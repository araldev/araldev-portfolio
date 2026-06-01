import { useState, useCallback } from 'react'
import { useLenis } from 'lenis/react'
import styles from './ProjectsCards.module.css'
import { FilterProjects } from '../FilterProjects/FilterProjects.jsx'
import { useIsIconCheckFilter } from '../../Hooks/useIsIconCheckFilter.js'
import { useSortProjects } from '../../Hooks/useSortProjects.js'
import { LinkButton } from '../LinkButton/LinkButton.jsx'
import { Button } from '../Button/Button.jsx'
import { ProjectModal } from '../ProjectModal/ProjectModal.jsx'
import { techIcons, socialIcons } from '../../data/icons.js'

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

function ProjectCard ({ project, onShowMore }) {
  return (
    <article className={styles.project_card}>
      <div className={styles.project_card_overlay} />

      <div className={styles.project_image_container}>
        <img src={project.imgSrc} alt={`Thumbnail of ${project.title}`} />
      </div>

      <div className={styles.projec_text_container}>
        <h3>{project.title}</h3>

        <div>
          {project.description.map((parrafo, index) => {
            return (
              <p key={`${project.id + index}`}><small>{parrafo}</small></p>
            )
          })}
        </div>
      </div>

      <div className={styles.project_icons_container}>
        <TechsIcons project={project} />
      </div>

      <nav className={styles.links_container}>
        {project.npmLink && (
          <LinkButton href={project.npmLink}>
            npm package
            {techIcons.npm}
          </LinkButton>
        )}
        {project.storybookLink && (
          <LinkButton href={project.storybookLink}>
            Storybook Live
            {techIcons.storybook}
          </LinkButton>
        )}
        {project.demoLink && (
          <LinkButton href={project.demoLink}>
            Demo
            {socialIcons.demo}
          </LinkButton>
        )}
        {project.codeLink && (
          <LinkButton href={project.codeLink}>
            Code
            {techIcons.gitHub}
          </LinkButton>
        )}
        <Button onClick={() => onShowMore(project)}>
          Mostrar más
        </Button>
      </nav>
    </article>
  )
}

export function ProjectsCards () {
  const { sortProjects } = useSortProjects()
  const lenis = useLenis()
  const [selectedProject, setSelectedProject] = useState(null)

  const openModal = useCallback((project) => {
    if (lenis) lenis.stop()
    setSelectedProject(project)
  }, [lenis])

  const closeModal = useCallback(() => {
    setSelectedProject(null)
    if (lenis) lenis.start()
  }, [lenis])

  return (
    <section id='projects' className={styles.projects_section}>
      <FilterProjects />

      <div className={styles.projects_cards_container}>
        {
          sortProjects.map(project => (
            <ProjectCard key={project.id} project={project} onShowMore={openModal} />
          ))
        }
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={closeModal} />
      )}
    </section>
  )
}
