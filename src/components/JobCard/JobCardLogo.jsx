import { useState } from 'react'
import styles from './JobCard.module.css'

/**
 * Compute initials from a company name (EC-005).
 * Takes the first character of each word, max 2.
 *
 * @param {string} company
 * @returns {string} uppercase initials
 */
export function getInitials (company) {
  if (!company) return '?'
  return company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

/**
 * Renders the company logo with a graceful fallback to SVG icon or initials
 * placeholder (EC-005). Priority:
 *   1. companyLogo image (when it loads successfully)
 *   2. companyIcon SVG (when no image URL or image fails)
 *   3. initials placeholder (fallback)
 *
 * The img is decorative (FR-006): alt="" + aria-hidden="true".
 * The company name is the semantic label, provided via the parent <h3>.
 *
 * @param {{ company: string, companyLogo?: string, companyIcon?: React.ReactNode }} props
 */
export function JobCardLogo ({ company, companyLogo, companyIcon }) {
  const [errored, setErrored] = useState(false)
  const showImg = companyLogo && !errored
  const initials = getInitials(company)

  return (
    <div className={styles.job_card_logo_wrapper} aria-hidden='true'>
      {showImg && (
        <img
          className={styles.job_card_logo_img}
          src={companyLogo}
          alt=''
          loading='lazy'
          onError={() => setErrored(true)}
        />
      )}
      {!showImg && companyIcon && (
        <div className={styles.job_card_logo_icon}>
          {companyIcon}
        </div>
      )}
      {!showImg && !companyIcon && (
        <span className={styles.job_card_logo_placeholder}>{initials}</span>
      )}
    </div>
  )
}
