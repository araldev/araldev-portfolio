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
})
