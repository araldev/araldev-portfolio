import styles from './HeroSection.module.css'
import { BackgroundHeroCanvas } from '../Backgrounds/BackgroundHeroCanvas.jsx'
import { socialIcons } from '../../data/icons.js'
import { useFadeInText } from '../../Hooks/useFadeInText.js'
import { useRef } from 'react'

export function HeroSection () {
  const titleRef = useRef()
  const subtitleRef = useRef()
  const paragraphRef = useRef()
  const heroContainerRef = useRef()
  useFadeInText(titleRef, heroContainerRef, 'chars', 'linear-gradient(90deg, #00C9FF, #92FE9D)')
  useFadeInText(subtitleRef, heroContainerRef, 'chars', 'linear-gradient(135deg, #8fc6ff 0%, #5a9cff  100%')
  useFadeInText(paragraphRef, heroContainerRef)

  return (
    <header ref={heroContainerRef} id='home' className={styles.container_header}>
      <aside className={styles.hero_section}>
        <h1 ref={titleRef} className={styles.title_hero}>Arturo Alba García</h1>
        <h2 ref={subtitleRef} className={styles.subTitle_hero}>Frontend Developer</h2>
        <p ref={paragraphRef} className={styles.paragraph_hero}>Focused on crafting modern, visually engaging, and <br />animated web experiences.</p>
        <nav className={styles.socials_hero_container}>
          <a className={styles.button_cv} href='../public/cv-araldev.pdf' download>
            Download CV
          </a>
          <div className={styles.social_icons_container}>
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
          </div>
        </nav>
      </aside>
      <BackgroundHeroCanvas />
    </header>
  )
}
