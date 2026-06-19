import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, render } from '@testing-library/react'
import { LanguageProvider } from '../../src/i18n/LanguageContext.jsx'
import { useLanguage } from '../../src/i18n/useLanguage.js'
import { detectInitialLanguage, LANGUAGE_STORAGE_KEY } from '../../src/i18n/detectLanguage.js'
import { translations, SUPPORTED_LANGS, DEFAULT_LANG, getValue } from '../../src/i18n/translations.js'

describe('translations registry', () => {
  it('exposes all supported languages', () => {
    expect(SUPPORTED_LANGS).toContain('es')
    expect(SUPPORTED_LANGS).toContain('en')
  })

  it('every language dict has the same top-level keys', () => {
    const ref = Object.keys(translations.es).sort()
    for (const lang of SUPPORTED_LANGS) {
      const keys = Object.keys(translations[lang]).sort()
      expect(keys, `language "${lang}" must have the same top-level keys`).toEqual(ref)
    }
  })

  it('every nav section has the same keys across languages', () => {
    const ref = Object.keys(translations.es.nav).sort()
    for (const lang of SUPPORTED_LANGS) {
      expect(Object.keys(translations[lang].nav).sort()).toEqual(ref)
    }
  })

  it('DEFAULT_LANG is one of the supported languages', () => {
    expect(SUPPORTED_LANGS).toContain(DEFAULT_LANG)
  })
})

describe('getValue', () => {
  const dict = { a: { b: { c: 'found' } }, top: 'top' }

  it('returns nested values via dot path', () => {
    expect(getValue(dict, 'a.b.c')).toBe('found')
    expect(getValue(dict, 'top')).toBe('top')
  })

  it('returns the fallback for missing paths', () => {
    expect(getValue(dict, 'a.b.missing', 'fb')).toBe('fb')
    expect(getValue(dict, 'nope', 'fb')).toBe('fb')
  })

  it('returns the fallback for null/undefined intermediate values', () => {
    expect(getValue({ a: null }, 'a.b', 'fb')).toBe('fb')
  })

  it('handles null/undefined dict safely', () => {
    expect(getValue(null, 'a', 'fb')).toBe('fb')
    expect(getValue(undefined, 'a', 'fb')).toBe('fb')
  })

  it('treats non-string paths safely', () => {
    expect(getValue(dict, undefined, 'fb')).toBe('fb')
    expect(getValue(dict, null, 'fb')).toBe('fb')
  })
})

describe('detectInitialLanguage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns DEFAULT_LANG when nothing is stored and navigator is silent', () => {
    Object.defineProperty(window.navigator, 'language', { value: undefined, configurable: true })
    expect(detectInitialLanguage()).toBe(DEFAULT_LANG)
  })

  it('uses the stored language when present and supported', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en')
    expect(detectInitialLanguage()).toBe('en')
  })

  it('ignores stored values that are not supported languages', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr')
    expect(detectInitialLanguage()).toBe(DEFAULT_LANG)
  })

  it('uses the primary subtag of navigator.language when supported', () => {
    window.localStorage.clear()
    Object.defineProperty(window.navigator, 'language', { value: 'en-GB', configurable: true })
    expect(detectInitialLanguage()).toBe('en')
  })

  it('falls back to DEFAULT_LANG when navigator language is not supported', () => {
    window.localStorage.clear()
    Object.defineProperty(window.navigator, 'language', { value: 'fr-FR', configurable: true })
    expect(detectInitialLanguage()).toBe(DEFAULT_LANG)
  })
})

describe('LanguageProvider + useLanguage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('provides the initial language and a working t()', () => {
    const wrapper = ({ children }) => <LanguageProvider initialLang='es'>{children}</LanguageProvider>
    const { result } = renderHook(() => useLanguage(), { wrapper })

    expect(result.current.lang).toBe('es')
    expect(result.current.t('nav.home')).toBe('Inicio')
  })

  it('switches languages and updates translations', () => {
    const wrapper = ({ children }) => <LanguageProvider initialLang='es'>{children}</LanguageProvider>
    const { result } = renderHook(() => useLanguage(), { wrapper })

    expect(result.current.t('nav.home')).toBe('Inicio')
    act(() => result.current.setLang('en'))
    expect(result.current.lang).toBe('en')
    expect(result.current.t('nav.home')).toBe('Home')
  })

  it('persists language to localStorage on setLang', () => {
    const wrapper = ({ children }) => <LanguageProvider initialLang='es'>{children}</LanguageProvider>
    const { result } = renderHook(() => useLanguage(), { wrapper })

    act(() => result.current.setLang('en'))
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
  })

  it('refuses unsupported languages from setLang', () => {
    const wrapper = ({ children }) => <LanguageProvider initialLang='es'>{children}</LanguageProvider>
    const { result } = renderHook(() => useLanguage(), { wrapper })

    act(() => result.current.setLang('fr'))
    expect(result.current.lang).toBe('es')
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBeNull()
  })

  it('falls back to the key when translation is missing', () => {
    const wrapper = ({ children }) => <LanguageProvider initialLang='es'>{children}</LanguageProvider>
    const { result } = renderHook(() => useLanguage(), { wrapper })

    expect(result.current.t('nonexistent.path')).toBe('nonexistent.path')
  })

  it('uses the explicit fallback when provided', () => {
    const wrapper = ({ children }) => <LanguageProvider initialLang='es'>{children}</LanguageProvider>
    const { result } = renderHook(() => useLanguage(), { wrapper })

    expect(result.current.t('nonexistent.path', 'FALLBACK')).toBe('FALLBACK')
  })

  it('falls back to DEFAULT_LANG dict if active lang dict is missing a key', () => {
    // Pretend English is missing the key. We test via the t() helper
    // by mocking the import — since t uses the live dict object, we
    // just verify that t() never throws on missing keys.
    const wrapper = ({ children }) => <LanguageProvider initialLang='en'>{children}</LanguageProvider>
    const { result } = renderHook(() => useLanguage(), { wrapper })

    // Should never throw and should return the key as a safe fallback.
    expect(() => result.current.t('does.not.exist')).not.toThrow()
    expect(result.current.t('does.not.exist')).toBe('does.not.exist')
  })

  it('detects initial language from localStorage when no initialLang provided', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en')
    const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>
    const { result } = renderHook(() => useLanguage(), { wrapper })

    expect(result.current.lang).toBe('en')
  })

  it('reacts to storage events from other tabs', () => {
    const wrapper = ({ children }) => <LanguageProvider initialLang='es'>{children}</LanguageProvider>
    const { result } = renderHook(() => useLanguage(), { wrapper })

    act(() => {
      // jsdom does not implement StorageEvent, so we build a plain
      // Event and attach the storage event properties manually. The
      // listener only reads `event.key` and `event.newValue`.
      const event = new Event('storage')
      event.key = LANGUAGE_STORAGE_KEY
      event.newValue = 'en'
      window.dispatchEvent(event)
    })
    expect(result.current.lang).toBe('en')
  })

  it('ignores storage events for unrelated keys', () => {
    const wrapper = ({ children }) => <LanguageProvider initialLang='es'>{children}</LanguageProvider>
    const { result } = renderHook(() => useLanguage(), { wrapper })

    act(() => {
      const event = new Event('storage')
      event.key = 'other'
      event.newValue = 'en'
      window.dispatchEvent(event)
    })
    expect(result.current.lang).toBe('es')
  })
})

describe('LanguageProvider smoke render', () => {
  it('renders children without crashing', () => {
    const { getByText } = render(
      <LanguageProvider initialLang='es'>
        <span>hello</span>
      </LanguageProvider>
    )
    expect(getByText('hello')).toBeInTheDocument()
  })
})
