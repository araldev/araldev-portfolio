import styles from './Header.module.css'
import { useId } from 'react'

function NavHeader () {
  const idNavIcon = useId()

  return (
    <nav className={styles.nav_header}>
      <div className={styles.nav_logo}>Logo</div>

      <label htmlFor={idNavIcon} className={styles.nav_icon}>
        <input className={styles.checkbox} id={idNavIcon} type='checkbox' hidden />
        <div className={styles.stroke_1} />
        <div className={styles.stroke_2} />
        <div className={styles.stroke_3} />
      </label>

      <ul className={styles.nav_links}>
        <li><a href='#about-me'>About me</a></li>
        <li><a href='#projects'>Projects</a></li>
        <li><a href='#contact'>Contact</a></li>
      </ul>
    </nav>
  )
}

function HeroSection () {
  return (
    <aside className={styles.hero_section}>
      <h1 className={styles.title_hero}>Arturo Alba García</h1>
      <h2 className={styles.subTitle_hero}>Frontend Developer</h2>
      <p className={styles.paragraph_hero}>Focused on crafting modern, visually engaging, and animated web experiences.</p>
      <a className={styles.button_cv} href='../public/cv-araldev.pdf' download>
        Descargar CV
      </a>
    </aside>
  )
}

export function Header () {
  return (
    <header className={styles.container_header}>
      <NavHeader />
      <HeroSection />
    </header>

  )
}
