import styles from './JobCard.module.css'
import { LinkButton } from '../LinkButton/LinkButton.jsx'

/**
 * JobCardFooter — tags (pills) + LinkButtons + optional expand trigger.
 *
 * @param {Object} props
 * @param {Object} props.job
 * @param {string} props.id - job.id
 * @param {boolean} props.isExpanded
 * @param {() => void} props.onToggleExpand
 * @param {React.RefObject<HTMLButtonElement>} props.expandTriggerRef
 * @param {string} props.expandLabel
 * @param {string} props.collapseLabel
 */
export function JobCardFooter ({
  job,
  id,
  isExpanded,
  onToggleExpand,
  expandTriggerRef,
  expandLabel = 'See more',
  collapseLabel = 'See less'
}) {
  // `expandLabel`/`collapseLabel` defaults are kept as a defensive
  // fallback so the component is safe to render in isolation
  // (Storybook, tests). The default render path always supplies
  // real labels from JobCard using t('experience.seeMore/seeLess').
  const hasAchievements = job.achievements && job.achievements.length > 0
  const achievementsId = `job-${id}-achievements`

  return (
    <footer className={styles.job_card_footer}>
      {job.tags && job.tags.length > 0 && (
        <section className={styles.job_card_tags} aria-label={`Tags for ${job.company}`}>
          {job.tags.map((t, i) => (
            <span key={i} className={styles.job_card_tag_pill}>{t}</span>
          ))}
        </section>
      )}

      {job.links && (job.links.companyLink || job.links.projectLink || job.links.referenceLink) && (
        <nav className={styles.job_card_links} aria-label={`External references for ${job.company}`}>
          {job.links.companyLink && (
            <LinkButton href={job.links.companyLink}>Company ↗</LinkButton>
          )}
          {job.links.projectLink && (
            <LinkButton href={job.links.projectLink}>Project ↗</LinkButton>
          )}
          {job.links.referenceLink && (
            <LinkButton href={job.links.referenceLink}>Reference ↗</LinkButton>
          )}
        </nav>
      )}

      {hasAchievements && (
        <button
          ref={expandTriggerRef}
          type='button'
          className={styles.job_card_expand_trigger}
          aria-expanded={isExpanded}
          aria-controls={achievementsId}
          onClick={onToggleExpand}
        >
          <span className={styles.job_card_expand_label}>
            {isExpanded ? collapseLabel : expandLabel}
          </span>
          <span
            className={styles.job_card_expand_icon}
            data-expanded={isExpanded}
            aria-hidden='true'
          >
            {isExpanded ? '▴' : '▾'}
          </span>
        </button>
      )}
    </footer>
  )
}
