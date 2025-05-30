// ScrollSync.jsx
import { useEffect } from 'react'
import { useLenis } from 'lenis/react'
import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ScrollSync () {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    gsap.ticker.lagSmoothing(0)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
      ScrollTrigger.update()
    })

    const refreshId = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 10)

    return () => {
      clearTimeout(refreshId)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [lenis])

  return null
}
