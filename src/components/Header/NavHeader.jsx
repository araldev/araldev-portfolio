import { useId } from 'react'
import styles from './Header.module.css'

export function NavHeader () {
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
