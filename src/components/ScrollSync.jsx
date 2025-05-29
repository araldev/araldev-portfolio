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

    console.log('lenis: ', lenis)
    console.log('lenis options wrapper: ', lenis.options.wrapper)

    const scroller = lenis.options.wrapper

    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop (value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.animatedScroll
      },
      getBoundingClientRect () {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      pinType: 'transform'
    })

    // Configuración especial para trabajar con Lenis
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
      // ignoreMobileResize: true
    })

    const update = () => ScrollTrigger.update()
    lenis.on('scroll', update)

    const refreshId = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 500)

    return () => {
      clearTimeout(refreshId)
      lenis.off('scroll', update)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [lenis])

  return null
}
