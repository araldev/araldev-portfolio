import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createRef } from 'react'
import { JobCardFooter } from '../../src/components/JobCard/JobCardFooter.jsx'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'

vi.mock('../../src/components/JobCard/JobCard.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

function renderWithLang (ui) {
  return render(<LanguageProvider initialLang='en'>{ui}</LanguageProvider>)
}

const baseJob = {
  id: 'j1',
  company: 'Acme',
  tags: ['React', 'FinTech'],
  links: {
    companyLink: 'https://acme.com',
    projectLink: 'https://github.com/acme/x'
  },
  achievements: ['A1', 'A2']
}

describe('JobCardFooter', () => {
  it('renders tag pills', () => {
    renderWithLang(<JobCardFooter job={baseJob} id='j1' isExpanded={false} onToggleExpand={vi.fn()} expandTriggerRef={createRef()} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('FinTech')).toBeInTheDocument()
    // T-307: tags section now uses aria-label="Tags for {company}" so
    // each card's section has a unique accessible name (no landmark-unique
    // violation when 3+ JobCards render on the same #experience section).
    expect(screen.getByLabelText('Tags for Acme')).toBeInTheDocument()
  })

  it('omits the tags block when tags is undefined (EC-011 friendly)', () => {
    renderWithLang(<JobCardFooter job={{ ...baseJob, tags: undefined }} id='j1' isExpanded={false} onToggleExpand={vi.fn()} expandTriggerRef={createRef()} />)
    expect(screen.queryByText('React')).not.toBeInTheDocument()
  })

  it('renders LinkButtons for each present link', () => {
    renderWithLang(<JobCardFooter job={baseJob} id='j1' isExpanded={false} onToggleExpand={vi.fn()} expandTriggerRef={createRef()} />)
    expect(screen.getByText(/Company/)).toHaveAttribute('href', 'https://acme.com')
    expect(screen.getByText(/Project/)).toHaveAttribute('href', 'https://github.com/acme/x')
  })

  it('does not render the expand trigger when there are no achievements (EC-001)', () => {
    renderWithLang(<JobCardFooter job={{ ...baseJob, achievements: [] }} id='j1' isExpanded={false} onToggleExpand={vi.fn()} expandTriggerRef={createRef()} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders the expand trigger with aria-expanded=false when collapsed', () => {
    renderWithLang(<JobCardFooter job={baseJob} id='j1' isExpanded={false} onToggleExpand={vi.fn()} expandTriggerRef={createRef()} />)
    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls', 'job-j1-achievements')
  })

  it('renders the expand trigger with aria-expanded=true when expanded', () => {
    renderWithLang(<JobCardFooter job={baseJob} id='j1' isExpanded onToggleExpand={vi.fn()} expandTriggerRef={createRef()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('calls onToggleExpand when the trigger is clicked', () => {
    const cb = vi.fn()
    renderWithLang(<JobCardFooter job={baseJob} id='j1' isExpanded={false} onToggleExpand={cb} expandTriggerRef={createRef()} />)
    fireEvent.click(screen.getByRole('button'))
    expect(cb).toHaveBeenCalledTimes(1)
  })
})
