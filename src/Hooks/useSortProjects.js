import { useEffect, useState } from 'react'
import { useIsIconCheckFilter } from './useIsIconCheckFilter'
import { projects } from '../data/projects'

export function useSortProjects () {
  const { isIconCheck } = useIsIconCheckFilter()
  const [sortProjects, setSortProjects] = useState(projects)

  useEffect(() => {
    setSortProjects(prevState => {
      const totalIndex = prevState.length
      let newState = []
      const indexUsed = []

      if (Object.values(isIconCheck).every(value => value === false)) {
        newState = projects
        return newState
      }

      for (const key in isIconCheck) {
        if (isIconCheck[key]) {
          prevState.forEach((project, index) => {
            if (!project.tech) return null
            if (project?.tech?.[key] && !indexUsed.includes(index)) {
              newState.push(project)
              indexUsed.push(index)
            }
          })
        }
      }

      const indexUnused = Array.from({ length: totalIndex }, (_, i) => i).filter(i => !indexUsed.includes(i))

      indexUnused.forEach(i => {
        newState.push(prevState[i])
      })

      return newState
    })
  }, [isIconCheck])

  return { sortProjects }
}
