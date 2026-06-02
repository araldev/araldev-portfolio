import styles from './JobCard.module.css'

/**
 * JobCardStack — renders each entry of job.stack as a span with the
 * tech-key className so the icon gets the brand color.
 *
 * P4: filter-driven dimming has been removed. The JobsCards section no
 * longer exposes a filter UI (per user feedback: filter+reload caused a
 * visual regression). The `useIsIconCheckFilter` import is gone, and
 * icons render at full opacity unconditionally. The brand-color
 * className (`tech_icon--${key}`) is preserved so the visual identity
 * of each tech icon is unchanged.
 *
 * @param {Object} props
 * @param {Object} props.stack - the Job's stack object { [techKey]: ReactNode }
 * @param {string} props.companyLabel - the job's company name, used to
 *   build a UNIQUE aria-label per card (axe landmark-unique: every <section>
 *   must have a unique accessible name across the page; with 4 cards on
 *   the experience section a static "Technologies used in this role" label
 *   would flag 3 duplicates).
 */
export function JobCardStack ({ stack, companyLabel }) {
  const entries = Object.keys(stack || {})

  if (entries.length === 0) return null

  const labelSuffix = companyLabel ? ` at ${companyLabel}` : ''
  return (
    <section className={styles.job_card_stack} aria-label={`Technologies used in this role${labelSuffix}`}>
      {entries.map(key => {
        const colorClass = styles[`tech_icon--${key}`] || ''
        const className = [styles.tech_icon, colorClass].filter(Boolean).join(' ')
        return (
          <span key={key} className={className}>
            {stack[key]}
          </span>
        )
      })}
    </section>
  )
}
