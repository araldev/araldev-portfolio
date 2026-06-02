// tests/visual/about-me-bento.spec.js — N3 AboutMe Bento proportions
// visual gate.
//
// P1 STATUS: RED baseline (T-008). Captures the Bento proportions
// bug that the user reported (tiles are not stable, rows expand by
// content). The structural assertion (boundingBox() aspect ratio
// matches design tokens) WILL FAIL on the current source because:
//   - .grid_container uses `grid-template-rows: repeat(auto-fit,
//     minmax(200px, 300px))` (content-driven rows, not 1fr tracks)
//   - .avatar_image has no `aspect-ratio: 1` (it inherits the source
//     image's natural ratio, which is non-square)
//   - .brand_image has no `aspect-ratio: 1` (same)
//
// P2 (N3) flips these to GREEN by switching to `repeat(6, 1fr)` rows
// and adding `aspect-ratio: 1; max-width/height: 360px` to the avatar
// and `aspect-ratio: 1; width: 100px` to the brand.
//
// Why a real browser: jsdom never lays out CSS Grid, so it cannot
// observe the actual tile dimensions. Real Chromium renders the
// Bento and boundingBox() reports the truth.
//
// Test pattern: each test runs at the active viewport (3 viewports
// defined in playwright.config.js projects). No inner for-loop.

/* global getComputedStyle */
// StandardJS no-undef sees getComputedStyle in page.evaluate() callbacks
// as an undefined global even though the callback executes in the
// browser context. The env: { browser: true } in package.json does not
// cover Playwright's page.evaluate callback scope. This explicit global
// declaration is the documented escape hatch.

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { installFixedClock, waitForVisualSettle } from './clock-fixture.js'

// Design tokens from design.md §N3.3 (N3 GREEN state). The test asserts
// these tokens hold at every viewport. P1 baseline records the
// divergence from these tokens.
const BENTO_ROW_COUNT = {
  'desktop-1440': 6, // FR-N3-01
  'tablet-768': 4, // FR-N3-06 (≤1450px)
  'mobile-375': 2 // FR-N3-06 (≤1000px)
}

const ASPECT_RATIO_TOLERANCE = 0.05 // ±5% — generous for sub-pixel rendering

// Install a fixed clock for every test in this file. The about-me
// section itself does not render dates, but the page-wide background
// or other sections might; freezing Date.now() keeps the snapshot
// baseline stable across days.
test.beforeEach(async ({ page }) => {
  await installFixedClock(page)
})

test.describe('SC-N3-01/02/03: Bento boundingBox matches design tokens @ active viewport', () => {
  test('row count + avatar/brand aspect ratio + 60ch bio cap', async ({ page }, testInfo) => {
    const expectedRows = BENTO_ROW_COUNT[testInfo.project.name]
    if (!expectedRows) {
      throw new Error(`No Bento row count configured for project ${testInfo.project.name}`)
    }

    await page.goto('/#about-me')
    await waitForVisualSettle(page)

    // 1. Bento row count per FR-N3-01 (desktop) and FR-N3-06 (tablet/mobile).
    // The current source has `repeat(auto-fit, minmax(200px, 300px))`
    // which produces 1-3 rows depending on content height. The
    // assertion fails on the current source. P2 (N3) replaces auto-fit
    // with `repeat(N, 1fr)` for stable tracks.
    const rowCount = await page.evaluate(() => {
      const grid = document.querySelector('[data-testid="bento-grid"]')
      return getComputedStyle(grid).gridTemplateRows.split(' ').length
    })
    expect(
      rowCount,
      `Bento has ${rowCount} grid rows at ${testInfo.project.name}; expected ${expectedRows} (FR-N3-01/06). ` +
      'The current source uses auto-fit which lets rows expand by content; N3 (P2) will lock rows to repeat(N, 1fr).'
    ).toBe(expectedRows)

    // 2. Avatar is square per FR-N3-03 (aspect-ratio: 1, max 360px).
    // The current source has no aspect-ratio declaration on
    // .avatar_image, so the rendered image is whatever the source
    // PNG/WebP's natural ratio is (the asset is 1:1 so this might
    // pass on the current source by coincidence — the test still
    // serves as a regression net for P2+).
    const avatarBox = await page.locator('img[alt*="Arturo"]').boundingBox()
    expect(
      avatarBox,
      'Avatar image is not visible. P2 (N3) must keep the avatar rendered in the Bento grid.'
    ).not.toBeNull()
    const avatarRatio = avatarBox.width / avatarBox.height
    expect(
      Math.abs(avatarRatio - 1),
      `Avatar aspect ratio is ${avatarRatio.toFixed(3)} (${avatarBox.width.toFixed(0)}x${avatarBox.height.toFixed(0)}); expected 1.000 (square) per FR-N3-03. ` +
      'The current source has no aspect-ratio: 1 on .avatar_image, so the image natural ratio dictates the height.'
    ).toBeLessThanOrEqual(ASPECT_RATIO_TOLERANCE)

    // 3. Brand is square per FR-N3-04 (aspect-ratio: 1, width: 100px).
    // The current source has no aspect-ratio declaration on
    // .brand_image, so the rendered image may be rectangular.
    const brandBox = await page.locator('img[alt*="Brand"]').boundingBox()
    expect(
      brandBox,
      'Brand image is not visible. P2 (N3) must keep the brand mark rendered in the Bento grid.'
    ).not.toBeNull()
    const brandRatio = brandBox.width / brandBox.height
    expect(
      Math.abs(brandRatio - 1),
      `Brand aspect ratio is ${brandRatio.toFixed(3)} (${brandBox.width.toFixed(0)}x${brandBox.height.toFixed(0)}); expected 1.000 (square) per FR-N3-04. ` +
      'The current source has no aspect-ratio: 1 on .brand_image, so the image natural ratio dictates the height.'
    ).toBeLessThanOrEqual(ASPECT_RATIO_TOLERANCE)

    // 4. Bio text respects max-width: 60ch per FR-N3-05.
    // The current source already has max-width: 60ch on .text_container > p
    // (line 56 of AboutMeSection.module.css), so this assertion
    // already passes. P2 (N3) must keep it green. This is the
    // GREEN-side assertion that catches a regression where P2
    // accidentally drops the 60ch cap.
    const pMaxWidth = await page.evaluate(() => {
      const p = document.querySelector('#about-me p')
      return p ? getComputedStyle(p).maxWidth : null
    })
    expect(
      pMaxWidth,
      'No <p> inside #about-me found. P2 (N3) must keep the bio paragraph rendered.'
    ).not.toBeNull()
    expect(
      pMaxWidth,
      `Bio <p> max-width is '${pMaxWidth}'; expected '60ch' per FR-N3-05. ` +
      'The current source already declares this; P2 (N3) must preserve it.'
    ).toBe('60ch')

    // 5. Bio text container TILE has non-zero boundingBox and a
    // height that is larger than any single line (>= 60px) — the
    // tile must fill its grid area per FR-N3-02 (height: 100% on
    // the > * selector). The current source has height: 100% ONLY
    // on .text_container (line 53 of AboutMeSection.module.css);
    // P2 (N3, T-213) will extend it to all tiles. The assertion
    // here targets the text container specifically because that
    // is the only tile with an existing height: 100% rule on the
    // current source. P2 (N3) will add height: 100% to all tiles
    // so the avatar/brand also fill their grid cells.
    const textBox = await page.locator('#about-me .grid_container > div').boundingBox()
    expect(
      textBox,
      `Bio text container is not visible at ${testInfo.project.name}. ` +
      'P2 (N3) must keep the bio tile rendered in the Bento grid.'
    ).not.toBeNull()
    expect(
      textBox.width,
      `Bio text container width is ${textBox.width.toFixed(0)}px at ${testInfo.project.name}; ` +
      'expected > 0 (the tile must fill its grid area per FR-N3-02).'
    ).toBeGreaterThan(0)
    // Height floor of 60px catches a tile that rendered with
    // height: 0 (the bug surface: content-driven row heights can
    // collapse the text container if any parent has overflow:
    // hidden and the content overflows). P2 (N3) locks row
    // heights with repeat(N, 1fr) so the text container will
    // always be tall enough to show the 4 bio paragraphs.
    expect(
      textBox.height,
      `Bio text container height is ${textBox.height.toFixed(0)}px at ${testInfo.project.name}; ` +
      'expected > 60 (the tile must fill its grid area per FR-N3-02, which contains 4 paragraphs of bio text).'
    ).toBeGreaterThan(60)
  })
})

test.describe('FR-N3: AboutMe snapshot @ active viewport', () => {
  test('snapshot', async ({ page }, testInfo) => {
    await page.goto('/#about-me')
    await waitForVisualSettle(page)

    const section = page.locator('#about-me')
    await expect(section).toBeVisible()

    // maxDiffPixelRatio of 0.05 (5%) for the same reason as the
    // JobsCards spec: the Bento tiles have subtle sub-pixel rendering
    // variance. P3+ tightens this back to 0.01 when the source is
    // stabilized.
    await expect(section).toHaveScreenshot(
      `about-me-${testInfo.project.name}.png`,
      { maxDiffPixelRatio: 0.05 }
    )
  })
})

test.describe('FR-N3-08: axe-core 0 violations @ active viewport', () => {
  test('axe-core on #about-me', async ({ page }) => {
    await page.goto('/#about-me')
    await waitForVisualSettle(page)

    const results = await new AxeBuilder({ page })
      .include('#about-me')
      .analyze()

    expect(results.violations).toEqual([])
  })
})
