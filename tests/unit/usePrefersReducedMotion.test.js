import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePrefersReducedMotion } from '../../src/Hooks/usePrefersReducedMotion.js'

afterEach(() => {
  vi.restoreAllMocks()
})

function mockMatchMedia (matches) {
  const listeners = []
  const mql = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (_evt, cb) => listeners.push(cb),
    removeEventListener: (_evt, cb) => {
      const i = listeners.indexOf(cb)
      if (i >= 0) listeners.splice(i, 1)
    },
    addListener: (cb) => listeners.push(cb),
    removeListener: (cb) => {
      const i = listeners.indexOf(cb)
      if (i >= 0) listeners.splice(i, 1)
    },
    dispatch: (newMatches) => {
      mql.matches = newMatches
      listeners.forEach(l => l({ matches: newMatches, media: mql.media }))
    }
  }
  window.matchMedia = vi.fn(() => mql)
  return { mql, listeners }
}

describe('usePrefersReducedMotion', () => {
  it('returns true when matchMedia matches reduce', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })

  it('returns false when matchMedia does not match reduce', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })

  it('updates when the media query change event fires', () => {
    const { mql } = mockMatchMedia(false)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)

    act(() => {
      mql.dispatch(true)
    })
    expect(result.current).toBe(true)
  })

  it('returns false gracefully when matchMedia is missing (SSR)', () => {
    const original = window.matchMedia
    delete window.matchMedia
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
    window.matchMedia = original
  })
})
