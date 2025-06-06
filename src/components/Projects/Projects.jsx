import styles from './Projects.module.css'
import { FilterProjects } from '../FilterProjects/FilterProjects.jsx'
import { useIsIconCheckFilter } from '../../Hooks/useIsIconCheckFilter.js'
import { useSortProjects } from '../../Hooks/useSortProjects.js'

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
  const { sortProjects } = useSortProjects()

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
