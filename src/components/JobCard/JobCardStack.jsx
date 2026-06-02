import { useIsIconCheckFilter } from '../../Hooks/useIsIconCheckFilter.js'
import styles from './JobCard.module.css'

/**
 * JobCardStack — reuses the same pattern as TechsIcons in ProjectsCards.
 * Renders each entry of job.stack as a span; adds the tech-key className
 * when the corresponding filter is active so the icon gets the brand color.
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
  const { isIconCheck } = useIsIconCheckFilter()
  const entries = Object.keys(stack || {})

  if (entries.length === 0) return null

  const labelSuffix = companyLabel ? ` at ${companyLabel}` : ''
  return (
    <section className={styles.job_card_stack} aria-label={`Technologies used in this role${labelSuffix}`}>
      {entries.map(key => {
        const isActive = isIconCheck[key]
        const colorClass = styles[`tech_icon--${key}`] || ''
        const dimClass = Object.values(isIconCheck).some(v => v) && !isActive
          ? styles.job_card_stack_dim
          : ''
        const className = [styles.tech_icon, colorClass, dimClass].filter(Boolean).join(' ')
        return (
          <span key={key} className={className}>
            {stack[key]}
          </span>
        )
      })}
    </section>
  )
}
