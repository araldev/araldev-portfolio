import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JobCardMeta } from '../../src/components/JobCard/JobCardMeta.jsx'

vi.mock('../../src/components/JobCard/JobCard.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

const job = {
  startDate: '2023-03',
  period: 'Mar 2023 — Present',
  current: true,
  location: 'Madrid, Spain',
  remote: true
}

describe('JobCardMeta', () => {
  it('renders the period in a <time> with dateTime ISO (FR-016)', () => {
    render(<JobCardMeta job={job} />)
    const time = screen.getByText('Mar 2023 — Present')
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('datetime', '2023-03')
  })

  it('renders the duration with descriptive aria-label', () => {
    render(<JobCardMeta job={job} />)
    expect(screen.getByLabelText(/Duration:/)).toBeInTheDocument()
  })

  it('renders the location', () => {
    render(<JobCardMeta job={job} />)
    expect(screen.getByText('Madrid, Spain')).toBeInTheDocument()
  })

  it('renders the remote dot when remote: true', () => {
    render(<JobCardMeta job={job} />)
    expect(screen.getByLabelText('Remote')).toBeInTheDocument()
  })

  it('omits the remote dot when remote: false', () => {
    render(<JobCardMeta job={{ ...job, remote: false }} />)
    expect(screen.queryByLabelText('Remote')).not.toBeInTheDocument()
  })
})
