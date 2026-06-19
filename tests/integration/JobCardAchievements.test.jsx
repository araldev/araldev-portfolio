import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { createRef } from 'react'
import { JobCardAchievements } from '../../src/components/JobCard/JobCardAchievements.jsx'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'

vi.mock('../../src/components/JobCard/JobCard.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

let mockPrefers = false
vi.mock('../../src/Hooks/usePrefersReducedMotion.js', () => ({
  usePrefersReducedMotion: () => mockPrefers
}))

function renderWithLang (ui) {
  return render(<LanguageProvider initialLang='en'>{ui}</LanguageProvider>)
}

beforeEach(() => { mockPrefers = false })
afterEach(() => { vi.restoreAllMocks() })

const achievements = ['Shipped feature X', 'Mentored 2 juniors', 'Wrote blog post']

describe('JobCardAchievements', () => {
  it('renders nothing when achievements is undefined (EC-001)', () => {
    const { container } = renderWithLang(
      <JobCardAchievements achievements={undefined} isExpanded={false} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when achievements is empty (EC-001)', () => {
    const { container } = renderWithLang(
      <JobCardAchievements achievements={[]} isExpanded={false} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the <section> when achievements is non-empty', () => {
    renderWithLang(
      <JobCardAchievements
        achievements={achievements}
        isExpanded
        achievementsId='ach-1'
      />
    )
    expect(screen.getByText('Key achievements')).toBeInTheDocument()
    expect(screen.getByText('Shipped feature X')).toBeInTheDocument()
    expect(screen.getByText('Mentored 2 juniors')).toBeInTheDocument()
    expect(screen.getByText('Wrote blog post')).toBeInTheDocument()
  })

  it('sets aria-hidden=true and the hidden attribute when collapsed', () => {
    renderWithLang(
      <JobCardAchievements
        achievements={achievements}
        isExpanded={false}
        achievementsId='ach-1'
      />
    )
    const section = screen.getByText('Key achievements').closest('section')
    expect(section).toHaveAttribute('aria-hidden', 'true')
    expect(section).toHaveAttribute('hidden')
  })

  it('sets aria-hidden=false and omits the hidden attribute when expanded', () => {
    renderWithLang(
      <JobCardAchievements
        achievements={achievements}
        isExpanded
        achievementsId='ach-1'
      />
    )
    const section = screen.getByText('Key achievements').closest('section')
    expect(section).toHaveAttribute('aria-hidden', 'false')
    expect(section).not.toHaveAttribute('hidden')
  })

  it('Escape key triggers the onToggleExpand callback', () => {
    const onToggle = vi.fn()
    const triggerRef = createRef()
    renderWithLang(
      <>
        <button ref={triggerRef}>trigger</button>
        <JobCardAchievements
          achievements={achievements}
          isExpanded
          achievementsId='ach-1'
          triggerRef={triggerRef}
          onToggleExpand={onToggle}
        />
      </>
    )
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })
    expect(onToggle).toHaveBeenCalled()
  })

  it('does NOT listen for Escape when collapsed', () => {
    const onToggle = vi.fn()
    const triggerRef = createRef()
    renderWithLang(
      <>
        <button ref={triggerRef}>trigger</button>
        <JobCardAchievements
          achievements={achievements}
          isExpanded={false}
          achievementsId='ach-1'
          triggerRef={triggerRef}
          onToggleExpand={onToggle}
        />
      </>
    )
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })
    expect(onToggle).not.toHaveBeenCalled()
  })
})
