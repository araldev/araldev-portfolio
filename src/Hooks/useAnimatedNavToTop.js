import { useEffect } from 'react'
import { gsap } from 'gsap/gsap-core'
import { show } from '../components/NavToTop/NavToTop.module.css'

export function useAnimatedNavToTop ({ mainRef, navToTopRef }) {
  useEffect(() => {
    const main = mainRef.current
    const navToTop = navToTopRef.current
    if (!navToTop) {
      throw new Error('No se encontró el elemento navToTop')
    }

    const TlNavToTop = gsap.timeline()

    TlNavToTop
      .to(navToTop, {
        scrollTrigger: {
          trigger: main,
          start: 'top bottom',
          onEnter: () => {
            navToTop.classList.add(show)
          },
          onLeaveBack: () => {
            navToTop.classList.remove(show)
          }
        }
      })
  }, [])
}
