import styles from './Projects.module.css'
import { projects } from '../../data/projects.js'
import { FilterProjects } from '../FilterProjects/FilterProjects.jsx'
import { useIsIconCheckFilter } from '../../Hooks/useIsIconCheckFilter.js'
import { useEffect, useState } from 'react'

function TechsIcons ({ project }) {
  const { isIconCheck } = useIsIconCheckFilter()
  const techIcons = []

  for (const key in project.tech) {
    const className = isIconCheck[key] ? styles[key] : ''
    techIcons.push(
      <span key={`${project.id}-${key}`} className={className}>
        {project.tech[key]}
      </span>
    )
  }

  return <>{techIcons}</>
}

function ProjectCard ({ project }) {
  return (
    <aside className={styles.project_card}>
      <div className={styles.project_image_container}>
        <img src={project.imgSrc} alt={`Thumbnail of ${project.title}`} />
      </div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>

      <div className={styles.project_icons_container}>
        <TechsIcons project={project} />
      </div>
    </aside>
  )
}

export function Projects () {
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

  return (
    <section id='projects' className={styles.projects_section}>

      <FilterProjects />

      {
          sortProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        }

    </section>
  )
}
