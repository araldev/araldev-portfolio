# Proposal: UX Overhaul & Relayout Root-Fix

**Change**: `004-ux-overhaul-and-relayout-root-fix` · Strict TDD · both artifacts (Engram + `specs/004-.../`)

## Intent

003 shipped with `pass-with-warnings`, yet the user reports 3 visible bugs: (1) **JobsCards relayout on reload**, (2) **ProjectsCards clip-paths deformed**, (3) **AboutMe Bento proportions broken**. The 003 verify gate was a **false negative** — jsdom unit + integration + a11y never reproduces real-browser layout, so visual regressions sailed through.

Root causes re-diagnosed from current source:
- **N2**: `JobCard` images (logos, tech icons) load async AFTER first paint; `useFadeInJobCards` measures and ScrollTrigger fires before pixels stabilize. 003 P1 only adjusted FLIP timing — not the image-async cause.
- **N1**: `ProjectsCards.module.css` hardcodes `clip-path: path("... 573 64 ...")` in absolute coords against a fluid `repeat(auto-fit, minmax(425px, 575px))` grid → width is never 573px → clip-paths deform on every viewport. Plus typo `.projec_text_container`.
- **N3**: `grid-template-rows: repeat(auto-fit, minmax(200px, 300px))` lets rows expand by content (`auto`); tiles lack `height: 100%`; avatar lacks `aspect-ratio`. A flex-stack in grid clothing.
- **N4 (missing capability)**: **no visual regression test infrastructure** in the repo — the structural failure that let 003 ship broken UX. 004 installs `@playwright/test` and writes `tests/visual/` BEFORE fixes (RED first, then GREEN).

## Scope

### In Scope
- **N1 — ProjectsCards v3**: delete + recreate. Preserve `project` prop (`id, title, imgSrc, shortDescription, description[], tech{}, demoLink?, npmLink?, storybookLink?, codeLink?`), `onShowMore`, `ProjectModal`, `useSortProjects`, `useIsIconCheckFilter`. v2 visual language (glass, chroma, Vision Pro spring, display) **without absolute clip-paths**.
- **N2 — JobsSection relayout root-fix**: wait for `window.load` + `img.decode()` before ScrollTrigger; `min-height` on `.job_card`; `aspect-ratio: 1` on logo wrapper and tech icons.
- **N3 — AboutMe Bento proportions**: `grid-template-rows: repeat(6, 1fr)`; `height: 100%` on tiles; `aspect-ratio: 1` on `.avatar_image`. Stable at 3 viewports.
- **N4 — Visual regression tests**: `tests/visual/` with `@playwright/test` (new devDep, justified). Snapshots at 1440/768/375. Assert JobsCards height delta = 0 (t=0 vs t=after-window-load). Assert Bento `boundingBox()` matches tokens.

### Out of Scope
NavHeader, light mode, i18n, CI/CD workflow, bundle optimization beyond 800-line budget, 5 pre-existing lint errors.

## Capabilities (contract with sdd-spec)

### New Capabilities
- `projects-cards-v3` — ProjectsCards without clip-paths, v2 visual language.
- `jobs-section-relayout-root-fix` — wait-for-load + aspect-ratio reservations, kills JobsCards first-paint relayout.
- `about-me-bento-proportions` — stable Bento (3/2/1 col), `height: 100%` on tiles, `aspect-ratio: 1` on avatar.
- `visual-regression-tests` — `@playwright/test` snapshots at 3 viewports, structural assertions on Bento + JobsCards.

### Modified Capabilities
None — greenfield or pure-fix; `JobCard`/`ProjectCard` spec-level contracts unchanged.

## Approach

- **N1**: delete + recreate. Link types, `ProjectModal`, filter-context preserved by signature. Visual contract shifts from absolute `clip-path` polygons to responsive `border-radius: var(--border-radius)` (open Q1).
- **N2**: image-async hypothesis. Three defenses: (1) `window.load` before `ScrollTrigger.create()`, (2) `await Promise.all(images.map(img => img.decode()))`, (3) CSS `aspect-ratio` + `min-height`.
- **N3**: stable tracks via `repeat(6, 1fr)`; tiles `height: 100%`; avatar `aspect-ratio: 1` is square.
- **N4**: `@playwright/test` justified because jsdom cannot reproduce real-browser layout. Tests **first** (RED), fixes pass (GREEN). Dev-time only.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/ProjectsCards/{ProjectsCards.jsx,module.css}` | Removed + New | Delete and recreate, drop clip-paths |
| `src/components/JobCard/JobCard.module.css` | Modified | `min-height`, `aspect-ratio` on logo + tech icons |
| `src/Hooks/useFadeInJobCards.js` | Modified | Wait for `window.load` + `img.decode()` before ScrollTrigger |
| `src/components/AboutMe/AboutMeSection.{jsx,module.css}` | Modified | Stable Bento grid, `height: 100%` on tiles, avatar `aspect-ratio: 1` |
| `tests/visual/` | New | Playwright snapshots + structural assertions at 3 viewports |
| `package.json` | Modified | Add `@playwright/test` devDep (justified) |
| `specs/004-.../{proposal,spec,design,tasks,verify-report}.md` | New | Full SDD chain |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Deleting ProjectsCards breaks `App.jsx` | Low | Keep `ProjectsCards` + `ProjectCard` exported names stable |
| `window.load` hangs on slow request | Med | 5s timeout fallback → proceed with measurements |
| Playwright needs browser binaries | Low | Dev-time only, no CI required |
| Bento refactor shifts visual identity | Med | Snapshot tests at 3 viewports catch regressions |
| N4 baselines flaky on first run | Med | Commit baselines; `pnpm test:visual --update` documented |

## Open Questions (ratify in sdd-spec)
1. **N1 shape**: SVG `mask-image` (flexible) or `border-radius: var(--border-radius)` (simpler, matches JobCard)?
2. **N4 command**: Playwright on every `pnpm test:run` (slow) or as separate `pnpm test:visual` (faster)?

## Rollback Plan

N1/N2/N3 each independently revertible via `git revert <commit>`. N4 is additive — no rollback. P1 = N4 (RED), P2 = N2 + N3 (GREEN), P3 = N1 (GREEN). Worst case: revert last PR, keep v2 tokens.

## Dependencies

- `@playwright/test` (new devDep — jsdom cannot reproduce real-browser layout, root cause of 003 false-negative)

## Success Criteria

- [ ] Visual regression tests exist for ProjectsCards, JobsCards, AboutMe at 3 viewports.
- [ ] JobsCards have ZERO height delta on reload (t=0 vs t=after-window-load).
- [ ] ProjectsCards renders identically at 1440/1024/768/375.
- [ ] AboutMe Bento has 6 stable rows at desktop; avatar fills hero cell; tiles `height: 100%`.
- [ ] Coverage ≥80% on 3 changed components; `pnpm test:run` passes, `pnpm run build` exits 0, no new lint.

## Constitution Alignment

- **I (Portfolio)** — fixes live bugs. **II (Performance)** — N2 defends 60fps on first paint.
- **III (A11y)** — refactors preserve keyboard nav and contrast. **IV (TDD/SDD)** — N4 IS the missing test surface (RED first).
- **V (Security)** — N1 deletion audited; no external resource changes. **VI (Animation)** — no new animations.
- **VII (Progressive Enhancement)** — HTML semantic preserved.
- **QG #2 (ESLint strict)** — aspirational; 5 pre-existing errors out of scope. **QG #4 (TypeScript)** — aspirational; repo is JS.
