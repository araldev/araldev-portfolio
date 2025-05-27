import styles from './AnimatedTitle.module.css'
import { useAnimatedTitle } from '../../Hooks/useAnimatedTitle.jsx'

export function AnimatedTitle ({ children }) {
  const {
    heroRef,
    heroImgContainerRef,
    heroImgTitleRef,
    heroImgCopyRef,
    overlayCopyContainerRef,
    fadeOverlayRef,
    svgOverlayRef,
    overlayCopyRef,
    titleContainerRef,
    titleMaskRef
  } = useAnimatedTitle()

  return (
    <>
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.hero_img_container} ref={heroImgContainerRef}>
          {children}

          <div className={styles.hero_img_title} ref={heroImgTitleRef}>
            <img src='src/utils/yo-sin-fondo.png' alt='AVATAR' />
          </div>

          <div className={styles.hero_img_copy} ref={heroImgCopyRef}>
            <p className={styles.paragraph}>Scroll down to reveal</p>
          </div>
        </div>

        <div className={styles.fade_overlay} ref={fadeOverlayRef} />

        <div className={styles.overlay} ref={svgOverlayRef}>
          <svg width='100%' height='100%'>
            <defs>
              <mask id='titleRevealMask'>
                <rect width='100%' height='100%' fill='white' />
                <path id='titleMask' ref={titleMaskRef} />
              </mask>
            </defs>
            <rect
              width='100%'
              height='100%'
              fill='#111117'
              mask='url(#titleRevealMask)'
            />
          </svg>
        </div>

        <div className={styles.title_container} ref={titleContainerRef} />

        <div className={styles.overlay_copy} ref={overlayCopyContainerRef}>
          <h1 ref={overlayCopyRef}>
            Animation <br />
            Experiment 452 <br />
            By Araldev
          </h1>
        </div>
      </section>
    </>
  )
}
