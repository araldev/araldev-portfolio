import styles from './LinkButton.module.css'

export function LinkButton ({ href = '', children }) {
  return (
    <a className={styles.anchor} href={href}>
      {children}
    </a>
  )
}
