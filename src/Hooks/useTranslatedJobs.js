import { useMemo } from 'react'
import { jobs } from '../data/jobs.js'
import { useLanguage } from '../i18n/useLanguage.js'

/**
 * Returns the jobs array with text fields overlaid from the active
 * language's translations. Structural data (ids, links, stack, dates,
 * startDate, endDate, current, remote, location, type) stays in the
 * static source — only user-facing text is translated.
 *
 * Each job must have a `contentKey` that maps to `jobsContent.{key}`
 * in the locale files.
 *
 * @returns {import('../data/jobs.js').Job[]}
 */
export function useTranslatedJobs () {
  const { t } = useLanguage()

  return useMemo(() => {
    return jobs.map(job => {
      if (!job.contentKey) return job

      const prefix = `jobsContent.${job.contentKey}`

      return {
        ...job,
        role: t(`${prefix}.role`, job.role),
        period: t(`${prefix}.period`, job.period),
        description: t(`${prefix}.description`, job.description),
        achievements: t(`${prefix}.achievements`, job.achievements),
        tags: t(`${prefix}.tags`, job.tags)
      }
    })
  }, [t])
}
