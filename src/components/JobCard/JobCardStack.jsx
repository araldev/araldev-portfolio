import { useIsIconCheckFilter } from '../../Hooks/useIsIconCheckFilter.js'
import styles from './JobCard.module.css'

/**
 * JobCardStack — reuses the same pattern as TechsIcons in ProjectsCards.
 * Renders each entry of job.stack as a span; adds the tech-key className
 * when the corresponding filter is active so the icon gets the brand color.
 *
 * @param {Object} props
 * @param {Object} props.stack - the Job's stack object { [techKey]: ReactNode }
 */
export function JobCardStack ({ stack }) {
  const { isIconCheck } = useIsIconCheckFilter()
  const entries = Object.keys(stack || {})

  if (entries.length === 0) return null

  return (
    <div className={styles.job_card_stack} aria-label='Technologies used in this role'>
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
    </div>
  )
}
