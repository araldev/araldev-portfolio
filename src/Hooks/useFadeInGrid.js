import { gsap } from 'gsap'
import { useEffect } from 'react'

export function useFadeInGrid (elementRef, moveDirection) {
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let directionX = 0
    let directionY = 0
    if (moveDirection === 'right') directionX = -60
    else if (moveDirection === 'left') directionX = 60
    if (moveDirection === 'up') directionY = 60
    else if (moveDirection === 'down') directionY = -60

    const animation = gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        toggleActions: 'play none none none'
      },
      autoAlpha: 0,
      x: directionX,
      y: directionY,
      duration: 1
    })

    return () => {
      if (animation) animation.kill()
    }
  }, [])
}
