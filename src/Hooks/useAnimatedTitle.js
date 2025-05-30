import { useEffect, useRef } from 'react'
import { projectsDataSvg } from '../components/AnimatedTitle/titles'

import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useAnimatedTitle () {
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
      console.log({
        hero,
        heroImgContainer,
        heroImgTitle,
        heroImgCopy,
        fadeOverlay,
        svgOverlay,
        overlayCopy,
        overlayCopyContainer,
        titleContainer,
        titleMask
      })
      return
    }

    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)

    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: () => `+=${hero.getBoundingClientRect().height + 200}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      invalidateOnRefresh: true,
      // markers: true,
      onRefresh: () => {
        titleMask.setAttribute('d', projectsDataSvg)

        const titleDimensions = titleContainer.getBoundingClientRect()
        const titleBoundingBox = titleMask.getBBox()

        const horizontalScaleRatio = titleDimensions.width / titleBoundingBox.width
        const verticalScaleRatio = titleDimensions.height / titleBoundingBox.height
        const titleScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio)

        const titleHorizontalPosition = titleDimensions.left + (titleDimensions.width - titleBoundingBox.width * titleScaleFactor) / 2 - titleBoundingBox.x * titleScaleFactor
        const titleVerticalPosition = titleDimensions.top + (titleDimensions.height - titleBoundingBox.height * titleScaleFactor) / 2 - titleBoundingBox.y * titleScaleFactor

        titleMask.setAttribute(
          'transform',
          `translate(${titleHorizontalPosition - 5}, ${titleVerticalPosition}) 
          scale(${titleScaleFactor})`)
      },
      onUpdate: (self) => {
        const scrollProgress = self.progress
        const fadeOpacity = 1 - scrollProgress * (1 / 0.15)
        let pointerState = 'none'

        if (scrollProgress <= 0.15) {
          gsap.set([heroImgTitle, heroImgCopy], {
            opacity: fadeOpacity
          })
        } else {
          gsap.set([heroImgTitle, heroImgCopy], {
            opacity: 0
          })
        }

        if (scrollProgress <= 0.85) {
          const numberScale =
            window.innerWidth < 1500 && window.innerWidth > 1401
              ? 1.1
              : window.innerWidth < 1400 && window.innerWidth > 501
                ? 1
                : 1.1

          const normalizedProgress = scrollProgress * (1 / 0.85)
          const heroImgContainerScale = numberScale - 0.3 * normalizedProgress
          const overlayScale =
            initialOverlayScale *
            Math.pow(1 / initialOverlayScale, normalizedProgress)
          let fadeOverlayOpacity = 0

          gsap.set(heroImgContainer, {
            scale: heroImgContainerScale
          })

          gsap.set(svgOverlay, {
            scale: overlayScale
          })

          if (scrollProgress >= 0.15) {
            pointerState = 'unset'
          }

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

        if (scrollProgress >= 0.6 && scrollProgress <= 0.85) {
          const overlayCopyRevealProgress = (scrollProgress - 0.6) * (1 / 0.25)

          const gradientSpread = 100
          const gradientBottomPosition = 240 - overlayCopyRevealProgress * 280
          const gradientTopPosition = gradientBottomPosition - gradientSpread
          const overlayCopyScale = 1.25 - 0.25 * overlayCopyRevealProgress

          overlayCopy.style.background = `linear-gradient(to bottom, #111117 0%, #111117 ${gradientTopPosition}%, #e66461 ${gradientBottomPosition}%, #e66461 100%)`
          overlayCopy.style.backgroundClip = 'text'
          overlayCopy.style.webkitBackgroundClip = 'text'

          gsap.set(overlayCopy, {
            scale: overlayCopyScale,
            opacity: overlayCopyRevealProgress
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
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.killAll()
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
