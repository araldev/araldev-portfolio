import { useRef, useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)

export function useSendEmailJs () {
  const [isFormSend, setIsFormSend] = useState(false)
  const [error, setError] = useState(null)
  const idTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (idTimeoutRef.current) {
        clearTimeout(idTimeoutRef.current)
        idTimeoutRef.current = null
      }
    }
  }, [])

  const handleSendEmailJs = async ({ form, formData, captchaToken }) => {
    if (!captchaToken) {
      setError('Please complete the CAPTCHA')
      return Promise.reject(new Error('CAPTCHA not completed'))
    }

    return emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, formData)
      .then(response => {
        clearTimeout(idTimeoutRef.current)
        if (response.status !== 200) throw new Error('Email service not found')
        setError(null)
        setIsFormSend(true)
        idTimeoutRef.current = setTimeout(() => setIsFormSend(false), 5000)
        form.reset()
        return response
      })
      .catch(error => {
        setError('The form could not be submitted')
        return Promise.reject(error)
      })
  }

  return { isFormSend, error, handleSendEmailJs }
}
