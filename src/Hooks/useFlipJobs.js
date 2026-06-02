import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'
import { WINDOW_LOAD_TIMEOUT_MS } from './useFadeInJobCards.js'

// Register the Flip plugin with the GSAP core. Without this, Flip.getState
// throws `TypeError: _toArray is not a function` at runtime in the browser,
// because Flip's internal helpers (gsap.utils.toArray) are not wired up to
// the namespace closure until registerPlugin is called. Mirrors the pattern
// in ScrollSync.jsx and useAnimatedTitle.js (which both register their
// respective plugins). Vite/ESM does not auto-register GSAP plugins.
gsap.registerPlugin(Flip)

/**
 * Reorder animation using the FLIP technique (First, Last, Invert, Play).
 * Skipped when:
 *  - `prefersReducedMotion: reduce` is on
 *  - `navigator.hardwareConcurrency < 4` (low-power device heuristic, R2)
 *
 * N2 (Feature 004) hardening (T-208):
 *   Flip.getState captures positions BEFORE the layout is stable. If the
 *   in-grid images have not decoded yet (or `window.load` has not fired),
 *   the captured state is a stale baseline, and the FLIP animation plays
 *   from a wrong starting point — the user sees a visible jump. Mirrors
 *   the useFadeInJobCards T-203 gate exactly:
 *     1. window.load (or document.readyState === 'complete')
 *     2. Promise.all( imgs.map(img => img.decode().catch(() => {})) )
 *   Falls back to a 5s `WINDOW_LOAD_TIMEOUT_MS` so a broken CDN or sandbox
 *   never blocks the FLIP indefinitely (EC-N2-03, FR-N2-08).
 *   See specs/004-.../verify-p1-relayout-diagnosis.md §6.5 and design.md
 *   §N2.3.
 *
 * @param {React.MutableRefObject<HTMLElement>} gridRef
 * @param {any} sortTrigger - any value that changes when sort order changes
 */
export function useFlipJobs (gridRef, sortTrigger) {
  const flipStateRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return undefined

    const cards = grid.querySelectorAll('[data-job-card]')
    if (cards.length === 0) return undefined

    if (prefersReducedMotion) return undefined

    const isLowPower = typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency < 4
    if (isLowPower) return undefined

    // ----- N2 gate (T-208) -----
    // Flip.getState is held until BOTH:
    //   (1) window.load has fired (or document.readyState === 'complete')
    //   (2) every in-grid <img> has decoded (silently catch failures)
    // A 5s timeout (`WINDOW_LOAD_TIMEOUT_MS`) is the fallback for BOTH
    // gates so a stuck load event or a stuck image never blocks the FLIP
    // indefinitely. Cleanup is full: remove the load listener, clear
    // the timeout, cancel the rAF that would play Flip.from.
    let cancelled = false
    let loadHandler = null
    let timeoutId = null
    let raf = null

    const proceed = () => {
      if (cancelled) return
      // Capture current positions BEFORE React reorders
      flipStateRef.current = Flip.getState(cards)

      // Wait for next frame so React's new DOM order is committed
      raf = globalThis.requestAnimationFrame(() => {
        if (!flipStateRef.current || cancelled) return
        Flip.from(flipStateRef.current, {
          duration: 0.3,
          ease: 'power2.inOut',
          stagger: 0.04,
          absolute: true,
          onEnter: (elements) => gsap.fromTo(elements,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.2 }),
          onLeave: (elements) => gsap.to(elements,
            { opacity: 0, scale: 0.9, duration: 0.15 })
        })
        flipStateRef.current = null
      })
    }

    const waitForImagesAndLoad = () => {
      return new Promise((resolve) => {
        let proceeded = false

        const proceedOnce = () => {
          if (proceeded) return
          proceeded = true

          // Eagerly call img.decode() on every in-grid <img>. The map
          // is synchronous so the test contract (decode must run right
          // after the load handler) holds. EC-N2-01: a broken image
          // never blocks the gate because each decode promise is
          // wrapped in .catch(() => {}).
          const decodePromises = Array.from(grid.querySelectorAll('img')).map(img =>
            img.decode().catch(() => {})
          )

          // Race the decode batch against a fresh 5s timeout. This is
          // the per-step fallback: if any image never decodes, the
          // outer promise still resolves after 5s and Flip.getState
          // runs (FR-N2-08, EC-N2-03).
          const decodeTimeout = new Promise((resolve) => {
            timeoutId = setTimeout(resolve, WINDOW_LOAD_TIMEOUT_MS)
          })
          Promise.race([Promise.all(decodePromises), decodeTimeout]).then(() => {
            resolve()
          })
        }

        // Always register the load listener. If load has already fired
        // (readyState === 'complete'), we proceed immediately; the
        // listener is a no-op because 'load' will not fire a second
        // time. The hook re-runs on every sort change, so this is
        // a fresh listener each time.
        loadHandler = proceedOnce
        globalThis.addEventListener('load', loadHandler, { once: true })

        if (document.readyState === 'complete') {
          proceedOnce()
        } else {
          // Outer 5s fallback for the load event itself. proceedOnce
          // is idempotent so the two timers cannot double-fire Flip.
          timeoutId = setTimeout(proceedOnce, WINDOW_LOAD_TIMEOUT_MS)
        }
      }).then(() => {
        if (!cancelled) proceed()
      })
    }

    waitForImagesAndLoad()

    return () => {
      cancelled = true
      if (loadHandler) {
        globalThis.removeEventListener('load', loadHandler)
        loadHandler = null
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      if (raf !== null) {
        globalThis.cancelAnimationFrame(raf)
        raf = null
      }
      flipStateRef.current = null
    }
  }, [sortTrigger, gridRef, prefersReducedMotion])
}
