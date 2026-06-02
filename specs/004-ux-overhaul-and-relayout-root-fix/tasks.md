# Tasks: UX Overhaul & Relayout Root-Fix

**Change**: `004-ux-overhaul-and-relayout-root-fix` · **Strict TDD**: ACTIVE · **Ordering**: P1=N4(RED) → P2=N2+N3(GREEN) → P3=N1(GREEN) · **Coverage trap**: `vitest.config.js` `coverage.include` MUST add `ProjectsCards/**` + `AboutMe/**` (N1, N3 in-scope).

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated LOC (code+tests+config) | ~1100 (P1:250 · P2:500 · P3:350) |
| 400-line budget risk per PR | P1:Low · P2:Medium · P3:Low |
| Chained PRs recommended | Yes (3-PR stacked-to-main) |
| Delivery strategy | `auto-chain` (cached) |
| Chain strategy | `stacked-to-main` |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Work Units

| Unit | Goal | PR | Base | Notes |
|------|------|----|------|-------|
| WU-N4 | Playwright infra + RED baselines | PR1 | main | Baselines against current broken source |
| WU-N2 | JobsCards relayout root-fix | PR2 | main | 5 fix layers; hook+CSS; flip RED→GREEN |
| WU-N3 | AboutMe Bento proportions | PR2 | main | CSS-only; boundingBox test passes |
| WU-N1 | ProjectsCards v3 delete+recreate | PR3 | main | No absolute clip-path; regenerate baselines |

---

## Cross-Cutting (P1)

- [ ] T-001 | `vitest.config.js`: add `ProjectsCards/**` + `AboutMe/**` to `coverage.include` | trace: QG#1,FR-N1,N3 | ac: 80% gate active for new code
- [ ] T-002 | `vitest.config.js`: exclude `tests/visual/**` from Vitest default | trace: FR-N4-08,SC-N4-04 | ac: `pnpm test:run` skips visual specs

---

## PR 1 — WU-N4 (RED) | branch: `004-n4-visual-regression` → `main`

**Verify**: `pnpm exec playwright install chromium` · `pnpm test:visual` exits 0 (baselines = current source) · `git diff --stat` ≤250

- [ ] T-101 | `package.json`: add devDeps `@playwright/test` + `@axe-core/playwright` | trace: FR-N4-01,FR-N4-06 | ac: `pnpm install` clean
- [ ] T-102 | `package.json`: add `test:visual` + `test:visual:update` scripts | trace: FR-N4-08 | ac: `pnpm test:visual` runs playwright
- [ ] T-103 | `tests/visual/playwright.config.js`: 3-viewport matrix, webServer `:5173`, chromium only, retries=2 CI | trace: FR-N4-07,OQ-N4-02 | ac: dev server boots <10s
- [ ] T-104 | `tests/visual/axe-fixture.js`: `runAxe(page,selector)` helper | trace: FR-N4-06 | ac: returns violations array
- [ ] T-105 | `tests/visual/projects-cards.spec.js` + 3 baselines: 1440/768/375 snapshot `#projects` (RED) | trace: FR-N1-05,FR-N4-03,SC-N4-01 | ac: baselines recorded from current source
- [ ] T-106 | `tests/visual/jobs-cards.spec.js`: 3-viewport snapshot + height-delta ≤1px (RED) | trace: FR-N2-07,FR-N4-04,SC-N2-01 | ac: structural assertion FAILS until N2
- [ ] T-107 | `tests/visual/about-me-bento.spec.js`: 3-viewport snapshot + `boundingBox` ±2px (RED) | trace: FR-N3-07,FR-N4-05,SC-N3-01..03 | ac: structural assertion FAILS until N3
- [ ] T-108 | `tests/visual/.gitignore` + `tests/visual/README.md` (install/run/update) | trace: FR-N4-02,EC-N4-03 | ac: README docs `playwright install chromium`
- [ ] T-109 | Install husky; `.husky/pre-commit` scope-watch `src/components/{ProjectsCards,JobsCards,JobCard,AboutMe}/` | trace: OQ-N4-01,FR-N4-08 | ac: commit on watched path runs `pnpm test:visual`
- [ ] T-110 | `package.json` `prepare: husky` | trace: OQ-N4-01 | ac: hook auto-installs

---

## PR 2 — WU-N2 + WU-N3 (GREEN) | branch: `004-n2-n3-relayout-bento` → `main`

**Verify**: `pnpm test:run` green · `pnpm test:coverage` ≥80% (3 components) · `pnpm test:visual` jobs+about-me specs pass · `pnpm run build` exit 0 · `git diff --stat` ≤500

### WU-N2: JobsCards Relayout

- [ ] T-201 | RED: `tests/integration/JobsCards.slow-image-load.test.jsx` — mock 500ms decode; height delta = 0 ±1px | trace: FR-N2-07,SC-N2-01,EC-N2-04 | ac: FAILS current hook
- [ ] T-202 | RED: `tests/unit/useFadeInJobCards.test.jsx` (update) — assert `window.load`+`img.decode`+`WINDOW_LOAD_TIMEOUT_MS=5000` | trace: FR-N2-01,FR-N2-02,FR-N2-08,EC-N2-01,EC-N2-03 | ac: 3 cases FAIL
- [ ] T-203 | RED: `tests/unit/useFlipJobs.test.jsx` (update) — assert `window.load`+`img.decode` gating; preserve `hasMountedRef` + 003 P5.2 plugin reg | trace: FR-N2-06,EC-N2-01 | ac: gating FAILS; reg test passes
- [ ] T-204 | RED: `tests/unit/JobCard.module.css.test.js` (NEW) — `getComputedStyle`: `min-height`+`aspect-ratio:1` on logo+tech icons | trace: FR-N2-03,FR-N2-04,FR-N2-05 | ac: 3 CSS assertions FAIL
- [ ] T-205 | GREEN: `src/Hooks/useFadeInJobCards.js` — `WINDOW_LOAD_TIMEOUT_MS` export, `withTimeout`, `window.load` gate, `Promise.all(img.decode())`; fix v1 leak | trace: FR-N2-01,FR-N2-02,FR-N2-08 | ac: T-202 passes
- [ ] T-206 | GREEN: `src/Hooks/useFlipJobs.js` — mirror gating; preserve `gsap.registerPlugin(Flip)` | trace: FR-N2-06,SC-N2-02 | ac: T-203 passes
- [ ] T-207 | GREEN: `src/components/JobCard/JobCard.module.css` — 3 rules: `min-height: var(--job-card-min-height)`, `aspect-ratio: 1` on logo wrapper + tech icons | trace: FR-N2-03,FR-N2-04,FR-N2-05 | ac: T-204 passes
- [ ] T-208 | GREEN: `src/components/JobCard/JobCardLogo.module.css` — `aspect-ratio: 1` (or co-locate in JobCard.module.css) | trace: FR-N2-04 | ac: `aspectRatio === '1'`
- [ ] T-209 | `src/index.css`: add `--job-card-min-height: 440px` (OQ-N2-01 override) | trace: OQ-N2-01,FR-N2-03 | ac: token resolves; no JobsCards regression

### WU-N3: AboutMe Bento

- [ ] T-210 | RED: `tests/integration/AboutMeSection.bento-proportions.test.jsx` (NEW, Playwright `boundingBox`) — tile w/h ±2px @ 3 viewports | trace: FR-N3-07,SC-N3-01..03,EC-N3-01 | ac: FAILS current `auto` grid
- [ ] T-211 | RED: `tests/a11y/AboutMeSection.a11y.test.jsx` (update) — 0 jest-axe @ 3 viewports; `<aside>`+`<section id="about-me">` preserved | trace: FR-N3-08,SC-N3-04 | ac: a11y gate green
- [ ] T-212 | RED: `tests/unit/AboutMeSection.module.css.test.js` (NEW) — `getComputedStyle`: rows≠`auto`, `height: 100%` on `> *` | trace: FR-N3-01,FR-N3-02,FR-N3-06 | ac: 2 CSS assertions FAIL
- [ ] T-213 | GREEN: `src/components/AboutMe/AboutMeSection.module.css` — `grid-template-rows: repeat(6, var(--bento-row-height))` desktop / `repeat(4,1fr)` ≤1450px / `repeat(2,1fr)` ≤1000px; `height: 100%` on `> *`; `aspect-ratio: 1; max-w/h 360px` avatar; `aspect-ratio: 1; width 100px` brand; `max-width: 60ch` on `> p` | trace: FR-N3-01..06 | ac: T-210+T-212 pass
- [ ] T-214 | `src/components/AboutMe/AboutMeSection.jsx` — verify no logic change; add `grid-area` if needed | trace: FR-N3-01,EC-N4-03 | ac: diff = class/area only
- [ ] T-215 | `src/index.css`: add `--bento-row-height: clamp(110px, 14vh, 180px)` | trace: FR-N3-01 | ac: token resolves

---

## PR 3 — WU-N1 (GREEN) | branch: `004-n1-projects-cards-v3` → `main`

**Verify**: `pnpm test:run` green · `pnpm test:coverage` ProjectsCards ≥80% · `pnpm test:visual` projects-cards exits 0 · `git diff --stat` ≤350

- [ ] T-301 | RED: `tests/unit/ProjectsCards.v3.test.jsx` (NEW) — each link combo, dimming, no-links, propTypes warning; `clipPath === 'none'` | trace: FR-N1-01,FR-N1-02,FR-N1-05,SC-N1-01,SC-N1-02,EC-N1-01..03 | ac: FAILS current
- [ ] T-302 | RED: `tests/a11y/ProjectsCards.v3.a11y.test.jsx` (NEW) — jest-axe 0; `aria-labelledby="project-{id}-title"` unique | trace: FR-N1-07,SC-N1-03 | ac: a11y gate green
- [ ] T-303 | RED: `tests/integration/ProjectsCards.v3.filter.test.jsx` (NEW) — `useIsIconCheckFilter` dims non-matching tech (opacity 0.35) | trace: FR-N1-04,SC-N1-03 | ac: FAILS current
- [ ] T-304 | RED: `tests/integration/ProjectsCards.v3.modal.test.jsx` (NEW) — "Ver detalles" → `onShowMore`; `lenis.stop()` ×1; `Escape` closes | trace: FR-N1-03,SC-N1-04 | ac: FAILS current
- [ ] T-305 | `src/components/ProjectsCards/ProjectsCards.jsx` — DELETE (broken `clip-path: path("... 573 64 ...")` + typo) | trace: FR-N1-08 | ac: `App.jsx` import path preserved
- [ ] T-306 | `src/components/ProjectsCards/ProjectsCards.module.css` — DELETE | trace: FR-N1-05 | ac: file gone
- [ ] T-307 | GREEN: `src/components/ProjectsCards/ProjectsCards.jsx` (RECREATE) — `border-radius: var(--border-radius)` + 1 SVG `mask-image` 18×18 top-left; `radialZoom` body; `useSortProjects`+`useIsIconCheckFilter` preserved; `aria-labelledby` unique; `onShowMore(project)`; dev-mode propTypes warning | trace: FR-N1-01..08,SC-N1-01..04,EC-N1-01..04,OQ-N1-01 | ac: T-301..T-304 pass
- [ ] T-308 | GREEN: `src/components/ProjectsCards/ProjectsCards.module.css` (RECREATE) — `align-items: stretch`; `aspect-ratio: var(--project-image-aspect)`; no `clip-path` | trace: FR-N1-05,FR-N1-06,OQ-N1-01 | ac: `clipPath === 'none'`
- [ ] T-309 | `src/index.css`: add `--project-card-min-height: 520px`, `--project-image-aspect: 4/3` | trace: FR-N1-05,OQ-N1-01 | ac: tokens resolve
- [ ] T-310 | `pnpm test:visual:update` — regenerate `tests/visual/__snapshots__/projects-{1440,768,375}.png`; commit new baselines | trace: FR-N4-03,EC-N4-04,SC-N4-01,SC-N4-02 | ac: 3 baselines match v3; visual exits 0; 0 axe violations

---

## Commit ordering (TDD-Forward, work-unit commits)

Per `work-unit-commits`: 1 task = 1 commit. Test commits precede source commits. Visual baseline update is the LAST commit of PR 3.

## Out-of-scope (NOT in this tasks.md)

NavHeader · light mode · i18n · CI/CD workflow · bundle optimization >800 LOC · 5 pre-existing lint errors · `App.jsx` modification (N1 preserves exports per FR-N1-08; 002 integration tests pass unmodified per EC-N1-04).

---

**Version**: 0.1.0 · **Created**: 2026-06-02 · **Author**: sdd-tasks sub-agent · **Status**: Ready for sdd-apply (3-PR chain stacked-to-main)
