import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectModal } from '../../src/components/ProjectModal/ProjectModal.jsx'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'

vi.mock('../../src/components/ProjectModal/ProjectModal.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

// GSAP is stubbed: the modal only needs fromTo/timeline to not throw.
// The stub must NOT reveal the close button (the real component relies
// on GSAP to animate autoAlpha from 0), so the tests exercise the same
// visibility timing the browser does.
//
// The timeline is chainable: the component calls tl.fromTo(...).fromTo(...)
// so every method returns the timeline itself.
function createTimeline () {
  const tl = {
    fromTo: vi.fn(() => tl),
    from: vi.fn(() => tl),
    to: vi.fn(() => tl),
    call: vi.fn((fn) => { fn(); return tl }),
    kill: vi.fn()
  }
  return tl
}

vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(() => createTimeline()),
    set: vi.fn(),
    timeline: vi.fn(() => createTimeline())
  }
}))

const project = {
  id: 1,
  title: 'v12-ui',
  shortDescription: 'A component library',
  description: ['Line one'],
  tags: ['ts'],
  demoLink: 'https://example.com',
  npmLink: 'https://npmjs.com',
  githubLink: 'https://github.com',
  storybookLink: 'https://storybook.js.org',
  sourceCodeLink: 'https://github.com',
  gallery: [],
  details: [],
  tech: {}
}

function renderModal (onClose = vi.fn()) {
  return render(
    <LanguageProvider initialLang='en'>
      <ProjectModal project={project} onClose={onClose} />
    </LanguageProvider>
  )
}

beforeEach(() => {
  // The close button starts hidden (visibility:hidden) and GSAP reveals
  // it. In jsdom the CSS module is mocked away, so visibility is not
  // applied — but the focus behaviour must still hold.
  document.body.innerHTML = ''
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('ProjectModal focus management', () => {
  it('moves focus into the modal when it opens', () => {
    renderModal()

    // The dialog itself or one of its controls must hold focus.
    const dialog = screen.getByRole('dialog')
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it('keeps Tab focus inside the modal', () => {
    renderModal()

    const dialog = screen.getByRole('dialog')

    // Tab several times; focus must never leave the dialog.
    for (let i = 0; i < 8; i++) {
      fireEvent.keyDown(document, { key: 'Tab' })
      expect(
        dialog.contains(document.activeElement),
        `focus escaped the dialog after ${i + 1} Tab press(es)`
      ).toBe(true)
    }
  })

  it('keeps Shift+Tab focus inside the modal', () => {
    renderModal()

    const dialog = screen.getByRole('dialog')

    for (let i = 0; i < 8; i++) {
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
      expect(
        dialog.contains(document.activeElement),
        `focus escaped the dialog after ${i + 1} Shift+Tab press(es)`
      ).toBe(true)
    }
  })

  it('returns focus to the trigger when the modal closes', () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'See details'
    document.body.appendChild(trigger)
    trigger.focus()

    const { unmount } = renderModal()

    unmount()

    expect(document.activeElement).toBe(trigger)
  })
})
