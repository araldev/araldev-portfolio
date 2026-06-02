import { describe, it, expect } from 'vitest'
import { findFeaturedIndex, useIsFeaturedJob } from '../../src/Hooks/useIsFeaturedJob.js'

const a = { id: 'a', current: true, startDate: '2024-01' }
const b = { id: 'b', current: true, startDate: '2023-06' }
const c = { id: 'c', current: false, startDate: '2022-01' }
const d = { id: 'd', current: false, startDate: '2021-01' }

describe('findFeaturedIndex', () => {
  it('returns -1 for empty list', () => {
    expect(findFeaturedIndex([])).toBe(-1)
  })

  it('returns -1 when no job is current', () => {
    expect(findFeaturedIndex([c, d])).toBe(-1)
  })

  it('returns the index of the unique current job', () => {
    expect(findFeaturedIndex([c, b, d])).toBe(1)
  })

  it('returns the most recent among multiple current jobs', () => {
    expect(findFeaturedIndex([b, a, c, d])).toBe(1) // a is most recent current
  })

  it('handles invalid input gracefully', () => {
    expect(findFeaturedIndex(null)).toBe(-1)
    expect(findFeaturedIndex(undefined)).toBe(-1)
  })
})

describe('useIsFeaturedJob', () => {
  it('returns true for the featured job', () => {
    expect(useIsFeaturedJob(a, [a, b, c])).toBe(true)
    expect(useIsFeaturedJob(b, [a, b, c])).toBe(false)
  })

  it('returns false if the job is not in the list', () => {
    const x = { id: 'x', current: true, startDate: '2025-01' }
    expect(useIsFeaturedJob(x, [a, b])).toBe(false)
  })

  it('returns false when job is undefined', () => {
    expect(useIsFeaturedJob(undefined, [a])).toBe(false)
  })
})
