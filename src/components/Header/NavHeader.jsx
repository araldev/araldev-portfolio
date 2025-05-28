import { useId } from 'react'
import styles from './Header.module.css'
import { useNavPaths } from '../../Hooks/useNavPaths'

export function NavHeader () {
  const { handleClick } = useNavPaths()
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
        <li><a data-id='about-me' onClick={handleClick}>About me</a></li>
        <li><a data-id='projects' onClick={handleClick}>Projects</a></li>
        <li><a data-id='contact' onClick={handleClick}>Contact</a></li>
      </ul>
    </nav>
  )
}
