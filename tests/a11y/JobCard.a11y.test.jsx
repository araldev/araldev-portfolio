import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { JobCard } from '../../src/components/JobCard/JobCard.jsx'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

vi.mock('../../src/components/JobCard/JobCard.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

vi.mock('../../src/Hooks/useIsIconCheckFilter.js', () => ({
  useIsIconCheckFilter: () => ({ isIconCheck: {}, setIsIconCheck: vi.fn() })
}))

const baseJob = {
  id: 'job-1',
  company: 'Acme Global',
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
  stack: { react: <svg />, ts: <svg /> },
  tags: ['React'],
  links: { companyLink: 'https://acme.com' }
}

const variants = {
  Standard: baseJob,
  Historical: { ...baseJob, id: 'h', current: false, endDate: '2022-12', period: 'Jan 2020 — Dec 2022', achievements: undefined, stack: { react: <svg /> } },
  EmptyStack: { ...baseJob, id: 'es', current: false, stack: {} },
  NoTags: { ...baseJob, id: 'nt', tags: undefined },
  NoLinks: { ...baseJob, id: 'nl', links: undefined },
  WithLogo: { ...baseJob, id: 'wl', companyLogo: '/logos/acme.webp' }
}

describe('JobCard — accessibility (jest-axe)', () => {
  Object.entries(variants).forEach(([name, job]) => {
    it(`has 0 axe violations for ${name} variant`, async () => {
      const { container } = render(<JobCard job={job} jobsList={[job]} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  // SC-N2-04 / FR-N2-09 — aria-prohibited-attr regression guard.
  //
  // The P2 visual test (real Chromium axe) flagged 4 viewports of
  // `aria-prohibited-attr` violations on the JobsCards section. The
  // offender was `<div class="job_card_stack" aria-label="Technologies
  // used in this role">` (and similar wrappers); aria-label is
  // PROHIBITED on <div> and <span> unless they carry a landmark role.
  //
  // jsdom's jest-axe does NOT enforce this rule (axe-core's role-tree
  // check is a real-browser feature), so the per-variant jest-axe call
  // above will report 0 violations even when the markup has prohibited
  // ARIA. This manual DOM check mirrors the real-browser gate: every
  // <div> and <span> that carries aria-label MUST also carry a valid
  // landmark role; otherwise the attribute is prohibited on the element
  // type and axe will flag it in the visual suite.
  //
  // P3-B2 (T-307) replaces the <div> wrappers with <section> (which IS
  // a valid landmark) and removes redundant aria-label on <span>
  // elements where the visible text is already the accessible name.
  it('has no <div> or <span> with aria-label without a landmark role (axe aria-prohibited-attr)', () => {
    const offenders = []
    Object.entries(variants).forEach(([name, job]) => {
      const { container } = render(<JobCard job={job} jobsList={[job]} />)
      const bad = Array.from(container.querySelectorAll('div, span'))
        .filter(el => el.hasAttribute('aria-label') && !el.hasAttribute('role'))
      bad.forEach(el => offenders.push(`[${name}] ${el.outerHTML.slice(0, 200)}`))
    })
    expect(
      offenders,
      `Found ${offenders.length} prohibited aria-label(s):\n  - ${offenders.join('\n  - ')}`
    ).toEqual([])
  })
})
