import styles from './Footer.module.css'
import { socialIcons } from '../../data/icons'
import brand from '../../assets/brand-araldev.webp'
import { useNavPaths } from '../../Hooks/useNavPaths'

export function Footer () {
  const { handleClick } = useNavPaths({})

  return (
    <footer className={styles.footer_container}>
      <div className={styles.footer_content}>
        <section className={styles.contact_container}>

          <h3>Contact</h3>

          <ul>
            <li>
              <a href='https://www.linkedin.com/in/araldev/' target='_blank' rel='noopener noreferrer'>
                {socialIcons.linkedin}
                <h5>Linkedin</h5>
                <small>Arturo Alba García</small>
              </a>
            </li>

            <li>
              <a href='mailto:arturo.r2d2.dev@gmail.com' target='_blank' rel='noopener noreferrer'>
                {socialIcons.gmail}
                <h5>Email</h5>
                <small>arturo.r2d2.dev@gmail.com</small>
              </a>
            </li>

            <li>
              <a href='https://github.com/araldev' target='_blank' rel='noopener noreferrer'>
                {socialIcons.gitHub}
                <h5>GitHub</h5>
                <small>Araldev</small>
              </a>
            </li>

            <li>
              <a href='https://discord.gg/jeTvBNjp' target='_blank' rel='noopener noreferrer'>
                {socialIcons.discord}
                <h5>Discord</h5>
                <small>araldev</small>
              </a>
            </li>
          </ul>
        </section>

        <section className={styles.links_container}>

          <h3>Links</h3>

          <ul>
            <li><a data-id='home' onClick={handleClick}>Home</a></li>
            <li><a data-id='projects' onClick={handleClick}>Projects</a></li>
            <li><a data-id='about-me' onClick={handleClick}>About me</a></li>
            <li><a data-id='contact' onClick={handleClick}>Contact</a></li>
          </ul>

        </section>

        <form className={styles.form} action=''>
          <label className={styles.form_label}>
            <input type='text' />
          </label>
          <button type='submit'>Send</button>
        </form>
      </div>

      <div className={styles.brand}>
        <img src={brand} alt='Brand Araldev' />
      </div>
    </footer>
  )
}
