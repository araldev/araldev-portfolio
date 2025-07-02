import { gsap } from 'gsap'
import { useEffect } from 'react'
import SplitText from 'gsap/SplitText'

export function useFadeInText (textRef, triggerRef, splitType = 'chars', backgroundColor = false) {
  useEffect(() => {
    const text = textRef.current
    const trigger = triggerRef.current

    if (!text && !trigger) return

    const splitText = new SplitText(text, {
      type: 'words, chars'
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
        start: 'top top',
        toggleActions: 'play none none none'
      }
    })
    tl.from(splitText[splitType], {
      opacity: 0,
      y: 15,
      filter: 'blur(10px)',
      duration: 1,
      stagger: 0.03
    })

    return () => {
      tl.kill()
      splitText.revert()
    }
  }, [])
}
