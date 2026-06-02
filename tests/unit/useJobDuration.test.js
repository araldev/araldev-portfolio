import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatDuration } from '../../src/Hooks/useJobDuration.js'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('formatDuration', () => {
  it('returns "1m" when start and end are the same month', () => {
    const job = { id: 'a', startDate: '2024-01', endDate: '2024-01', current: false }
    expect(formatDuration(job)).toBe('1m')
  })

  it('formats years and months for a multi-year span', () => {
    const job = { id: 'a', startDate: '2022-01', endDate: '2024-05', current: false }
    expect(formatDuration(job)).toBe('2y 4m')
  })

  it('formats only months when less than a year', () => {
    const job = { id: 'a', startDate: '2024-01', endDate: '2024-09', current: false }
    expect(formatDuration(job)).toBe('8m')
  })

  it('uses today as end when current: true and no endDate', () => {
    const now = new Date(2025, 5, 1) // June 1 2025
    const job = { id: 'a', startDate: '2023-03', endDate: undefined, current: true }
    expect(formatDuration(job, now)).toBe('2y 3m')
  })

  it('ignores endDate when current: true (EC-003)', () => {
    const now = new Date(2025, 5, 1)
    const job = { id: 'a', startDate: '2023-03', endDate: '2024-01', current: true }
    expect(formatDuration(job, now)).toBe('2y 3m')
  })

  it('throws when endDate < startDate', () => {
    const job = { id: 'bad', startDate: '2024-05', endDate: '2024-01', current: false }
    expect(() => formatDuration(job)).toThrow(/endDate < startDate/)
  })

  it('returns "—" for malformed startDate', () => {
    const job = { id: 'a', startDate: 'not-a-date', endDate: '2024-01', current: false }
    expect(formatDuration(job)).toBe('—')
  })

  it('returns "—" when startDate is missing', () => {
    const job = { id: 'a', current: false }
    expect(formatDuration(job)).toBe('—')
  })

  it('returns "—" for malformed endDate', () => {
    const job = { id: 'a', startDate: '2024-01', endDate: '12/2024', current: false }
    expect(formatDuration(job)).toBe('—')
  })
})
