/**
 * Pure helper: given a list of jobs, return the index of the featured one
 * (`current: true`, most recent `startDate`). Returns -1 if none.
 *
 * @param {Object[]} jobsList
 * @returns {number} index of featured job, or -1
 */
export function findFeaturedIndex (jobsList) {
  if (!Array.isArray(jobsList) || jobsList.length === 0) return -1

  let featuredIdx = -1
  let bestDate = ''

  for (let i = 0; i < jobsList.length; i++) {
    const j = jobsList[i]
    if (j && j.current && j.startDate > bestDate) {
      bestDate = j.startDate
      featuredIdx = i
    }
  }

  return featuredIdx
}

/**
 * React hook wrapper: returns true if the given job is the featured one in the list.
 * @param {Object} job
 * @param {Object[]} jobsList
 * @returns {boolean}
 */
export function useIsFeaturedJob (job, jobsList) {
  if (!job || !Array.isArray(jobsList)) return false
  const idx = jobsList.findIndex(j => j && j.id === job.id)
  if (idx === -1) return false
  return findFeaturedIndex(jobsList) === idx
}
