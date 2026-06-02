import { useState, useRef, useCallback, useMemo } from 'react'
import styles from './JobCard.module.css'
import { JobCardLogo } from './JobCardLogo.jsx'
import { JobCardHeader } from './JobCardHeader.jsx'
import { JobCardMeta } from './JobCardMeta.jsx'
import { JobCardDescription } from './JobCardDescription.jsx'
import { JobCardStack } from './JobCardStack.jsx'
import { JobCardAchievements } from './JobCardAchievements.jsx'
import { JobCardFooter } from './JobCardFooter.jsx'
import { useBeaconPulse } from '../../Hooks/useBeaconPulse.js'
import { useIsFeaturedJob } from '../../Hooks/useIsFeaturedJob.js'

/**
 * JobCard — composed card representing one professional position.
 *
 * Composes:
 *  - JobCardLogo    (logo with onError → initials placeholder, EC-005)
 *  - JobCardHeader  (type badge, company h3, role h4, beacon if current)
 *  - JobCardMeta    (<time>, duration, location, remote)
 *  - JobCardDescription
 *  - JobCardStack   (tech icons, dimmed on filter mismatch)
 *  - JobCardAchievements (disclosure, DA-05)
 *  - JobCardFooter  (tags, links, expand trigger)
 *
 * ARIA (FR-001, FR-014, FR-016):
 *  - <article role="article" aria-labelledby="job-{id}-company">
 *  - <time dateTime="..."> for the period
 *  - aria-expanded + aria-controls on the expand trigger
 *
 * @param {Object} props
 * @param {Object} props.job - Job entity from src/data/jobs.js
 * @param {Object[]} props.jobsList - the full sorted list, for featured detection
 * @param {string} [props.expandLabel] - i18n: text when collapsed (default 'See more')
 * @param {string} [props.collapseLabel] - i18n: text when expanded (default 'See less')
 */
export function JobCard ({
  job,
  jobsList,
  expandLabel = 'See more',
  collapseLabel = 'See less'
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const expandTriggerRef = useRef(null)
  const beaconRef = useRef(null)

  const isFeatured = useIsFeaturedJob(job, jobsList)
  const hasAchievements = useMemo(
    () => Boolean(job.achievements && job.achievements.length > 0),
    [job.achievements]
  )

  // Pulse only for featured cards
  useBeaconPulse(beaconRef)

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  const achievementsId = `job-${job.id}-achievements`
  const companyHeadingId = `job-${job.id}-company`

  return (
    <article
      className={styles.job_card}
      data-job-card='true'
      data-current={String(job.current)}
      data-featured={String(isFeatured)}
      data-type={job.type}
      aria-labelledby={companyHeadingId}
    >
      <div className={styles.job_card_surface}>
        <div className={styles.job_card_top}>
          <JobCardLogo company={job.company} companyLogo={job.companyLogo} />
          <div className={styles.job_card_top_text}>
            <JobCardHeader job={job} id={job.id} />
          </div>
          {job.current && (
            <span
              ref={beaconRef}
              className={styles.job_card_beacon}
              role='img'
              aria-label='Currently active position'
            >
              <span className={styles.job_card_beacon_core} data-beacon-core='true' />
              <span className={styles.job_card_beacon_halo} data-beacon-halo='true' />
            </span>
          )}
        </div>

        <div className={styles.job_card_divider} aria-hidden='true' />

        <JobCardMeta job={job} />

        <div className={styles.job_card_divider} aria-hidden='true' />

        <JobCardDescription description={job.description} />

        {hasAchievements && (
          <>
            <div className={styles.job_card_divider} aria-hidden='true' />
            <JobCardAchievements
              achievements={job.achievements}
              isExpanded={isExpanded}
              achievementsId={achievementsId}
              triggerRef={expandTriggerRef}
              onToggleExpand={toggleExpand}
            />
          </>
        )}

        {Object.keys(job.stack || {}).length > 0 && (
          <>
            <div className={styles.job_card_divider} aria-hidden='true' />
            <JobCardStack stack={job.stack} companyLabel={job.company} />
          </>
        )}

        <div className={styles.job_card_divider} aria-hidden='true' />

        <JobCardFooter
          job={job}
          id={job.id}
          isExpanded={isExpanded}
          onToggleExpand={toggleExpand}
          expandTriggerRef={expandTriggerRef}
          expandLabel={expandLabel}
          collapseLabel={collapseLabel}
        />
      </div>
    </article>
  )
}
