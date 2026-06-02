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
