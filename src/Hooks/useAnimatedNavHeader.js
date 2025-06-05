import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import { show } from '../components/NavHeader/NavHeader.module.css'

export function useAnimatedNavHeader ({ mainRef, navHeaderRef }) {
  useEffect(() => {
    if (!navHeaderRef?.current || !mainRef?.current) return

    const navHeader = navHeaderRef.current
    const main = mainRef.current

    ScrollTrigger.create({
      id: 'nav-trigger',
      trigger: main,
      start: 'top bottom',
      // markers: true,
      onEnter: () => {
        navHeader.classList.add(show)
      },
      onLeaveBack: () => {
        navHeader.classList.remove(show)
      }
    })

    return () => {
      const st = ScrollTrigger.getById('nav-trigger')
      if (st) st.kill()
    }
  }, [navHeaderRef, mainRef])

  return null
}
