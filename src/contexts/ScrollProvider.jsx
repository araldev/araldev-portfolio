import { createContext, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis } from 'lenis/react'

gsap.registerPlugin(ScrollTrigger)

export const ScrollContext = createContext(null)

export const ScrollProvider = ({ children }) => {
  const lenisRef = useRef(null)
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    const checkLenis = () => {
      const lenisInstance = lenisRef.current?.lenis
      if (lenisInstance) {
        setLenis(lenisInstance)

        ScrollTrigger.scrollerProxy(document.body, {
          scrollTop (value) {
            if (arguments.length) {
              lenis.scrollTo(value, { immediate: true }) // para setear scroll
            } else {
              return lenis.scroll
            }
          },
          getBoundingClientRect () {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight
            }
          },
          pinType: document.body.style.transform ? 'transform' : 'fixed'
        })

        const update = (time) => {
          lenisInstance.raf(time * 1000)
          ScrollTrigger.update()
        }
        gsap.ticker.lagSmoothing(0)
        gsap.ticker.add(update)

        ScrollTrigger.refresh()

        cancelAnimationFrame(checkLenis)
      } else {
        requestAnimationFrame(checkLenis)
      }
    }

    requestAnimationFrame(checkLenis)

    // Limpieza
    return () => {
      cancelAnimationFrame(checkLenis)

      gsap.ticker.removeAll()
      ScrollTrigger.killAll()
    }
  }, [])

  return (
    <ScrollContext.Provider value={{ lenis }}>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      {children}
    </ScrollContext.Provider>
  )
}
