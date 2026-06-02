import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBeaconPulse } from '../../src/Hooks/useBeaconPulse.js'

const mockTimelineKill = vi.fn()
const mockTo = vi.fn().mockReturnThis()

vi.mock('gsap', () => ({
  gsap: {
    timeline: vi.fn(() => ({ to: mockTo, kill: mockTimelineKill })),
    registerPlugin: vi.fn()
  }
}))

let mockPrefers = false
vi.mock('../../src/Hooks/usePrefersReducedMotion.js', () => ({
  usePrefersReducedMotion: () => mockPrefers
}))

beforeEach(() => {
  mockTimelineKill.mockClear()
  mockTo.mockClear()
  mockPrefers = false
})

afterEach(() => {
  vi.restoreAllMocks()
})

function makeBeacon () {
  const ref = { current: null }
  const beacon = document.createElement('div')
  const core = document.createElement('span')
  core.setAttribute('data-beacon-core', 'true')
  const halo = document.createElement('span')
  halo.setAttribute('data-beacon-halo', 'true')
  beacon.appendChild(core)
  beacon.appendChild(halo)
  ref.current = beacon
  document.body.appendChild(beacon)
  return { ref, cleanup: () => document.body.removeChild(beacon) }
}

describe('useBeaconPulse', () => {
  it('creates a repeating timeline when motion is allowed', () => {
    const { ref, cleanup } = makeBeacon()
    renderHook(() => useBeaconPulse(ref))
    expect(mockTo).toHaveBeenCalledTimes(2)
    cleanup()
  })

  it('skips when prefers-reduced-motion is on', () => {
    mockPrefers = true
    const { ref, cleanup } = makeBeacon()
    renderHook(() => useBeaconPulse(ref))
    expect(mockTo).not.toHaveBeenCalled()
    cleanup()
  })

  it('kills the timeline on cleanup', () => {
    const { ref, cleanup } = makeBeacon()
    const { unmount } = renderHook(() => useBeaconPulse(ref))
    unmount()
    expect(mockTimelineKill).toHaveBeenCalled()
    cleanup()
  })

  it('returns early when beacon ref is null', () => {
    const ref = { current: null }
    renderHook(() => useBeaconPulse(ref))
    expect(mockTo).not.toHaveBeenCalled()
  })
})
