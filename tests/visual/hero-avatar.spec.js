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
    const block = document.querySelector('[class*="hero_section"]')
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      image: box(image),
      container: box(container),
      title: box(title),
      block: box(block),
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

test.describe('Hero text block is vertically centred (stacked layout)', () => {
  // The avatar hangs right above the text block and the TEXT BLOCK is
  // the centred element: the name is the focal point, not the picture.
  for (const vp of MATRIX.filter(v => v.layout === 'stacked' && v.height >= 500)) {
    test(`${vp.width}x${vp.height} centres the text block`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1200)

      const g = await heroGeometry(page)
      const blockCentre = ((g.block.top + g.block.bottom) / 2 / g.viewport.height) * 100

      // The text block must sit on the vertical middle of the screen.
      // On very short viewports the hero content does not fit at all
      // and the block is top-aligned instead (the avatar must never be
      // clipped), so the upper bound is a bit looser there.
      expect(blockCentre).toBeGreaterThan(44)
      expect(blockCentre).toBeLessThan(64)

      // And the avatar must be glued to it, not floating at the top.
      const visibleBottom = g.image.top + g.image.height * 0.72
      expect(g.title.top - visibleBottom).toBeLessThan(48)
      expect(g.title.top - visibleBottom).toBeGreaterThan(-2)
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
