import { useMemo } from 'react'
import { useTranslatedJobs } from './useTranslatedJobs.js'

/**
 * P4 simplification: filter logic removed per user feedback (filtering
 * JobsCards + page reload caused a visual regression in the layout, see
 * verify-report-p4.md). Jobs are now sorted solely by:
 *   1. `current: true` always wins over `current: false` (R8 of plan.md)
 *   2. `startDate` descending within the same `current` bucket
 *
 * The `useIsIconCheckFilter` import is gone. The hook returns the
 * statically-sorted list with `useMemo` (no re-sort on render, no
 * identity change after mount) — this matters because `useFlipJobs`
 * depends on the array identity; an extra `setSortJobs` on mount
 * would have triggered a phantom FLIP on first paint.
 *
 * @returns {{ sortJobs: Object[] }}
 */
export function useSortJobs () {
  const translatedJobs = useTranslatedJobs()
  const sortJobs = useMemo(() => sortByCurrentAndDate(translatedJobs), [translatedJobs])
  return { sortJobs }
}

function sortByCurrentAndDate (list) {
  return [...list].sort((a, b) => {
    if (a.current && !b.current) return -1
    if (!a.current && b.current) return 1
    return b.startDate.localeCompare(a.startDate)
  })
}
