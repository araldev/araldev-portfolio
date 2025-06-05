import styles from './Projects.module.css'
import { projects } from '../../data/projects.js'
import { FilterProjects } from '../FilterProjects/FilterProjects.jsx'

function TechsIcons ({ project }) {
  return project.tech.map((eachTech, index) => (
    <span key={`${project.id}-${index}`}>
      {eachTech}
    </span>
  ))
}

function ProjectCard ({ project }) {
  return (
    <aside className={styles.project_card}>
      <div className={styles.project_image_container}>
        <img src={project.imgSrc} alt='Thumbnail about my project english-web' />
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
  return (
    <>

      <section id='projects' className={styles.projects_section}>
        <FilterProjects />
        {
          projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        }
      </section>
    </>
  )
}
