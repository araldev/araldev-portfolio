// tests/visual/projects-cards.spec.js — N1 ProjectsCards v3 visual gate.
//
// P1 STATUS: RED baseline (T-006). This spec runs against the CURRENT
// (broken) source where ProjectsCards hardcodes `clip-path: path(...)`
// in absolute coordinates. The first run records the broken state as
// the committed baseline. P3 (N1 GREEN) deletes + recreates
// ProjectsCards without absolute clip-paths and updates the baselines.
//
// Asserts:
//   1. The #projects section is visible at the active viewport (3
//      viewports via the projects[] matrix in playwright.config.js).
//   2. The section's rendered DOM matches the committed PNG baseline
//      within 1% pixel diff (maxDiffPixelRatio: 0.01) per SC-N1-05.
//      The CURRENT source's clip-path renders correctly (it does what
//      it was coded to do) so the first run records the broken
//      polygons as the baseline; P3 updates the baselines.
//   3. axe-core reports 0 violations per FR-N1-07. The current source
//      has a real a11y defect (multiple <nav> elements with no
//      aria-label, violating landmark-unique) — this assertion FAILS
//      on the current source. P3 (N1 recreate) must fix it.
//
// Why a real browser: jsdom does not apply CSS `clip-path` to the
// visual model, so the deformation is invisible to Vitest. The bug
// ships through jsdom + jest-axe green. Real Chromium renders the
// clip-path and the snapshot reflects the actual user-visible state.
//
// Test pattern: Playwright's projects[] matrix in playwright.config.js
// already defines the 3 viewports (desktop-1440, tablet-768, mobile-375).
// Each `test()` in this file is automatically run once per project, so
// we get 3 invocations of each test without an inner for-loop.

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('SC-N1-05: ProjectsCards snapshot @ active viewport', () => {
  test('snapshot + section visible', async ({ page }, testInfo) => {
    await page.goto('/#projects')
    await page.waitForLoadState('networkidle')

    // The section must be rendered and reachable.
    const section = page.locator('#projects')
    await expect(section).toBeVisible()

    // Snapshot the section. First run creates the baseline; subsequent
    // runs compare against it. maxDiffPixelRatio of 0.01 (1%) absorbs
    // sub-pixel font rendering variance but catches real regressions.
    await expect(section).toHaveScreenshot(
      `projects-${testInfo.project.name}.png`,
      { maxDiffPixelRatio: 0.01 }
    )
  })
})

test.describe('FR-N1-07: axe-core 0 violations @ active viewport', () => {
  test('axe-core on #projects', async ({ page }) => {
    await page.goto('/#projects')
    await page.waitForLoadState('networkidle')

    // axe-core via @axe-core/playwright (real-browser a11y). The
    // current source fails this with a "landmark-unique" violation
    // (multiple <nav class="links_container"> with no aria-label).
    // That is the P1 RED state for a11y; P3 (N1) fixes it.
    const results = await new AxeBuilder({ page })
      .include('#projects')
      .analyze()

    expect(results.violations).toEqual([])
  })
})
