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
