import styles from './JobCard.module.css'

/**
 * JobCardDescription — array of <p> paragraphs (FR-002, FR-019).
 * Each paragraph respects --paragraph-max-width: 60ch from the Design System.
 *
 * @param {Object} props
 * @param {string[]} props.description
 */
export function JobCardDescription ({ description }) {
  return (
    <div className={styles.job_card_description}>
      {description.map((paragraph, i) => (
        <p key={i} className={styles.job_card_paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}
