import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'
import { ContactSection } from '../../src/components/Contact/ContactSection.jsx'

// ─── Mocks ───────────────────────────────────────────────────────────────

// 1) react-google-recaptcha — jsdom cannot load the Google script, so we
//    expose a controllable ref that mirrors the real API: executeAsync()
//    returns a Promise<string> and reset() is a no-op.
const captchaRef = vi.hoisted(() => ({
  executeAsync: vi.fn(),
  reset: vi.fn()
}))

vi.mock('react-google-recaptcha', () => ({
  default: React.forwardRef((_props, ref) => {
    if (typeof ref === 'function') ref(captchaRef)
    else if (ref) ref.current = captchaRef
    return React.createElement('div', { 'data-testid': 'recaptcha' })
  })
}))

// 2) useSendEmailJs — capture the call instead of hitting the real API
const sendEmailMock = vi.fn()
vi.mock('../../src/Hooks/useSendEmailJs.js', () => ({
  useSendEmailJs: () => ({
    isFormSend: false,
    error: null,
    handleSendEmailJs: sendEmailMock
  })
}))

// 3) Button — keep simple to avoid CSS module coupling
vi.mock('../../src/components/Button/Button.jsx', () => ({
  Button: ({ children, disabled, type, ...rest }) => (
    React.createElement('button', { type, disabled, ...rest }, children)
  )
}))

// CSS modules — proxy so class names are stable strings
vi.mock('../../src/components/Contact/ContactSection.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

// ─── Helpers ─────────────────────────────────────────────────────────────

function renderWithProvider (ui, initialLang = 'es') {
  return render(<LanguageProvider initialLang={initialLang}>{ui}</LanguageProvider>)
}

function fillValid (overrides = {}) {
  const defaults = {
    name: 'Arturo',
    email: 'arturo@example.com',
    subject: 'Hello',
    message: 'Testing the contact form'
  }
  const data = { ...defaults, ...overrides }
  fireEvent.input(screen.getByLabelText(/Nombre/i), { target: { name: 'name', value: data.name } })
  fireEvent.input(screen.getByLabelText('Email'), { target: { name: 'email', value: data.email } })
  fireEvent.input(screen.getByLabelText(/Asunto/i), { target: { name: 'subject', value: data.subject } })
  fireEvent.input(screen.getByLabelText(/colaborar/i), { target: { name: 'message', value: data.message } })
  return data
}

const FAKE_TOKEN = 'fake-captcha-token-123'

beforeEach(() => {
  captchaRef.executeAsync.mockReset().mockResolvedValue(FAKE_TOKEN)
  captchaRef.reset.mockReset()
  sendEmailMock.mockReset().mockResolvedValue({ status: 200 })
})

// ─── Tests ───────────────────────────────────────────────────────────────

describe('ContactSection — captcha integration', () => {
  it('renders an invisible reCAPTCHA', () => {
    renderWithProvider(<ContactSection />)
    expect(screen.getByTestId('recaptcha')).toBeInTheDocument()
  })

  it('does not call the captcha on render', () => {
    renderWithProvider(<ContactSection />)
    expect(captchaRef.executeAsync).not.toHaveBeenCalled()
  })

  it('does not call the captcha when the form is empty', async () => {
    renderWithProvider(<ContactSection />)
    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }))

    await waitFor(() => {
      expect(captchaRef.executeAsync).not.toHaveBeenCalled()
    })
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('does not call the captcha when the email is invalid', async () => {
    renderWithProvider(<ContactSection />)
    fillValid({ email: 'not-an-email' })
    fireEvent.blur(screen.getByLabelText('Email'))

    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }))

    await waitFor(() => {
      expect(captchaRef.executeAsync).not.toHaveBeenCalled()
    })
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('shows an inline error for an invalid email after blur', () => {
    renderWithProvider(<ContactSection />)
    const email = screen.getByLabelText('Email')
    fireEvent.input(email, { target: { name: 'email', value: 'bad' } })
    fireEvent.blur(email)

    expect(screen.getByRole('alert')).toHaveTextContent(/no es válido/i)
  })

  it('triggers executeAsync exactly once on a valid submission', async () => {
    renderWithProvider(<ContactSection />)
    fillValid()

    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }))

    await waitFor(() => {
      expect(captchaRef.executeAsync).toHaveBeenCalledTimes(1)
    })
  })

  it('passes the captcha token to the email hook as g-recaptcha-response', async () => {
    renderWithProvider(<ContactSection />)
    fillValid()

    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }))

    await waitFor(() => {
      expect(sendEmailMock).toHaveBeenCalledTimes(1)
    })
    const call = sendEmailMock.mock.calls[0][0]
    expect(call.captchaToken).toBe(FAKE_TOKEN)
    expect(call.formData['g-recaptcha-response']).toBe(FAKE_TOKEN)
  })

  it('resets the captcha after a successful submission', async () => {
    renderWithProvider(<ContactSection />)
    fillValid()

    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }))

    await waitFor(() => {
      expect(captchaRef.reset).toHaveBeenCalledTimes(1)
    })
  })

  it('resets the captcha after a failed email send', async () => {
    sendEmailMock.mockReset().mockRejectedValue(new Error('boom'))
    renderWithProvider(<ContactSection />)
    fillValid()

    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }))

    await waitFor(() => {
      expect(captchaRef.reset).toHaveBeenCalledTimes(1)
    })
  })

  it('prevents double-submit while the captcha is in flight', async () => {
    let resolveFirst
    captchaRef.executeAsync.mockImplementationOnce(
      () => new Promise(res => { resolveFirst = res })
    )
    renderWithProvider(<ContactSection />)
    fillValid()

    const submit = screen.getByRole('button', { name: /Enviar/i })
    fireEvent.click(submit)
    fireEvent.click(submit)
    fireEvent.click(submit)

    expect(captchaRef.executeAsync).toHaveBeenCalledTimes(1)
    // Cleanup so the test doesn't hang
    resolveFirst(FAKE_TOKEN)
  })
})
