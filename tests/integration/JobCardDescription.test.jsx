import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JobCardDescription } from '../../src/components/JobCard/JobCardDescription.jsx'

vi.mock('../../src/components/JobCard/JobCard.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

describe('JobCardDescription', () => {
  it('renders each paragraph', () => {
    render(<JobCardDescription description={['One', 'Two', 'Three']} />)
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
    expect(screen.getByText('Three')).toBeInTheDocument()
  })

  it('renders nothing for an empty array', () => {
    const { container } = render(<JobCardDescription description={[]} />)
    expect(container.querySelector('p')).toBeNull()
  })
})
