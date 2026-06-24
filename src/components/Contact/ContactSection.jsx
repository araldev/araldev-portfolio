import styles from './ContactSection.module.css'
import { Button } from '../Button/Button.jsx'
import ReCAPTCHA from 'react-google-recaptcha'
import React, { useRef, useState, useCallback } from 'react'
import { useSendEmailJs } from '../../Hooks/useSendEmailJs.js'
import { useLanguage } from '../../i18n/useLanguage.js'

function validateEmail (value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const FIELD_NAMES = ['name', 'email', 'subject', 'message']
const INITIAL_VALUES = { name: '', email: '', subject: '', message: '' }

function getFieldError (name, value, t) {
  if (!value.trim()) return t('contact.errors.required')
  if (name === 'email' && !validateEmail(value)) return t('contact.errors.invalidEmail')
  return null
}

export function ContactSection () {
  const { isFormSend, error, handleSendEmailJs } = useSendEmailJs()
  const { t } = useLanguage()
  const captchaRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  const [values, setValues] = useState(INITIAL_VALUES)
  const [touched, setTouched] = useState({})

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])

  function hasAnyError () {
    return FIELD_NAMES.some(name => getFieldError(name, values[name], t))
  }

  async function handleSubmit (event) {
    event.preventDefault()
    const captcha = captchaRef.current

    // Touch all fields
    const allTouched = {}
    FIELD_NAMES.forEach(name => { allTouched[name] = true })
    setTouched(allTouched)

    if (hasAnyError()) return

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
        setValues(INITIAL_VALUES)
        setTouched({})
      }
    } catch (err) {
      console.error('Error sending email:', err)
      captcha.reset()
    } finally {
      setIsLoading(false)
    }
  }

  const fieldLabels = {
    name: t('contact.name'),
    email: 'Email',
    subject: t('contact.subject'),
    message: t('contact.message')
  }

  function renderField (name) {
    const label = fieldLabels[name]
    const fieldError = touched[name] ? getFieldError(name, values[name], t) : null
    const isValid = touched[name] && !fieldError && values[name].length > 0
    const isMessage = name === 'message'

    let fieldClass = styles.field
    if (fieldError) fieldClass += ` ${styles['field--error']}`
    else if (isValid) fieldClass += ` ${styles['field--valid']}`

    const inputProps = {
      id: `contact-${name}`,
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      placeholder: label,
      'aria-label': label,
      'aria-invalid': fieldError ? 'true' : undefined,
      'aria-describedby': fieldError ? `contact-${name}-error` : undefined,
      required: true
    }

    return (
      <div className={fieldClass}>
        <label htmlFor={`contact-${name}`}>
          <span className={styles.visually_hidden}>{label}</span>
          {isMessage
            ? <textarea {...inputProps} rows='5' cols='40' />
            : <input {...inputProps} type={name === 'email' ? 'email' : 'text'} autoComplete={name} />}
        </label>
        {fieldError && (
          <span id={`contact-${name}-error`} className={styles.field_error} role='alert'>
            {fieldError}
          </span>
        )}
      </div>
    )
  }

  return (
    <section id='contact' className={styles.contact_container}>
      <h2>{t('contact.title')}</h2>

      <form autoComplete='on' name='contact-form' onSubmit={handleSubmit} className={styles.form} action=''>
        {FIELD_NAMES.map((name) => {
          const element = renderField(name)
          return React.cloneElement(element, { key: name })
        })}

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

        {error && <small className={styles.form_feedback} role='status' data-type='error'>{error}</small>}
        {!error && isFormSend && <small className={styles.form_feedback} role='status' data-type='success'>{t('contact.success')}</small>}
      </form>
    </section>
  )
}
