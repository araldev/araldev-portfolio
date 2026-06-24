import { useLanguage } from '../../i18n/useLanguage.js'
import styles from './JobCard.module.css'

/**
 * JobCardHeader — top of the card.
 *  - Type badge with semantic color and aria-label
 *  - Company (h3) — anchor for aria-labelledby
 *  - Role (h4) — gradient text
 *
 * Note: the beacon is rendered at the top level of the card (JobCard.jsx)
 * so the GSAP pulse can attach to it. This header renders badge + headings.
 *
 * @param {Object} props
 * @param {Object} props.job
 * @param {string} props.id - job.id, used to build stable element IDs
 */
export function JobCardHeader ({ job, id }) {
  const { t } = useLanguage()
  const typeLabel = t(`jobTypes.${job.type}`) || job.type
  const badgeClass = `${styles.job_card_type_badge} ${styles[`job_card_type_badge--${job.type}`] || ''}`

  return (
    <header className={styles.job_card_header}>
      <h3 id={`job-${id}-company`} className={styles.job_card_company}>{job.company}</h3>
      <h4 className={styles.job_card_role}>{job.role}</h4>

      <span className={badgeClass}>
        {typeLabel}
      </span>
    </header>
  )
}
