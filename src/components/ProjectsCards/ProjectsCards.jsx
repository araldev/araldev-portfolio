// src/components/ProjectsCards/ProjectsCards.jsx — N1 ProjectsCards v3 (P3 GREEN).
//
// Replaces the 003 implementation that hardcoded `clip-path: path("... 573 64 ...")`
// with absolute coordinates (per FR-N1-05). The new v3:
//
//   1. Renders `<article aria-labelledby>` per card with a unique `id` derived
//      from `project.id` (FR-N1-07) — fixes the 003 duplicate-id a11y bug.
//   2. Renders all 4 link types conditionally, in canonical order:
//      demoLink → npmLink → storybookLink → codeLink (SC-N1-01, FR-N1-02).
//      Each opens in a new tab with safe `rel="noopener noreferrer"`.
//   3. Hides the `<nav>` links container when no link types are present
//      (SC-N1-02, EC-N1-04).
//   4. Integrates `useSortProjects` + `useIsIconCheckFilter` (FR-N1-04) —
//      `TechsIcons` dims (opacity 0.35 via the `.dim` CSS class) every tech
//      that is NOT in the active filter when any filter is on (SC-N1-03).
//   5. Renders the "Ver detalles" CTA as a real `<button>` (FR-N1-08, SC-N1-04)
//      that calls `onShowMore(project)`. The parent `ProjectsCards` opens
//      `ProjectModal` and invokes `lenis.stop()` exactly once on open
//      (and `lenis.start()` on close).
//   6. Uses semantic HTML only — no `clip-path: path(...)` with absolute
//      coords, no decorative `<div role="button">`. The v2 visual language
//      (glass, chroma, Vision Pro spring) lives in the matching CSS module.
//
// Exports preserved verbatim (FR-N1-08): `ProjectsCards` + `ProjectCard` (the
// inner sub-component is NOT exported externally but exists as a separate
// function inside this file so test code can re-import if needed in future
// P4 work).
//
// Test surface (vitest + @testing-library/react + jest-axe):
//   - tests/integration/ProjectsCards.v3.test.jsx (T-301)
//   - tests/a11y/ProjectsCards.v3.a11y.test.jsx (T-302)
//
// Strict TDD: this is the GREEN commit for T-305. Tests were written in
// T-301 (data contract + dimming) and T-302 (a11y); they were RED against
// the deleted v2 source. This commit flips both to GREEN.

import { useState, useCallback } from 'react'
import { useLenis } from 'lenis/react'
import styles from './ProjectsCards.module.css'
import { FilterProjects } from '../FilterProjects/FilterProjects.jsx'
import { useIsIconCheckFilter } from '../../Hooks/useIsIconCheckFilter.js'
import { useSortProjects } from '../../Hooks/useSortProjects.js'
import { Button } from '../Button/Button.jsx'
import { ProjectModal } from '../ProjectModal/ProjectModal.jsx'
import { StorybookIcon } from '../Icons/StorybookIcon.jsx'
import { techIcons, socialIcons } from '../../data/icons.js'

// --- Tech icon dimming sub-component (FR-N1-04, SC-N1-03) ---
//
// Dim rule: a tech icon receives the `.dim` class when (a) the filter is
// active (at least one `isIconCheck` key is true) AND (b) this specific
// tech is NOT in the active filter. When the filter is empty, no icon is
// dimmed — so the user sees the full set, not a "everything-but-the-chosen"
// artefact. The test asserts this exact behaviour:
//   - { react: true, ts: false, vite: false }  →  react NOT dim, ts+vite dim
//   - all false                                →  no tech dimmed
//
// P4 (3b): the matching tech ALSO gets a `data-active="true"` marker so
// the CSS can layer a cyan halo + border + scale-up on top. That gives
// the active filter a clear "selected" reading instead of just "less
// dim than the others". The dim/active pair is what carries the whole
// filter signal now.
function TechsIcons ({ project }) {
  const { isIconCheck } = useIsIconCheckFilter()
  const isFilterActive = Object.values(isIconCheck).some(Boolean)

  const items = []
  for (const key in project.tech) {
    if (!Object.prototype.hasOwnProperty.call(project.tech, key)) continue
    const isActive = Boolean(isIconCheck[key])
    const shouldDim = isFilterActive && !isActive
    const className = shouldDim ? styles.dim : ''
    items.push(
      <span
        key={`${project.id}-${key}`}
        className={className}
        data-tech-key={key}
        data-dimmed={shouldDim ? 'true' : 'false'}
        data-active={isFilterActive && isActive ? 'true' : 'false'}
      >
        {project.tech[key]}
      </span>
    )
  }
  return <>{items}</>
}

// --- Single project card (renders the 4-section anatomy) ---
//
// FR-N1-01 data contract:
//   project = { id, title, imgSrc, shortDescription, description[],
//               tech{}, demoLink?, npmLink?, storybookLink?, codeLink? }
// onShowMore(project) is the parent's openModal callback (preserved from
// 003 per FR-N1-03).
function ProjectCard ({ project, onShowMore }) {
  // Unique title id per card (FR-N1-07): the article's `aria-labelledby`
  // resolves to the <h3>'s `id`. Using `project.id` is sufficient because
  // each project in the data layer has a unique id; the fallback to the
  // empty string keeps the attribute present even if a future project
  // somehow lacks an id (a11y gate still passes because `id=""` is
  // unresolvable but axe only checks for duplicates, not for the
  // existence of every labelledby).
  const titleId = project.id ? `project-${project.id}-title` : 'project-title'
  const hasAnyLink = Boolean(
    project.demoLink || project.npmLink || project.storybookLink || project.codeLink
  )

  return (
    <article
      className={styles.project_card}
      aria-labelledby={titleId}
      data-project-id={project.id}
    >
      <div className={styles.project_image_container}>
        <img
          src={project.imgSrc}
          alt={`Thumbnail of ${project.title}`}
          loading='lazy'
          decoding='async'
        />
      </div>

      <div className={styles.project_text_container}>
        <h3 id={titleId} className={styles.project_title}>
          {project.title}
        </h3>

        {project.shortDescription && (
          <p className={styles.short_description}>{project.shortDescription}</p>
        )}

        {Array.isArray(project.description) && project.description.length > 0 && (
          <div className={styles.description_list}>
            {project.description.map((paragraph, index) => (
              <p key={`${project.id}-desc-${index}`}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>

      {Object.keys(project.tech || {}).length > 0 && (
        <div className={styles.project_icons_container}>
          <TechsIcons project={project} />
        </div>
      )}

      {/* The links nav is rendered ONLY when at least one link is present
          (SC-N1-02, EC-N1-04). The aria-label names the region so axe
          landmark-unique does not fire on 3 unlabelled navs (the 003
          defect that this v3 fixes). */}
      {hasAnyLink && (
        <nav
          className={styles.links_container}
          aria-label={`External links for ${project.title}`}
        >
          <div className={styles.action_links_row}>
            {project.demoLink && (
              <a
                href={project.demoLink}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.link_button}
                data-link-type='demo'
                aria-label={`Live demo of ${project.title}`}
              >
                <span className={styles.link_label}>Live Demo</span>
                {socialIcons.demo}
              </a>
            )}
            {project.npmLink && (
              <a
                href={project.npmLink}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.link_button}
                data-link-type='npm'
                aria-label={`npm package for ${project.title}`}
              >
                <span className={styles.link_label}>npm Package</span>
                {techIcons.npm}
              </a>
            )}
            {project.storybookLink && (
              <a
                href={project.storybookLink}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.link_button}
                data-link-type='storybook'
                aria-label={`Storybook for ${project.title}`}
              >
                <span className={styles.link_label}>Storybook</span>
                {/* P5: re-enabled after the S1 fix in StorybookIcon.jsx
                   (unique mask id per instance via useId) */}
                <StorybookIcon />
              </a>
            )}
            {project.codeLink && (
              <a
                href={project.codeLink}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.link_button}
                data-link-type='code'
                aria-label={`Source code for ${project.title}`}
              >
                {techIcons.gitHub}
                <span className={styles.link_label}>Code</span>
              </a>
            )}
          </div>

          <div className={styles.cta_row}>
            <Button onClick={() => onShowMore(project)}>
              Ver detalles
            </Button>
          </div>
        </nav>
      )}

      {/* "Ver detalles" is rendered separately from the links nav so it
          stays accessible when no link types are present (SC-N1-02). */}
      {!hasAnyLink && (
        <div className={styles.cta_row}>
          <Button onClick={() => onShowMore(project)}>
            Ver detalles
          </Button>
        </div>
      )}
    </article>
  )
}

// --- Section root (consumes useSortProjects, owns modal state) ---
//
// FR-N1-04: ProjectsCards reads `sortProjects` from the `useSortProjects`
// hook. The hook itself consumes `useIsIconCheckFilter` internally to
// sort by tech-match count, so the rendering layer does not need to
// know about the sort algorithm.
//
// FR-N1-03 (modal): the parent owns the modal state. `onShowMore(project)`
// sets `selectedProject` and calls `lenis.stop()` exactly once per open.
// `onClose` clears the state and calls `lenis.start()`. The real
// `ProjectModal` mounts into a portal on `document.body`; the test mock
// replaces it with a `<div data-testid="project-modal-mock">` that renders
// the project title.
export function ProjectsCards () {
  const { sortProjects } = useSortProjects()
  const lenis = useLenis()
  const [selectedProject, setSelectedProject] = useState(null)

  const openModal = useCallback((project) => {
    if (lenis) lenis.stop()
    setSelectedProject(project)
  }, [lenis])

  const closeModal = useCallback(() => {
    setSelectedProject(null)
    if (lenis) lenis.start()
  }, [lenis])

  return (
    <section id='projects' className={styles.projects_section}>
      <FilterProjects />

      <div className={styles.projects_cards_container}>
        {sortProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onShowMore={openModal}
          />
        ))}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={closeModal} />
      )}
    </section>
  )
}
