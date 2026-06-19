import { useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import styles from './JobCard.module.css'
import { usePrefersReducedMotion } from '../../Hooks/usePrefersReducedMotion.js'
import { useLanguage } from '../../i18n/useLanguage.js'

/**
 * JobCardAchievements — disclosure widget for the optional achievements list.
 *
 * Renders ALWAYS in the DOM (DA-05) and toggles visibility via:
 *  - `aria-hidden`
 *  - the native `hidden` attribute (fallback)
 *  - animated `height` with GSAP
 *
 * Disclosed by the parent via the `isExpanded` / `onToggleExpand` props so the
 * trigger button can own the disclosure semantics.
 *
 * @param {Object} props
 * @param {string[]|undefined} props.achievements
 * @param {boolean} props.isExpanded
 * @param {string} props.achievementsId - id used by aria-controls
 * @param {React.RefObject<HTMLElement>} props.triggerRef - parent ref of the trigger button
 * @param {() => void} props.onToggleExpand - collapse callback (so Escape can trigger it)
 */
export function JobCardAchievements ({
  achievements,
  isExpanded,
  achievementsId,
  triggerRef,
  onToggleExpand
}) {
  const sectionRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { t } = useLanguage()

  // Animate height on expand/collapse
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    if (prefersReducedMotion) {
      // No animation, just reflect state
      section.style.height = isExpanded ? 'auto' : '0'
      return undefined
    }

    if (isExpanded) {
      // Measure natural height, then animate from 0 → natural
      gsap.set(section, { height: 'auto', autoAlpha: 1, overflow: 'hidden' })
      const full = section.offsetHeight
      gsap.fromTo(section,
        { height: 0, autoAlpha: 0 },
        {
          height: full,
          autoAlpha: 1,
          duration: 0.32,
          ease: 'power3.out',
          onComplete: () => gsap.set(section, { height: 'auto' })
        })
    } else {
      gsap.to(section, {
        height: 0,
        autoAlpha: 0,
        duration: 0.32,
        ease: 'power2.in'
      })
    }
    return undefined
  }, [isExpanded, prefersReducedMotion])

  // Escape key collapses and returns focus to the trigger
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isExpanded) {
      e.stopPropagation()
      onToggleExpand && onToggleExpand()
      // Return focus to the trigger after the state update
      setTimeout(() => {
        if (triggerRef?.current) triggerRef.current.focus()
      }, 0)
    }
  }, [isExpanded, onToggleExpand, triggerRef])

  useEffect(() => {
    if (!isExpanded) return undefined
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, handleKeyDown])

  if (!achievements || achievements.length === 0) return null

  return (
    <section
      id={achievementsId}
      ref={sectionRef}
      className={styles.job_card_achievements}
      hidden={!isExpanded}
      aria-hidden={!isExpanded}
    >
      <h5 className={styles.job_card_achievements_title}>{t('experience.keyAchievements')}</h5>
      <ul className={styles.job_card_achievements_list}>
        {achievements.map((a, i) => (
          <li key={i} className={styles.job_card_achievement_item}>{a}</li>
        ))}
      </ul>
    </section>
  )
}
