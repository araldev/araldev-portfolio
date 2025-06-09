import styles from './AnimatedTitle.module.css'
import { useId } from 'react'
import { useAnimatedTitle } from '../../Hooks/useAnimatedTitle.js'
import { usePreloadImg } from '../../Hooks/usePreloadImg.js'
import avatar from '../../assets/yo-sin-fondo.webp'

export function AnimatedTitle ({ children }) {
  const titleRevealMaskId = useId()
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

  usePreloadImg(avatar)

  return (
    <>
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.hero_img_container} ref={heroImgContainerRef}>
          {children}

          <div className={styles.hero_img_title} ref={heroImgTitleRef}>
            <img src={avatar} alt='Profile Image' />
          </div>

          <div className={styles.hero_img_copy} ref={heroImgCopyRef}>
            <p className={styles.paragraph}>Scroll down to reveal</p>
          </div>
        </div>

        <div className={styles.fade_overlay} ref={fadeOverlayRef} />

        <div className={styles.overlay} ref={svgOverlayRef}>
          <svg width='100%' height='100%'>
            <defs>
              <mask id={titleRevealMaskId}>
                <rect width='100%' height='100%' fill='white' />
                <path id='titleMask' ref={titleMaskRef} />
              </mask>
            </defs>
            <rect
              width='100%'
              height='100%'
              fill='#111117'
              mask={`url(#${titleRevealMaskId})`}
            />
          </svg>
        </div>

        <div className={styles.title_container} ref={titleContainerRef} />

        <div className={styles.overlay_copy} ref={overlayCopyContainerRef}>
          <h1 ref={overlayCopyRef}>
            «Code meets creativity» <br /> <br />
            «Logic flows with art» <br /> <br />
            «These are my projects»
          </h1>
        </div>
      </section>
    </>
  )
}
