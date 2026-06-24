import { useState, useEffect, useRef } from 'react'

/**
 * Tracks which section is currently most visible in the viewport
 * using IntersectionObserver. Returns the active section ID.
 *
 * Uses a simple approach:
 *  - Single threshold (0) to fire on any visibility change
 *  - rootMargin: 0 so the full viewport is the intersection root
 *  - Updates React state only when the active section actually changes
 *
 * @param {string[]} sectionIds - array of section DOM IDs (without #)
 * @returns {string|null} the currently active section ID
 */
export function useActiveSection (sectionIds) {
  const [activeId, setActiveId] = useState(null)
  const activeIdRef = useRef(null)
  activeIdRef.current = activeId

  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) return

    const visibility = new Map()
    sectionIds.forEach(id => visibility.set(id, 0))

    let rafId = null

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          visibility.set(entry.target.id, entry.intersectionRatio)
        })

        let maxRatio = 0
        let maxId = null
        for (const [id, ratio] of visibility) {
          if (ratio > maxRatio) {
            maxRatio = ratio
            maxId = id
          }
        }

        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            rafId = null
            if (maxId !== activeIdRef.current) {
              setActiveId(maxId)
            }
          })
        }
      },
      {
        // No margin — use the full viewport as intersection root
        rootMargin: '0px',
        threshold: 0
      }
    )

    const elements = []
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
        elements.push(el)
      }
    })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      elements.forEach(el => observer.unobserve(el))
      observer.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds])

  return activeId
}
