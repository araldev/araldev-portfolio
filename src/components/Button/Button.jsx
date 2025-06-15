import styles from './Button.module.css'

export function Button ({ type = 'button', children }) {
  return (
    <button type={type} className={styles.button}>
      {children}
    </button>
  )
}
