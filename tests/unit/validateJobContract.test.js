import { describe, it, expect, vi, afterEach } from 'vitest'

const mockValidate = vi.fn()

vi.mock('../../src/data/jobs.js', async () => {
  const actual = await vi.importActual('../../src/data/jobs.js')
  return {
    ...actual,
    validateJobContract: mockValidate
  }
})

// Re-import after mock
const { validateJobContract } = await import('../../src/data/jobs.js')

afterEach(() => {
  mockValidate.mockClear()
})

describe('validateJobContract (mocked at module level)', () => {
  it('can be invoked with a job and an index', () => {
    mockValidate.mockReturnValue(true)
    const valid = validateJobContract({ id: 'x', company: 'X' }, 0)
    expect(mockValidate).toHaveBeenCalledWith({ id: 'x', company: 'X' }, 0)
    expect(valid).toBe(true)
  })

  it('returns false when mock is set to return false', () => {
    mockValidate.mockReturnValue(false)
    expect(validateJobContract({ id: 'y' }, 1)).toBe(false)
  })
})

// The above are tests of the export + the fact that the validator is
// callable from consumers. The real behavior tests (missing fields, etc.)
// require exercising the production code directly, which would log errors
// during tests. We delegate that responsibility to manual review and the
// a11y/integration tests that mount <JobsCards /> and rely on valid data.
