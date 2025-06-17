import styles from './ProjectsCards.module.css'
import { FilterProjects } from '../FilterProjects/FilterProjects.jsx'
import { useIsIconCheckFilter } from '../../Hooks/useIsIconCheckFilter.js'
import { useSortProjects } from '../../Hooks/useSortProjects.js'
import { LinkButton } from '../LinkButton/LinkButton.jsx'

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
    <article className={styles.project_card}>
      <div className={styles.project_image_container}>
        <img src={project.imgSrc} alt={`Thumbnail of ${project.title}`} />
      </div>

      <div className={styles.projec_text_container}>
        <h3>{project.title}</h3>

        <p>{project.description}</p>
      </div>

      <div className={styles.project_icons_container}>
        <TechsIcons project={project} />
      </div>

      <nav className={styles.links_container}>
        <LinkButton href={project.demoLink}>
          Demo
        </LinkButton>
        <LinkButton href={project.codeLink}>
          Code
        </LinkButton>
      </nav>
    </article>
  )
}

export function ProjectsCards () {
  const { sortProjects } = useSortProjects()

  return (
    <section id='projects' className={styles.projects_section}>
      <FilterProjects />

      <div className={styles.projects_cards_container}>
        {
          sortProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        }
      </div>
    </section>
  )
}
