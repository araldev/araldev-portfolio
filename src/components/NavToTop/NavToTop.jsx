import styles from './NavToTop.module.css'
import { utilsIcons } from '../../data/icons'
import { forwardRef } from 'react'
import { useNavToTopPath } from '../../Hooks/useNavToTopPath'

export const NavToTop = forwardRef((props, ref) => {
  const { handleClick } = useNavToTopPath()

  return (
    <a data-id='nav-to-top' onClick={handleClick} ref={ref} className={styles.nav_arrow_up_container}>
      {utilsIcons.arrowUp}
    </a>
  )
})
