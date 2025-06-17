import styles from './ContactSection.module.css'
import { Button } from '../Button/Button.jsx'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSendEmailJs } from '../../Hooks/useSendEmailJs.js'
import { useRef } from 'react'

export function ContactSection () {
  const { isFormSend, error, handleSendEmailJs } = useSendEmailJs()
  const tokenRef = useRef(null)
  const captchaRef = useRef(null)

  async function handleSubmit (event) {
    event.preventDefault()

    const form = event.target
    const token = tokenRef.current
    const captcha = captchaRef.current

    const formData = Object.fromEntries(new FormData(form))
    const formDataWithToken = {
      ...formData,
      'g-recaptcha-response': token
    }

    try {
      const succes = await handleSendEmailJs({ form, formData: formDataWithToken, captchaToken: token })
      if (succes) {
        tokenRef.current = null
        captcha.reset()
      }
    } catch (err) {
      console.warn('dentro del catch', err)
    }
  }

  function onChangeCaptcha (token) {
    tokenRef.current = token
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
          ref={captchaRef}
          // size='invisible'
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          theme='dark'
          onChange={(token) => onChangeCaptcha(token)}
        />

        <Button type='submit'>
          Send
        </Button>

        {error && <small style={{ color: 'red' }}>{error}</small>}
        {!error && isFormSend && <small style={{ color: 'green' }}>Successfully sent</small>}
      </form>
    </section>
  )
}
