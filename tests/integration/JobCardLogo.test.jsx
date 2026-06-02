import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { JobCardLogo } from '../../src/components/JobCard/JobCardLogo.jsx'

// Provide the styles import the component needs
vi.mock('../../src/components/JobCard/JobCard.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

describe('JobCardLogo', () => {
  it('renders the initials placeholder when no companyLogo is provided', () => {
    render(<JobCardLogo company='Acme Global' />)
    expect(screen.getByText('AG')).toBeInTheDocument()
  })

  it('renders the <img> when companyLogo is provided', () => {
    const { container } = render(
      <JobCardLogo company='Acme Global' companyLogo='/logos/acme.webp' />
    )
    // <img alt=""> inside aria-hidden is role="presentation" by WAI-ARIA,
    // so we query the DOM directly rather than by role.
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img).toHaveAttribute('src', '/logos/acme.webp')
    expect(img).toHaveAttribute('alt', '')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('falls back to initials when the image errors (EC-005)', () => {
    const { container } = render(
      <JobCardLogo company='Beta Co' companyLogo='/logos/missing.webp' />
    )
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    act(() => {
      img.dispatchEvent(new Event('error', { bubbles: true }))
    })
    // After the error fires, the initials placeholder is rendered
    expect(screen.getByText('BC')).toBeInTheDocument()
  })

  it('is marked aria-hidden="true" (decorative, FR-006)', () => {
    const { container } = render(<JobCardLogo company='Gamma' />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('handles missing company gracefully', () => {
    render(<JobCardLogo company='' />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('caps initials at 2 chars', () => {
    render(<JobCardLogo company='A Very Long Company Name LLC' />)
    expect(screen.getByText('AV')).toBeInTheDocument()
  })
})
