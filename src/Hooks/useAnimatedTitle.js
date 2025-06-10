import { useEffect, useRef } from 'react'
import { projectsDataSvg } from '../components/AnimatedTitle/titles'

import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useAnimatedTitle () {
  const timeoutId = useRef(null)
  const lastWindowInnerHeightRef = useRef()
  const lastWindowInnerWidthRef = useRef()

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

  useEffect(() => {
    let lastWindowInnerHeight = lastWindowInnerHeightRef.current
    let lastWindowInnerWidth = lastWindowInnerWidthRef.current
    lastWindowInnerHeight = window.innerHeight
    lastWindowInnerWidth = window.innerWidth

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
    const initialOverlayScale = 350

    if (!hero || !heroImgContainer || !heroImgTitle || !titleMask || !overlayCopy || !overlayCopyContainer || !fadeOverlay || !svgOverlay || !titleContainer || !heroImgCopy) {
      console.warn('GSAP/ScrollTrigger: Algunos elementos no se encontraron. La animación se intentará de nuevo cuando los refs se asignen.')
      return
    }

    const handleResizeDebounce = () => {
      clearTimeout(timeoutId.current)

      timeoutId.current = setTimeout(() => {
        const heightDiff = Math.abs(lastWindowInnerHeight - window.innerHeight)
        const widthDiff = Math.abs(lastWindowInnerWidth - window.innerWidth)
        if (heightDiff > 80 || widthDiff > 80) {
          lastWindowInnerHeight = window.innerHeight
          lastWindowInnerWidth = window.innerWidth
          ScrollTrigger.refresh()
        }
      }, 300)
    }
    window.addEventListener('resize', handleResizeDebounce)

    ScrollTrigger.create({
      id: 'hero-trigger',
      trigger: hero,
      start: 'top top',
      end: () => `+=${window.innerHeight * 1.5}px`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      invalidateOnRefresh: true,
      // markers: true,
      onUpdate: (self) => {
        const scrollProgress = self.progress

        // SVG translate and scale
        titleMask.setAttribute('d', projectsDataSvg)

        const titleDimensions = titleContainer.getBoundingClientRect()
        const titleBoundingBox = titleMask.getBBox()

        const horizontalScaleRatio = titleDimensions.width / titleBoundingBox.width
        const verticalScaleRatio = titleDimensions.height / titleBoundingBox.height
        const titleScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio) * 1.6

        const titleHorizontalPosition = titleDimensions.left + (titleDimensions.width - titleBoundingBox.width * titleScaleFactor) / 2 - titleBoundingBox.x * titleScaleFactor
        const titleVerticalPosition = titleDimensions.top + (titleDimensions.height - titleBoundingBox.height * titleScaleFactor) / 2 - titleBoundingBox.y * titleScaleFactor

        titleMask.setAttribute(
          'transform',
            `translate(${titleHorizontalPosition}, ${titleVerticalPosition}) 
            scale(${titleScaleFactor})`
        )

        // Fade out heroImgTitle & heroImgCopy
        const fadeOpacity = 1 - scrollProgress * (1 / 0.15)
        gsap.set([heroImgTitle, heroImgCopy], {
          opacity: scrollProgress <= 0.15 ? fadeOpacity : 0
        })

        if (scrollProgress <= 0.85) {
          const numberScale =
            window.innerWidth < 1500 && window.innerWidth > 1401
              ? 1.1
              : window.innerWidth < 1400 && window.innerWidth > 501
                ? 1
                : 1.1

          const normalizedProgress = scrollProgress * (1 / 0.85)
          const heroImgContainerScale = numberScale - 0.5 * normalizedProgress
          const overlayScale =
              initialOverlayScale *
              Math.pow(1 / initialOverlayScale, normalizedProgress)

          gsap.set(heroImgContainer, { scale: heroImgContainerScale })
          gsap.set(svgOverlay, { scale: overlayScale })

          const pointerState = scrollProgress >= 0.25 ? 'unset' : 'none'
          let fadeOverlayOpacity = 0

          if (scrollProgress >= 0.25) {
            fadeOverlayOpacity = Math.min(1, (scrollProgress - 0.25) * (1 / 0.4))
          }

          gsap.set([svgOverlay, overlayCopyContainer], {
            pointerEvents: pointerState
          })

          gsap.set(fadeOverlay, {
            opacity: fadeOverlayOpacity,
            pointerEvents: pointerState
          })
        }

        // Overlay copy reveal
        if (scrollProgress >= 0.6 && scrollProgress <= 0.85) {
          const revealProgress = (scrollProgress - 0.6) * (1 / 0.25)

          const gradientSpread = 100
          const gradientBottom = 240 - revealProgress * 280
          const gradientTop = gradientBottom - gradientSpread
          const overlayCopyScale = 1.25 - 0.45 * revealProgress

          overlayCopy.style.background = `linear-gradient( to bottom,
          #111117 0%,
          #111117 ${gradientTop}%,
          #8fc6ff ${gradientBottom}%, 
          #5a9cff ${100 + gradientBottom}%)`
          overlayCopy.style.backgroundClip = 'text'
          overlayCopy.style.webkitBackgroundClip = 'text'

          gsap.set(overlayCopy, {
            scale: overlayCopyScale,
            opacity: revealProgress
          })
        } else if (scrollProgress < 0.6) {
          gsap.set(overlayCopy, { opacity: 0 })
        }
      }
    })

    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener('resize', handleResizeDebounce)
      const st = ScrollTrigger.getById('hero-trigger')
      if (st) st.kill()
    }
  }, [heroImgContainerRef, heroImgTitleRef, heroImgCopyRef, fadeOverlayRef, svgOverlayRef, overlayCopyRef, overlayCopyContainerRef, titleContainerRef, titleMaskRef])

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
