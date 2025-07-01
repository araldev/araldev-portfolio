import styles from './AboutMeSection.module.css'
import avatar from '../../assets/yo-sin-fondo-M.webp'
import brand from '../../assets/brand-araldev.webp'

export function AboutMeSection () {
  return (
    <section id='about-me' className={styles.about_me_container}>
      <h2>About Me</h2>

      <aside className={styles.grid_container}>
        <img className={styles.avatar_image} src={avatar} alt={'Arturo\'s photo'} />
        <img className={styles.brand_image} src={brand} alt='Araldev Brand' />
        <div className={styles.text_container}>
          <p>Mi nombre es Arturo, aunque muchos me conocen como R2. Estudié TSAFAD, pero tras varios años dedicándome a ello, decidí dar un giro hacia el sector tecnológico —otra de mis grandes pasiones— impulsado por mi interés en crear, construir y resolver.</p>
          <p>Desde pequeño he estado en contacto con ordenadores, aunque no fue hasta 2022 cuando comencé a adentrarme en el mundo de la programación. En enero de 2025, tomé la decisión de formarme de manera seria y estructurada. Desde entonces, he desarrollado múltiples proyectos y tengo otros tantos en mente que me gustaría llevar a cabo y monetizar.</p>
          <p>Me considero una persona autodidacta; aprender por mi cuenta ha sido una constante en mi vida y eso me ha convertido en alguien resolutivo, independiente y siempre en busca de nuevas soluciones.</p>
          <p>Además, soy una persona muy activa y deportista. Mantenerme en forma no solo me ayuda a estar bien físicamente, sino que también potencia mi enfoque, energía y claridad mental para afrontar cualquier desafío.</p>
        </div>

      </aside>
    </section>
  )
}
