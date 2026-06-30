import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import { show } from '../components/NavHeader/NavHeader.module.css'

export function useAnimatedNavHeader ({ navHeaderRef }) {
  useEffect(() => {
    if (!navHeaderRef?.current) return

    const navHeader = navHeaderRef.current

    ScrollTrigger.create({
      id: 'nav-trigger',
      trigger: document.body,
      start: 'top -80px',
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
  }, [navHeaderRef])

  return null
}
