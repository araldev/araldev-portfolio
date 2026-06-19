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
      splitText[splitType].forEach(el => {
        el.style.background = backgroundColor
        el.style.backgroundClip = 'text'
        el.style.webkitBackgroundClip = 'text'
        el.style.color = 'transparent'
        el.style.webkitTextFillColor = 'transparent'
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
      y: 8,
      filter: 'blur(5px)',
      duration: 0.35,
      stagger: 0.025
    })

    return () => {
      if (tl) tl.kill()
      if (splitText) splitText.revert()
    }
  }, [])
}
