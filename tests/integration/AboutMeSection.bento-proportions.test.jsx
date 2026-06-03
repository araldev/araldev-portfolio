// tests/integration/AboutMeSection.bento-proportions.test.jsx — N3 AboutMe
// Bento proportions integration test.
//
// P2-B2 / T-211 (RED): Asserts each Bento tile's boundingBox matches the
// design tokens at 3 viewports (1440×900, 768×1024, 375×812). The test
// uses Playwright's chromium API directly inside a vitest test so we can
// reuse the integration test location while still observing real
// browser layout (jsdom cannot measure CSS Grid; see the design.md
// §N3.1 root-cause paragraph).
//
// On the CURRENT source (T-211 RED), the Bento uses
//   grid-template-rows: repeat(auto-fit, minmax(200px, 300px))
// which produces 1-3 content-driven rows (not 6/4/2 per FR-N3-01/06),
// and the avatar/brand images have no `aspect-ratio: 1` so the
// natural image ratio dictates the tile height. This test WILL FAIL
// on the current source. P2-B3 (T-213) flips the CSS to
// `repeat(N, 1fr)` rows + `aspect-ratio: 1` on the images; the
// test will turn GREEN at that point.
//
// Test runtime model:
//   1. Connect to a Vite dev server on http://localhost:5173.
//      The test SKIPS if no server is reachable (so unit-test runs in
//      CI without a dev server don't fail).
//   2. Launch chromium, navigate to /#about-me at 3 viewports.
//   3. For each viewport, get boundingBox of:
//        - .avatar_image (img[alt*="Arturo"])
//        - .brand_image   (img[alt*="Brand"])
//        - .text_container (the bio tile)
//      and assert each box is non-zero AND the square-tile ones
//      (avatar, brand) have width ≈ height within 5%.
//   4. Get grid-template-rows count from the .grid_container and
//      assert it matches the design token for that viewport
//      (6 / 4 / 2 for desktop / tablet / mobile).
//
// The 'cleanest is to use Playwright directly' pattern (per the
// orchestrator's T-211 directive) means importing @playwright/test's
// chromium and launching a real browser, not running under the
// @playwright/test runner. This is unconventional but the only way
// to get a real-browser boundingBox assertion inside the
// tests/integration/ location (which is a vitest directory).

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium } from '@playwright/test'

const BASE_URL = 'http://localhost:5173/araldev-portfolio/#about-me'

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900, expectedRows: 6 },
  { name: 'tablet-768', width: 768, height: 1024, expectedRows: 4 },
  { name: 'mobile-375', width: 375, height: 812, expectedRows: 2 }
]

const SQUARE_TOLERANCE = 0.05 // ±5% — generous for sub-pixel rendering
let serverReachable = false
let browser
let context

beforeAll(async () => {
  // Probe the dev server. If it's not running, set serverReachable
  // to false and the tests will skip (we don't want a missing dev
  // server to fail unit-test CI runs that don't spin one up).
  try {
    const probe = await fetch('http://localhost:5173/araldev-portfolio/', { method: 'HEAD' })
    serverReachable = probe.ok || probe.status === 200 || probe.status === 304
  } catch {
    serverReachable = false
  }
  if (!serverReachable) {
    return
  }
  browser = await chromium.launch()
  context = await browser.newContext()
  // P6: extended beforeAll timeout from 30s → 60s. chromium.launch()
  // on slower machines can take 15-25s alone; the original 30s
  // budget left no headroom for the per-viewport Playwright work.
}, 60_000)

afterAll(async () => {
  if (context) await context.close()
  if (browser) await browser.close()
})

describe('AboutMeSection Bento proportions — T-211 N3 RED contract', () => {
  // P6: extended the per-test timeout from 30s → 60s. The test boots
  // a real chromium instance per `it` and runs Playwright across 3
  // viewports; on slower machines (CI, devs with antivirus) the 30s
  // budget was tight and produced flaky timeouts. 60s gives a
  // comfortable headroom without changing the assertions.
  it('row count + per-tile boundingBox at 3 viewports matches the design tokens (FR-N3-01..06)', async () => {
    if (!serverReachable) {
      // Skip the real-browser path. The P2-B3 fix-forwards (T-210,
      // T-213) will exercise this against the real source.
      return
    }
    const page = await context.newPage()

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(BASE_URL)
      // Wait for the Bento grid to be present and for layout to settle.
      // domcontentloaded is enough; the Bento has no async resources
      // (the avatar/brand <img> tags are local WebP and decode
      // synchronously enough that waiting for the network is overkill).
      await page.waitForLoadState('domcontentloaded')
      await page.waitForSelector('[data-testid="bento-grid"]')

      // 1. Bento row count per FR-N3-01 (desktop) / FR-N3-06
      //    (tablet ≤1450px / mobile ≤1000px). The current source uses
      //    auto-fit which produces 1-3 rows. P2-B3 (T-213) replaces
      //    auto-fit with repeat(N, 1fr) for stable tracks.
      const rowCount = await page.evaluate(() => {
        const grid = document.querySelector('[data-testid="bento-grid"]')
        if (!grid) return 0
        const rows = window.getComputedStyle(grid).gridTemplateRows
        return rows.split(' ').filter(s => s.length > 0).length
      })
      expect(
        rowCount,
        `[${vp.name}] Bento has ${rowCount} grid rows; expected ${vp.expectedRows} (FR-N3-01/06). ` +
        'Current source uses auto-fit which lets rows expand by content; N3 (P2-B3 T-213) will lock rows to repeat(N, 1fr).'
      ).toBe(vp.expectedRows)

      // 2. Avatar is square per FR-N3-03 (aspect-ratio: 1, max 360px).
      //    The current source has no aspect-ratio on .avatar_image,
      //    so the rendered image is whatever the source WebP's
      //    natural ratio is.  Selector scoped to #about-me to
      //    avoid matching the NavHeader avatar.
      const avatarBox = await page.locator('#about-me img[alt*="Arturo"]').boundingBox()
      expect(avatarBox, `[${vp.name}] avatar not visible`).not.toBeNull()
      const avatarRatio = avatarBox.width / avatarBox.height
      expect(
        Math.abs(avatarRatio - 1),
        `[${vp.name}] Avatar aspect ratio is ${avatarRatio.toFixed(3)} (${avatarBox.width.toFixed(0)}x${avatarBox.height.toFixed(0)}); expected 1.000 (square) per FR-N3-03. ` +
        'Current source has no aspect-ratio: 1 on .avatar_image; P2-B3 (T-213) will add it.'
      ).toBeLessThanOrEqual(SQUARE_TOLERANCE)

      // 3. Brand is square per FR-N3-04 (aspect-ratio: 1, width 100px
      //    desktop). The current source has no aspect-ratio on
      //    .brand_image, so the rendered image may be rectangular.
      //    Selector scoped to #about-me to avoid matching the
      //    NavHeader + Footer brand images.
      const brandBox = await page.locator('#about-me img[alt*="Brand"]').boundingBox()
      expect(brandBox, `[${vp.name}] brand not visible`).not.toBeNull()
      const brandRatio = brandBox.width / brandBox.height
      expect(
        Math.abs(brandRatio - 1),
        `[${vp.name}] Brand aspect ratio is ${brandRatio.toFixed(3)} (${brandBox.width.toFixed(0)}x${brandBox.height.toFixed(0)}); expected 1.000 (square) per FR-N3-04. ` +
        'Current source has no aspect-ratio: 1 on .brand_image; P2-B3 (T-213) will add it.'
      ).toBeLessThanOrEqual(SQUARE_TOLERANCE)

      // 4. Bio text container is present and has non-zero dimensions
      //    (height: 100% on > * fills its grid area per FR-N3-02).
      //    The current source has height: 100% ONLY on .text_container
      //    (line 53), not on the other tiles, so the assertion
      //    targets the text container specifically.
      const textBox = await page.locator('#about-me p').first().boundingBox()
      expect(textBox, `[${vp.name}] bio <p> not visible`).not.toBeNull()
      expect(
        textBox.width,
        `[${vp.name}] Bio <p> width is ${textBox.width}; expected > 0.`
      ).toBeGreaterThan(0)
      expect(
        textBox.height,
        `[${vp.name}] Bio <p> height is ${textBox.height}; expected > 0.`
      ).toBeGreaterThan(0)
    }

    await page.close()
  // P6: extended the per-test timeout from 30s → 60s. The test
  // boots a real chromium instance per `it` and runs Playwright
  // across 3 viewports; on slower machines the 30s budget was
  // tight and produced flaky timeouts. 60s gives headroom.
  }, 60_000)
})
