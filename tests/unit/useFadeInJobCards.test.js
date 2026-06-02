import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFadeInJobCards } from '../../src/Hooks/useFadeInJobCards.js'

// vi.mock is hoisted to the top of the file before all imports, so any
// variables referenced inside the factory must be created via vi.hoisted.
const mocks = vi.hoisted(() => {
  return {
    mockFrom: vi.fn(() => ({ kill: vi.fn() })),
    mockSet: vi.fn(),
    mockTriggerCreate: vi.fn(() => ({ kill: vi.fn() })),
    mockGetAll: vi.fn(() => [])
  }
})

vi.mock('gsap', () => ({
  gsap: {
    from: mocks.mockFrom,
    set: mocks.mockSet,
    registerPlugin: vi.fn()
  }
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: mocks.mockTriggerCreate,
    getAll: mocks.mockGetAll,
    getById: vi.fn(),
    batch: vi.fn(() => [])
  }
}))

let mockPrefers = false
vi.mock('../../src/Hooks/usePrefersReducedMotion.js', () => ({
  usePrefersReducedMotion: () => mockPrefers
}))

beforeEach(() => {
  mocks.mockFrom.mockClear()
  mocks.mockSet.mockClear()
  mocks.mockTriggerCreate.mockClear()
  mocks.mockGetAll.mockClear()
  mockPrefers = false
})

afterEach(() => {
  vi.restoreAllMocks()
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

describe('useFadeInJobCards', () => {
  it('creates a ScrollTrigger on the grid when motion is allowed', () => {
    const { ref, cleanup } = makeGrid(3)
    renderHook(() => useFadeInJobCards(ref))
    expect(mocks.mockTriggerCreate).toHaveBeenCalledTimes(1)
    expect(mocks.mockTriggerCreate.mock.calls[0][0].trigger).toBe(ref.current)
    cleanup()
  })

  it('uses gsap.set and skips ScrollTrigger when reduced motion is preferred', () => {
    mockPrefers = true
    const { ref, cleanup } = makeGrid(2)
    renderHook(() => useFadeInJobCards(ref))
    expect(mocks.mockSet).toHaveBeenCalled()
    expect(mocks.mockTriggerCreate).not.toHaveBeenCalled()
    cleanup()
  })

  it('returns early when grid ref is null', () => {
    const ref = { current: null }
    renderHook(() => useFadeInJobCards(ref))
    expect(mocks.mockTriggerCreate).not.toHaveBeenCalled()
    expect(mocks.mockFrom).not.toHaveBeenCalled()
  })

  it('returns early when grid has no job cards', () => {
    const ref = { current: null }
    const div = document.createElement('div')
    ref.current = div
    document.body.appendChild(div)
    renderHook(() => useFadeInJobCards(ref))
    expect(mocks.mockTriggerCreate).not.toHaveBeenCalled()
    document.body.removeChild(div)
  })
})

// ============================================================
// T-202 (N2 P2-B1): RED contract — window.load + img.decode + 5s timeout gate
//
// The current useFadeInJobCards calls ScrollTrigger.create IMMEDIATELY on
// mount, before window.load fires and before any in-grid <img> has
// decoded. The result is a visible relayout on reload (see
// specs/004-.../verify-p1-relayout-diagnosis.md). P2-B1 (T-203) gates
// the ScrollTrigger creation on:
//   1. window.load event (or document.readyState === 'complete')
//   2. Promise.all( imgs.map(img => img.decode().catch(() => {})) )
//   3. 5s timeout fallback (FR-N2-08, EC-N2-03) — if window.load never
//      fires, the setup proceeds anyway
//
// These tests assert that the gate is honored. They will FAIL on the
// current code (which calls ScrollTrigger.create immediately) and PASS
// after T-203.
// ============================================================

describe('useFadeInJobCards — T-202 N2 gate (window.load + img.decode + 5s timeout)', () => {
  let addEventListenerSpy
  let removeEventListenerSpy
  let capturedLoadHandler
  let decodeImpl

  beforeEach(() => {
    // Mock globalThis.addEventListener to capture the 'load' handler that
    // the hook registers. jsdom fires 'load' on document when the document
    // finishes loading, so we have to capture the handler and call it
    // manually to test the gate. (We can't let jsdom fire it because we
    // need deterministic timing.)
    capturedLoadHandler = null
    addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener').mockImplementation((event, handler, opts) => {
      if (event === 'load') {
        capturedLoadHandler = handler
      }
    })
    removeEventListenerSpy = vi.spyOn(globalThis, 'removeEventListener').mockImplementation(() => {})

    // Mock HTMLImageElement.prototype.decode to return a controllable
    // promise. The hook is expected to call img.decode() on every in-grid
    // <img> and only proceed when ALL of them resolve (FR-N2-02,
    // EC-N2-01: broken images are caught silently with .catch).
    decodeImpl = vi.fn(() => new Promise(() => {})) // never resolves by default
    Object.defineProperty(HTMLImageElement.prototype, 'decode', {
      configurable: true,
      writable: true,
      value: decodeImpl
    })
  })

  afterEach(() => {
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
    // Restore the original decode prototype
    delete HTMLImageElement.prototype.decode
  })

  function makeGridWithImages (count = 3) {
    const ref = { current: null }
    const div = document.createElement('div')
    for (let i = 0; i < count; i++) {
      const card = document.createElement('article')
      card.setAttribute('data-job-card', 'true')
      const img = document.createElement('img')
      img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>` // valid src
      card.appendChild(img)
      div.appendChild(card)
    }
    ref.current = div
    document.body.appendChild(div)
    return { ref, cleanup: () => document.body.removeChild(div) }
  }

  it('T-202.A: does NOT call ScrollTrigger.create until window.load fires AND all img.decode() resolve', async () => {
    const { ref, cleanup } = makeGridWithImages(3)

    // Track per-call order of mocks. We'll use a manual resolve for
    // img.decode() so we can control when the gate lifts.
    let resolveDecode
    decodeImpl.mockImplementation(() => new Promise((r) => { resolveDecode = r }))

    renderHook(() => useFadeInJobCards(ref))

    // RIGHT AFTER MOUNT: ScrollTrigger.create must NOT have been called.
    // The hook should be waiting on the load event (or readyState).
    expect(mocks.mockTriggerCreate).not.toHaveBeenCalled()
    expect(capturedLoadHandler).toBeTypeOf('function') // the gate is armed

    // Even if we let the load handler run alone (without decode),
    // the trigger still must not fire — both conditions are required.
    await capturedLoadHandler()
    expect(mocks.mockTriggerCreate).not.toHaveBeenCalled()

    // Only after BOTH load fired AND all img.decode() resolved does
    // the trigger get created. Resolve the decode promise, flush
    // microtasks, then assert.
    resolveDecode()
    // 3 cards × 1 img each = 3 decodes. Resolving once resolves
    // ALL of them (same mock instance is used by every img). Flush
    // microtasks for Promise.all() to settle.
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()

    expect(mocks.mockTriggerCreate).toHaveBeenCalledTimes(1)
    cleanup()
  })

  it('T-202.B: proceeds after WINDOW_LOAD_TIMEOUT_MS (5000ms) even if window.load never fires', async () => {
    // Use vi.useFakeTimers to control the 5s timeout. vi.advanceTimersByTime
    // is the deterministic way to verify the fallback.
    vi.useFakeTimers()

    // decode() never resolves in this test (default mockImpl from
    // beforeEach is a never-resolving promise).
    const { ref, cleanup } = makeGridWithImages(2)
    renderHook(() => useFadeInJobCards(ref))

    // Sanity: the gate is armed but nothing has fired yet.
    expect(mocks.mockTriggerCreate).not.toHaveBeenCalled()
    expect(capturedLoadHandler).toBeTypeOf('function')

    // Advance time to 4999ms — still inside the window, must NOT fire.
    vi.advanceTimersByTime(4999)
    // Flush the microtask queue so Promise.race has a chance to settle.
    await vi.runAllTimersAsync()
    // We have to re-flush because the Promise.race(..., setTimeout) is
    // not fully resolved by runAllTimersAsync until the setTimeout cb runs.
    expect(mocks.mockTriggerCreate).not.toHaveBeenCalled()

    // Cross the 5000ms threshold — fallback fires, ScrollTrigger.create
    // is called even though load never fired and decode never resolved.
    vi.advanceTimersByTime(2)
    await vi.runAllTimersAsync()
    // Drain any pending microtasks one more time
    await Promise.resolve()
    await Promise.resolve()

    expect(mocks.mockTriggerCreate).toHaveBeenCalledTimes(1)
    cleanup()

    vi.useRealTimers()
  })

  it('T-202.C: silently swallows img.decode() rejection (broken image does not block the gate)', async () => {
    // EC-N2-01: a broken image (decode rejects) must NOT block the
    // setup. The hook uses .catch(() => 'decode-failed') (or similar)
    // so the gate still lifts and ScrollTrigger.create runs.
    decodeImpl.mockImplementation(() => Promise.reject(new Error('decode-failed')))

    const { ref, cleanup } = makeGridWithImages(3)
    renderHook(() => useFadeInJobCards(ref))

    // Trigger the load handler — this should chain into Promise.all
    // which catches each decode rejection and resolves with a value.
    await capturedLoadHandler()
    // Flush microtasks
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()

    // Even with all 3 decodes rejecting, the trigger must still be
    // created. The console.error for the unhandled rejection is the
    // test's problem if the .catch is missing — but the assertion
    // (and the user-perceived behavior) is what matters.
    expect(mocks.mockTriggerCreate).toHaveBeenCalledTimes(1)
    cleanup()
  })
})
