import styles from './ContactSection.module.css'
import { Button } from '../Button/Button.jsx'
import ReCAPTCHA from 'react-google-recaptcha'

export function ContactSection () {
  return (
    <section id='contact' className={styles.contact_container}>
      <h2>Contact</h2>

      <form className={styles.form} action=''>
        <label>
          <input name='name' type='text' placeholder='Name LastName' required />
        </label>

        <label>
          <input name='email' type='email' placeholder='example@gmail.com' required />
        </label>

        <label>
          <input name='title' type='text' placeholder='Subject' required />
        </label>

        <label>
          <textarea name='message' rows='5' cols='40' placeholder='How we can colaborate?' required />
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
