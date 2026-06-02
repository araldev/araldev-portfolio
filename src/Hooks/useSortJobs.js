import { useEffect, useState } from 'react'
import { useIsIconCheckFilter } from './useIsIconCheckFilter.js'
import { jobs } from '../data/jobs.js'

/**
 * Mirror of useSortProjects. Consumes the same IsIconCheckFilter context
 * (shared between Projects and Jobs — see plan.md DA-02).
 *
 * Logic:
 *  - If no filter is active, return jobs sorted by startDate desc.
 *  - Otherwise, attach `techsCheked` (count of matching active filters) to each job
 *    and sort by it desc, breaking ties by startDate desc.
 *  - `current: true` always wins over `current: false` regardless of startDate
 *    (R8 of plan.md mitigation).
 *
 * @returns {{ sortJobs: Object[] }}
 */
export function useSortJobs () {
  const { isIconCheck } = useIsIconCheckFilter()
  const [sortJobs, setSortJobs] = useState(jobs)

  useEffect(() => {
    setSortJobs(() => {
      const noFilters = Object.values(isIconCheck).every(v => v === false)
      if (noFilters) {
        return sortByCurrentAndDate(jobs).map(j => ({ ...j, techsCheked: 0 }))
      }

      const computed = jobs.map(job => {
        let techsCheked = 0
        for (const [tech, checked] of Object.entries(isIconCheck)) {
          if (checked && job.stack && job.stack[tech]) techsCheked++
        }
        return { ...job, techsCheked }
      })

      computed.sort((a, b) => {
        if (a.current && !b.current) return -1
        if (!a.current && b.current) return 1
        if (a.techsCheked !== b.techsCheked) return b.techsCheked - a.techsCheked
        return b.startDate.localeCompare(a.startDate)
      })

      return computed
    })
  }, [isIconCheck])

  return { sortJobs }
}

function sortByCurrentAndDate (list) {
  return [...list].sort((a, b) => {
    if (a.current && !b.current) return -1
    if (!a.current && b.current) return 1
    return b.startDate.localeCompare(a.startDate)
  })
}
