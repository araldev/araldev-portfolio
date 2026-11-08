import { useCallback, useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'

export function useNavPaths ({ navMenuRef = null }) {
  const lenis = useLenis()
  const frameIdRef = useRef(null)

  // Sincroniza el bloqueo de scroll con el estado del checkbox del menú
  // móvil. Cuando el menú está abierto el scroll se congela; al cerrarlo
  // se libera.
  const syncScrollLock = useCallback(() => {
    if (!lenis) return
    if (!navMenuRef || !navMenuRef.current) return

    // Hacer una funcion para que para cuando haga el scroll
    if (navMenuRef.current.checked) lenis.stop()
    else lenis.start()
  }, [lenis, navMenuRef])

  useEffect(() => {
    if (!navMenuRef || !navMenuRef.current) return
    const checkbox = navMenuRef.current

    checkbox.addEventListener('change', syncScrollLock)

    // Ejecutar una vez al montar por si ya está checked
    syncScrollLock()
    return () => {
      checkbox.removeEventListener('change', syncScrollLock)
    }
  }, [navMenuRef, syncScrollLock])

  // Cierra el menú móvil desmarcando el checkbox. El estado vive en el
  // DOM (CSS `:has(.checkbox:checked)`), no en React, por eso se
  // manipula la propiedad `checked` directamente.
  const closeMenu = useCallback(() => {
    if (!navMenuRef || !navMenuRef.current) return

    navMenuRef.current.checked = false
    syncScrollLock()
  }, [navMenuRef, syncScrollLock])

  const handleClick = useCallback((event) => {
    event.preventDefault()

    closeMenu()

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
    if (targetDataIdValue === 'experience') offsetValue = -80
    if (targetDataIdValue === 'contact') offsetValue = -100

    const targetElement = document.getElementById(targetDataIdValue)
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
  }, [lenis, closeMenu])

  return { handleClick, closeMenu }
}
