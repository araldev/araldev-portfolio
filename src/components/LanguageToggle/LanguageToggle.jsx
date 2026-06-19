import styles from './LanguageToggle.module.css'
import { useLanguage } from '../../i18n/useLanguage.js'
import { SUPPORTED_LANGS } from '../../i18n/translations.js'

/**
 * Map of supported languages to:
 *  - flagClass: a CSS class that paints the flag in pure CSS
 *  - code:     the two-letter ISO code rendered in the corner
 *  - label:    the full language name for aria-label
 *
 * Flags are drawn in CSS (not emoji) so the toggle renders the
 * same on every platform — including those without country flag
 * emoji support (older Chromium, Linux without noto-emoji).
 */
const LANG_META = {
  es: { flagClass: 'flagEs', code: 'ES', label: 'Español' },
  en: { flagClass: 'flagEn', code: 'EN', label: 'English' }
}

/**
 * Two-flag language toggle.
 *
 * Renders one button per supported language. The active language is
 * highlighted; clicking another language switches the UI everywhere
 * (the change is propagated through LanguageContext and persisted to
 * localStorage).
 *
 * Accessibility:
 *  - role="group" with an aria-label so screen readers announce it
 *    as the language switcher.
 *  - each button is a real <button> with aria-pressed reflecting the
 *    active state.
 *  - the visible text is the two-letter ISO code, which the
 *    aria-label expands to the full language name for screen readers.
 */
export function LanguageToggle () {
  const { lang, setLang } = useLanguage()

  return (
    <div role='group' aria-label='Language' className={styles.toggle}>
      {SUPPORTED_LANGS.map((code) => {
        const isActive = code === lang
        const meta = LANG_META[code] ?? { flagClass: '', code: code.toUpperCase(), label: code }
        const flagClass = styles[meta.flagClass] ?? ''
        return (
          <button
            key={code}
            type='button'
            className={`${styles.flagBtn} ${flagClass} ${isActive ? styles.flagBtnActive : ''}`}
            aria-pressed={isActive}
            aria-label={meta.label}
            onClick={() => setLang(code)}
          >
            <span aria-hidden='true' className={styles.code}>{meta.code}</span>
          </button>
        )
      })}
    </div>
  )
}
