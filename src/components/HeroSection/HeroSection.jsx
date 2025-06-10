import styles from './HeroSection.module.css'
import { BackgroundHeroCanvas } from '../Backgrounds/BackgroundHeroCanvas.jsx'
import { socialIcons } from '../../data/icons.js'

export function HeroSection () {
  return (
    <header id='home' className={styles.container_header}>
      <aside className={styles.hero_section}>
        <h1 className={styles.title_hero}>Arturo Alba García</h1>
        <h2 className={styles.subTitle_hero}>Frontend Developer</h2>
        <p className={styles.paragraph_hero}>Focused on crafting modern, visually engaging, and animated web experiences.</p>
        <div className={styles.socials_hero_container}>
          <a className={styles.button_cv} href='../public/cv-araldev.pdf' download>
            Descargar CV
          </a>
          <nav className={styles.social_icons_container}>
            <a href='https://www.linkedin.com/in/araldev/' target='_blank' rel='noopener noreferrer' className={styles.linkedin}>
              {socialIcons.linkedin}
            </a>
            <a href='mailto:arturo.r2d2.dev@gmail.com' target='_blank' rel='noopener noreferrer' className={styles.gmail}>
              {socialIcons.gmail}
            </a>
            <a href='https://github.com/araldev' target='_blank' rel='noopener noreferrer' className={styles.gitHub}>
              {socialIcons.gitHub}
            </a>
            <a href='https://discord.gg/jeTvBNjp' target='_blank' rel='noopener noreferrer' className={styles.discord}>
              {socialIcons.discord}
            </a>
          </nav>
        </div>
        <BackgroundHeroCanvas />
      </aside>
    </header>
  )
}
