import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFadeInJobCards, WINDOW_LOAD_TIMEOUT_MS } from '../../src/Hooks/useFadeInJobCards.js'

// P4 simplification: the useFadeInJobCards hook is now a no-op. The
// GSAP-from entrance + ScrollTrigger setup is gone (it was the source
// of the SC-N2-01b visual flake). The hook is preserved as a no-op
// for JobsCards.jsx import stability, and `WINDOW_LOAD_TIMEOUT_MS` is
// re-exported because useFlipJobs (also a P4 no-op) still wants the
// constant for its own 5s budget.

describe('useFadeInJobCards (P4 no-op)', () => {
  it('renders without throwing when called with a null ref', () => {
    const ref = { current: null }
    expect(() => renderHook(() => useFadeInJobCards(ref))).not.toThrow()
  })

  it('renders without throwing when called with a populated grid ref', () => {
    const ref = { current: document.createElement('div') }
    expect(() => renderHook(() => useFadeInJobCards(ref))).not.toThrow()
  })

  it('renders without throwing when called with no arguments', () => {
    // JobsCards.jsx still passes a ref + sortJobs; the no-op ignores them.
    expect(() => renderHook(() => useFadeInJobCards(undefined))).not.toThrow()
  })

  it('re-exports WINDOW_LOAD_TIMEOUT_MS as 5000ms (preserved for the useFlipJobs 5s budget)', () => {
    expect(WINDOW_LOAD_TIMEOUT_MS).toBe(5000)
  })
})
