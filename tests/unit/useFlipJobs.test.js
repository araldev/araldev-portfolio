/* global HTMLImageElement */
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

// ============================================================
// T-208 (N2 P2-B2): RED contract — useFlipJobs gate on window.load + img.decode
//
// The current useFlipJobs calls Flip.getState(cards) IMMEDIATELY on every
// useEffect run (first mount AND every sort change), before window.load
// fires and before any in-grid <img> has decoded. The result is a visible
// relayout on hard reload AND on every filter toggle: Flip captures
// pre-image positions and animates from a stale baseline. P2-B2 (T-208)
// mirrors the useFadeInJobCards T-203 gate into useFlipJobs:
//   1. window.load event (or document.readyState === 'complete')
//   2. Promise.all( imgs.map(img => img.decode().catch(() => {})) )
//   3. 5s timeout fallback (FR-N2-08, EC-N2-03)
// The existing useEffect dependency on sortTrigger is preserved — the
// gate just lifts BEFORE Flip.getState is called on each run.
//
// These tests will FAIL on the current code (Flip.getState called on
// first render, before any decode) and PASS after the T-208 fix.
// ============================================================

describe('useFlipJobs — T-208 N2 gate (window.load + img.decode + 5s timeout)', () => {
  let addEventListenerSpy
  let removeEventListenerSpy
  let capturedLoadHandler
  let decodeImpl
  let originalHardwareConcurrency

  beforeEach(() => {
    // Capture the 'load' handler so we can fire it deterministically.
    // jsdom's load behavior is unreliable in vitest; we spy on
    // globalThis.addEventListener to intercept the registration.
    capturedLoadHandler = null
    addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener').mockImplementation((event, handler, opts) => {
      if (event === 'load') {
        capturedLoadHandler = handler
      }
    })
    removeEventListenerSpy = vi.spyOn(globalThis, 'removeEventListener').mockImplementation(() => {})

    // Mock HTMLImageElement.prototype.decode. The default is a never-
    // resolving promise so we can assert the gate is held by decode.
    // Individual tests override this to a shared resolvable promise.
    decodeImpl = vi.fn(() => new Promise(() => {}))
    Object.defineProperty(HTMLImageElement.prototype, 'decode', {
      configurable: true,
      writable: true,
      value: decodeImpl
    })

    // The "skips on low-power devices" test above leaves
    // navigator.hardwareConcurrency = 2. Without restoring it here,
    // the useEffect's low-power check would short-circuit and the
    // useFlipJobs hook would return early WITHOUT calling
    // Flip.getState — hiding the missing gate. Restore a high value
    // so the useEffect runs to completion and our RED assertions
    // actually observe the missing gate.
    originalHardwareConcurrency = Object.getOwnPropertyDescriptor(globalThis.navigator, 'hardwareConcurrency')
    Object.defineProperty(globalThis.navigator, 'hardwareConcurrency', {
      value: 8, configurable: true, writable: true
    })
  })

  afterEach(() => {
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
    delete HTMLImageElement.prototype.decode
    // Restore the original hardwareConcurrency descriptor. The
    // "skips on low-power devices" test will set its own value on
    // its next run.
    if (originalHardwareConcurrency) {
      Object.defineProperty(globalThis.navigator, 'hardwareConcurrency', originalHardwareConcurrency)
    } else {
      delete globalThis.navigator.hardwareConcurrency
    }
  })

  function makeGridWithImages (count = 3) {
    const ref = { current: null }
    const div = document.createElement('div')
    for (let i = 0; i < count; i++) {
      const card = document.createElement('article')
      card.setAttribute('data-job-card', 'true')
      const img = document.createElement('img')
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>'
      card.appendChild(img)
      div.appendChild(card)
    }
    ref.current = div
    document.body.appendChild(div)
    return { ref, cleanup: () => document.body.removeChild(div) }
  }

  it('T-208.A: does NOT call Flip.getState on first render until window.load + img.decode resolve', async () => {
    // Shared decode promise so every img.decode() call observes the
    // same resolution (mirrors T-202.A pattern in useFadeInJobCards).
    let resolveDecode
    const sharedDecode = new Promise((resolve) => { resolveDecode = resolve })
    decodeImpl.mockImplementation(() => sharedDecode)

    const { ref, cleanup } = makeGridWithImages(3)

    renderHook(() => useFlipJobs(ref, 1))

    // Wait one rAF frame. This is the same wait the existing
    // "captures state and calls Flip.from on sort change" test uses
    // (line 73). The rAF is needed because React 18 schedules the
    // useEffect in a microtask that may not flush before the next
    // sync assertion. After this wait, the useEffect has run and:
    //   - Current code: Flip.getState is called immediately (RED)
    //   - Fixed code: addEventListener is called, capturedLoadHandler
    //     is set, and Flip.getState is still gated (GREEN)
    await new Promise(resolve => globalThis.requestAnimationFrame(resolve))

    // RIGHT AFTER MOUNT (effect ran): Flip.getState must NOT have
    // been called. The current code calls it on the first render;
    // this test asserts the gate is honored.
    expect(mocks.mockGetState).not.toHaveBeenCalled()
    expect(capturedLoadHandler).toBeTypeOf('function')

    // Even if the load handler fires alone (no decode), Flip.getState
    // is still gated. Both conditions are required (AND, not OR).
    await capturedLoadHandler()
    expect(mocks.mockGetState).not.toHaveBeenCalled()

    // Resolve decode; flush microtasks for the full chain to settle.
    resolveDecode()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    // One more rAF to let the actual Flip.from rAF callback fire
    // (we only need Flip.getState to be called; the rAF for Flip.from
    // is the next step in the chain and not asserted here).
    await new Promise(resolve => globalThis.requestAnimationFrame(resolve))

    expect(mocks.mockGetState).toHaveBeenCalledTimes(1)
    cleanup()
  })

  it('T-208.B: re-arms the gate on every sort change (re-Flip.getState is also gated)', async () => {
    let resolveDecode
    const sharedDecode = new Promise((resolve) => { resolveDecode = resolve })
    decodeImpl.mockImplementation(() => sharedDecode)

    const { ref, cleanup } = makeGridWithImages(3)

    // First render with sortTrigger=1.
    const { rerender } = renderHook(({ trigger }) => useFlipJobs(ref, trigger), {
      initialProps: { trigger: 1 }
    })

    // Wait for the first effect to run.
    await new Promise(resolve => globalThis.requestAnimationFrame(resolve))

    // Resolve decode to lift the gate on the first render.
    resolveDecode()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await new Promise(resolve => globalThis.requestAnimationFrame(resolve))
    expect(mocks.mockGetState).toHaveBeenCalledTimes(1)

    // Now toggle the sort (e.g. user toggles a filter). The new decode
    // promise is fresh and we DO NOT resolve it yet.
    const sharedDecode2 = new Promise((resolve) => { resolveDecode = resolve })
    decodeImpl.mockImplementation(() => sharedDecode2)

    // Reset the load-handler capture so we can detect the NEW handler
    // registered by the sort-change effect.
    capturedLoadHandler = null
    mocks.mockGetState.mockClear()

    rerender({ trigger: 2 })

    // Wait for the sort-change effect to run.
    await new Promise(resolve => globalThis.requestAnimationFrame(resolve))

    // The hook must re-arm the gate. Flip.getState must NOT be called
    // for the sort change yet.
    expect(mocks.mockGetState).not.toHaveBeenCalled()
    expect(capturedLoadHandler).toBeTypeOf('function')

    // Fire the load handler. Still gated by decode.
    await capturedLoadHandler()
    expect(mocks.mockGetState).not.toHaveBeenCalled()

    // Resolve the second decode batch; flush microtasks.
    resolveDecode()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    await new Promise(resolve => globalThis.requestAnimationFrame(resolve))

    // Now Flip.getState should have been called for the second time
    // (the sort-change animation).
    expect(mocks.mockGetState).toHaveBeenCalledTimes(1)
    cleanup()
  })
})
