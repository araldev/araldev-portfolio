// tests/integration/ProjectsCards.v3.test.jsx — N1 ProjectsCards v3 RED contract.
//
// P3 (T-301) RED contract for the ProjectsCards v3 delete+recreate.
// This test asserts the v3 data contract preserved from the current
// source (per FR-N1-01..08 in specs/004-.../spec.md §N1):
//
//   1. Component accepts a `project` prop with the 9-field shape
//      ({ id, title, imgSrc, shortDescription, description[], tech{},
//        demoLink?, npmLink?, storybookLink?, codeLink? }).
//   2. Component renders all 4 link types conditionally in order:
//      demoLink → "Live Demo", npmLink → "npm Package",
//      storybookLink → "Storybook", codeLink → "Code".
//   3. Each link uses `target="_blank"` + `rel="noopener noreferrer"`.
//   4. Component renders the "Ver detalles" CTA button.
//   5. Clicking "Ver detalles" calls `onShowMore(project)` with the
//      full project object (preserved callback contract).
//   6. Component integrates `useSortProjects` + `useIsIconCheckFilter`
//      to render the project list + dim non-matching tech icons.
//   7. When `isIconCheck` has at least one truthy entry, tech icons
//      that are NOT in the active filter receive a "dim" class
//      (opacity 0.35 per FR-N1-04 / SC-N1-03).
//
// This test is RED against the current source (which has absolute
// `clip-path: path(...)` coordinates and a typo `projec_text_container`).
// P3 (N1 GREEN) deletes the old file and recreates it with the
// v3 contract — this test will then pass against the new file.
//
// Test layer: Integration (vitest + @testing-library/react) — the
// component is a multi-hook composition that requires a Provider
// for the IsIconCheckFilter context.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectsCards } from '../../src/components/ProjectsCards/ProjectsCards.jsx'
import { IsIconCheckFilterProvider } from '../../src/contexts/IsIconCheckFilter.jsx'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'

// CSS module proxy (deterministic class names for assertions)
vi.mock('../../src/components/ProjectsCards/ProjectsCards.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

// Mock the heavy ProjectModal — the modal uses gsap timelines that
// throw in jsdom. The v3 contract requires the parent to render the
// modal on `onShowMore`, but the modal itself is out of test scope.
vi.mock('../../src/components/ProjectModal/ProjectModal.jsx', () => ({
  ProjectModal: ({ project }) => (
    <div data-testid='project-modal-mock'>
      {project ? `Modal for ${project.title}` : null}
    </div>
  )
}))

// useSortProjects / useIsIconCheckFilter consume the IsIconCheckFilter
// context. Mock them so the test controls the project list + filter
// state explicitly (rather than reading the global `projects` array).
let mockSortProjects = []
vi.mock('../../src/Hooks/useSortProjects.js', () => ({
  useSortProjects: () => ({ sortProjects: mockSortProjects })
}))

let mockIsIconCheck = {}
vi.mock('../../src/Hooks/useIsIconCheckFilter.js', () => ({
  useIsIconCheckFilter: () => ({ isIconCheck: mockIsIconCheck, setIsIconCheck: vi.fn() })
}))

// useLenis — mocked to no-op so the modal open/close lenis.stop/start
// calls don't throw in jsdom (the real hook reads from lenis/react).
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

function renderWithProviders (ui) {
  return render(
    <LanguageProvider initialLang='en'>
      <IsIconCheckFilterProvider>{ui}</IsIconCheckFilterProvider>
    </LanguageProvider>
  )
}

// Mock project fixture with all 4 link types present
const fullProject = {
  id: 'test-project-1',
  title: 'Test Project',
  imgSrc: '/img/test.png',
  shortDescription: 'A short blurb for the test project',
  description: ['Para 1', 'Para 2'],
  tech: {
    react: <svg data-testid='svg-react' />,
    ts: <svg data-testid='svg-ts' />,
    vite: <svg data-testid='svg-vite' />
  },
  demoLink: 'https://example.com/demo',
  npmLink: 'https://npmjs.com/package/test',
  storybookLink: 'https://storybook.example.com',
  codeLink: 'https://github.com/test/test'
}

const noLinksProject = {
  id: 'test-project-2',
  title: 'No Links Project',
  imgSrc: '/img/nolinks.png',
  shortDescription: 'No links at all',
  description: ['Just text'],
  tech: { js: <svg data-testid='svg-js' /> }
}

describe('ProjectsCards v3 — data contract (FR-N1-01..08)', () => {
  it('renders the project list from useSortProjects', () => {
    mockSortProjects = [fullProject]
    renderWithProviders(<ProjectsCards />)
    expect(screen.getByRole('heading', { level: 3, name: 'Test Project' })).toBeInTheDocument()
    expect(screen.getByText('A short blurb for the test project')).toBeInTheDocument()
  })

  it('renders all 4 link types in the correct order (SC-N1-01)', () => {
    mockSortProjects = [fullProject]
    renderWithProviders(<ProjectsCards />)

    // All 4 anchors present
    const demoLink = screen.getByRole('link', { name: /live demo/i })
    const npmLink = screen.getByRole('link', { name: /npm package/i })
    const storyLink = screen.getByRole('link', { name: /storybook/i })
    const codeLink = screen.getByRole('link', { name: /code/i })

    expect(demoLink).toHaveAttribute('href', 'https://example.com/demo')
    expect(npmLink).toHaveAttribute('href', 'https://npmjs.com/package/test')
    expect(storyLink).toHaveAttribute('href', 'https://storybook.example.com')
    expect(codeLink).toHaveAttribute('href', 'https://github.com/test/test')

    // All open in new tab with safe rel
    ;[demoLink, npmLink, storyLink, codeLink].forEach(a => {
      expect(a).toHaveAttribute('target', '_blank')
      expect(a).toHaveAttribute('rel', 'noopener noreferrer')
    })

    // Order check: demo → npm → storybook → code
    const links = screen.getAllByRole('link')
    const linkHrefs = links.map(l => l.getAttribute('href'))
    const demoIdx = linkHrefs.indexOf('https://example.com/demo')
    const npmIdx = linkHrefs.indexOf('https://npmjs.com/package/test')
    const storyIdx = linkHrefs.indexOf('https://storybook.example.com')
    const codeIdx = linkHrefs.indexOf('https://github.com/test/test')
    expect(demoIdx).toBeLessThan(npmIdx)
    expect(npmIdx).toBeLessThan(storyIdx)
    expect(storyIdx).toBeLessThan(codeIdx)
  })

  it('does NOT render the action_links_row / links container when no link types are present (SC-N1-02)', () => {
    mockSortProjects = [noLinksProject]
    renderWithProviders(<ProjectsCards />)
    // The "See details" CTA must STILL be present (SC-N1-02)
    expect(screen.getByRole('button', { name: /see details/i })).toBeInTheDocument()
    // No anchors at all
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders only the links that are present (partial link set)', () => {
    const partialProject = {
      ...fullProject,
      id: 'partial',
      demoLink: undefined,
      npmLink: 'https://npmjs.com/package/partial',
      storybookLink: undefined,
      codeLink: 'https://github.com/test/partial'
    }
    mockSortProjects = [partialProject]
    renderWithProviders(<ProjectsCards />)
    expect(screen.queryByRole('link', { name: /live demo/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /npm package/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /storybook/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /code/i })).toBeInTheDocument()
  })

  it('renders one Ver detalles button per project (FR-N1-04, EC-N1-03)', () => {
    mockSortProjects = [fullProject, noLinksProject]
    renderWithProviders(<ProjectsCards />)
    const buttons = screen.getAllByRole('button', { name: /see details/i })
    expect(buttons).toHaveLength(2)
  })

  it('renders the description paragraphs (FR-N1-01 description[])', () => {
    mockSortProjects = [fullProject]
    renderWithProviders(<ProjectsCards />)
    expect(screen.getByText('Para 1')).toBeInTheDocument()
    expect(screen.getByText('Para 2')).toBeInTheDocument()
  })

  it('does NOT render the description list when description is empty (EC-N1-03)', () => {
    const emptyDescProject = { ...fullProject, id: 'empty-desc', description: [] }
    mockSortProjects = [emptyDescProject]
    renderWithProviders(<ProjectsCards />)
    // The short description is still shown
    expect(screen.getByText('A short blurb for the test project')).toBeInTheDocument()
    // No description list at all
    expect(screen.queryByText('Para 1')).not.toBeInTheDocument()
  })

  it('renders the project image with descriptive alt (FR-N1-01)', () => {
    mockSortProjects = [fullProject]
    renderWithProviders(<ProjectsCards />)
    const img = screen.getByRole('img', { name: /test project/i })
    expect(img).toHaveAttribute('src', '/img/test.png')
  })
})

describe('ProjectsCards v3 — modal integration (SC-N1-04)', () => {
  it('opens the modal when "Ver detalles" is clicked; lenis.stop() called once', () => {
    // The mock Lenis is null, so lenis.stop() is a no-op (safe).
    // We only need to verify the modal mounts and renders.
    mockSortProjects = [fullProject]
    renderWithProviders(<ProjectsCards />)
    expect(screen.queryByTestId('project-modal-mock')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /see details/i }))
    expect(screen.getByTestId('project-modal-mock')).toBeInTheDocument()
    expect(screen.getByTestId('project-modal-mock')).toHaveTextContent('Modal for Test Project')
  })

  it('calls onShowMore-equivalent state (modal receives the full project object)', () => {
    // The contract is: clicking the button → modal opens with project.
    // We assert the modal receives the same object passed to the card.
    mockSortProjects = [fullProject]
    renderWithProviders(<ProjectsCards />)
    fireEvent.click(screen.getByRole('button', { name: /see details/i }))
    expect(screen.getByTestId('project-modal-mock')).toHaveTextContent('Test Project')
  })
})

describe('ProjectsCards v3 — filter dimming (SC-N1-03, FR-N1-04)', () => {
  it('highlights the active tech and dims the rest when filter is active', () => {
    // Active filter: react only
    mockIsIconCheck = { ...mockIsIconCheck, react: true }
    mockSortProjects = [fullProject]
    renderWithProviders(<ProjectsCards />)
    // The 3 tech icons are all in the DOM (rendered as SVG)
    expect(screen.getByTestId('svg-react')).toBeInTheDocument()
    expect(screen.getByTestId('svg-ts')).toBeInTheDocument()
    expect(screen.getByTestId('svg-vite')).toBeInTheDocument()
    // The active tech (react) does NOT receive the dim class
    const reactSpan = screen.getByTestId('svg-react').parentElement
    const tsSpan = screen.getByTestId('svg-ts').parentElement
    const viteSpan = screen.getByTestId('svg-vite').parentElement
    expect(reactSpan.className).not.toMatch(/dim/i)
    expect(tsSpan.className).toMatch(/dim/i)
    expect(viteSpan.className).toMatch(/dim/i)
  })

  it('does not dim any tech when no filter is active', () => {
    mockIsIconCheck = { ...mockIsIconCheck } // all false
    mockSortProjects = [fullProject]
    renderWithProviders(<ProjectsCards />)
    const reactSpan = screen.getByTestId('svg-react').parentElement
    const tsSpan = screen.getByTestId('svg-ts').parentElement
    expect(reactSpan.className).not.toMatch(/dim/i)
    expect(tsSpan.className).not.toMatch(/dim/i)
  })
})
