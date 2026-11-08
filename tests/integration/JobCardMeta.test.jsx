import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JobCardMeta } from '../../src/components/JobCard/JobCardMeta.jsx'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'

vi.mock('../../src/components/JobCard/JobCard.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

function renderWithLang (ui) {
  return render(<LanguageProvider initialLang='en'>{ui}</LanguageProvider>)
}

const job = {
  startDate: '2023-03',
  period: 'Mar 2023 — Present',
  current: true,
  location: 'Madrid, Spain',
  remote: true
}

// A `current: true` job renders its duration relative to TODAY, so the
// expected string drifts every month ("3y 3m" → "3y 4m" → ...). Pin the
// clock so the assertion is stable forever. The Playwright suite uses the
// same trick in tests/visual/clock-fixture.js.
const FIXED_NOW = new Date(2026, 6, 1) // July 1 2026

afterEach(() => {
  vi.useRealTimers()
})

describe('JobCardMeta', () => {
  it('renders the period in a <time> with dateTime ISO (FR-016)', () => {
    renderWithLang(<JobCardMeta job={job} />)
    const time = screen.getByText('Mar 2023 — Present')
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('datetime', '2023-03')
  })

  it('renders the duration as visible text (SC-N2-04 regression — aria-prohibited-attr fix)', () => {
    // After T-307, the duration span has no aria-label. The accessible
    // name resolves to the text content (e.g. "3y 4m"). The previous
    // "Duration: 3y 4m" aria-label was prohibited on <span>.
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_NOW)

    renderWithLang(<JobCardMeta job={job} />)

    // Mar 2023 → Jul 2026 = 3 years and 4 months.
    expect(screen.getByText('3y 4m')).toBeInTheDocument()
  })

  it('renders the location', () => {
    renderWithLang(<JobCardMeta job={job} />)
    expect(screen.getByText('Madrid, Spain')).toBeInTheDocument()
  })

  it('renders the remote dot when remote: true', () => {
    renderWithLang(<JobCardMeta job={job} />)
    expect(screen.getByLabelText('Remote')).toBeInTheDocument()
  })

  it('omits the remote dot when remote: false', () => {
    renderWithLang(<JobCardMeta job={{ ...job, remote: false }} />)
    expect(screen.queryByLabelText('Remote')).not.toBeInTheDocument()
  })
})
