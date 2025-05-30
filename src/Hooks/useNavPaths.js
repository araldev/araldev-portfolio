import { useCallback, useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'

export function useNavPaths () {
  const lenis = useLenis()
  const frameIdRef = useRef(null)

  const handleClick = useCallback((event) => {
    event.preventDefault()

    if (!lenis) return

    let offsetValue

    const targetDataIdValue = event.target.dataset.id
    if (!targetDataIdValue) {
      console.warn('El elemento clickeado no tiene un data-id válido.')
      return
    }

    if (targetDataIdValue === 'about-me') offsetValue = -(window.innerHeight + 250)
    if (targetDataIdValue === 'projects') offsetValue = -80

    const targetElement = document.getElementById(targetDataIdValue)
    if (!targetElement) {
      console.warn(`No se encontró un elemento con el id: ${targetDataIdValue}`)
      return
    }

    function goTo () {
      console.log('lenis: ', lenis)
      console.log('targetElement: ', targetElement.offsetTop)

      lenis.scrollTo(targetElement, {
        offset: offsetValue,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // easing personalizado
      })
    }

    frameIdRef.current = requestAnimationFrame(goTo)
  }, [lenis])

  useEffect(() => {
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current)
      }
    }
  }, [])

  return { handleClick }
}
