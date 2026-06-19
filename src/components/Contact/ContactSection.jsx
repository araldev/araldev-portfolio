import styles from './ContactSection.module.css'
import { Button } from '../Button/Button.jsx'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSendEmailJs } from '../../Hooks/useSendEmailJs.js'
import { useLanguage } from '../../i18n/useLanguage.js'
import { useRef, useState } from 'react'

export function ContactSection () {
  const { isFormSend, error, handleSendEmailJs } = useSendEmailJs()
  const { t } = useLanguage()
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
      <h2>{t('contact.title')}</h2>

      <form autoComplete='on' name='contact-form' onSubmit={handleSubmit} className={styles.form} action=''>
        <label>
          <span className={styles.visually_hidden}>{t('contact.name')}</span>
          <input name='name' type='text' placeholder={t('contact.name')} aria-label={t('contact.name')} required />
        </label>

        <label>
          <span className={styles.visually_hidden}>Email</span>
          <input name='email' type='email' placeholder='example@gmail.com' aria-label='Email' required />
        </label>

        <label>
          <span className={styles.visually_hidden}>{t('contact.subject')}</span>
          <input name='subject' type='text' placeholder={t('contact.subject')} aria-label={t('contact.subject')} required />
        </label>

        <label>
          <span className={styles.visually_hidden}>{t('contact.message')}</span>
          <textarea name='message' rows='5' cols='40' placeholder={t('contact.message')} aria-label={t('contact.message')} required />
        </label>

        <ReCAPTCHA
          ref={captchaRef}
          badge='bottomleft'
          size='invisible'
          sitekey={import.meta.env.VITE_RECAPTCHA_INVISIBLE_SITE_KEY}
          theme='dark'
        />

        <Button disabled={isLoading} type='submit'>
          {isLoading ? t('contact.loading') : t('contact.send')}
        </Button>

        {error && <small style={{ color: 'red' }} role='status'>{error}</small>}
        {!error && isFormSend && <small style={{ color: 'green' }} role='status'>{t('contact.success')}</small>}
      </form>
    </section>
  )
}
