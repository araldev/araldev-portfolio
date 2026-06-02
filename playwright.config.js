// playwright.config.js — N4 visual regression test runner.
//
// Runs the Playwright specs in `tests/visual/` against a real Chromium
// browser. The 3-viewport matrix (1440×900, 768×1024, 375×812) is the
// real-browser gate for the layout fixes in P2 (N2 JobsCards relayout,
// N3 AboutMe Bento) and P3 (N1 ProjectsCards v3).
//
// jsdom cannot reproduce the bugs we are testing (image-async relayout,
// Bento auto-row expansion, clip-path deformation). Real Chromium can —
// that is why this config exists (FR-N4-07, SC-N4-03).
//
// P1 = RED baseline: every spec captures the current (broken) source
// state into a committed baseline. P2 and P3 update the baselines after
// the fixes land. See tests/visual/README.md for the RED/GREEN contract.

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // Only pick up Playwright specs under tests/visual/ — never anything
  // from tests/{unit,integration,a11y}/ (those are Vitest specs that
  // use jsdom and would explode under a Playwright runner).
  testDir: './tests/visual',
  testMatch: /.*\.spec\.js$/,

  // Default 30s per test (3 viewports × 9 specs = 27 expect calls; this
  // is generous so CI cold cache does not flake). Individual expects
  // still get their own 5s budget below.
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // CI tuning: serialize (workers=1) and retry transient failures twice
  // to absorb the rare flake of a dev-server compile. Locally we cap
  // workers at 4 to keep the Vite dev server responsive under the
  // 9 simultaneous tests (3 specs x 3 viewports); going wider causes
  // HMR + image-decodes to keep the network active past the
  // networkidle timeout.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    // baseURL: dev server. `pnpm dev` boots Vite on :5173; the SPA is
    // served from `/araldev-portfolio/` because vite.config.js sets
    // `base: '/araldev-portfolio/'`. The 302 redirect at `/` is handled
    // by page.goto automatically.
    baseURL: 'http://localhost:5173',

    // FR-N4-07: evidence on first failure (trace) and after every test
    // (screenshot). Screenshots are the input to the diff reporter
    // when baselines change.
    trace: 'on-first-retry',
    screenshot: 'on',

    actionTimeout: 5_000,
    navigationTimeout: 10_000
  },

  // 3-viewport matrix per spec — 9 baseline images per spec (3 specs ×
  // 3 viewports = 9). viewport.height is chosen to be representative
  // of the device's typical first paint (desktop 900, tablet 1024,
  // iPhone 13/14 812). We use plain Desktop Chrome (not HiDPI) so
  // screenshots are 1× — easier to diff in code review.
  //
  // reducedMotion: 'reduce' is REQUIRED for deterministic snapshots.
  // The app uses usePrefersReducedMotion() to skip the GSAP entrance
  // animation and the featured-card beacon pulse when the user (or
  // the test runner) prefers reduced motion. Without this, snapshots
  // would be taken at random animation frames and the diff would
  // be noise. The behavioral tests (e.g. SC-N2-01 height-delta) are
  // not affected — they assert on layout, not on transform/opacity.
  projects: [
    {
      name: 'desktop-1440',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'reduce'
      }
    },
    {
      name: 'tablet-768',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
        reducedMotion: 'reduce'
      }
    },
    {
      name: 'mobile-375',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
        reducedMotion: 'reduce'
      }
    }
  ],

  // Auto-start the Vite dev server if it is not already running on
  // :5173. reuseExistingServer: true means developers with `pnpm dev`
  // already open do not get a second instance spawned. SC-N4-03: full
  // boot + first test must complete in < 10s.
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173/araldev-portfolio/',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    stdout: 'ignore',
    stderr: 'pipe'
  }
})
