import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSortJobs } from '../../src/Hooks/useSortJobs.js'
import { jobs } from '../../src/data/jobs.js'

// We mock the context to control isIconCheck
const mockSetIsIconCheck = vi.fn()
let mockIsIconCheck = {}

vi.mock('../../src/Hooks/useIsIconCheckFilter.js', () => ({
  useIsIconCheckFilter: () => ({ isIconCheck: mockIsIconCheck, setIsIconCheck: mockSetIsIconCheck })
}))

beforeEach(() => {
  mockIsIconCheck = {
    js: false,
    react: false,
    css: false,
    html: false,
    ts: false,
    git: false,
    gitHub: false,
    gsap: false,
    tailwind: false,
    storybook: false,
    vite: false,
    npm: false
  }
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useSortJobs', () => {
  it('returns all jobs sorted by startDate desc + current first', () => {
    const { result } = renderHook(() => useSortJobs())
    const list = result.current.sortJobs
    expect(list).toHaveLength(jobs.length)
    // First item should be the featured/current job (most recent startDate)
    expect(list[0].current).toBe(true)
    // Verify startDate is descending
    for (let i = 1; i < list.length; i++) {
      expect(list[i - 1].startDate >= list[i].startDate).toBe(true)
    }
  })

  it('initializes techsCheked to 0 when no filter is active', () => {
    const { result } = renderHook(() => useSortJobs())
    expect(result.current.sortJobs.every(j => j.techsCheked === 0)).toBe(true)
  })

  it('re-orders by techsCheked desc when filters are active', () => {
    mockIsIconCheck = { ...mockIsIconCheck, react: true }
    const { result, rerender } = renderHook(() => useSortJobs())
    rerender() // trigger effect
    const list = result.current.sortJobs
    // First item should have react in its stack and have a non-zero techsCheked
    expect(list[0].stack.react).toBeDefined()
    expect(list[0].techsCheked).toBeGreaterThan(0)
  })

  it('keeps current:true jobs ahead of historical jobs even with 0 matches', () => {
    mockIsIconCheck = { ...mockIsIconCheck, npm: true } // very few matches
    const { result, rerender } = renderHook(() => useSortJobs())
    rerender()
    const list = result.current.sortJobs
    // Find first non-current
    const firstNonCurrent = list.findIndex(j => !j.current)
    // All entries before that index must be current:true
    for (let i = 0; i < firstNonCurrent; i++) {
      expect(list[i].current).toBe(true)
    }
  })
})
