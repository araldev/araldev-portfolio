import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { detectInitialLanguage, LANGUAGE_STORAGE_KEY } from './detectLanguage.js'
import { DEFAULT_LANG, SUPPORTED_LANGS, translations, getValue } from './translations.js'

/**
 * LanguageContext — single source of truth for the active UI language.
 *
 * - Initial language comes from detectInitialLanguage() (localStorage >
 *   navigator.language > default).
 * - Every language change is mirrored to localStorage so it survives
 *   reloads.
 * - The translation function `t` walks a dot-path and returns the
 *   value in the active language, or the provided fallback (or the
 *   raw key) when the key is missing. Never throws.
 */
export const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key, fallback) => fallback ?? key
})

export function LanguageProvider ({ children, initialLang }) {
  const [lang, setLangState] = useState(() => initialLang ?? detectInitialLanguage())

  const setLang = useCallback((next) => {
    if (!SUPPORTED_LANGS.includes(next)) return
    setLangState(next)
    try {
      window.localStorage?.setItem(LANGUAGE_STORAGE_KEY, next)
    } catch {
      // localStorage may be unavailable (private mode, SSR, etc.)
      // The in-memory state still updates, so the UI works for the
      // current session.
    }
  }, [])

  // React to storage changes from other tabs so the toggle stays in
  // sync across the browser. Always listen, regardless of whether an
  // explicit initialLang was provided — instances with initialLang
  // still need to follow manual overrides from elsewhere.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== LANGUAGE_STORAGE_KEY) return
      const value = event.newValue
      if (value && SUPPORTED_LANGS.includes(value)) setLangState(value)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const t = useCallback((path, fallback) => {
    const dict = translations[lang] ?? translations[DEFAULT_LANG]
    return getValue(dict, path, fallback ?? path)
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
