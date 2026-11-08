import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { NavHeader } from '../../src/components/NavHeader/NavHeader.jsx'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'

// The nav header drives the mobile menu through a CSS-only checkbox
// (the `:has(.checkbox:checked)` selectors in NavHeader.module.css).
// Lenis is only used to freeze/unfreeze the scroll, so a stub is enough
// to assert that the scroll is released when the menu closes.
const { lenisMock } = vi.hoisted(() => ({
  lenisMock: {
    stop: vi.fn(),
    start: vi.fn(),
    scrollTo: vi.fn()
  }
}))

vi.mock('lenis/react', () => ({
  useLenis: () => lenisMock
}))

function renderNav () {
  return render(
    <LanguageProvider initialLang='es'>
      <NavHeader activeSection='home' />
    </LanguageProvider>
  )
}

function getCheckbox (container) {
  return container.querySelector('input[type="checkbox"]')
}

function openMenu (container) {
  fireEvent.click(container.querySelector('label'))
}

describe('NavHeader mobile menu', () => {
  beforeEach(() => {
    lenisMock.stop.mockClear()
    lenisMock.start.mockClear()
    lenisMock.scrollTo.mockClear()
  })

  it('opens the menu when the user clicks the hamburger toggle', () => {
    const { container } = renderNav()

    openMenu(container)

    expect(getCheckbox(container).checked).toBe(true)
  })

  it('closes the menu when the user clicks the backdrop outside the menu', () => {
    const { container } = renderNav()
    openMenu(container)
    expect(getCheckbox(container).checked).toBe(true)

    // The `.overlay` sibling of the <nav> is the dimmed backdrop that
    // covers the page behind the open menu panel.
    fireEvent.click(container.querySelector('nav ~ div'))

    expect(getCheckbox(container).checked).toBe(false)
  })

  it('closes the menu when the user clicks anywhere outside the nav', () => {
    const { container } = renderNav()
    openMenu(container)

    fireEvent.click(document.body)

    expect(getCheckbox(container).checked).toBe(false)
  })

  it('keeps the menu open when the user clicks inside the menu panel', () => {
    const { container } = renderNav()
    openMenu(container)

    fireEvent.click(container.querySelector('nav ul'))

    expect(getCheckbox(container).checked).toBe(true)
  })

  it('closes the menu when the user clicks the toggle again', () => {
    const { container } = renderNav()
    openMenu(container)

    fireEvent.click(container.querySelector('label'))

    expect(getCheckbox(container).checked).toBe(false)
  })

  it('closes the menu when the user presses Escape', () => {
    const { container } = renderNav()
    openMenu(container)
    expect(getCheckbox(container).checked).toBe(true)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(getCheckbox(container).checked).toBe(false)
  })

  it('releases the scroll lock when the menu closes from an outside click', () => {
    const { container } = renderNav()
    openMenu(container)
    expect(lenisMock.stop).toHaveBeenCalled()

    // Drop the calls made while opening the menu so we only assert on
    // what the outside click itself triggers.
    lenisMock.start.mockClear()
    fireEvent.click(document.body)

    expect(lenisMock.start).toHaveBeenCalled()
  })
})
