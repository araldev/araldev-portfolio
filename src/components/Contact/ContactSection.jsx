import styles from './ContactSection.module.css'
import { Button } from '../Button/Button.jsx'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSendEmailJs } from '../../Hooks/useSendEmailJs.js'
import { useState } from 'react'

export function ContactSection () {
  const [captchaToken, setCaptchaToken] = useState(null)
  const { error, handleSendEmailJs } = useSendEmailJs()

  function onCaptchaChange (token) {
    setCaptchaToken(token)
  }

  function handleSubmit (event) {
    const { name, email, title, message } = Object.fromEntries(new FormData(event.target))
    const formData = {
      name,
      email,
      title,
      message,
      'g-recaptcha-response': captchaToken
    }

    handleSendEmailJs({ event, formData, captchaToken })
  }

  return (
    <section id='contact' className={styles.contact_container}>
      <h2>Contact</h2>

      <form onSubmit={handleSubmit} className={styles.form} action=''>
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
          onChange={onCaptchaChange}
        />

        <Button type='submit'>
          Send
        </Button>

        {error && <small>{error}</small>}
        {!error && <small>Sended</small>}
      </form>
    </section>
  )
}
