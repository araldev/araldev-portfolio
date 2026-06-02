// tests/setup.js — Vitest global setup (loaded by vitest.config.js).
//
// This file is loaded ONLY for the Vitest test runner (`pnpm test:run` and
// `pnpm test:coverage`). Playwright specs under `tests/visual/` run in a
// real Chromium browser via their own runner (`pnpm test:visual`) and do
// NOT load this file. Therefore, polyfills here apply to jsdom-based
// Vitest tests only; Playwright specs rely on the real browser.
//
// 004-ux-overhaul-and-relayout-root-fix N4 audit (2026-06-02): the
// existing polyfills (matchMedia for usePrefersReducedMotion,
// crypto.randomUUID for the few places that need IDs) remain
// sufficient. N4 introduces no new jsdom dependencies. No changes
// required to this file for P1.

import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import 'jest-axe'

// Polyfill matchMedia for jsdom (used by usePrefersReducedMotion)
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false
    })
  })
}

// Polyfill crypto.randomUUID if missing
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = { randomUUID: () => Math.random().toString(36).slice(2) }
}

// Clean up the DOM after every test
afterEach(() => {
  cleanup()
})
