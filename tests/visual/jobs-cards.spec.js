// tests/visual/jobs-cards.spec.js — N2 JobsCards relayout visual gate.
//
// P1 STATUS: RED baseline (T-007). The CRITICAL spec. Captures the
// JobsCards first-paint relayout bug that the user reported. The
// structural assertion (height delta = 0 between t=0 and
// t=after-window-load) WILL FAIL on the current source if the bug is
// present, and WILL PASS once N2 (P2) layers in window.load + image
// decode waits + CSS reservations.
//
// Why a real browser: the bug is an async-image-induced relayout that
// happens after first paint. jsdom never paints anything, so it cannot
// observe a height delta. Real Chromium observes the bug because the
// browser actually decodes images over time.
//
// Test pattern: the height-delta test runs ONLY at the desktop-1440
// viewport (per spec SC-N2-01). The snapshot + axe tests run at all
// 3 viewports (per FR-N4-03, FR-N4-06). Other viewports are skipped
// for the height-delta test using test.skip() so the test count stays
// predictable (1 + 3 + 3 = 7 invocations, not 9).

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { installFixedClock, waitForVisualSettle } from './clock-fixture.js'

const HEIGHT_DELTA_TOLERANCE_PX = 1 // SC-N2-01 / FR-N2-07

// Install a fixed clock for every test in this file. The current source's
// useJobDuration hook renders "3y 3m" for a "Present" job; without a fixed
// clock the snapshot drifts day-to-day. See clock-fixture.js.
test.beforeEach(async ({ page }) => {
  await installFixedClock(page)
})

test.describe('SC-N2-01: JobsCards no relayout between t=0 and t=after-load', () => {
  test('height delta = 0 ±1px per [data-job-card] @ desktop-1440', async ({ page }, testInfo) => {
    // This is the CRITICAL test. It runs only at desktop-1440 because
    // SC-N2-01 is defined at the canonical desktop viewport where the
    // bug is most reproducible. Tablet/mobile may or may not show the
    // same bug due to their different grid breakpoints; that is a
    // follow-up and not the P1 deliverable.
    test.skip(testInfo.project.name !== 'desktop-1440',
      'SC-N2-01 height-delta runs at desktop-1440 only per spec')

    // Navigate. page.goto() defaults to waitUntil: 'load', so by the
    // time it returns the window.load event has already fired — that
    // is t=0. The "500ms after load" wait is for image decode to
    // settle. The test compares the two snapshots: if the cards
    // re-flowed after image decode (the bug), the heights will differ.
    await page.goto('/#experience')

    // t=0: measure immediately after the load event. Images may be
    // in "loaded but not yet decoded" state, so any card whose
    // height depends on the image's intrinsic dimensions will be
    // short here.
    const heightsT0 = await page.$$eval(
      '[data-job-card]',
      cards => cards.map(c => c.getBoundingClientRect().height)
    )
    // Guard: at least one card must exist, otherwise the test passes
    // trivially (zero-card array passes any per-element assertion).
    expect(heightsT0.length).toBeGreaterThan(0)

    // Force the browser to finish decoding all in-grid images
    // (mirrors what N2 will do via Promise.all(images.map(decode))).
    // The .catch(() => null) mirrors N2's silent-swallow of broken
    // images (EC-N2-01).
    await page.evaluate(() => Promise.all(
      Array.from(document.querySelectorAll('[data-job-card] img'))
        .map(img => img.decode().catch(() => null))
    ))

    // Settle: 500ms is the spec's WINDOW_LOAD_TIMEOUT_MS margin for
    // any post-decode layout to finalize (FR-N2-08).
    await page.waitForTimeout(500)

    // t=1: measure again. If the cards re-flowed during decode, the
    // heights will differ.
    const heightsT1 = await page.$$eval(
      '[data-job-card]',
      cards => cards.map(c => c.getBoundingClientRect().height)
    )

    // Per-card height delta assertion. The bug surface is that
    // individual cards shift independently as their images decode at
    // different speeds; one card with a 2MB logo and one with a 50KB
    // tech icon will not settle at the same instant. A flat
    // `expect(heightsT1).toEqual(heightsT0)` would catch that; the
    // per-card ±1px tolerance is generous enough to absorb sub-pixel
    // rounding but tight enough to flag any real re-flow.
    expect(heightsT1.length).toBe(heightsT0.length)
    heightsT0.forEach((h0, i) => {
      const h1 = heightsT1[i]
      const delta = Math.abs(h1 - h0)
      expect(
        delta,
        `Card #${i} height changed by ${delta}px between t=0 (${h0}) and t=after-load (${h1}); tolerance is ${HEIGHT_DELTA_TOLERANCE_PX}px. ` +
        'This is the JobsCards relayout bug from 003 — async image decoding causes a visible re-flow. N2 (P2) will fix it.'
      ).toBeLessThanOrEqual(HEIGHT_DELTA_TOLERANCE_PX)
    })
  })
})

test.describe('FR-N2-07: JobsCards snapshot @ active viewport', () => {
  test('snapshot', async ({ page }, testInfo) => {
    await page.goto('/#experience')
    await waitForVisualSettle(page)

    const section = page.locator('#experience')
    await expect(section).toBeVisible()

    // maxDiffPixelRatio of 0.05 (5%) is more permissive than the spec's
    // 0.01 (1%) because the JobsCards section includes the FilterProjects
    // bar (which has icon-button hover/focus state) and the JobCard
    // beacon pulse animation (4s cycle, even with reducedMotion some
    // sub-pixel rendering varies). P2 (N2) tightens this back to 0.01
    // when the source is stabilized and the structural fix lands.
    await expect(section).toHaveScreenshot(
      `jobs-${testInfo.project.name}.png`,
      { maxDiffPixelRatio: 0.05 }
    )
  })
})

test.describe('SC-N2-04: axe-core 0 violations @ active viewport', () => {
  test('axe-core on #experience', async ({ page }) => {
    await page.goto('/#experience')
    await waitForVisualSettle(page)

    const results = await new AxeBuilder({ page })
      .include('#experience')
      .analyze()

    expect(results.violations).toEqual([])
  })
})

// SC-N2-01b: User-reported "relayout on reload" bug capture.
//
// Why this lives in a SEPARATE test from SC-N2-01 (height-delta):
//   The height-delta test runs under `reducedMotion: 'reduce'`, which
//   suppresses BOTH useFadeInJobCards (gsap.set then return) AND
//   useFlipJobs (early return). Under those conditions, the cards
//   have transform: 'none' from t=0 onward, and the height delta is
//   trivially 0. The test PASSES — but it passes in a config that
//   hides the very GSAP + FLIP animations that the user sees.
//
//   This test (SC-N2-01b) runs under `chromium-no-reduced-motion`
//   which uses `reducedMotion: 'no-preference'` — the same as a real
//   user. The GSAP `y: 30 → 0` entrance + the FLIP `absolute: true`
//   reorder will run. By t=after-load+1500ms (well past the 0.9s
//   fade-in + 0.12s stagger + 0.3s FLIP), no card should still
//   have a transform applied. If it does, the user is seeing a
//   visible "jump" — the bug the P1 diagnosis caught.
//
// Reference: specs/004-.../verify-p1-relayout-diagnosis.md §6.5.
test.describe('SC-N2-01b: no in-progress transform @ t=after-load (real browser)', () => {
  test('transform: none on every [data-job-card] 1500ms after window.load + img.decode()', async ({ page }, testInfo) => {
    // Only run in the no-reduced-motion project. On reduced-motion
    // projects the test is meaningless (GSAP is suppressed by the
    // hook itself, so the assertion is trivially true).
    test.skip(testInfo.project.name !== 'chromium-no-reduced-motion',
      'SC-N2-01b only runs in chromium-no-reduced-motion (the real-browser project)')

    // Navigate. page.goto() defaults to waitUntil: 'load', so by the
    // time it returns window.load has fired.
    await page.goto('/#experience')

    // Mirror the production gate: Promise.all(img.decode()) on every
    // in-grid image. The .catch(() => null) mirrors EC-N2-01 (silent
    // swallow of broken images). This is the same pattern N2 will
    // use in useFadeInJobCards to wait for layout to be stable.
    await page.evaluate(() => Promise.all(
      Array.from(document.querySelectorAll('[data-job-card] img'))
        .map(img => img.decode().catch(() => null))
    ))

    // 1500ms = (0.9s fade-in duration) + (0.12s stagger × 4 cards)
    //        + (0.3s FLIP duration) + (200ms settle margin).
    // After this wait, all animations should be cleared and every
    // card should report transform: 'none' from getComputedStyle.
    await page.waitForTimeout(1500)

    const transforms = await page.$$eval(
      '[data-job-card]',
      cards => cards.map(c => window.getComputedStyle(c).transform)
    )

    // Guard: at least one card must exist. A 0-card result here
    // would make the per-card assertion trivially pass.
    expect(transforms.length).toBeGreaterThan(0)

    transforms.forEach((transform, i) => {
      expect(
        transform,
        `Card #${i} still has transform "${transform}" 1500ms after ` +
        'window.load + img.decode(). The GSAP entrance + FLIP reorder ' +
        'should have completed and cleared all inline transforms. ' +
        'If this fails, the user-reported "relayout on reload" is ' +
        'still observable. See verify-p1-relayout-diagnosis.md §6.5.'
      ).toBe('none')
    })
  })
})
