import { useRef } from 'react'
import styles from './JobsCards.module.css'
import { JobCard } from '../JobCard/JobCard.jsx'
import { FilterProjects } from '../FilterProjects/FilterProjects.jsx'
import { useSortJobs } from '../../Hooks/useSortJobs.js'
import { useFadeInJobCards } from '../../Hooks/useFadeInJobCards.js'
import { useFlipJobs } from '../../Hooks/useFlipJobs.js'

/**
 * JobsCards — <section id="experience"> wrapper.
 *  - Reuses the existing <FilterProjects /> (DA-02)
 *  - Calls useSortJobs() to mirror the Projects sort/filter flow
 *  - Animates entrance via useFadeInJobCards (stagger)
 *  - Animates reorder via useFlipJobs (FLIP technique, <300ms)
 *  - Renders the empty-state fallback when jobs === [] (EC-006)
 *
 * Placement (DA-06): between Projects and AboutMe. Mounted in App.jsx.
 */
export function JobsCards () {
  const gridRef = useRef(null)
  const { sortJobs } = useSortJobs()

  // Entrance animation: stagger when section enters the viewport
  useFadeInJobCards(gridRef)
  // Reorder animation: when sortJobs identity changes
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

      <FilterProjects />

      <div className={styles.experience_cards_container} ref={gridRef}>
        {sortJobs.map(job => (
          <JobCard key={job.id} job={job} jobsList={sortJobs} />
        ))}
      </div>
    </section>
  )
}
