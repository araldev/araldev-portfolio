import styles from './LanguageToggle.module.css'
import { useLanguage } from '../../i18n/useLanguage.js'
import { SUPPORTED_LANGS } from '../../i18n/translations.js'

const FLAGS = {
  es: { flag: '🇪🇸', label: 'Español' },
  en: { flag: '🇬🇧', label: 'English' }
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
 *  - the flag emoji is wrapped in aria-hidden; the visible label is
 *    the full language name, not the flag.
 */
export function LanguageToggle () {
  const { lang, setLang } = useLanguage()

  return (
    <div role='group' aria-label='Language' className={styles.toggle}>
      {SUPPORTED_LANGS.map((code) => {
        const isActive = code === lang
        const { flag, label } = FLAGS[code] ?? { flag: code.toUpperCase(), label: code }
        return (
          <button
            key={code}
            type='button'
            className={`${styles.flagBtn} ${isActive ? styles.flagBtnActive : ''}`}
            aria-pressed={isActive}
            aria-label={label}
            onClick={() => setLang(code)}
          >
            <span aria-hidden='true' className={styles.flag}>{flag}</span>
          </button>
        )
      })}
    </div>
  )
}
