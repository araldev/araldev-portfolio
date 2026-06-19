import { useEffect } from 'react'
import { useLanguage } from '../i18n/useLanguage.js'

/**
 * Updates the document <title> and <meta> tags for SEO when the
 * language changes. Reads SEO values from the active locale.
 *
 * Also sets <html lang="…"> dynamically so screen‑readers and
 * search engines see the correct language.
 */
export function useDocumentHead () {
  const { t } = useLanguage()

  useEffect(() => {
    const title = t('seo.title')
    const description = t('seo.description')
    const ogTitle = t('seo.ogTitle')
    const ogDescription = t('seo.ogDescription')

    document.title = title

    const setMeta = (name, content, property = false) => {
      const attr = property ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description)
    setMeta('og:title', ogTitle, true)
    setMeta('og:description', ogDescription, true)
    setMeta('og:type', 'website', true)
  }, [t])
}
