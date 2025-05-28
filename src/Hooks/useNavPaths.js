import { useCallback } from 'react'
import { useScroll } from './useScroll.js'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useNavPaths () {
  const { lenis } = useScroll()

  const handleClick = useCallback((event) => {
    event.preventDefault()

    if (!lenis) return

    const targetDataIdValue = event.target.dataset.id
    if (!targetDataIdValue) {
      console.warn('El elemento clickeado no tiene un data-id válido.')
      return
    }

    const targetElement = document.getElementById(targetDataIdValue)
    if (!targetElement) {
      console.warn(`No se encontró un elemento con el id: ${targetDataIdValue}`)
      return
    }
    ScrollTrigger.refresh()

    function goTo () {
      console.log(lenis)

      lenis.scrollTo(targetElement, {
        offset: -80,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // easing personalizado
      })
    }

    requestAnimationFrame(goTo)

    return cancelAnimationFrame(goTo)
  }, [lenis])

  return { handleClick }
}
