import { gsap } from 'gsap'
import { useEffect } from 'react'

export function useFadeInText (textRef, triggerRef, splitType = 'words', backgroundColor = false) {
  useEffect(() => {
    const text = textRef.current
    const trigger = triggerRef.current

    if (!text && !trigger) return

    // Manual word-split: each word becomes an inline-block <span>
    // This guarantees wrapping at word boundaries on small screens
    const originalContent = text.textContent
    const words = originalContent.split(/\s+/)

    text.innerHTML = ''
    const spans = words.map((word, i) => {
      const span = document.createElement('span')
      span.textContent = word
      span.style.display = 'inline-block'

      if (backgroundColor) {
        span.style.background = backgroundColor
        span.style.backgroundClip = 'text'
        span.style.webkitBackgroundClip = 'text'
        span.style.color = 'transparent'
        span.style.webkitTextFillColor = 'transparent'
      }

      text.appendChild(span)

      // Preserve whitespace between words (except after the last)
      if (i < words.length - 1) {
        text.appendChild(document.createTextNode(' '))
      }

      return span
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: 'top center',
        toggleActions: 'play none none none'
      }
    })
    tl.from(spans, {
      opacity: 0,
      y: 8,
      filter: 'blur(5px)',
      duration: 0.35,
      stagger: 0.025
    })

    return () => {
      if (tl) tl.kill()
      text.textContent = originalContent
    }
  }, [])
}
