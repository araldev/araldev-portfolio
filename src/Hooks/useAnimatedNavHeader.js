import { gsap } from 'gsap'
import { useEffect } from 'react'
import { show } from '../components/NavHeader/NavHeader.module.css'

export function useAnimatedNavHeader ({ mainRef, navHeaderRef }) {
  useEffect(() => {
    if (!navHeaderRef?.current || !mainRef?.current) return

    const navHeader = navHeaderRef.current
    const main = mainRef.current

    const ctxGsapNavHeader = gsap.context(() => {
      gsap.set(navHeader, {
        scrollTrigger: {
          trigger: main,
          start: 'top bottom',
          // markers: true,
          onEnter: () => {
            navHeader.classList.add(show)
          },
          onLeaveBack: () => {
            navHeader.classList.remove(show)
          }
        }
      })
    })

    return () => ctxGsapNavHeader.revert()
  }, [navHeaderRef, mainRef])

  return null
}
