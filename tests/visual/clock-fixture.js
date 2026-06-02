// tests/visual/clock-fixture.js — Shared Playwright fixtures for N4
// visual specs.
//
// Centralizes two pieces of test infrastructure that the snapshot
// tests need to be deterministic:
//
//   1. `installFixedClock(page)` — mocks `Date.now()` and `new Date()`
//      to a fixed timestamp. The current source's useJobDuration hook
//      renders "3y 3m" for a job with endDate=Present, which changes
//      day-to-day. Without a fixed clock, snapshots drift by ~1 pixel
//      per day in the "Present" duration text. Mocking the clock
//      freezes that text forever.
//
//   2. `waitForVisualSettle(page)` — waits for Lenis (smooth scroll)
//      to be idle, all CSS animations to complete, and fonts to load.
//      Playwright's default `waitForLoadState('networkidle')` covers
//      network but not Lenis. This helper covers both.

const FIXED_TIMESTAMP = new Date('2026-06-02T12:00:00Z').getTime()

/**
 * Install a fixed-clock init script on the page so all Date calls
 * inside the app return the same value. Must be called BEFORE page.goto.
 *
 * @param {import('@playwright/test').Page} page
 */
export async function installFixedClock (page) {
  await page.addInitScript(`(() => {
    const FIXED = ${FIXED_TIMESTAMP}
    const OriginalDate = Date
    function PatchedDate (...args) {
      if (args.length === 0) return new OriginalDate(FIXED)
      return new OriginalDate(...args)
    }
    PatchedDate.prototype = OriginalDate.prototype
    PatchedDate.now = () => FIXED
    PatchedDate.parse = OriginalDate.parse
    PatchedDate.UTC = OriginalDate.UTC
    // eslint-disable-next-line no-global-assign
    Date = PatchedDate
  })()`)
}

/**
 * Wait for the page to be visually stable before taking a snapshot.
 * Combines networkidle (no in-flight requests) with a 600ms post-load
 * idle to absorb Lenis smooth-scroll settling and any deferred CSS
 * recalc (e.g. font swap on Roboto 700/600).
 *
 * @param {import('@playwright/test').Page} page
 */
export async function waitForVisualSettle (page) {
  await page.waitForLoadState('networkidle')
  // Lenis uses requestAnimationFrame for its scroll loop; give it
  // ~12 frames at 60fps (200ms) to settle into the anchor position.
  await page.waitForTimeout(600)
}
