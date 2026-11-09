// tests/visual/hero-avatar.spec.js — hero avatar visibility gate.
//
// Regression guard for the "avatar disappears" bugs:
//
//   1. GSAP was writing an inline `transform` on `.hero_img_container`,
//      overwriting the CSS `translate(-50%, -80%)` centring. The avatar
//      then drifted half its width to the right and got clipped by the
//      hero's `overflow: hidden`.
//   2. The avatar was positioned with magic offsets
//      (`top: calc(50% - 290px)`) that only matched ONE viewport
//      height. On short screens the computed top went negative and the
//      head was cut off (iPhone SE 320x568, tablet 768x800).
//
// Both bugs are invisible to jsdom/Vitest: they need the real layout
// engine, so the gate runs in Chromium like the other visual specs.
//
// The matrix below is DELIBERATELY wider than the 3 projects in
// playwright.config.js — the bugs only showed up on short/odd
// viewports, so the spec drives its own viewport matrix with
// `page.setViewportSize()`.

import { test, expect } from '@playwright/test'

// [width, height, layout]
//   'stacked'  → avatar above the title (phones + tablets, ≤1024px)
//   'side'     → avatar in its own right column (≥1025px)
const MATRIX = [
  // phones
  { width: 320, height: 568, layout: 'stacked' },
  { width: 360, height: 640, layout: 'stacked' },
  { width: 375, height: 667, layout: 'stacked' },
  { width: 390, height: 664, layout: 'stacked' },
  { width: 414, height: 896, layout: 'stacked' },
  // tablets, incl. reduced height
  { width: 768, height: 400, layout: 'stacked' },
  { width: 768, height: 600, layout: 'stacked' },
  { width: 768, height: 800, layout: 'stacked' },
  { width: 768, height: 1024, layout: 'stacked' },
  { width: 820, height: 500, layout: 'stacked' },
  { width: 1024, height: 768, layout: 'stacked' },
  // desktop
  { width: 1280, height: 720, layout: 'side' },
  { width: 1440, height: 900, layout: 'side' },
  { width: 1920, height: 1080, layout: 'side' }
]

async function heroGeometry (page) {
  return page.evaluate(() => {
    const box = (el) => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      return {
        top: r.top,
        bottom: r.bottom,
        left: r.left,
        right: r.right,
        height: r.height
      }
    }
    const container = document.querySelector('[class*="hero_img_container"]')
    const title = document.querySelector('[class*="hero_section"] h1')
    const image = document.querySelector('[class*="hero_img_container"] img')
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      image: box(image),
      container: box(container),
      title: box(title),
      // GSAP must never own the positioning transform of the container
      containerTransform: container ? window.getComputedStyle(container).transform : null,
      inlineTransform: container ? container.style.transform || '' : ''
    }
  })
}

test.describe('Hero avatar is always fully visible', () => {
  for (const vp of MATRIX) {
    test(`${vp.width}x${vp.height} (${vp.layout})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      // Let the GSAP entrance animation finish so the final layout is
      // the one under test.
      await page.waitForTimeout(1200)

      const g = await heroGeometry(page)

      expect(g.image).not.toBeNull()
      expect(g.inlineTransform).toBe('')

      // 1. The picture must be INSIDE the viewport. The hero container
      //    has overflow:hidden, so anything outside is cut away.
      expect(g.image.top).toBeGreaterThanOrEqual(-0.5)
      expect(g.image.bottom).toBeLessThanOrEqual(g.viewport.height + 0.5)
      expect(g.image.left).toBeGreaterThanOrEqual(-0.5)
      expect(g.image.right).toBeLessThanOrEqual(g.viewport.width + 0.5)

      // 2. In the stacked layout the avatar sits ABOVE the title and
      //    never overlaps it. The bottom 28% of the picture is masked
      //    out (a fade-out), so the VISIBLE part is what must stay
      //    clear of the title.
      if (vp.layout === 'stacked') {
        const visibleBottom = g.image.top + g.image.height * 0.72
        expect(visibleBottom).toBeLessThanOrEqual(g.title.top + 2)
      }
    })
  }
})

test.describe('Hero name is the focal point (stacked layout)', () => {
  // The avatar is anchored near the top and the text block is centred
  // in the space below it, so the name lands on the optical centre of
  // the screen instead of being pushed up by the avatar.
  for (const vp of MATRIX.filter(v => v.layout === 'stacked' && v.height >= 600)) {
    test(`${vp.width}x${vp.height} keeps the name in the focal band`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1200)

      const g = await heroGeometry(page)
      const namePercent = (g.title.top / g.viewport.height) * 100

      // The name must not be crammed against the top (that was the old
      // centred-group behaviour) nor pushed off the lower half.
      expect(namePercent).toBeGreaterThan(28)
      expect(namePercent).toBeLessThan(58)
    })
  }
})

test.describe('Hero avatar keeps its CSS centring transform', () => {
  // The GSAP entrance animation targets the inner wrapper. If it ever
  // targets the container again, GSAP writes an inline transform that
  // destroys the `translate(-50%, -80%)` centring and the avatar
  // slides out of its column.
  for (const vp of MATRIX.filter(v => v.layout === 'side')) {
    test(`${vp.width}x${vp.height} keeps the -50% X centring`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1200)

      const g = await heroGeometry(page)

      expect(g.inlineTransform).toBe('')
      expect(g.containerTransform).toContain('matrix')

      // The container's box is centred on 75% of the viewport width:
      // the left edge must sit at (75% - half the width) once the
      // centring translate is applied.
      const centre = g.container.left + (g.container.right - g.container.left) / 2
      const expected = g.viewport.width * 0.75
      // Allow for the GSAP zoom (scale 1.1 about the centre).
      expect(Math.abs(centre - expected)).toBeLessThan(g.viewport.width * 0.15)
    })
  }
})
