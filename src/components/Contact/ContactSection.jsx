import styles from './ContactSection.module.css'
import { Button } from '../Button/Button.jsx'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSendEmailJs } from '../../Hooks/useSendEmailJs.js'
import { useRef, useState } from 'react'

export function ContactSection () {
  const { isFormSend, error, handleSendEmailJs } = useSendEmailJs()
  const captchaRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit (event) {
    event.preventDefault()

    const captcha = captchaRef.current

    try {
      setIsLoading(true)
      const token = await captcha.executeAsync()

      const form = event.target
      const formData = Object.fromEntries(new FormData(form))
      const formDataWithToken = {
        ...formData,
        time: new Date().toLocaleString(),
        'g-recaptcha-response': token
      }

      const success = await handleSendEmailJs({ formData: formDataWithToken, captchaToken: token })

      if (success) {
        form.reset()
        captcha.reset()
      }
    } catch (err) {
      console.error('Error sending email:', err)
      captcha.reset()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id='contact' className={styles.contact_container}>
      <h2>Contact</h2>

      <form autoComplete='on' name='contact-form' onSubmit={handleSubmit} className={styles.form} action=''>
        <label>
          <input name='name' type='text' placeholder='Name' required />
        </label>

        <label>
          <input name='email' type='email' placeholder='example@gmail.com' required />
        </label>

        <label>
          <input name='subject' type='text' placeholder='Subject' required />
        </label>

        <label>
          <textarea name='message' rows='5' cols='40' placeholder='How we can colaborate?' required />
        </label>

        <ReCAPTCHA
          ref={captchaRef}
          badge='bottomleft'
          size='invisible'
          sitekey={import.meta.env.VITE_RECAPTCHA_INVISIBLE_SITE_KEY}
          theme='dark'
        />

        <Button disabled={isLoading} type='submit'>
          {isLoading ? 'Loading...' : 'Send'}
        </Button>

        {error && <small style={{ color: 'red' }}>{error}</small>}
        {!error && isFormSend && <small style={{ color: 'green' }}>Successfully sent</small>}
      </form>
    </section>
  )
}
