import styles from './Footer.module.css'
import { socialIcons } from '../../data/icons'
import brand from '../../assets/brand-araldev.webp'
import { useNavPaths } from '../../Hooks/useNavPaths'
import { useLanguage } from '../../i18n/useLanguage.js'

export function Footer () {
  const { handleClick } = useNavPaths({})
  const { t } = useLanguage()

  return (
    <footer className={styles.footer_container}>
      <div className={styles.footer_content}>
        <nav className={styles.contact_container} aria-label={t('footer.contactAria')}>

          <h3>{t('footer.contact')}</h3>

          <ul className={styles.ul_contact} role='list'>
            <li>
              <a href='https://www.linkedin.com/in/araldev/' target='_blank' rel='noopener noreferrer'>
                {socialIcons.linkedin}
                <h5>{t('footer.socials.linkedin')}</h5>
                <small>Arturo Alba García</small>
              </a>
            </li>

            <li>
              <a href='mailto:arturo.r2d2.dev@gmail.com' target='_blank' rel='noopener noreferrer'>
                {socialIcons.gmail}
                <h5>{t('footer.socials.email')}</h5>
                <small>arturo.r2d2.dev@gmail.com</small>
              </a>
            </li>

            <li>
              <a href='https://github.com/araldev' target='_blank' rel='noopener noreferrer'>
                {socialIcons.gitHub}
                <h5>{t('footer.socials.github')}</h5>
                <small>Araldev</small>
              </a>
            </li>

            <li>
              <a href='https://discord.gg/jeTvBNjp' target='_blank' rel='noopener noreferrer'>
                {socialIcons.discord}
                <h5>{t('footer.socials.discord')}</h5>
                <small>araldev</small>
              </a>
            </li>
          </ul>
        </nav>

        <nav className={styles.links_container} aria-label={t('footer.linksAria')}>

          <h3>{t('footer.links')}</h3>

          <ul className={styles.ul_links} role='list'>
            <li><a href='#home' data-id='home' onClick={handleClick}>{t('nav.home')}</a></li>
            <li><a href='#projects' data-id='projects' onClick={handleClick}>{t('nav.projects')}</a></li>
            <li><a href='#about-me' data-id='about-me' onClick={handleClick}>{t('nav.aboutMe')}</a></li>
            <li><a href='#contact' data-id='contact' onClick={handleClick}>{t('nav.contact')}</a></li>
          </ul>

        </nav>
      </div>

      <div className={styles.brand}>
        <img src={brand} alt={t('images.brandAraldev')} />
      </div>
    </footer>
  )
}
