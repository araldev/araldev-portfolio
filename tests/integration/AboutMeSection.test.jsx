import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { AboutMeSection } from '../../src/components/AboutMe/AboutMeSection.jsx'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'

vi.mock('../../src/components/AboutMe/AboutMeSection.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

function renderAbout (lang = 'es') {
  return render(
    <LanguageProvider initialLang={lang}>
      <AboutMeSection />
    </LanguageProvider>
  )
}

describe('AboutMeSection highlights', () => {
  it('shows only the quality, without a subtitle', () => {
    const { container } = renderAbout()

    const cards = container.querySelectorAll('[class*=highlight_card]')
    expect(cards.length).toBeGreaterThan(0)

    // Every card must render the quality (label) and nothing else.
    for (const card of cards) {
      expect(card.querySelector('[class*=highlight_label]')).toBeInTheDocument()
      expect(card.querySelector('[class*=highlight_desc]')).toBeNull()
    }
  })

  it('lists "Trabajo en equipo" instead of "Enfoque"', () => {
    const { container } = renderAbout()

    const labels = [...container.querySelectorAll('[class*=highlight_label]')].map(el => el.textContent)

    expect(labels).toContain('Trabajo en equipo')
    expect(labels).toContain('Comunicativo')
    expect(labels).not.toContain('Enfoque')
  })

  it('keeps the English qualities in sync', () => {
    const { container } = renderAbout('en')

    const labels = [...container.querySelectorAll('[class*=highlight_label]')].map(el => el.textContent)

    expect(labels).toContain('Teamwork')
    expect(labels).toContain('Communicative')
    expect(labels).not.toContain('Focus')
  })
})
