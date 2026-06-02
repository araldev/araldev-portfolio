import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion.js'

/**
 * Infinite pulse animation for the Featured card's beacon (core + halo).
 * Uses a GSAP timeline with `repeat: -1, yoyo: true` and `sine.inOut` easing.
 * Cleanup with `.kill()` (FR-011).
 *
 * @param {React.MutableRefObject<HTMLElement>} beaconRef
 */
export function useBeaconPulse (beaconRef) {
  const tlRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const beacon = beaconRef.current
    if (!beacon) return undefined

    if (prefersReducedMotion) return undefined

    const core = beacon.querySelector('[data-beacon-core]')
    const halo = beacon.querySelector('[data-beacon-halo]')
    if (!core || !halo) return undefined

    tlRef.current = gsap.timeline({ repeat: -1, yoyo: true })
      .to(core, { scale: 1.2, duration: 0.9, ease: 'sine.inOut' }, 0)
      .to(halo, { scale: 1.5, opacity: 0.3, duration: 0.9, ease: 'sine.inOut' }, 0)

    return () => {
      if (tlRef.current) {
        tlRef.current.kill()
        tlRef.current = null
      }
    }
  }, [beaconRef, prefersReducedMotion])
}
