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
 * @param {React.MutableRefObject<HTMLElement>} gridRef
 */
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

    const trigger = ScrollTrigger.create({
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

    return () => {
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
