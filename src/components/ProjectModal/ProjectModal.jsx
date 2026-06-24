import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import styles from './ProjectModal.module.css'
import { mockDetailImages } from '../../data/projects.js'
import { useLanguage } from '../../i18n/useLanguage.js'

const patterns = {
  grid: (color) => (
    <svg viewBox='0 0 100 100' className={styles.mock_pattern_svg}>
      <defs>
        <pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
          <path d='M 20 0 L 0 0 0 20' fill='none' stroke={color} strokeWidth='0.5' opacity='0.3' />
        </pattern>
      </defs>
      <rect width='100' height='100' fill='url(#grid)' />
    </svg>
  ),
  dots: (color) => (
    <svg viewBox='0 0 100 100' className={styles.mock_pattern_svg}>
      <defs>
        <pattern id='dots' width='16' height='16' patternUnits='userSpaceOnUse'>
          <circle cx='8' cy='8' r='2' fill={color} opacity='0.3' />
        </pattern>
      </defs>
      <rect width='100' height='100' fill='url(#dots)' />
    </svg>
  ),
  waves: (color) => (
    <svg viewBox='0 0 200 100' className={styles.mock_pattern_svg} preserveAspectRatio='none'>
      <path d='M0 80 Q 50 20, 100 80 T 200 80' fill='none' stroke={color} strokeWidth='2' opacity='0.3' />
      <path d='M0 70 Q 50 10, 100 70 T 200 70' fill='none' stroke={color} strokeWidth='2' opacity='0.15' />
    </svg>
  ),
  circles: (color) => (
    <svg viewBox='0 0 100 100' className={styles.mock_pattern_svg}>
      <circle cx='20' cy='20' r='15' fill='none' stroke={color} strokeWidth='1' opacity='0.2' />
      <circle cx='70' cy='30' r='10' fill='none' stroke={color} strokeWidth='1' opacity='0.15' />
      <circle cx='40' cy='70' r='18' fill='none' stroke={color} strokeWidth='1' opacity='0.2' />
      <circle cx='85' cy='80' r='8' fill='none' stroke={color} strokeWidth='1' opacity='0.15' />
    </svg>
  ),
  diagonal: (color) => (
    <svg viewBox='0 0 100 100' className={styles.mock_pattern_svg}>
      <defs>
        <pattern id='diag' width='14' height='14' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'>
          <line x1='0' y1='0' x2='0' y2='14' stroke={color} strokeWidth='1' opacity='0.25' />
        </pattern>
      </defs>
      <rect width='100' height='100' fill='url(#diag)' />
    </svg>
  )
}

function MockImage ({ imgIndex }) {
  const mock = mockDetailImages[imgIndex % mockDetailImages.length]
  const PatternComponent = patterns[mock.pattern]
  return (
    <div
      className={styles.mock_image}
      style={{ background: mock.gradient }}
    >
      <div className={styles.mock_overlay} />
      <div className={styles.mock_content}>
        <div className={styles.mock_bar} style={{ width: '60%' }} />
        <div className={styles.mock_bar} style={{ width: '80%' }} />
        <div className={styles.mock_bar} style={{ width: '40%' }} />
        <div className={styles.mock_circle_row}>
          <div className={styles.mock_circle} />
          <div className={styles.mock_circle} />
          <div className={styles.mock_circle} />
        </div>
      </div>
      <div className={styles.mock_pattern}>
        {PatternComponent({ color: 'rgba(255,255,255,0.8)' })}
      </div>
    </div>
  )
}

function DetailSection ({ detail, index, sectionRef }) {
  const isReversed = index % 2 !== 0

  return (
    <div
      ref={sectionRef}
      className={`${styles.detail_section} ${isReversed ? styles.detail_reversed : ''}`}
    >
      <div className={styles.detail_image_wrapper}>
        <MockImage imgIndex={detail.imgIndex} />
        {detail.featureTag && (
          <span className={styles.feature_tag}>{detail.featureTag}</span>
        )}
      </div>
      <div className={styles.detail_text_wrapper}>
        <div className={styles.detail_number}>0{index + 1}</div>
        <h3 className={styles.detail_title}>{detail.title}</h3>
        <p className={styles.detail_text}>{detail.text}</p>
      </div>
    </div>
  )
}

export function ProjectModal ({ project, onClose }) {
  const { t } = useLanguage()
  const overlayRef = useRef(null)
  const modalRef = useRef(null)
  const closeBtnRef = useRef(null)
  const heroRef = useRef(null)
  const sectionRefs = useRef([])
  const titleVars = { title: project.title }

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    // Trap focus inside the modal: focus the close button on open
    const prevFocus = document.activeElement
    if (closeBtnRef.current) {
      closeBtnRef.current.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      // Return focus to the element that triggered the modal
      if (prevFocus && prevFocus.focus) {
        prevFocus.focus()
      }
    }
  }, [handleKeyDown])

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(overlayRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }
    ).fromTo(modalRef.current,
      { scale: 0.92, autoAlpha: 0, y: 40 },
      { scale: 1, autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.15'
    ).fromTo(heroRef.current,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
    if (closeBtnRef.current) {
      tl.fromTo(closeBtnRef.current,
        { autoAlpha: 0, rotation: -90 },
        { autoAlpha: 1, rotation: 0, duration: 0.4, ease: 'back.out(1.7)' },
        '-=0.4'
      )
    }
    return () => { tl.kill() }
  }, [])

  useEffect(() => {
    const els = sectionRefs.current.filter(Boolean)
    if (els.length === 0) return

    els.forEach(el => gsap.set(el, { autoAlpha: 0, y: 60 }))

    // eslint-disable-next-line no-undef
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out'
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    els.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return createPortal(
    <>
      <div className={styles.overlay} ref={overlayRef} onClick={onClose} data-lenis-prevent>
        <div
          className={styles.modal}
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          role='dialog'
          aria-modal='true'
          aria-label={t('projectModal.detailsOf', null, titleVars)}
        >
          <section className={styles.hero_section} ref={heroRef}>
            <div className={styles.hero_image_container}>
              <img src={project.imgSrc} alt={project.title} className={styles.hero_image} loading="lazy" decoding="async" />
              <div className={styles.hero_gradient_overlay} />
            </div>
            <div className={styles.hero_content}>
              {project.tags && project.tags.length > 0 && (
                <div className={styles.hero_tags}>
                  {project.tags.map(tag => (
                    <span key={tag} className={styles.hero_tag}>{tag}</span>
                  ))}
                </div>
              )}
              <h2 className={styles.hero_title}>{project.title}</h2>
              {project.shortDescription && (
                <p className={styles.hero_short_description}>{project.shortDescription}</p>
              )}
              <div className={styles.hero_description}>
                {project.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.details_section}>
            <div className={styles.details_header}>
              <span className={styles.details_label}>{t('projectModal.characteristics')}</span>
              <div className={styles.details_header_line} />
            </div>
            {project.details.map((detail, index) => (
              <DetailSection
                key={detail.id}
                detail={detail}
                index={index}
                sectionRef={(el) => { sectionRefs.current[index] = el }}
              />
            ))}
          </section>

          <footer className={styles.modal_footer}>
            <div className={styles.footer_links}>
              {project.demoLink && (
                <a href={project.demoLink} target='_blank' rel='noopener noreferrer'>
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                    <polyline points='15 3 21 3 21 9' />
                    <line x1='10' y1='14' x2='21' y2='3' />
                  </svg>
                  {t('projectModal.links.liveDemo')}
                </a>
              )}
              {project.npmLink && (
                <a href={project.npmLink} target='_blank' rel='noopener noreferrer'>
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M20 6L9 17l-5-5' />
                  </svg>
                  {t('projectModal.links.npm')}
                </a>
              )}
              {project.storybookLink && (
                <a href={project.storybookLink} target='_blank' rel='noopener noreferrer'>
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                    <polyline points='15 3 21 3 21 9' />
                    <line x1='10' y1='14' x2='21' y2='3' />
                  </svg>
                  {t('projectModal.links.storybook')}
                </a>
              )}
              {project.codeLink && (
                <a href={project.codeLink} target='_blank' rel='noopener noreferrer'>
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />
                  </svg>
                  {t('projectModal.links.sourceCode')}
                </a>
              )}
            </div>
            <p>{t('projectModal.footerCopyright', null, { year: new Date().getFullYear(), title: project.title })}</p>
          </footer>
        </div>
      </div>
      <button
        ref={closeBtnRef}
        className={styles.close_button}
        onClick={onClose}
        aria-label={t('projectModal.close')}
      >
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <path d='M18 6L6 18M6 6l12 12' />
        </svg>
      </button>
    </>,
    document.body
  )
}
