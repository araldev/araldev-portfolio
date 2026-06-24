import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JobsCards } from '../../src/components/JobsCards/JobsCards.jsx'
import { IsIconCheckFilterProvider } from '../../src/contexts/IsIconCheckFilter.jsx'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'
import { minimalJob, jobEmptyStack } from '../fixtures/jobs.js'

vi.mock('../../src/components/JobsCards/JobsCards.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))
vi.mock('../../src/components/JobCard/JobCard.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

let mockSortJobs = []
vi.mock('../../src/Hooks/useSortJobs.js', () => ({
  useSortJobs: () => ({ sortJobs: mockSortJobs })
}))

vi.mock('../../src/Hooks/useFadeInJobCards.js', () => ({ useFadeInJobCards: vi.fn() }))
vi.mock('../../src/Hooks/useFlipJobs.js', () => ({ useFlipJobs: vi.fn() }))

beforeEach(() => {
  mockSortJobs = [minimalJob, jobEmptyStack]
})

function renderWithProviders (ui) {
  return render(
    <LanguageProvider>
      <IsIconCheckFilterProvider>{ui}</IsIconCheckFilterProvider>
    </LanguageProvider>
  )
}

describe('JobsCards', () => {
  it('renders the experience section with a heading', () => {
    renderWithProviders(<JobsCards />)
    expect(screen.getByRole('heading', { level: 2, name: /My career/i })).toBeInTheDocument()
  })

  it('renders one JobCard per job', () => {
    renderWithProviders(<JobsCards />)
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('renders the empty-state fallback when sortJobs is empty (EC-006)', () => {
    mockSortJobs = []
    renderWithProviders(<JobsCards />)
    expect(screen.getByRole('status')).toHaveTextContent(/No experience entries available/)
  })
})
