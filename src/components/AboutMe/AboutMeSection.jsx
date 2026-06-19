import styles from './AboutMeSection.module.css'
import avatar from '../../assets/perfil_sin_fondo.webp'

const highlights = [
  { icon: '🎓', label: 'Autodidacta', desc: 'Aprendizaje continuo' },
  { icon: '💡', label: 'Problem Solver', desc: 'Enfoque resolutivo' },
  { icon: '🏋️', label: 'Atleta', desc: 'Equilibrio mente-cuerpo' },
  { icon: '🚀', label: 'Full-Stack', desc: 'MERN + más' },
  { icon: '🎯', label: 'Enfoque', desc: 'Claridad mental' },
  { icon: '⚡', label: 'Proactividad', desc: 'Iniciativa constante' },
]

export function AboutMeSection () {
  return (
    <section id='about-me' className={styles.about_section}>
      <h2 className={styles.section_title}>About Me</h2>

      <div className={styles.content_flex}>
        {/* Avatar - sticky on desktop */}
        <div className={styles.avatar_card}>
          <div className={styles.avatar_wrapper}>
            <img src={avatar} alt="Arturo's photo" className={styles.avatar_image} />
          </div>
          <div className={styles.avatar_info}>
            <span className={styles.avatar_name}>Arturo "R2"</span>
            <span className={styles.avatar_tag}>Full-Stack Developer</span>
          </div>
        </div>

        {/* Bio + Highlights */}
        <div className={styles.bio_column}>
          <div className={styles.bio_card}>
            <p>
              Mi nombre es Arturo, aunque muchos me conocen como <strong>R2</strong>.
              Estudié TSAFAD, pero tras varios años dedicándome a ello, decidí dar un giro
              hacia el sector tecnológico —otra de mis grandes pasiones— impulsado por mi
              interés en crear, construir y resolver.
            </p>
            <p>
              Desde pequeño he estado en contacto con ordenadores, aunque no fue hasta 2022
              cuando comencé a adentrarme en el mundo de la programación. En enero de 2025,
              tomé la decisión de formarme de manera seria y estructurada. Desde entonces,
              he desarrollado múltiples proyectos y tengo otros tantos en mente que me
              gustaría llevar a cabo y monetizar.
            </p>
            <p>
              Me considero una persona <strong>autodidacta</strong>; aprender por mi cuenta
              ha sido una constante en mi vida y eso me ha convertido en alguien resolutivo,
              independiente y siempre en busca de nuevas soluciones.
            </p>
          </div>

          <div className={styles.highlights_grid}>
            {highlights.map((item) => (
              <div key={item.label} className={styles.highlight_card}>
                <span className={styles.highlight_icon}>{item.icon}</span>
                <span className={styles.highlight_label}>{item.label}</span>
                <span className={styles.highlight_desc}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
