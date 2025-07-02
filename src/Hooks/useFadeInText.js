import { gsap } from 'gsap'
import { useEffect } from 'react'
import SplitText from 'gsap/SplitText'

export function useFadeInText (textRef, triggerRef, splitType = 'chars', backgroundColor = false) {
  useEffect(() => {
    const text = textRef.current
    const trigger = triggerRef.current

    if (!text && !trigger) return

    const splitText = new SplitText(text, {
      type: splitType
    })

    if (backgroundColor) {
      splitText.chars.forEach(char => {
        char.style.background = backgroundColor
        char.style.backgroundClip = 'text'
        char.style.webkitBackgroundClip = 'text'
        char.style.color = 'transparent'
        char.style.webkitTextFillColor = 'transparent'
      })
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: 'top center',
        toggleActions: 'play none none none'
      }
    })
    tl.from(splitText[splitType], {
      opacity: 0,
      y: 10,
      filter: 'blur(10px)',
      duration: 0.5,
      stagger: 0.03
    })

    return () => {
      if (tl) tl.kill()
      if (splitText) splitText.revert()
    }
  }, [])
}
