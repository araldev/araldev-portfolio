// tests/a11y/ProjectsCards.v3.a11y.test.jsx — N1 ProjectsCards v3 a11y gate.
//
// P3 (T-302) RED contract for ProjectsCards v3 a11y.
// Asserts jest-axe 0 violations and verifies the FR-N1-07
// requirements:
//   1. jest-axe reports 0 violations on the rendered #projects
//      section (SC-N1-03).
//   2. Each <article> has a unique `aria-labelledby` (FR-N1-07).
//   3. The "Ver detalles" CTA uses a real <button>, not a <div>
//      with role=button (semantic HTML preference).
//   4. There are NO duplicate <nav> elements without aria-label
//      (the current source has 3 <nav class="links_container">
//      with no aria-label → 3 landmark-unique violations).
//
// P1 capture: visual axe on the live page flagged 3 violations
// (3 duplicate <nav> elements in the projects section). P3 (N1
// delete+recreate) MUST fix this.
//
// Test layer: Unit-level jsdom axe. The visual axe test in
// tests/visual/projects-cards.spec.js already runs axe against
// the live page at all 3 viewports + chromium-no-reduced-motion
// (FR-N1-07). This vitest file is the per-commit jsdom gate.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ProjectsCards } from '../../src/components/ProjectsCards/ProjectsCards.jsx'
import { IsIconCheckFilterProvider } from '../../src/contexts/IsIconCheckFilter.jsx'

expect.extend(toHaveNoViolations)

vi.mock('../../src/components/ProjectsCards/ProjectsCards.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

vi.mock('../../src/components/ProjectModal/ProjectModal.jsx', () => ({
  ProjectModal: () => null
}))

let mockSortProjects = []
vi.mock('../../src/Hooks/useSortProjects.js', () => ({
  useSortProjects: () => ({ sortProjects: mockSortProjects })
}))

let mockIsIconCheck = {}
vi.mock('../../src/Hooks/useIsIconCheckFilter.js', () => ({
  useIsIconCheckFilter: () => ({ isIconCheck: mockIsIconCheck, setIsIconCheck: vi.fn() })
}))

vi.mock('lenis/react', () => ({
  useLenis: () => null
}))

beforeEach(() => {
  mockIsIconCheck = {
    js: false,
    react: false,
    css: false,
    html: false,
    ts: false,
    git: false,
    gitHub: false,
    gsap: false,
    tailwind: false,
    storybook: false,
    vite: false,
    npm: false
  }
})

const project1 = {
  id: 'a11y-1',
  title: 'First Project',
  imgSrc: '/img/1.png',
  shortDescription: 'first',
  description: ['p1'],
  tech: { react: <svg data-testid='svg-react' /> },
  demoLink: 'https://example.com',
  codeLink: 'https://github.com/x'
}

const project2 = {
  id: 'a11y-2',
  title: 'Second Project',
  imgSrc: '/img/2.png',
  shortDescription: 'second',
  description: ['p2'],
  tech: { ts: <svg data-testid='svg-ts' /> },
  npmLink: 'https://npmjs.com/y',
  storybookLink: 'https://sb.example.com'
}

function renderWithProviders (ui) {
  return render(<IsIconCheckFilterProvider>{ui}</IsIconCheckFilterProvider>)
}

describe('ProjectsCards v3 — accessibility (jest-axe)', () => {
  it('has 0 axe violations on the projects section (FR-N1-07)', async () => {
    mockSortProjects = [project1, project2]
    const { container } = renderWithProviders(<ProjectsCards />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has 0 axe violations with 0 projects', async () => {
    mockSortProjects = []
    const { container } = renderWithProviders(<ProjectsCards />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('uses an <article> with unique aria-labelledby per card (FR-N1-07)', () => {
    mockSortProjects = [project1, project2]
    renderWithProviders(<ProjectsCards />)
    const articles = screen.getAllByRole('article')
    expect(articles).toHaveLength(2)
    const labelledBy = articles.map(a => a.getAttribute('aria-labelledby'))
    // Each card's labelledby must be unique (no 003 duplicate-id bug)
    expect(new Set(labelledBy).size).toBe(2)
    // And each must be a real ID we can resolve in the DOM
    labelledBy.forEach(id => {
      expect(document.getElementById(id)).not.toBeNull()
    })
  })

  it('renders the "Ver detalles" CTA as a semantic <button> (FR-N1-08)', () => {
    mockSortProjects = [project1]
    renderWithProviders(<ProjectsCards />)
    const btn = screen.getByRole('button', { name: /ver detalles/i })
    expect(btn.tagName).toBe('BUTTON')
  })

  it('does NOT render a <nav> without aria-label (FR-N1-07 regression guard)', () => {
    // The 003 source had 3 <nav class="links_container"> with NO
    // aria-label — axe flagged this as `landmark-unique` (3 instances
    // of the same unlabelled landmark). P3 (N1) must fix it.
    mockSortProjects = [project1, project2]
    const { container } = renderWithProviders(<ProjectsCards />)
    const navs = Array.from(container.querySelectorAll('nav'))
    navs.forEach(nav => {
      const hasAriaLabel = nav.hasAttribute('aria-label') || nav.hasAttribute('aria-labelledby')
      expect(hasAriaLabel, 'every <nav> must have aria-label or aria-labelledby').toBe(true)
    })
  })

  it('the <section id="projects"> landmark is preserved (FR-N1-08)', () => {
    mockSortProjects = [project1]
    const { container } = renderWithProviders(<ProjectsCards />)
    const section = container.querySelector('section#projects')
    expect(section).not.toBeNull()
  })
})
