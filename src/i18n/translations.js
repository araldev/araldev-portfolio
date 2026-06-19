import es from './locales/es.json'
import en from './locales/en.json'

/**
 * Translations registry. Add a new language here when needed.
 * Each entry must be a complete, statically-imported JSON object so
 * bundlers can tree-shake and consumers can index by literal key.
 */
export const translations = {
  es,
  en
}

export const SUPPORTED_LANGS = Object.keys(translations)
export const DEFAULT_LANG = 'es'

/**
 * Safe getter with dot-path support. Returns the fallback (or the
 * raw key) when a path is missing so the UI never crashes on an
 * incomplete translation. The fallback is also returned for `null`/
 * `undefined` intermediate values.
 *
 * @param {object} dict   the language dictionary
 * @param {string} path   dot-separated key, e.g. "footer.socials.github"
 * @param {*} fallback    value to return when the key is not found
 * @returns {*}
 */
export function getValue (dict, path, fallback) {
  if (!dict || typeof path !== 'string') return fallback
  const segments = path.split('.')
  let current = dict
  for (const segment of segments) {
    if (current == null || typeof current !== 'object') return fallback
    current = current[segment]
  }
  return current === undefined ? fallback : current
}
