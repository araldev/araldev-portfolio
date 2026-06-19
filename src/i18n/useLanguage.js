import { useContext } from 'react'
import { LanguageContext } from './LanguageContext.jsx'

/**
 * Subscribe a component to the active language.
 *
 * @returns {{ lang: string, setLang: (lang: string) => void, t: (path: string, fallback?: *) => * }}
 */
export function useLanguage () {
  return useContext(LanguageContext)
}
