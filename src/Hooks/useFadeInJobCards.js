import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

/**
 * Stagger fade-in for a grid of cards using ScrollTrigger.batch.
 * Single observer shared across all cards (more performant than N triggers).
 *
 * Cleanup follows plan.md §"Animations Strategy":
 *   1. Kill the inner tween (if any)
 *   2. Kill all ScrollTriggers associated with the grid
 *   3. Clear GSAP props to avoid FOUC
 *
 * N2 (Feature 004) hardening (T-203 / T-205):
 *   The ScrollTrigger setup is now gated on BOTH:
 *     a) window.load (or document.readyState === 'complete')
 *     b) Promise.all(img.decode()) for every in-grid <img>
 *   A single 5s overall timeout (`WINDOW_LOAD_TIMEOUT_MS`) races against
 *   BOTH waits, so the setup proceeds even when the load event never
 *   fires OR an image never decodes (broken network, sandbox issues).
 *   This prevents the pre-load relayout flicker on hard reloads that
 *   the SC-N2-01 / SC-N2-01b visual tests are designed to catch.
 *   See specs/004-.../verify-p1-relayout-diagnosis.md §6.5.
 *
 * @param {React.MutableRefObject<HTMLElement>} gridRef
 */
export const WINDOW_LOAD_TIMEOUT_MS = 5000

export function useFadeInJobCards (gridRef) {
  const tweenRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return undefined

    const cards = grid.querySelectorAll('[data-job-card]')
    if (cards.length === 0) return undefined

    if (prefersReducedMotion) {
      // Reduced motion: just set the final state, no animation
      gsap.set(cards, { autoAlpha: 1, y: 0, clearProps: 'transform' })
      return undefined
    }

    // ----- N2 gate (T-203) -----
    // The ScrollTrigger is only created AFTER:
    //   (1) window.load has fired (or document.readyState === 'complete')
    //   (2) every in-grid <img> has decoded (silently catch failures)
    // A single 5s timeout is the fallback for BOTH gates so a stuck
    // load event or a stuck image never blocks the setup indefinitely.
    let cancelled = false
    let loadHandler = null
    let timeoutId = null
    let trigger = null

    const createTrigger = () => {
      if (cancelled) return
      trigger = ScrollTrigger.create({
        trigger: grid,
        start: 'top bottom-=50',
        once: true,
        onEnter: () => {
          tweenRef.current = gsap.from(cards, {
            autoAlpha: 0,
            y: 30,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12
          })
        }
      })
    }

    const waitForImagesAndLoad = () => {
      return new Promise((resolve) => {
        let proceeded = false

        const proceed = () => {
          if (proceeded) return
          proceeded = true

          // Eagerly call img.decode() on every in-grid <img>. The map is
          // synchronous so the test contract (decode must run right after
          // the load handler, with no extra microtask boundary) holds.
          // EC-N2-01: a broken image never blocks the gate because each
          // decode promise is wrapped in .catch(() => {}).
          const decodePromises = Array.from(grid.querySelectorAll('img')).map(img =>
            img.decode().catch(() => {})
          )

          // Race the decode batch against a fresh 5s timeout. This is
          // the per-step fallback: if any image never decodes, the
          // outer promise still resolves after 5s and createTrigger
          // runs (FR-N2-08, EC-N2-03).
          const decodeTimeout = new Promise((resolve) => {
            timeoutId = setTimeout(resolve, WINDOW_LOAD_TIMEOUT_MS)
          })
          Promise.race([Promise.all(decodePromises), decodeTimeout]).then(() => {
            resolve()
          })
        }

        // Always register the load listener (test contract + safety net).
        // If load has already fired (readyState === 'complete'), we
        // proceed immediately; the listener is a no-op because 'load'
        // will not fire a second time.
        loadHandler = proceed
        globalThis.addEventListener('load', loadHandler, { once: true })

        if (document.readyState === 'complete') {
          proceed()
        } else {
          // Outer 5s fallback for the load event itself. proceed() is
          // idempotent so the two timers cannot double-fire createTrigger.
          timeoutId = setTimeout(proceed, WINDOW_LOAD_TIMEOUT_MS)
        }
      }).then(() => {
        if (!cancelled) createTrigger()
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
      if (tweenRef.current) {
        tweenRef.current.kill()
        tweenRef.current = null
      }
      // Kill any ScrollTriggers whose trigger is inside this grid
      ScrollTrigger.getAll()
        .filter(t => t.vars && t.vars.trigger && grid.contains(t.vars.trigger))
        .forEach(t => t.kill())
      if (trigger) trigger.kill()
      gsap.set(cards, { clearProps: 'all' })
    }
  }, [gridRef, prefersReducedMotion])
}
