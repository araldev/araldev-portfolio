/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {string} company
 * @property {string} [companyLogo]
 * @property {string} role
 * @property {('full-time'|'part-time'|'contract'|'freelance'|'internship')} type
 * @property {string} period
 * @property {string} startDate - ISO "YYYY-MM"
 * @property {string} [endDate] - ISO "YYYY-MM"
 * @property {boolean} current
 * @property {string} location
 * @property {boolean} remote
 * @property {string[]} description
 * @property {string[]} [achievements]
 * @property {Object<string, any>} stack
 * @property {string[]} [tags]
 * @property {{companyLink?: string, projectLink?: string, referenceLink?: string}} [links]
 */

import { techIcons } from './icons.js'

/**
 * Validator for the Job contract (FR-021).
 * In dev mode, logs errors/warnings. In prod, returns silently.
 * @param {Job} job
 * @param {number} index
 * @returns {boolean} true if valid (or prod mode), false if invalid in dev
 */
export function validateJobContract (job, index = 0) {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD) {
    return true
  }

  const required = [
    'id', 'company', 'role', 'type', 'period', 'startDate',
    'current', 'location', 'remote', 'description', 'stack'
  ]
  let valid = true

  for (const field of required) {
    if (job[field] === undefined || job[field] === null) {
      // eslint-disable-next-line no-console
      console.error(`[jobs.js] Job at index ${index} is missing required field "${field}".`, job)
      valid = false
    }
  }

  if (job.current && job.endDate) {
    // eslint-disable-next-line no-console
    console.warn(`[jobs.js] Job ${job.id} has current: true AND endDate defined; endDate will be ignored (EC-003).`)
  }

  if (job.startDate && !/^\d{4}-\d{2}$/.test(job.startDate)) {
    // eslint-disable-next-line no-console
    console.error(`[jobs.js] Job ${job.id} startDate must be in ISO "YYYY-MM" format, got "${job.startDate}".`)
    valid = false
  }

  if (job.endDate && !/^\d{4}-\d{2}$/.test(job.endDate)) {
    // eslint-disable-next-line no-console
    console.error(`[jobs.js] Job ${job.id} endDate must be in ISO "YYYY-MM" format, got "${job.endDate}".`)
    valid = false
  }

  const validTypes = ['full-time', 'part-time', 'contract', 'freelance', 'internship']
  if (job.type && !validTypes.includes(job.type)) {
    // eslint-disable-next-line no-console
    console.error(`[jobs.js] Job ${job.id} has invalid type "${job.type}". Allowed: ${validTypes.join(', ')}.`)
    valid = false
  }

  return valid
}

/**
 * Static job data. 3-8 entries expected (A10 of spec).
 * Covers all 12 edge cases from spec §1.
 * @type {Job[]}
 */
export const jobs = [
  {
    id: 'araldev-tech-lead-2023',
    company: 'Araldev',
    companyLogo: undefined,
    role: 'Frontend Tech Lead',
    type: 'full-time',
    period: 'Mar 2023 — Present',
    startDate: '2023-03',
    endDate: undefined,
    current: true,
    location: 'Madrid, Spain',
    remote: true,
    description: [
      'Lead the frontend architecture and tooling for the core product. Define the long-term technical roadmap with the CTO and coordinate a team of 4 engineers across two time zones.',
      'Own the design system, code quality, and performance budgets. Drive the migration to a micro-frontend architecture and ship a Storybook-driven component library used by 6 internal apps.'
    ],
    achievements: [
      'Reduced LCP from 4.2s to 1.8s across the marketing site and main app',
      'Shipped 12 production-ready micro-frontends in 18 months',
      'Mentored 3 junior developers on GSAP, accessibility and clean architecture',
      'Created the internal Storybook kit adopted by 4 teams'
    ],
    stack: {
      react: techIcons.react,
      ts: techIcons.ts,
      tailwind: techIcons.tailwind,
      storybook: techIcons.storybook,
      vite: techIcons.vite,
      gsap: techIcons.gsap
    },
    tags: ['React', 'Leadership', 'FinTech', 'A11y'],
    links: {
      companyLink: 'https://github.com/araldev',
      projectLink: 'https://github.com/araldev/v12-ui'
    }
  },
  {
    id: 'freelance-design-engineer-2022',
    company: 'Independent',
    companyLogo: undefined,
    role: 'Design Engineer',
    type: 'freelance',
    period: 'Sep 2022 — Feb 2023',
    startDate: '2022-09',
    endDate: '2023-02',
    current: false,
    location: 'Remote',
    remote: true,
    description: [
      'Delivered design-engineering contracts for two SaaS startups: GSAP-driven landing animations, custom illustration pipelines and Storybook documentation.',
      'Worked async-first, shipping every Friday with a recorded walkthrough. Clients reported a 30% lift in landing-page conversion after the visual refresh.'
    ],
    achievements: [
      'Delivered 3 MVPs in 5 months',
      'Authored 2 open-source GSAP utilities (100+ GitHub stars combined)'
    ],
    stack: {
      js: techIcons.js,
      react: techIcons.react,
      gsap: techIcons.gsap,
      tailwind: techIcons.tailwind,
      git: techIcons.git,
      gitHub: techIcons.gitHub
    },
    tags: ['Freelance', 'GSAP', 'SaaS'],
    links: {
      projectLink: 'https://github.com/araldev',
      referenceLink: 'https://www.linkedin.com/in/araldev'
    }
  },
  {
    id: 'prevsaas-frontend-2021',
    company: 'PrevSaaS',
    companyLogo: undefined,
    role: 'Frontend Engineer',
    type: 'full-time',
    period: 'Mar 2021 — Aug 2022',
    startDate: '2021-03',
    endDate: '2022-08',
    current: false,
    location: 'Barcelona, Spain',
    remote: false,
    description: [
      'Built the customer-facing dashboard for a B2B SaaS analytics product. Owned the data-visualization layer (D3 + custom canvas charts) and the accessibility audit process.',
      'Collaborated with a product designer in a tight 2-week cadence. Introduced a custom in-house React component library and Vite-based tooling to replace the legacy Webpack pipeline.'
    ],
    achievements: [
      'Cut dashboard time-to-interactive by 45%',
      'Achieved WCAG 2.1 AA compliance across 30+ screens',
      'Migrated the build pipeline from Webpack to Vite, reducing CI time by 60%'
    ],
    stack: {
      react: techIcons.react,
      js: techIcons.js,
      css: techIcons.css,
      html: techIcons.html,
      vite: techIcons.vite,
      git: techIcons.git,
      gitHub: techIcons.gitHub
    },
    tags: ['React', 'D3', 'Analytics'],
    links: {
      companyLink: 'https://example.com/prevsaas'
    }
  },
  {
    id: 'edtech-frontend-intern-2020',
    company: 'EdTech Lab',
    companyLogo: undefined,
    role: 'Frontend Intern',
    type: 'internship',
    period: 'Jun 2020 — Feb 2021',
    startDate: '2020-06',
    endDate: '2021-02',
    current: false,
    location: 'Madrid, Spain',
    remote: false,
    description: [
      'First professional role: built interactive HTML/CSS/JS exercises for an English-learning web app. Worked closely with the lead engineer and a content team.',
      'Created the JSON-driven level system that the team continued to extend after my internship ended.'
    ],
    stack: {
      js: techIcons.js,
      css: techIcons.css,
      html: techIcons.html,
      git: techIcons.git,
      gitHub: techIcons.gitHub
    },
    tags: ['Internship', 'EdTech'],
    links: {
      projectLink: 'https://araldev.github.io/english-web/'
    }
  }
]

// Validate all jobs at module load (dev only)
jobs.forEach((job, i) => validateJobContract(job, i))
