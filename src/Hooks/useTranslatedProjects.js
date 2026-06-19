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
 * Translates the `details` array — each item has a `title` and `text`
 * that live at `{prefix}.details[{index}].{field}` in the locale.
 */
function translateDetails (details, prefix, t) {
  if (!Array.isArray(details)) return details

  const translated = t(`${prefix}.details`, null)
  if (Array.isArray(translated) && translated.length === details.length) {
    return translated.map((item, index) => ({
      ...details[index],
      title: item?.title ?? details[index].title,
      text: item?.text ?? details[index].text
    }))
  }

  // Fallback: translate each detail individually
  return details.map((detail, index) => ({
    ...detail,
    title: t(`${prefix}.details.${index}.title`, detail.title),
    text: t(`${prefix}.details.${index}.text`, detail.text)
  }))
}
