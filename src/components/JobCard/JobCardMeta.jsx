import styles from './JobCard.module.css'
import { useJobDuration } from '../../Hooks/useJobDuration.js'
import { useLanguage } from '../../i18n/useLanguage.js'

/**
 * JobCardMeta — meta row under the header.
 *  - <time dateTime="...">{period}</time>  (FR-016)
 *  - Duration badge ("2y 4m")
 *  - Location + remote indicator
 *
 * @param {Object} props
 * @param {Object} props.job
 */
export function JobCardMeta ({ job }) {
  const duration = useJobDuration(job)
  const { t } = useLanguage()

  return (
    <div className={styles.job_card_meta}>
      <time className={styles.job_card_period} dateTime={job.startDate}>
        {job.period}
      </time>
      <span className={styles.job_card_duration}>
        {duration}
      </span>
      <span className={styles.job_card_location}>
        {job.location}
        {job.remote && (
          <span
            className={styles.job_card_remote_dot}
            role='img'
            aria-label={t('job.remote')}
          />
        )}
      </span>
    </div>
  )
}
