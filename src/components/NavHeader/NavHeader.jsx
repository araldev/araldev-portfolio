import { useId, useRef, forwardRef } from 'react'
import styles from './NavHeader.module.css'
import { useNavPaths } from '../../Hooks/useNavPaths.js'
import brand from '../../assets/brand-araldev-miniatura.webp'

export const NavHeader = forwardRef((props, ref) => {
  const navMenuRef = useRef(null)
  const { handleClick } = useNavPaths({ navMenuRef })
  const idNavIcon = useId()
  return (
    <>
      <nav ref={ref} className={styles.nav_header}>
        <div className={styles.nav_logo}>
          <img src={brand} alt='Brand Araldev' />
        </div>

        <label htmlFor={idNavIcon} className={styles.nav_icon}>
          <input ref={navMenuRef} className={styles.checkbox} id={idNavIcon} type='checkbox' hidden />
          <div className={styles.stroke_1} />
          <div className={styles.stroke_2} />
          <div className={styles.stroke_3} />
        </label>

        <ul className={styles.nav_links}>
          <li><a data-id='home' onClick={handleClick}>Home</a></li>
          <li><a data-id='projects' onClick={handleClick}>Projects</a></li>
          <li><a data-id='about-me' onClick={handleClick}>About me</a></li>
          <li><a data-id='contact' onClick={handleClick}>Contact</a></li>
        </ul>
      </nav>

      <div className={styles.overlay} />
    </>
  )
})
