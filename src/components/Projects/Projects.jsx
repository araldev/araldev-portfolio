import styles from './Projects.module.css'

export function Projects () {
  return (
    <>
      <section id='projects' className={styles.projects_section}>
        <aside className={styles.project_card}>
          <div>
            <img src={`${import.meta.env.BASE_URL}/images/shot-english-web.webp`} alt='Thumbnail about my project english-web' />
          </div>
          <h2>English Web</h2>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem ea iusto sed nemo asperiores quas officia atque maxime odit, saepe facilis perferendis ut quaerat inventore! Itaque dolores maxime repellendus eaque.</p>
        </aside>

        <aside className={styles.project_card}>
          <div>
            <img src={`${import.meta.env.BASE_URL}/images/shot-english-web.webp`} alt='Thumbnail about my project english-web' />
          </div>
          <h2>English Web</h2>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem ea iusto sed nemo asperiores quas officia atque maxime odit, saepe facilis perferendis ut quaerat inventore! Itaque dolores maxime repellendus eaque.</p>
        </aside>

        <aside className={styles.project_card}>
          <div>
            <img src={`${import.meta.env.BASE_URL}/images/shot-english-web.webp`} alt='Thumbnail about my project english-web' />
          </div>
          <h2>English Web</h2>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem ea iusto sed nemo asperiores quas officia atque maxime odit, saepe facilis perferendis ut quaerat inventore! Itaque dolores maxime repellendus eaque.</p>
        </aside>
      </section>
    </>
  )
}
