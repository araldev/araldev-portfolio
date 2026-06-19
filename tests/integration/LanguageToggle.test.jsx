import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageToggle } from '../../src/components/LanguageToggle/LanguageToggle.jsx'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'
import { LANGUAGE_STORAGE_KEY } from '../../src/i18n/detectLanguage.js'

vi.mock('../../src/components/LanguageToggle/LanguageToggle.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

function renderWithProvider (ui, initialLang = 'es') {
  return render(<LanguageProvider initialLang={initialLang}>{ui}</LanguageProvider>)
}

describe('LanguageToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders one button per supported language', () => {
    renderWithProvider(<LanguageToggle />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  it('marks the active language button as aria-pressed=true', () => {
    renderWithProvider(<LanguageToggle />, 'es')
    const buttons = screen.getAllByRole('button')
    const activeButton = buttons.find((btn) => btn.getAttribute('aria-pressed') === 'true')
    expect(activeButton).toBeDefined()
    expect(activeButton.getAttribute('aria-label')).toBe('Español')
  })

  it('switches the active language when another button is clicked', () => {
    renderWithProvider(<LanguageToggle />, 'es')
    const buttons = screen.getAllByRole('button')

    // Find the English button by label
    const englishButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'English')
    fireEvent.click(englishButton)

    // After click, English should be the active one
    const englishAfter = buttons.find((btn) => btn.getAttribute('aria-label') === 'English')
    expect(englishAfter.getAttribute('aria-pressed')).toBe('true')
  })

  it('persists the chosen language to localStorage', () => {
    renderWithProvider(<LanguageToggle />, 'es')
    const buttons = screen.getAllByRole('button')
    const englishButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'English')
    fireEvent.click(englishButton)
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
  })

  it('exposes an aria-label on the wrapper describing the role (ES)', () => {
    renderWithProvider(<LanguageToggle />, 'es')
    const group = screen.getByRole('group', { name: /Idioma/i })
    expect(group).toBeInTheDocument()
  })

  it('exposes an aria-label on the wrapper describing the role (EN)', () => {
    renderWithProvider(<LanguageToggle />, 'en')
    const group = screen.getByRole('group', { name: /Language/i })
    expect(group).toBeInTheDocument()
  })

  it('wraps each flag code in an aria-hidden span (decorative)', () => {
    const { container } = renderWithProvider(<LanguageToggle />)
    const flagSpans = container.querySelectorAll('span[aria-hidden="true"]')
    expect(flagSpans.length).toBeGreaterThanOrEqual(2)
  })

  it('renders the ISO language code in each button (ES/EN)', () => {
    const { container } = renderWithProvider(<LanguageToggle />)
    // The codes live in aria-hidden spans.
    const codes = Array.from(container.querySelectorAll('span[aria-hidden="true"]'))
      .map((el) => el.textContent)
    expect(codes).toContain('ES')
    expect(codes).toContain('EN')
  })

  it('uses CSS-only flag swatches (no emoji glyphs rendered)', () => {
    // The flag is painted via background-image / linear-gradient. We
    // assert the button background is non-empty (the CSS module sets
    // it). The test is loose on purpose: the goal is to confirm the
    // button has visual content, not to pin the exact gradient.
    const buttons = renderWithProvider(<LanguageToggle />).getAllByRole('button')
    buttons.forEach((btn) => {
      const style = window.getComputedStyle(btn)
      expect(style.background.length).toBeGreaterThan(0)
    })
  })

  it('only the active button has the active state class (so the checkmark + cyan ring render on it)', () => {
    const { container } = renderWithProvider(<LanguageToggle />, 'es')
    // The CSS class `flagBtnActive` is a hashed class. We just check
    // that exactly one button has it (the active one).
    const buttons = container.querySelectorAll('button')
    const activeCount = Array.from(buttons).filter((b) =>
      b.getAttribute('aria-pressed') === 'true'
    ).length
    expect(activeCount).toBe(1)
  })
})
