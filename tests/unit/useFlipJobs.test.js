import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFlipJobs } from '../../src/Hooks/useFlipJobs.js'

// vi.mock is hoisted to the top of the file before all imports, so any
// variables referenced inside the factory must be created via vi.hoisted.
const mocks = vi.hoisted(() => {
  return {
    mockGetState: vi.fn(() => ({ id: 'state' })),
    mockFrom: vi.fn(),
    mockRegisterPlugin: vi.fn()
  }
})

vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
    to: vi.fn(),
    registerPlugin: mocks.mockRegisterPlugin
  }
}))
vi.mock('gsap/Flip', () => ({
  Flip: { getState: mocks.mockGetState, from: mocks.mockFrom }
}))

let mockPrefers = false
vi.mock('../../src/Hooks/usePrefersReducedMotion.js', () => ({
  usePrefersReducedMotion: () => mockPrefers
}))

beforeEach(() => {
  mocks.mockGetState.mockClear()
  mocks.mockFrom.mockClear()
  // NOTE: do NOT clear mocks.mockRegisterPlugin here.
  // gsap.registerPlugin(Flip) runs once at module-import time of
  // useFlipJobs.js, BEFORE any test or beforeEach fires. The cumulative
  // call from import is the signal we want to assert.
  mockPrefers = false
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

function makeGrid (count = 3) {
  const ref = { current: null }
  const div = document.createElement('div')
  for (let i = 0; i < count; i++) {
    const card = document.createElement('article')
    card.setAttribute('data-job-card', 'true')
    div.appendChild(card)
  }
  ref.current = div
  document.body.appendChild(div)
  return { ref, cleanup: () => document.body.removeChild(div) }
}

describe('useFlipJobs', () => {
  it('skips entirely when prefers-reduced-motion is on', () => {
    mockPrefers = true
    const { ref, cleanup } = makeGrid(2)
    renderHook(() => useFlipJobs(ref, 1))
    expect(mocks.mockGetState).not.toHaveBeenCalled()
    expect(mocks.mockFrom).not.toHaveBeenCalled()
    cleanup()
  })

  it('captures state and calls Flip.from on sort change', async () => {
    const { ref, cleanup } = makeGrid(3)
    renderHook(() => useFlipJobs(ref, 1))
    // Wait for rAF
    await new Promise(resolve => globalThis.requestAnimationFrame(resolve))
    expect(mocks.mockGetState).toHaveBeenCalled()
    expect(mocks.mockFrom).toHaveBeenCalled()
    cleanup()
  })

  it('skips on low-power devices (hardwareConcurrency < 4)', () => {
    Object.defineProperty(globalThis.navigator, 'hardwareConcurrency', {
      value: 2, configurable: true
    })
    const { ref, cleanup } = makeGrid(2)
    renderHook(() => useFlipJobs(ref, 1))
    expect(mocks.mockGetState).not.toHaveBeenCalled()
    expect(mocks.mockFrom).not.toHaveBeenCalled()
    cleanup()
  })

  it('returns early when grid ref is null', () => {
    const ref = { current: null }
    renderHook(() => useFlipJobs(ref, 1))
    expect(mocks.mockGetState).not.toHaveBeenCalled()
  })

  it('registers the Flip plugin with GSAP at module load (regression: runtime TypeError _toArray is not a function)', () => {
    // Importing the hook triggers gsap.registerPlugin(Flip) at module scope.
    // If a future refactor accidentally moves the call inside the hook body
    // or removes it, this test fails immediately.
    expect(mocks.mockRegisterPlugin).toHaveBeenCalled()
    const calledWith = mocks.mockRegisterPlugin.mock.calls[0]?.[0]
    expect(calledWith).toBeDefined()
    expect(calledWith).toHaveProperty('getState')
    expect(calledWith).toHaveProperty('from')
  })
})
