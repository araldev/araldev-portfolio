import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JobCardHeader } from '../../src/components/JobCard/JobCardHeader.jsx'

vi.mock('../../src/components/JobCard/JobCard.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

const baseJob = {
  id: 'job-1',
  company: 'Acme Global',
  role: 'Tech Lead',
  type: 'full-time',
  current: false
}

describe('JobCardHeader', () => {
  it('renders company as an h3 with the expected id', () => {
    render(<JobCardHeader job={baseJob} id='job-1' />)
    const h3 = screen.getByRole('heading', { level: 3, name: 'Acme Global' })
    expect(h3).toBeInTheDocument()
    expect(h3).toHaveAttribute('id', 'job-job-1-company')
  })

  it('renders role as an h4', () => {
    render(<JobCardHeader job={baseJob} id='job-1' />)
    expect(screen.getByRole('heading', { level: 4, name: 'Tech Lead' })).toBeInTheDocument()
  })

  it('renders the type badge with descriptive aria-label', () => {
    render(<JobCardHeader job={baseJob} id='job-1' />)
    expect(screen.getByLabelText('Full-time employment')).toBeInTheDocument()
  })

  it('handles all valid job types', () => {
    const types = ['full-time', 'part-time', 'contract', 'freelance', 'internship']
    const expected = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']
    types.forEach((type, i) => {
      const { unmount } = render(<JobCardHeader job={{ ...baseJob, type }} id={`x${i}`} />)
      expect(screen.getByLabelText(`${expected[i]} employment`)).toBeInTheDocument()
      unmount()
    })
  })

  it('does NOT render the beacon inside the header (it lives at the top of the card)', () => {
    render(<JobCardHeader job={baseJob} id='job-1' />)
    expect(screen.queryByLabelText('Currently active position')).not.toBeInTheDocument()
  })
})
