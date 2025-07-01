import styles from './LinkButton.module.css'

export function LinkButton ({ href = '', children, target = '_blank', rel = 'noopener noreferrer' }) {
  return (
    <a className={styles.anchor} href={href} target={target} rel={rel}>
      {children}
    </a>
  )
}
