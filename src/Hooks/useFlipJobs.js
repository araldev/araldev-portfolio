import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

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

    // Capture current positions BEFORE React reorders
    flipStateRef.current = Flip.getState(cards)

    // Wait for next frame so React's new DOM order is committed
    const raf = globalThis.requestAnimationFrame(() => {
      if (!flipStateRef.current) return
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

    return () => {
      globalThis.cancelAnimationFrame(raf)
      flipStateRef.current = null
    }
  }, [sortTrigger, gridRef, prefersReducedMotion])
}
