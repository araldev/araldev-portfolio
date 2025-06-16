import { useState } from 'react'
import emailjs from '@emailjs/browser'

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)

export function useSendEmailJs () {
  const [error, setError] = useState(null)

  const handleSendEmailJs = ({ event, formData, captchaToken }) => {
    event.preventDefault()

    if (!captchaToken) {
      setError('Please complete the CAPTCHA')
      return
    }

    emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, formData)
      .then(response => {
        if (response.status !== 200) throw new Error('Email service not found')
        setError(null)
        event.target.reset()
      })
      .catch(error => {
        setError('The form could not be submitted')
        throw new Error(error.message)
      })
  }

  return { error, handleSendEmailJs }
}
