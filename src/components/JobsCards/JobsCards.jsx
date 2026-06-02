import { useRef } from 'react'
import styles from './JobsCards.module.css'
import { JobCard } from '../JobCard/JobCard.jsx'
import { useSortJobs } from '../../Hooks/useSortJobs.js'
import { useFadeInJobCards } from '../../Hooks/useFadeInJobCards.js'
import { useFlipJobs } from '../../Hooks/useFlipJobs.js'

/**
 * JobsCards — <section id="experience"> wrapper.
 *  - Calls useSortJobs() to sort jobs by current/date (filter UI removed P4
 *    per user feedback: filtering JobsCards + page reload caused visual
 *    regression; the FilterProjects UI now only renders in ProjectsCards)
 *  - useFadeInJobCards + useFlipJobs are both P4 no-ops (kept for JobsCards
 *    import stability) since the entrance + reorder animations are gone
 *  - Renders the empty-state fallback when jobs === [] (EC-006)
 *
 * Placement (DA-06): between Projects and AboutMe. Mounted in App.jsx.
 */
export function JobsCards () {
  const gridRef = useRef(null)
  const { sortJobs } = useSortJobs()

  // Both hooks are P4 no-ops; the gridRef is kept as a local ref in case
  // a future P5 brings back an animation that needs it.
  useFadeInJobCards(gridRef)
  useFlipJobs(gridRef, sortJobs)

  if (!sortJobs || sortJobs.length === 0) {
    return (
      <section
        id='experience'
        className={`${styles.experience_section} ${styles['experience_section--empty']}`}
        aria-labelledby='experience-title'
      >
        <h2 id='experience-title' className={styles.experience_title}>Experience</h2>
        <p role='status' className={styles.experience_empty}>
          No experience entries available.
        </p>
      </section>
    )
  }

  const minThreeClass = sortJobs.length >= 3 ? styles['experience_section--has-min-3'] : ''

  return (
    <section
      id='experience'
      className={`${styles.experience_section} ${minThreeClass}`}
      aria-labelledby='experience-title'
    >
      <h2 id='experience-title' className={styles.experience_title}>
        Experience — A Holo-Log of my Career
      </h2>

      <div className={styles.experience_cards_container} ref={gridRef}>
        {sortJobs.map(job => (
          <JobCard key={job.id} job={job} jobsList={sortJobs} />
        ))}
      </div>
    </section>
  )
}
