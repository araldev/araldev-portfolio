import styles from './Button.module.css'

export function Button ({ disabled = false, type = 'button', onClick, children }) {
  return (
    <button disabled={disabled} onClick={onClick} type={type} className={styles.button}>
      {children}
    </button>
  )
}
