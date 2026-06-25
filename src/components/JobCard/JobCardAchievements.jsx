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
  const listRef = useRef(null)
  const lastHeightRef = useRef(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { t } = useLanguage()

  // Animate list height on expand/collapse (title stays visible).
  //
  // Visibility is managed ENTIRELY by GSAP — the JSX uses only aria-hidden
  // for accessibility. NO hidden attribute, so the element is NEVER
  // display: none.  The CSS starts it visibility: hidden; height: 0, and
  // GSAP overrides those with inline styles during animations.
  useEffect(() => {
    const list = listRef.current
    if (!list) return undefined

    if (prefersReducedMotion) {
      list.style.visibility = isExpanded ? 'visible' : 'hidden'
      list.style.height = isExpanded ? 'auto' : '0'
      return undefined
    }

    if (isExpanded) {
      // GSAP overrides CSS default (visibility: hidden; height: 0) with
      // visibility: visible and height: 'auto' so we can measure.
      gsap.set(list, { height: 'auto', autoAlpha: 1, overflow: 'hidden' })
      const full = list.offsetHeight
      // Save immediately — covers mid-animation toggle.
      lastHeightRef.current = full
      gsap.fromTo(list,
        { height: 0, autoAlpha: 0 },
        {
          height: full,
          autoAlpha: 1,
          duration: 0.32,
          ease: 'power3.out',
          onComplete: () => {
            gsap.set(list, { height: 'auto' })
          }
        })
    } else {
      // Animate from the last measured height down to 0.
      // The element is visibility:visible (from the expand phase), so the
      // browser renders every GSAP frame — unlike display:none.
      gsap.set(list, { height: lastHeightRef.current, overflow: 'hidden' })
      gsap.to(list, {
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
      className={styles.job_card_achievements}
    >
      <button
        type='button'
        className={styles.job_card_achievements_title}
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
        aria-controls={achievementsId}
      >
        {t('experience.keyAchievements')}
        <span className={styles.achievements_meta} aria-hidden='true'>
          <span className={styles.achievements_count}>{achievements.length}</span>
          <span className={styles.achievements_chevron} data-expanded={isExpanded}>
            ▾
          </span>
        </span>
      </button>
      <div ref={listRef} className={styles.achievements_list_wrapper} aria-hidden={!isExpanded}>
        <ul className={styles.job_card_achievements_list}>
          {achievements.map((a, i) => (
            <li key={i} className={styles.job_card_achievement_item}>{a}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
