import styles from './AboutMeSection.module.css'
import avatar from '../../assets/perfil_sin_fondo.webp'
import { useLanguage } from '../../i18n/useLanguage.js'

/**
 * Parses a translation string with `[[X]]` markers into a list of
 * React-safe nodes. `[[X]]` becomes <strong>X</strong>. Anything
 * else is plain text. This avoids dangerouslySetInnerHTML (XSS risk)
 * while still letting translators mark emphasis in plain JSON.
 *
 * @param {string} text
 * @returns {Array<{ kind: 'text'|'strong', value: string }>}
 */
function parseEmphasis (text) {
  if (typeof text !== 'string') return []
  // Split keeping the [[X]] tokens. Pattern: any `[[X]]` (non-greedy).
  const parts = text.split(/(\[\[[^\]]+\]\])/g).filter(Boolean)
  return parts.map((part) => {
    const match = part.match(/^\[\[([^\]]+)\]\]$/)
    if (match) return { kind: 'strong', value: match[1] }
    return { kind: 'text', value: part }
  })
}

export function AboutMeSection () {
  const { t } = useLanguage()
  const bio = t('about.bio', [])
  const highlights = t('about.highlights', [])

  return (
    <section id='about-me' className={styles.about_section}>
      <h2 className={styles.section_title}>{t('about.title')}</h2>

      <div className={styles.content_flex}>
        {/* Avatar - sticky on desktop */}
        <div className={styles.avatar_card}>
          <div className={styles.avatar_wrapper}>
            <img src={avatar} alt={t('images.profile')} className={styles.avatar_image} />
          </div>
          <div className={styles.avatar_info}>
            <span className={styles.avatar_name}>Arturo "R2"</span>
            <span className={styles.avatar_tag}>{t('about.tagline')}</span>
          </div>
        </div>

        {/* Bio + Highlights */}
        <div className={styles.bio_column}>
          <div className={styles.bio_card}>
            {Array.isArray(bio) && bio.map((paragraph, i) => {
              const segments = parseEmphasis(paragraph)
              return (
                <p key={i}>
                  {segments.map((seg, j) =>
                    seg.kind === 'strong'
                      ? <strong key={j}>{seg.value}</strong>
                      : <span key={j}>{seg.value}</span>
                  )}
                </p>
              )
            })}
          </div>

          <div className={styles.highlights_grid}>
            {Array.isArray(highlights) && highlights.map((item) => (
              <div key={item.label} className={styles.highlight_card}>
                <span className={styles.highlight_icon}>{item.icon}</span>
                <span className={styles.highlight_label}>{item.label}</span>
                <span className={styles.highlight_desc}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
