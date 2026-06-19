import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { JobCard } from '../../src/components/JobCard/JobCard.jsx'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'

function renderWithLang (ui) {
  return render(<LanguageProvider initialLang='en'>{ui}</LanguageProvider>)
}

// Style proxy so any class lookup yields a deterministic string
vi.mock('../../src/components/JobCard/JobCard.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

// P4: useIsIconCheckFilter mock removed — JobCardStack no longer reads
// the filter context (filter UI + dim logic removed from JobsCards).

const fullJob = {
  id: 'job-1',
  company: 'Acme Global',
  companyLogo: undefined,
  role: 'Tech Lead',
  type: 'full-time',
  period: 'Mar 2023 — Present',
  startDate: '2023-03',
  endDate: undefined,
  current: true,
  location: 'Madrid, Spain',
  remote: true,
  description: ['Para 1', 'Para 2'],
  achievements: ['A1', 'A2'],
  stack: { react: <svg data-testid='svg-react' />, ts: <svg data-testid='svg-ts' /> },
  tags: ['React', 'FinTech'],
  links: { companyLink: 'https://acme.com' }
}

const historicalJob = {
  ...fullJob,
  id: 'job-hist',
  current: false,
  endDate: '2022-12',
  period: 'Jan 2020 — Dec 2022',
  achievements: undefined,
  stack: {},
  tags: undefined,
  links: undefined
}

describe('JobCard — main composition', () => {
  it('renders an <article> with aria-labelledby (FR-001)', () => {
    renderWithLang(<JobCard job={fullJob} jobsList={[fullJob]} />)
    const article = screen.getByRole('article')
    expect(article).toHaveAttribute('aria-labelledby', 'job-job-1-company')
  })

  it('marks data-featured="true" on the current job when it is the only one', () => {
    renderWithLang(<JobCard job={fullJob} jobsList={[fullJob]} />)
    expect(screen.getByRole('article')).toHaveAttribute('data-featured', 'true')
  })

  it('marks data-featured="false" on a historical job', () => {
    renderWithLang(<JobCard job={historicalJob} jobsList={[historicalJob]} />)
    expect(screen.getByRole('article')).toHaveAttribute('data-featured', 'false')
  })

  it('only the most recent current:true is featured when multiple are present', () => {
    const olderCurrent = { ...fullJob, id: 'old', startDate: '2020-01' }
    renderWithLang(<JobCard job={olderCurrent} jobsList={[olderCurrent, fullJob]} />)
    expect(screen.getByRole('article')).toHaveAttribute('data-featured', 'false')
  })

  it('renders company + role + period + description', () => {
    renderWithLang(<JobCard job={fullJob} jobsList={[fullJob]} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Acme Global' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4, name: 'Tech Lead' })).toBeInTheDocument()
    expect(screen.getByText('Mar 2023 — Present')).toBeInTheDocument()
    expect(screen.getByText('Para 1')).toBeInTheDocument()
    expect(screen.getByText('Para 2')).toBeInTheDocument()
  })

  it('renders the expand trigger for a job with achievements (FR-004)', () => {
    renderWithLang(<JobCard job={fullJob} jobsList={[fullJob]} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('does NOT render the expand trigger when achievements is empty (FR-004 / EC-001)', () => {
    renderWithLang(<JobCard job={historicalJob} jobsList={[historicalJob]} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('expands and collapses on click (US-3)', () => {
    renderWithLang(<JobCard job={fullJob} jobsList={[fullJob]} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  it('hides the stack row when stack is empty (FR-005)', () => {
    renderWithLang(<JobCard job={historicalJob} jobsList={[historicalJob]} />)
    expect(screen.queryByLabelText(/Technologies used in this role/)).not.toBeInTheDocument()
  })

  it('hides the tags row when tags is undefined (EC-011 friendly)', () => {
    renderWithLang(<JobCard job={historicalJob} jobsList={[historicalJob]} />)
    expect(screen.queryByText('React')).not.toBeInTheDocument()
  })

  it('uses the type-specific badge class (FR-007) — visible text "Full-time" (T-307 aria-prohibited-attr fix)', () => {
    renderWithLang(<JobCard job={fullJob} jobsList={[fullJob]} />)
    const badge = screen.getByText('Full-time')
    expect(badge).toBeInTheDocument()
  })

  it('uses <time> with dateTime for the period (FR-016)', () => {
    renderWithLang(<JobCard job={fullJob} jobsList={[fullJob]} />)
    const time = screen.getByText('Mar 2023 — Present')
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('datetime', '2023-03')
  })

  it('renders the beacon when current: true (Featured visual)', () => {
    renderWithLang(<JobCard job={fullJob} jobsList={[fullJob]} />)
    expect(screen.getAllByLabelText('Currently active position').length).toBeGreaterThan(0)
  })

  it('does not render the beacon when current: false', () => {
    renderWithLang(<JobCard job={historicalJob} jobsList={[historicalJob]} />)
    expect(screen.queryByLabelText('Currently active position')).not.toBeInTheDocument()
  })
})
