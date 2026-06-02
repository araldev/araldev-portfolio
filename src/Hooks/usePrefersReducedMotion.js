import { useEffect, useState } from 'react'

/**
 * React hook that subscribes to `prefers-reduced-motion: reduce`.
 * Returns true if the user has the reduced-motion preference enabled.
 * Re-renders on setting change.
 *
 * @returns {boolean}
 */
export function usePrefersReducedMotion () {
  const getInitial = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitial)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (e) => setPrefersReducedMotion(e.matches)

    if (mql.addEventListener) {
      mql.addEventListener('change', handleChange)
      return () => mql.removeEventListener('change', handleChange)
    }
    // Safari < 14 fallback
    mql.addListener(handleChange)
    return () => mql.removeListener(handleChange)
  }, [])

  return prefersReducedMotion
}
