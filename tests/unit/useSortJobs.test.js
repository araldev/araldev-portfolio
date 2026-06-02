import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSortJobs } from '../../src/Hooks/useSortJobs.js'
import { jobs } from '../../src/data/jobs.js'

// P4 simplification: the hook no longer reads the IsIconCheckFilter
// context, so we no longer need to mock it. Sort is now driven by
// `current` (true wins over false) + `startDate` desc.

describe('useSortJobs', () => {
  it('returns all jobs', () => {
    const { result } = renderHook(() => useSortJobs())
    expect(result.current.sortJobs).toHaveLength(jobs.length)
  })

  it('puts every current:true job ahead of every current:false job (R8 of plan.md)', () => {
    const { result } = renderHook(() => useSortJobs())
    const list = result.current.sortJobs
    const firstNonCurrent = list.findIndex(j => !j.current)
    if (firstNonCurrent === -1) return // all current — trivially satisfied
    for (let i = 0; i < firstNonCurrent; i++) {
      expect(list[i].current).toBe(true)
    }
  })

  it('sorts by startDate desc within the same current bucket', () => {
    const { result } = renderHook(() => useSortJobs())
    const list = result.current.sortJobs
    // Walk the list and check that within each current-bucket,
    // startDate is non-increasing.
    let lastCurrent = list[0]?.current
    let lastDate = list[0]?.startDate
    for (let i = 1; i < list.length; i++) {
      if (list[i].current !== lastCurrent) {
        lastCurrent = list[i].current
        lastDate = list[i].startDate
        continue
      }
      expect(list[i].startDate <= lastDate).toBe(true)
      lastDate = list[i].startDate
    }
  })

  it('does not attach a techsCheked property to any job (filter logic removed)', () => {
    const { result } = renderHook(() => useSortJobs())
    const list = result.current.sortJobs
    expect(list.every(j => !('techsCheked' in j))).toBe(true)
  })
})
