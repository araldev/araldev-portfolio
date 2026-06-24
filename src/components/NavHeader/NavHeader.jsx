import { useId, useRef, forwardRef } from 'react'
import styles from './NavHeader.module.css'
import { useNavPaths } from '../../Hooks/useNavPaths.js'
import { useLanguage } from '../../i18n/useLanguage.js'
import { LanguageToggle } from '../LanguageToggle/LanguageToggle.jsx'
import brand from '../../assets/brand-araldev-miniatura.webp'

export const NavHeader = forwardRef(({ activeSection }, ref) => {
  const navMenuRef = useRef(null)
  const { handleClick } = useNavPaths({ navMenuRef })
  const { t } = useLanguage()
  const idNavIcon = useId()

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'about-me', label: t('nav.aboutMe') },
    { id: 'contact', label: t('nav.contact') }
  ]

  return (
    <>
      <nav ref={ref} className={styles.nav_header} aria-label={t('nav.ariaLabel')}>
        <div className={styles.nav_logo}>
          <img src={brand} alt={t('images.brandAraldev')} />
        </div>

        <label htmlFor={idNavIcon} className={styles.nav_icon} aria-label={t('nav.menuToggle')}>
          <input ref={navMenuRef} className={styles.checkbox} id={idNavIcon} type='checkbox' />
          <div className={styles.stroke_1} aria-hidden='true' />
          <div className={styles.stroke_2} aria-hidden='true' />
          <div className={styles.stroke_3} aria-hidden='true' />
        </label>

        <ul className={styles.nav_links} role='list'>
          {navItems.map(({ id, label }) => {
            const liClass = activeSection === id
              ? `${styles.nav_link_item} ${styles.nav_link_item_active}`
              : styles.nav_link_item
            return (
              <li key={id} className={liClass}>
                <a href={`#${id}`} data-id={id} onClick={handleClick}>{label}</a>
              </li>
            )
          })}
        </ul>

        <div className={styles.nav_lang}>
          <LanguageToggle />
        </div>
      </nav>

      <div className={styles.overlay} aria-hidden='true' />
    </>
  )
})
