import { useCallback, useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'

export function useNavPaths ({ navMenuRef }) {
  const lenis = useLenis()
  const frameIdRef = useRef(null)

  function onChange () {
    if (!lenis) return
    if (!navMenuRef || !navMenuRef.current) return

    // Hacer una funcion para que para cuando haga el scroll
    if (navMenuRef.current.checked) lenis.stop()
    else lenis.start()
  }

  useEffect(() => {
    navMenuRef.current.addEventListener('change', onChange)

    // Ejecutar una vez al montar por si ya está checked
    onChange()
    return () => {
      if (!navMenuRef || !navMenuRef.current) return
      navMenuRef.current.removeEventListener('change', onChange)
    }
  }, [navMenuRef, lenis])

  const handleClick = useCallback((event) => {
    event.preventDefault()

    if (navMenuRef.current) navMenuRef.current.checked = false

    onChange()

    if (!lenis) return

    let offsetValue

    const targetDataIdValue = event.target.dataset.id
    if (!targetDataIdValue) {
      console.warn('El elemento clickeado no tiene un data-id válido.')
      return
    }

    if (targetDataIdValue === 'home') offsetValue = -(window.innerHeight * 2)
    if (targetDataIdValue === 'about-me') offsetValue = -80
    if (targetDataIdValue === 'projects') offsetValue = -80

    const targetElement = document.getElementById(targetDataIdValue)
    console.log(targetElement)
    if (!targetElement) {
      console.warn(`No se encontró un elemento con el id: ${targetDataIdValue}`)
      return
    }

    function goTo () {
      lenis.scrollTo(targetElement, {
        offset: offsetValue,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // easing personalizado
      })
    }

    if (frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current)
    }

    frameIdRef.current = requestAnimationFrame(goTo)
  }, [lenis])

  return { handleClick }
}
