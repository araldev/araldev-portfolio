import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFlipJobs, WINDOW_LOAD_TIMEOUT_MS } from '../../src/Hooks/useFlipJobs.js'

// P4 simplification: the useFlipJobs hook is now a no-op. The FLIP
// reorder animation is gone (the JobsCards filter was removed, so
// sortJobs is a stable useMemo reference and there is nothing to
// reorder). The previous implementation applied `position: absolute`
// + `transform: translate(x,y)` inline to every card on mount via
// `Flip.from({absolute:true})` and never cleared those styles, which
// is what caused the SC-N2-01b transform assertion to fail with
// `matrix(1, 0, 0, 1, 0, 42.6)`. The hook is preserved as a no-op
// for JobsCards.jsx import stability, and `WINDOW_LOAD_TIMEOUT_MS`
// is re-exported for any future test that wants to assert the
// constant.

let mockPrefers = false
vi.mock('../../src/Hooks/usePrefersReducedMotion.js', () => ({
  usePrefersReducedMotion: () => mockPrefers
}))

beforeEach(() => {
  mockPrefers = false
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useFlipJobs (P4 no-op)', () => {
  it('renders without throwing when called with a null ref', () => {
    const ref = { current: null }
    expect(() => renderHook(() => useFlipJobs(ref, 1))).not.toThrow()
  })

  it('renders without throwing when called with a populated grid ref + sortTrigger', () => {
    const ref = { current: document.createElement('div') }
    expect(() => renderHook(() => useFlipJobs(ref, [{ id: 'a' }]))).not.toThrow()
  })

  it('renders without throwing when called with a sortTrigger that changes across rerenders', () => {
    const ref = { current: document.createElement('div') }
    const { rerender } = renderHook(({ trigger }) => useFlipJobs(ref, trigger), {
      initialProps: { trigger: 1 }
    })
    expect(() => rerender({ trigger: 2 })).not.toThrow()
  })

  it('renders without throwing when prefers-reduced-motion is on', () => {
    mockPrefers = true
    const ref = { current: document.createElement('div') }
    expect(() => renderHook(() => useFlipJobs(ref, 1))).not.toThrow()
  })

  it('re-exports WINDOW_LOAD_TIMEOUT_MS as 5000ms (preserved for any future useFadeInJobCards tests)', () => {
    expect(WINDOW_LOAD_TIMEOUT_MS).toBe(5000)
  })
})
