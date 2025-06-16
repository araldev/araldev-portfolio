import styles from './Button.module.css'

export function Button ({ type = 'button', onClick, children }) {
  return (
    <button onClick={onClick} type={type} className={styles.button}>
      {children}
    </button>
  )
}
