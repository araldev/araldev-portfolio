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

  const handleSendEmailJs = async ({ formData, captchaToken }) => {
    try {
      if (!captchaToken) {
        setError('Please complete the CAPTCHA')
        return Promise.reject(new Error('CAPTCHA not completed'))
      }
      if (!formData) {
        setError('Please complete the form')
        return Promise.reject(new Error('form not completed'))
      }

      const response = await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, formData)

      if (response.status !== 200) throw new Error('Email service not found')

      clearTimeout(idTimeoutRef.current)
      setError(null)
      setIsFormSend(true)
      idTimeoutRef.current = setTimeout(() => setIsFormSend(false), 5000)

      return response
    } catch (err) {
      const errorMessage = err.text || 'Error al enviar el formulario'

      setError(errorMessage)
      return Promise.reject(errorMessage)
    }
  }

  return { isFormSend, error, handleSendEmailJs }
}
