// tests/a11y/AboutMeSection.a11y.test.jsx — N3 AboutMe Bento a11y gate.
//
// P2-B3 / T-210 (RED → GREEN).  Asserts 0 jest-axe violations on
// the rendered <AboutMeSection /> component.  The P1 axe run on
// the live page reported a `landmark-complementary-is-top-level`
// violation: the <aside> (bento grid) was nested inside the
// <section id="about-me"> (which is also a landmark), and
// complementary landmarks MUST be top-level per WAI-ARIA.
//
// The T-210 fix in src/components/AboutMe/AboutMeSection.jsx
// replaces the <aside> wrapper with a <div data-testid="bento-grid">.
// The <div> has no implicit landmark role, so the rule no longer
// fires.  The <section id="about-me"> is preserved per FR-N3-08
// (it remains the region's primary landmark, labelled by the
// <h2>About Me</h2>).
//
// Note on "3 viewports (1440, 768, 375)": the *visual* axe test
// in tests/visual/about-me-bento.spec.js already runs axe against
// the live page at all 3 viewports (FR-N4-06).  This vitest
// file is the *unit-level* jsdom-axe gate that runs on every
// commit.  jsdom has no real viewport; the structural landmark
// rule fires identically at all widths.

import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { AboutMeSection } from '../../src/components/AboutMe/AboutMeSection.jsx'

expect.extend(toHaveNoViolations)

// Mock the CSS module (Vite hashes the class names; the vitest
// jsdom env doesn't run the CSS module transform unless the
// @vitejs/plugin-react-swc config is loaded — and even then,
// `getComputedStyle` returns '' for unknown class names).  The
// Proxy returns the requested key as a string, which is enough
// for class lookups; the a11y assertions don't depend on the
// actual styles.
vi.mock('../../src/components/AboutMe/AboutMeSection.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

// useFadeInElement is called 3 times in the source (avatar, brand,
// text) and uses gsap + ScrollTrigger, which throw in jsdom.  Mock
// it to a no-op so the render is clean.
vi.mock('../../src/Hooks/useFadeInElement', () => ({
  useFadeInElement: vi.fn()
}))

describe('AboutMeSection — accessibility (jest-axe)', () => {
  it('has 0 axe violations on the AboutMe section', async () => {
    const { container } = render(<AboutMeSection />)
    const results = await axe(container)
    // Failure message is detailed by jest-axe's toHaveNoViolations
    // matcher; it lists each violation's id, impact, and the
    // offending HTML.
    expect(results).toHaveNoViolations()
  })

  it('preserves the <section id="about-me"> landmark (FR-N3-08)', () => {
    const { container } = render(<AboutMeSection />)
    const section = container.querySelector('section#about-me')
    expect(section).not.toBeNull()
  })

  it('renders an <h2>About Me</h2> heading inside the section', () => {
    const { container } = render(<AboutMeSection />)
    const h2 = container.querySelector('#about-me h2')
    expect(h2).not.toBeNull()
    expect(h2.textContent).toBe('About Me')
  })

  it('preserves the bento grid as the section content (data-testid="bento-grid")', () => {
    const { container } = render(<AboutMeSection />)
    const grid = container.querySelector('[data-testid="bento-grid"]')
    expect(grid).not.toBeNull()
    // The grid contains 2 <img> (avatar + brand) + 1 <div> (text).
    expect(grid.querySelectorAll('img').length).toBe(2)
    expect(grid.querySelectorAll('div').length).toBeGreaterThanOrEqual(1)
  })

  it('avatar <img> has non-empty alt (semantic, not decorative)', () => {
    const { container } = render(<AboutMeSection />)
    const avatar = container.querySelector('img[alt*="Arturo"]')
    expect(avatar).not.toBeNull()
    // Semantic alt text is REQUIRED for a profile photo.
    // Do NOT change this to alt="" — the avatar represents the
    // site author and screen readers must announce it.
    expect(avatar.getAttribute('alt')).toBeTruthy()
    expect(avatar.getAttribute('alt').length).toBeGreaterThan(0)
  })

  it('brand <img> has non-empty alt (semantic — it is the company mark)', () => {
    const { container } = render(<AboutMeSection />)
    const brand = container.querySelector('img[alt*="Brand"]')
    expect(brand).not.toBeNull()
    expect(brand.getAttribute('alt')).toBeTruthy()
  })
})
