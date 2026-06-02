import { useState, useCallback } from 'react'
import { useLenis } from 'lenis/react'
import styles from './ProjectsCards.module.css'
import { FilterProjects } from '../FilterProjects/FilterProjects.jsx'
import { useIsIconCheckFilter } from '../../Hooks/useIsIconCheckFilter.js'
import { useSortProjects } from '../../Hooks/useSortProjects.js'
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
  const hasPrimaryCTA = project.demoLink || project.npmLink || project.storybookLink || project.codeLink

  return (
    <article className={styles.project_card}>
      <div className={styles.project_card_overlay} />

      <div className={styles.project_image_container}>
        <img src={project.imgSrc} alt={`Thumbnail of ${project.title}`} />
      </div>

      <div className={styles.projec_text_container}>
        <h3>{project.title}</h3>

        {project.shortDescription && (
          <p className={styles.short_description}>{project.shortDescription}</p>
        )}

        <div className={styles.description_divider} />

        <div className={styles.description_list}>
          {project.description.map((parrafo, index) => {
            return (
              <p key={`${project.id + index}`}>{parrafo}</p>
            )
          })}
        </div>
      </div>

      <div className={styles.project_icons_container}>
        <TechsIcons project={project} />
      </div>

      <nav className={styles.links_container}>
        <div className={styles.action_links_row}>
          {project.demoLink && (
            <a href={project.demoLink} target='_blank' rel='noopener noreferrer'>
              Live Demo
              {socialIcons.demo}
            </a>
          )}
          {project.npmLink && (
            <a href={project.npmLink} target='_blank' rel='noopener noreferrer'>
              npm Package
              {techIcons.npm}
            </a>
          )}
          {project.storybookLink && (
            <a href={project.storybookLink} target='_blank' rel='noopener noreferrer'>
              Storybook
              {techIcons.storybook}
            </a>
          )}
          {project.codeLink && (
            <a className={styles.codeButton} href={project.codeLink} target='_blank' rel='noopener noreferrer'>
              {techIcons.gitHub}
              <span className={styles.link_label}>Code</span>
            </a>
          )}
        </div>

        <div className={styles.cta_row}>
          <Button onClick={() => onShowMore(project)}>
            Ver detalles
          </Button>
        </div>
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
