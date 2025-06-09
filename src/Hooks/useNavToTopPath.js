import { useLenis } from 'lenis/react'

export function useNavToTopPath () {
  const lenis = useLenis()

  const handleClick = () => {
    if (!lenis) return
    lenis.scrollTo(document.documentElement, {
      offset: -100,
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // easing personalizado
    })
  }

  return { handleClick }
}
