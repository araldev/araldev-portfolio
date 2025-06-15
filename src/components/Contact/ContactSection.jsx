import styles from './ContactSection.module.css'
import { Button } from '../Button/Button.jsx'
import ReCAPTCHA from 'react-google-recaptcha'

export function ContactSection () {
  return (
    <section className={styles.contact_container}>
      <h2>Contact</h2>

      <form className={styles.form} action=''>
        <label>
          <input name='email' type='text' placeholder='example@gmail.com' />
        </label>

        <label>
          <textarea name='message' rows='5' cols='40' placeholder='Cómo podemos colaborar' />
        </label>

        <ReCAPTCHA
          sitekey='6LcgEGIrAAAAACA0BuNeb6Y-D9YDnInr8mZ7ThS-'
          theme='dark'
        />

        <Button type='submit'>
          Send
        </Button>
      </form>
    </section>
  )
}
