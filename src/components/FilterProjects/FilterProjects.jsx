import { useId, useState, useRef, useEffect, useCallback } from 'react'
import styles from './FilterProjects.module.css'
import { techIcons } from '../../data/icons.js'
import { useIsIconCheckFilter } from '../../Hooks/useIsIconCheckFilter.js'
import { useLanguage } from '../../i18n/useLanguage.js'

/* ── Tech grouping ───────────────────────────────────────────
   Groups make the filter scannable: icons are rendered under
   category headings instead of a flat wall of 21 items. */
const techGroups = {
  frontend: ['react', 'angular', 'nextjs', 'js', 'ts', 'html', 'css', 'tailwind', 'gsap', 'rxjs', 'storybook'],
  backend: ['java', 'spring', 'python', 'nodejs', 'postgres', 'junit'],
  devops: ['git', 'gitHub', 'vite', 'npm'],
  ai: ['ia']
}
const groupOrder = ['frontend', 'backend', 'devops', 'ai']

function TechIcons () {
  const { setIsIconCheck } = useIsIconCheckFilter()
  const { t } = useLanguage()
  const idBaseFilter = useId()

  function handleClick (event) {
    const key = event.currentTarget.getAttribute('data-key')
    setIsIconCheck(prevState => {
      const newState = { ...prevState }
      if (key) {
        newState[key] = !newState[key]
        return newState
      }
    })
  }

  let iconIndex = 0

  return (
    <>
      {groupOrder.map(groupKey => {
        const techKeys = techGroups[groupKey]
        const groupLabel = t('projects.filterGroups.' + groupKey)
        return (
          <div key={groupKey} className={styles.filter_group} role='group' aria-label={groupLabel}>
            <div className={styles.filter_group_heading}>{groupLabel}</div>
            <div className={styles.filter_group_icons}>
              {techKeys.map(key => {
                const eachTechIcon = techIcons[key]
                if (!eachTechIcon) return null
                const idFilter = `${idBaseFilter}-${iconIndex}`
                const styleForIcon = key ? styles[key] : ''
                const techName = t('projects.filterIcons.' + key)
                iconIndex++
                return (
                  <label className={styles.filter_icon_label} key={`${key}`} htmlFor={idFilter} data-tooltip={techName}>
                    <input
                      data-key={key}
                      onClick={handleClick}
                      className={styles.filter_icon_checkbox}
                      id={idFilter}
                      type='checkbox'
                      hidden
                    />
                    <div className={`${styles.filter_icon_container} ${styleForIcon}`}>
                      {eachTechIcon}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        )
      })}
    </>
  )
}

export function FilterProjects () {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const filterGroupsId = useId()
  const sentinelRef = useRef(null)
  const autoCollapseRef = useRef(true)

  /* ── Detect constrained viewport ────────────────────────────
      Auto-collapse activates when vertical space is limited
      (landscape mobile / small windows) OR the viewport is
      narrow (portrait mobile). On spacious desktop screens it
      stays idle.                                   */
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 710px), (max-height: 700px)')
    setIsMobile(mql.matches)

    const handler = e => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  /* ── Auto-collapse on sticky in constrained viewports ───────
      Active when isMobile is true (≤710px wide OR ≤700px tall).
      A sentinel <div> sits just before the <form>. When the user
      scrolls past it (transition from intersecting → not), the
      form is sticky → collapse the toolbar.
      If the user manually toggles, autoCollapse is disabled until
      the sentinel re-enters (scroll back up). Uses a transition
      tracker so the initial page-load state (e.g. after #hash jump)
      does NOT trigger collapse — only real user scroll does. */
  useEffect(() => {
    if (!isMobile) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const wasIntersecting = { current: null }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (wasIntersecting.current === true && !entry.isIntersecting && autoCollapseRef.current) {
          setIsOpen(false)
        }
        wasIntersecting.current = entry.isIntersecting

        if (entry.isIntersecting) {
          autoCollapseRef.current = true
        }
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [isMobile])

  /* ── Manual toggle disables auto-collapse ─────────────────── */
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
    autoCollapseRef.current = false
  }, [])

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1 }} />
      <form className={styles.form_filter_container}>
        <button
          type='button'
          className={styles.toolbar_header}
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-controls={filterGroupsId}
        >
          <span className={styles.toolbar_legend}>{t('projects.filterLegend')}</span>
          <svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden='true' className={isOpen ? styles.chevron_up : styles.chevron_down}>
            <path d='M5 7 L9 11 L13 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
          </svg>
        </button>
        <div id={filterGroupsId} className={styles.filter_container}>
          <div className={`${styles.filter_animate} ${isOpen ? styles.filter_open : ''}`}>
            <TechIcons />
          </div>
        </div>
      </form>
    </>
  )
}
