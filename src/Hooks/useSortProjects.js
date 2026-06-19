import { useEffect, useState } from 'react'
import { useIsIconCheckFilter } from './useIsIconCheckFilter'
import { useTranslatedProjects } from './useTranslatedProjects.js'

export function useSortProjects () {
  const { isIconCheck } = useIsIconCheckFilter()
  const translatedProjects = useTranslatedProjects()
  const [sortProjects, setSortProjects] = useState(translatedProjects)

  useEffect(() => {
    setSortProjects(() => {
    // Si no hay filtros activos, devolver proyectos originales
      if (Object.values(isIconCheck).every(value => value === false)) {
        return translatedProjects.map(project => ({ ...project, techsCheked: 0 }))
      }

      // Crear nuevos proyectos y calcular techsCheked desde cero
      const newProjects = translatedProjects.map(project => {
        let techsCheked = 0

        // Contar cuántas tecnologías seleccionadas tiene este proyecto
        Object.entries(isIconCheck).forEach(([tech, isChecked]) => {
          if (isChecked && project.tech[tech]) {
            techsCheked++
          }
        })

        return {
          ...project,
          techsCheked
        }
      })

      // Ordenar por techsCheked (mayor a menor)
      newProjects.sort((a, b) => b.techsCheked - a.techsCheked)

      return newProjects
    })
  }, [isIconCheck, translatedProjects])

  return { sortProjects }
}
