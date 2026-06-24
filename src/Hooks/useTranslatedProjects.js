import { useMemo } from 'react'
import { projects } from '../data/projects.js'
import { useLanguage } from '../i18n/useLanguage.js'

/**
 * Returns the projects array with text fields overlaid from the active
 * language's translations. Structural data (ids, links, tech, imgSrc,
 * tags for filtering, demoLink, etc.) stays in the static source —
 * only user-facing text is translated.
 *
 * Each project must have a `contentKey` that maps to
 * `projectsContent.{key}` in the locale files.
 *
 * @returns {import('../data/projects.js').Project[]}
 */
export function useTranslatedProjects () {
  const { t } = useLanguage()

  return useMemo(() => {
    return projects.map(project => {
      if (!project.contentKey) return project

      const prefix = `projectsContent.${project.contentKey}`

      return {
        ...project,
        shortDescription: t(`${prefix}.shortDescription`, project.shortDescription),
        description: t(`${prefix}.description`, project.description),
        details: translateDetails(project.details, prefix, t)
      }
    })
  }, [t])
}

/**
 * Returns the details array from locale files.
 * Locale files are the single source of truth for all project details.
 */
function translateDetails (details, prefix, t) {
  // Get details directly from locale files (source of truth)
  const translated = t(`${prefix}.details`, null)
  if (Array.isArray(translated)) {
    return translated
  }
  // Fallback to projects.js details if locale fails (backward compatibility)
  return details
}
