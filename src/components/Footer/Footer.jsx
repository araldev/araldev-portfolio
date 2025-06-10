import styles from './Footer.module.css'
import { socialIcons } from '../../data/icons'
import brand from '../../assets/brand-araldev.webp'

export function Footer () {
  return (
    <footer className={styles.footer_container}>
      <div className={styles.footer_content}>
        <section className={styles.contact_container}>

          <h3>Contact</h3>

          <ul>
            <li>
              {socialIcons.linkedin}
              <h5>Linkedin</h5>
              <small>Arturo Alba García</small>
            </li>

            <li>
              {socialIcons.gmail}
              <h5>Email</h5>
              <small>arturo.r2d2.dev@gmail.com</small>
            </li>

            <li>
              {socialIcons.gitHub}
              <h5>GitHub</h5>
              <small>Araldev</small>
            </li>

            <li>
              {socialIcons.discord}
              <h5>Discord</h5>
              <small>araldev</small>
            </li>
          </ul>
        </section>

        <section className={styles.links_container}>

          <h3>Links</h3>

          <ul>
            <li><a href=''>Home</a></li>
            <li><a href=''>Projects</a></li>
            <li><a href=''>About me</a></li>
            <li><a href=''>Contact</a></li>
          </ul>

          <form className={styles.form} action=''>
            <input type='text' />
            <button type='submit'>Enviar</button>
          </form>
        </section>
      </div>

      <div className={styles.brand}>
        <img src={brand} alt='Brand Araldev' />
      </div>
    </footer>
  )
}
