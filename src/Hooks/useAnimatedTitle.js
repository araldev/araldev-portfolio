import { useLayoutEffect, useRef } from 'react'

import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useAnimatedTitle (svgPath) {
  const timeoutId = useRef(null)

  const heroRef = useRef(null)
  const heroImgContainerRef = useRef(null)
  const heroImgTitleRef = useRef(null)
  const heroImgCopyRef = useRef(null)
  const fadeOverlayRef = useRef(null)
  const svgOverlayRef = useRef(null)
  const overlayCopyRef = useRef(null)
  const overlayCopyContainerRef = useRef(null)
  const titleContainerRef = useRef(null)
  const titleMaskRef = useRef(null)

  useLayoutEffect(() => {
    const hero = heroRef.current
    const heroImgContainer = heroImgContainerRef.current
    const heroImgTitle = heroImgTitleRef.current
    const heroImgCopy = heroImgCopyRef.current
    const fadeOverlay = fadeOverlayRef.current
    const svgOverlay = svgOverlayRef.current
    const overlayCopy = overlayCopyRef.current
    const overlayCopyContainer = overlayCopyContainerRef.current
    const titleContainer = titleContainerRef.current
    const titleMask = titleMaskRef.current

    if (
      !hero ||
      !heroImgContainer ||
      !heroImgTitle ||
      !heroImgCopy ||
      !fadeOverlay ||
      !svgOverlay ||
      !overlayCopy ||
      !overlayCopyContainer ||
      !titleContainer ||
      !titleMask
    ) {
      console.warn(
        'GSAP/ScrollTrigger: Algunos elementos no se encontraron.'
      )
      return
    }

    // =========================
    // IMPORTANTÍSIMO PARA MÓVIL
    // =========================

    gsap.set(
      [fadeOverlay, svgOverlay, overlayCopyContainer],
      {
        pointerEvents: 'none'
      }
    )

    // =========================
    // REFRESH RESIZE + ORIENTATION
    // =========================
    // Chrome DevTools device-preset switching sometimes fires
    // resize/orientation before the viewport dimensions settle.
    // We do TWO refreshes: one quick (200ms) and one deferred
    // (600ms) to catch the settled layout.

    const doRefresh = () => {
      ScrollTrigger.refresh()
    }

    const handleResizeDebounce = () => {
      clearTimeout(timeoutId.current)

      timeoutId.current = setTimeout(() => {
        doRefresh()
        // Second refresh after the layout fully settles
        // (catches DevTools preset-switch edge cases).
        setTimeout(doRefresh, 400)
      }, 200)
    }

    window.addEventListener('resize', handleResizeDebounce)
    window.addEventListener('orientationchange', handleResizeDebounce)

    // =========================
    // FADE IN INICIAL
    // =========================

    const fadeInImg = gsap.fromTo(
      heroImgTitle,
      {
        x: 60,
        filter: 'blur(10px)'
      },
      {
        x: 0,
        filter: 'blur(0px)',
        duration: 1
      }
    )

    // =========================
    // CALCULAR SVG SOLO EN REFRESH
    // =========================

    const updateMaskPosition = () => {
      titleMask.setAttribute('d', svgPath)
      titleMask.removeAttribute('transform')

      const titleDimensions =
        titleContainer.getBoundingClientRect()

      const titleBoundingBox = titleMask.getBBox()

      const horizontalScaleRatio =
        titleDimensions.width / titleBoundingBox.width

      const verticalScaleRatio =
        titleDimensions.height / titleBoundingBox.height

      const titleScaleFactor = Math.min(
        horizontalScaleRatio,
        verticalScaleRatio
      )

      const titleHorizontalPosition =
        titleDimensions.left +
        (titleDimensions.width -
          titleBoundingBox.width * titleScaleFactor) /
          2 -
        titleBoundingBox.x * titleScaleFactor

      const titleVerticalPosition =
        titleDimensions.top +
        (titleDimensions.height -
          titleBoundingBox.height * titleScaleFactor) /
          2 -
        titleBoundingBox.y * titleScaleFactor

      titleMask.setAttribute(
        'transform',
        `
        translate(${titleHorizontalPosition}, ${titleVerticalPosition})
        scale(${titleScaleFactor})
        `
      )
    }

    updateMaskPosition()

    // =========================
    // SCROLLTRIGGER
    // =========================

    const trigger = ScrollTrigger.create({
      id: 'hero-trigger',

      trigger: hero,

      start: 'top top',

      end: () => `+=${window.innerHeight * 1.5}`,

      pin: true,

      pinSpacing: true,

      scrub: 1,

      invalidateOnRefresh: true,

      pinType: 'transform',

      onRefresh: () => {
        updateMaskPosition()
      },

      onUpdate: (self) => {
        updateMaskPosition()

        const scrollProgress = self.progress

        // =========================
        // FADE OUT TEXTO HERO
        // =========================

        const fadeOpacity =
          1 - scrollProgress * (1 / 0.15)

        gsap.set(
          [heroImgTitle, heroImgCopy],
          {
            opacity:
              scrollProgress <= 0.15
                ? fadeOpacity
                : 0
          }
        )

        // =========================
        // ESCALADO
        // =========================

        if (scrollProgress <= 0.85) {
          const numberScale =
            window.innerWidth < 1500 &&
            window.innerWidth > 1401
              ? 1.1
              : window.innerWidth < 1400 &&
                  window.innerWidth > 501
                ? 1
                : 1.1

          const initialOverlayScale = 350

          const normalizedProgress =
            scrollProgress * (1 / 0.85)

          const heroImgContainerScale =
            numberScale -
            0.5 * normalizedProgress

          const overlayScale =
            initialOverlayScale *
            Math.pow(
              1 / initialOverlayScale,
              normalizedProgress
            )

          gsap.set(heroImgContainer, {
            scale: heroImgContainerScale
          })

          gsap.set(svgOverlay, {
            scale: overlayScale
          })

          // =========================
          // OVERLAY OPACITY
          // =========================

          let fadeOverlayOpacity = 0

          if (scrollProgress >= 0.25) {
            fadeOverlayOpacity = Math.min(
              1,
              (scrollProgress - 0.25) * (1 / 0.4)
            )
          }

          gsap.set(fadeOverlay, {
            opacity: fadeOverlayOpacity
          })
        }

        // =========================
        // REVEAL COPY
        // =========================

        if (
          scrollProgress >= 0.6 &&
          scrollProgress <= 0.85
        ) {
          const revealProgress =
            (scrollProgress - 0.6) * (1 / 0.25)

          const gradientSpread = 200

          const gradientBottom =
            240 - revealProgress * 280

          const gradientTop =
            gradientBottom - gradientSpread

          const overlayCopyScale =
            1.25 - 0.45 * revealProgress

          overlayCopy.style.background = `
            linear-gradient(
              to bottom,
              #111117 0%,
              #111117 ${gradientTop}%,
              #8fc6ff ${gradientBottom}%,
              #5a9cff ${100 + gradientBottom}%
            )
          `

          overlayCopy.style.backgroundClip = 'text'
          overlayCopy.style.webkitBackgroundClip =
            'text'

          gsap.set(overlayCopy, {
            scale: overlayCopyScale,
            opacity: revealProgress
          })
        } else if (scrollProgress < 0.6) {
          gsap.set(overlayCopy, {
            opacity: 0
          })
        }
      }
    })

    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener(
        'resize',
        handleResizeDebounce
      )
      window.removeEventListener(
        'orientationchange',
        handleResizeDebounce
      )

      clearTimeout(timeoutId.current)

      if (trigger) trigger.kill()

      if (fadeInImg) fadeInImg.kill()
    }
  }, [svgPath])

  return {
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
  }
}
