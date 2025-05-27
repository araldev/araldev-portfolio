import styles from './Header.module.css'

export function HeroSection () {
  return (
    <header className={styles.container_header}>
      <aside className={styles.hero_section}>
        <h1 className={styles.title_hero}>Arturo Alba García</h1>
        <h2 className={styles.subTitle_hero}>Frontend Developer</h2>
        <p className={styles.paragraph_hero}>Focused on crafting modern, visually engaging, and animated web experiences.</p>
        <a className={styles.button_cv} href='../public/cv-araldev.pdf' download>
          Descargar CV
        </a>
      </aside>
    </header>
  )
}
