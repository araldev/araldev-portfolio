import { useLanguage } from '../../i18n/useLanguage.js'
import { useActiveSection } from '../../Hooks/useActiveSection.js'
import styles from './CVDownloadWidget.module.css'

const SECTION_IDS = ['home', 'projects', 'about-me', 'experience', 'contact']

export function CVDownloadWidget () {
  const { t } = useLanguage()
  const activeSection = useActiveSection(SECTION_IDS)

  // Show only from projects section onwards
  if (
    !activeSection ||
    activeSection === 'home'
  ) {
    return null
  }

  return (
    <a
      href={`${import.meta.env.BASE_URL}cv-araldev.pdf`}
      download='cv-arturo-alba-garcia.pdf'
      className={styles.widget}
      aria-label={t('hero.downloadCV')}
      title={t('hero.downloadCV')}
    >
      <svg
        className={styles.icon}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
      >
        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
        <polyline points='7 10 12 15 17 10' />
        <line x1='12' y1='15' x2='12' y2='3' />
      </svg>
      <span className={styles.label}>{t('hero.downloadCV')}</span>
    </a>
  )
}
