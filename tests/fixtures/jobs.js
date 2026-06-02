import { techIcons } from '../../src/data/icons.js'

/**
 * Shared job fixtures for tests (Feature 002).
 * Mirrors the `Job` contract from spec §3.
 * Always valid by default; specific tests can override fields.
 */

export const validStack = {
  js: techIcons.js,
  react: techIcons.react,
  ts: techIcons.ts,
  tailwind: techIcons.tailwind
}

export const minimalJob = {
  id: 'test-co-2024',
  company: 'Test Co',
  companyLogo: undefined,
  role: 'Frontend Dev',
  type: 'full-time',
  period: 'Jan 2024 — Present',
  startDate: '2024-01',
  endDate: undefined,
  current: true,
  location: 'Madrid, Spain',
  remote: true,
  description: ['Built cool things.'],
  achievements: undefined,
  stack: { js: techIcons.js, react: techIcons.react },
  tags: undefined,
  links: undefined
}

export const featuredJob = {
  ...minimalJob,
  id: 'featured-co-2024',
  current: true
}

export const historicalJob = {
  ...minimalJob,
  id: 'historical-co-2020',
  current: false,
  endDate: '2020-12',
  period: 'Jan 2020 — Dec 2020'
}

export const jobWithAchievements = {
  ...minimalJob,
  id: 'with-ach-2023',
  achievements: ['Shipped feature X', 'Mentored 2 juniors']
}

export const jobEmptyStack = {
  ...minimalJob,
  id: 'no-stack-2022',
  stack: {}
}

export const jobNoAchievements = {
  ...minimalJob,
  id: 'no-ach-2023',
  achievements: undefined
}

export const jobLongDescription = {
  ...minimalJob,
  id: 'long-desc-2021',
  description: ['Para 1', 'Para 2', 'Para 3']
}

export const jobWithLinks = {
  ...minimalJob,
  id: 'with-links-2023',
  links: {
    companyLink: 'https://example.com',
    projectLink: 'https://github.com/x'
  }
}

export const jobWithTags = {
  ...minimalJob,
  id: 'with-tags-2023',
  tags: ['React', 'FinTech', 'Leadership']
}

export const jobNoTags = {
  ...minimalJob,
  id: 'no-tags-2023',
  tags: undefined
}

export const jobWithLogo = {
  ...minimalJob,
  id: 'with-logo-2023',
  companyLogo: '/logos/test.webp'
}

export const allFixtures = [
  featuredJob,
  jobWithAchievements,
  historicalJob,
  jobEmptyStack,
  jobWithLinks
]
