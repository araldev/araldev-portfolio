import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JobCardFooter } from '../../src/components/JobCard/JobCardFooter.jsx'
import { JobCardAchievements } from '../../src/components/JobCard/JobCardAchievements.jsx'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'

vi.mock('../../src/components/JobCard/JobCard.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

// The chevron that marks an expandable control. It reads as a stray dash
// next to the label and carries no information for the user.
const CHEVRON = /[▾▸▼►⌄⌃]/

function renderWithLang (ui, lang = 'en') {
  return render(<LanguageProvider initialLang={lang}>{ui}</LanguageProvider>)
}

const job = {
  id: 'ntt-data-practicas-2026',
  company: 'NTT DATA',
  achievements: ['One achievement']
}

describe('JobCard expandable controls', () => {
  it('renders the expand trigger without a chevron glyph', () => {
    renderWithLang(
      <JobCardFooter
        job={job}
        id={job.id}
        isExpanded={false}
        onToggleExpand={vi.fn()}
        expandTriggerRef={{ current: null }}
        expandLabel='See more'
        collapseLabel='See less'
      />
    )

    const trigger = screen.getByRole('button', { name: /see more/i })
    expect(trigger).toBeInTheDocument()
    expect(trigger.textContent).not.toMatch(CHEVRON)
  })

  it('renders the achievements header without a chevron glyph', () => {
    renderWithLang(
      <JobCardAchievements
        job={job}
        id={job.id}
        isExpanded={false}
        onToggleExpand={vi.fn()}
        achievementsId='job-ntt-data-achievements'
        achievements={job.achievements}
      />
    )

    const header = screen.getByRole('button', { name: /key achievements/i })
    expect(header).toBeInTheDocument()
    expect(header.textContent).not.toMatch(CHEVRON)
  })
})
