import styles from './ContactSection.module.css'

export function ContactSection () {
  return (
    <section className={styles.contact_container}>
      <h2>Contact</h2>

      <form className={styles.form} action=''>
        <label>
          <input type='text' placeholder='example@gmail.com' />
        </label>
        <label>
          <textarea rows='5' cols='40' placeholder='Cómo podemos colaborar' />
        </label>
        <button type='submit'>Contactar</button>
      </form>
    </section>
  )
}
