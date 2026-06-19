import { DEFAULT_LANG, SUPPORTED_LANGS } from './translations.js'

const STORAGE_KEY = 'araldev-lang'

/**
 * Resolves the initial language using this priority:
 *   1. localStorage override (set manually via the LanguageToggle)
 *   2. navigator.language (browser preference, e.g. "es-ES", "en-US")
 *   3. DEFAULT_LANG fallback
 *
 * Safe in non-browser environments (jsdom without navigator, SSR):
 * returns the default when `window`/`navigator` is unavailable.
 *
 * @returns {string} one of SUPPORTED_LANGS
 */
export function detectInitialLanguage () {
  if (typeof window === 'undefined') return DEFAULT_LANG

  try {
    // 1. localStorage override
    const stored = window.localStorage?.getItem(STORAGE_KEY)
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored

    // 2. navigator.language (string like "es-ES", "en-US", "es", "en")
    const browser = window.navigator?.language
    if (browser) {
      const primary = browser.toLowerCase().split('-')[0]
      if (SUPPORTED_LANGS.includes(primary)) return primary
    }
  } catch {
    // localStorage may throw in private mode / disabled cookies.
    // Fall through to default.
  }

  // 3. fallback
  return DEFAULT_LANG
}

export const LANGUAGE_STORAGE_KEY = STORAGE_KEY
