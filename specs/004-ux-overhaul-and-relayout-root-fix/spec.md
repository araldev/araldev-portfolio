# Spec: UX Overhaul & Relayout Root-Fix

**Change**: `004-ux-overhaul-and-relayout-root-fix`
**Source**: `specs/004-ux-overhaul-and-relayout-root-fix/proposal.md` (intake v1)
**Artifact store**: `both` (Engram topic `sdd/004-ux-overhaul-and-relayout-root-fix/spec` + this file)
**Strict TDD**: ACTIVE — N4 written FIRST (RED baselines) before N1/N2/N3 fixes
**Phase ordering (P1 → P3)**: P1 = N4 (RED) · P2 = N2 + N3 (GREEN) · P3 = N1 (GREEN)

---

## 1. Context

003 shipped with `pass-with-warnings`. Three visible bugs slipped past the verify gate because jsdom cannot reproduce real-browser layout. 004 installs the missing visual-regression infrastructure (N4) **first** so subsequent fixes can be validated against real-browser measurements. All 003 patches (FLIP reorder animation, featured beacon pulse, `sortJobs` semantics) MUST be preserved by every capability. This spec covers **4 NEW capabilities, 0 MODIFIED** — greenfield or pure-fix, per the proposal's contract.

---

## Capability N1 — `projects-cards-v3`

### Domain
`projects-cards` (replaces current `src/components/ProjectsCards/{ProjectsCards.jsx,ProjectsCards.module.css}`).

### Type
**NEW** (full spec — no prior spec.md exists for this component). Delete + recreate.

### Purpose
Render the `ProjectsCards` section without the deformed `clip-path: path("... 573 64 ...")` polygons. Preserve the data contract, `ProjectModal` integration, and the `useSortProjects` + `useIsIconCheckFilter` context bridge. Apply v2 visual language (glass, chroma, Vision Pro spring, display title) **without absolute clip-paths**.

### Functional Requirements

- **FR-N1-01** — The component MUST accept a `project` prop with shape `{ id, title, imgSrc, shortDescription, description[], tech{}, demoLink?, npmLink?, storybookLink?, codeLink? }`. The prop MUST be required; missing `id` or `title` MUST log a dev-mode warning and render a fallback `<article>` labeled with the missing field name.
- **FR-N1-02** — The component MUST render all 4 link types conditionally and in this order: `demoLink` → "Live Demo", `npmLink` → "npm Package", `storybookLink` → "Storybook", `codeLink` → "Code". Each MUST open in a new tab with `rel="noopener noreferrer"` and `target="_blank"`. If none are present, the `links_container` MUST be hidden (no empty wrapper).
- **FR-N1-03** — The component MUST integrate `ProjectModal` via the `onShowMore(project)` callback signature (preserved from current implementation). The parent `ProjectsCards` MUST continue to call `lenis.stop()` on open and `lenis.start()` on close.
- **FR-N1-04** — The component MUST consume `useSortProjects()` to source the rendered list and `useIsIconCheckFilter()` to dim non-matching tech icons (preserve current filter bridge).
- **FR-N1-05** — The component MUST NOT define any `clip-path` rule with absolute coordinates. Acceptable alternatives: `border-radius: var(--border-radius)`, `clip-path: inset(...)` (percentage-only), or `mask-image: url(<svg>)` with `viewBox`-relative paths. **Open Q1** (see §4).
- **FR-N1-06** — The component MUST apply the v2 visual language defined in `specs/002-job-card-component/design.md` §2-§4 — `glass-surface` background, `chroma-text` gradient on titles, `Vision Pro spring` hover (`cubic-bezier(0.34, 1.56, 0.64, 1)`), and `display` font-size token on the title.
- **FR-N1-07** — The component MUST pass `jest-axe` with 0 violations and MUST NOT reintroduce the 003 a11y regression (duplicate `id` on cards). `aria-labelledby` MUST be unique per card using `project.id` as suffix.
- **FR-N1-08** — The exported names `ProjectsCards` and `ProjectCard` MUST be preserved. Deletion of old files MUST be paired with creation of new files in the same import path; `App.jsx` MUST NOT require changes.

### Scenarios

- **SC-N1-01 (render happy path)** — GIVEN a `project` with all 4 link types, WHEN `ProjectCard` renders, THEN all 4 anchor links are visible with correct `target`/`rel`/labels in that order: Live Demo, npm Package, Storybook, Code.
- **SC-N1-02 (zero links)** — GIVEN a `project` with no link types, WHEN `ProjectCard` renders, THEN no empty `nav` wrapper exists in the DOM, the modal-trigger "Ver detalles" button is still present, and `axe-core` reports 0 violations.
- **SC-N1-03 (filter dimming)** — GIVEN `useIsIconCheckFilter` returns `{ react: true, ts: false }` for a project with `{ react, ts, vite }` in `tech`, WHEN `ProjectCard` renders, THEN `ts`/`vite` icons receive the `--dim` class (opacity 0.35), `react` does not, and axe reports 0 violations.
- **SC-N1-04 (modal integration)** — GIVEN the user clicks "Ver detalles", WHEN the click fires, THEN `onShowMore(project)` is called with the full object, the parent's modal state opens, and `lenis.stop()` is invoked exactly once (asserted by spy on the `useLenis` mock).

### Edge Cases

- **EC-N1-01 (no `imgSrc`)** — A `project` without `imgSrc` renders a `glass-surface` placeholder with the project title as accessible label (`role="img" aria-label={title}`) and no broken-image icon.
- **EC-N1-02 (empty `tech{}`)** — A `project` with `tech = {}` omits the tech-icons row entirely (no "No technologies" placeholder, per FR-N1-04 symmetry with `JobCard` EC-002).
- **EC-N1-03 (zero `description[]`)** — A `project` with `description = []` renders no empty `<ul>`; only `shortDescription` and the divider are shown.
- **EC-N1-04 (JobsCards contract unchanged)** — After N1 ships, 002 JobsCards integration tests re-run unmodified and pass (no shared import, no shared CSS variable mutation).

### Test Surface (TDD-Forward)

sdd-tasks will create:

- `tests/unit/ProjectsCards.test.jsx` — render with each link combination, dimming logic, no-links path, propTypes warning.
- `tests/a11y/ProjectsCards.a11y.test.jsx` — `jest-axe` 0-violation, no duplicate-id regression, `aria-labelledby` uniqueness.
- `tests/integration/ProjectsCards.filter.test.jsx` — `useIsIconCheckFilter` integration: `react` active dims `ts`/`vite`; deactivation restores opacity.
- `tests/integration/ProjectsCards.modal.test.jsx` — click "Ver detalles" opens modal; `lenis.stop()` called once; `Escape` closes.
- `tests/visual/projects-cards.spec.js` (Playwright — see N4) — 3-viewport snapshot + axe run.

### Constitution Alignment

- **I (Portfolio)** — restores the visual contract broken in 003.
- **II (Performance)** — `border-radius` / `mask-image` are GPU-cheap; no reflow on hover.
- **III (A11y)** — FR-N1-07 enforces `aria-labelledby` uniqueness; `jest-axe` is the gate.
- **IV (TDD/SDD)** — N4 visual tests cap the FR-N1-05 "no absolute clip-paths" rule.
- **V (Security)** — deletion is local; no external resources added or removed.
- **VI (Animation)** — hover spring is the only animation; respects `prefers-reduced-motion`.
- **VII (Progressive Enhancement)** — semantic `<article>`, `<h3>`, `<nav>` preserved; HTML readable without CSS.

---

## Capability N2 — `jobs-section-relayout-root-fix`

### Domain
`jobs-cards` (additive fix to 002's `JobCard` + `useFadeInJobCards`).

### Type
**NEW** (additive; documented as a 002 supplement so the test surface is preserved if 002 is archived before 004).

### Purpose
Eliminate the JobsCards first-paint relayout caused by image-async loading. Three independent defenses (CSS reservation, `window.load` wait, `img.decode()` wait) are layered. The 003 FLIP reorder animation and featured-card beacon pulse MUST be preserved.

### Functional Requirements

- **FR-N2-01** — `useFadeInJobCards` MUST await a Promise that resolves on the `window.load` event before calling `ScrollTrigger.create`. If `window.load` does not fire within **5000ms**, the wait MUST be abandoned via `Promise.race` and ScrollTrigger MUST be created anyway (timeout fallback).
- **FR-N2-02** — `useFadeInJobCards` MUST call `await Promise.all(Array.from(images).map(img => img.decode().catch(() => {})))` for every `<img>` inside `[data-job-card]` nodes, BEFORE the ScrollTrigger fires. Decode rejections (404, broken src) MUST be swallowed silently.
- **FR-N2-03** — `.job_card` MUST declare `min-height: var(--job-card-min-height)` (new design token, default `280px`) to prevent initial collapse before fonts/images settle.
- **FR-N2-04** — `.job_card_logo_wrapper` MUST declare `aspect-ratio: 1` so the 56×56 box reserves space even when `companyLogo` is `undefined` and the initials placeholder is the only child.
- **FR-N2-05** — `.job_card_stack .tech_icon` MUST declare `aspect-ratio: 1` so SVG icons reserve a 40×40 box before the SVG itself paints.
- **FR-N2-06** — All 002 + 003 patches MUST be preserved: FLIP reorder (`useFlipJobs`), featured beacon pulse (`useBeaconPulse`), `data-featured` selector styling. Reverting N2 MUST NOT remove these.
- **FR-N2-07** — `tests/integration/JobsCards.relayout.test.jsx` MUST mock images with a **500ms** artificial delay and assert that `getBoundingClientRect().height` of every `[data-job-card]` at `t=0` (after first paint, before `window.load`) is EQUAL to `t=after-load` within a **±1px** tolerance for sub-pixel rounding.
- **FR-N2-08** — The 5-second `window.load` timeout default MUST be exposed as a module-level constant (e.g. `WINDOW_LOAD_TIMEOUT_MS = 5000`) so it can be tuned in tests and documented in `tests/visual/README.md`.

### Scenarios

- **SC-N2-01 (no relayout on hard reload)** — In a real browser at 1440×900 with cold cache, hard-reload produces no visible content jump in the JobsCards section (Playwright `boundingBox()` delta = 0 between `t=DOMContentLoaded` and `t=window.load`).
- **SC-N2-02 (FLIP reorder preserved)** — When the filter toggles `react` on and the sort updates, the FLIP animation runs (asserted by `useFlipJobs` being called and CSS transforms transitioning over 250–350ms).
- **SC-N2-03 (beacon pulse preserved)** — A featured job card entering the viewport has `data-beacon-core` / `data-beacon-halo` running `animation: jobFeaturedBorder 4s infinite` and the pulse cycles.
- **SC-N2-04 (axe clean)** — After the fix lands, `tests/a11y/JobCard.a11y.test.jsx` re-runs with 0 jest-axe violations and no new warnings (constitution QG #5).

### Edge Cases

- **EC-N2-01 (image 404)** — `<img src="/logos/missing.webp">` 404s, `img.decode()` rejects, the catch swallows the error, the placeholder initials render, and no unhandled rejection appears in console.
- **EC-N2-02 (image already cached)** — All images are HTTP-cached; `img.decode()` resolves immediately (<10ms each); no perceptible delay; `window.load` resolves at the same paint frame.
- **EC-N2-03 (`window.load` hangs)** — A slow third-party script blocks `window.load` past 5s; the timeout fires; ScrollTrigger is created with the current measurements (cards may be slightly off, but the page is interactive).
- **EC-N2-04 (mixed image-load speeds)** — 4 cards with images that resolve at 100ms / 200ms / 500ms / 1200ms; `Promise.all` awaits all; ScrollTrigger fires at t≈1200ms; no card animates in early.

### Test Surface (TDD-Forward)

sdd-tasks will create:

- `tests/integration/JobsCards.relayout.test.jsx` — slow-image mock (500ms); assert `getBoundingClientRect().height` delta = 0 between t=0 and t=after-load.
- `tests/integration/useFadeInJobCards.timing.test.jsx` — assert `window.load` await + `img.decode()` await; mock `Promise.race` for timeout; assert `WINDOW_LOAD_TIMEOUT_MS` export.
- `tests/unit/JobCard.module.css.test.js` *(NEW pattern)* — uses `getComputedStyle` in jsdom + a css-token resolver to assert `min-height`, `aspect-ratio` declarations exist on the right selectors.
- `tests/visual/jobs-cards.spec.js` (Playwright — see N4) — viewport snapshots + height-delta assertion at 3 viewports.

### Constitution Alignment

- **I (Portfolio)** — kills a live bug reported by the user.
- **II (Performance)** — defends 60fps on first paint; `aspect-ratio` + `min-height` avoid layout thrash.
- **III (A11y)** — no a11y regression: keyboard nav and contrast preserved (003 patches kept).
- **IV (TDD/SDD)** — N4 visual test is the regression net; relayout test is RED-first.
- **V (Security)** — no new dependencies, no external resources.
- **VI (Animation)** — `prefers-reduced-motion` path preserved (003 work intact).
- **VII (Progressive Enhancement)** — HTML rendered immediately; CSS reservations defend it.

---

## Capability N3 — `about-me-bento-proportions`

### Domain
`about-me` (replaces the ad-hoc grid in `src/components/AboutMe/AboutMeSection.{jsx,module.css}`).

### Type
**NEW** (additive to 001 portfolio-docs; documented as a feature supplement).

### Purpose
Stabilize the Bento grid of `AboutMeSection` so tile dimensions are deterministic across viewports. Replace `repeat(auto-fit, minmax(200px, 300px))` (rows expand by content) with `repeat(6, 1fr)` (rows are fixed tracks) and add `height: 100%` to every tile so the grid area is filled. Define explicit `aspect-ratio` for `.avatar_image` and `.brand_image`, plus a `max-width: 60ch` cap on bio text (constitution §III typography rule).

### Functional Requirements

- **FR-N3-01** — `.grid_container` MUST use `grid-template-rows: repeat(6, 1fr)` at desktop (≥1200px). Each tile MUST be placed in an explicit `grid-area` (or `grid-row`/`grid-column`) so rows are deterministic, not content-driven.
- **FR-N3-02** — Every `.bento_*` tile MUST declare `height: 100%` so it fills its grid area regardless of content length. The current `> *` selector MUST be extended with `height: 100%` (it already sets `border` and `border-radius`).
- **FR-N3-03** — `.avatar_image` MUST declare `aspect-ratio: 1; object-fit: cover; max-width: 360px; max-height: 360px;` so the hero cell renders a square avatar bounded to a 360px ceiling (constitution typography + responsive).
- **FR-N3-04** — `.brand_image` MUST declare `aspect-ratio: 1; width: 100px;` so the brand mark is a deterministic 100×100 square at desktop.
- **FR-N3-05** — The bio text container MUST respect `max-width: 60ch` on `<p>` children (constitution typography rule) while the TILE itself fills its grid area. Padding MUST be 50px vertical and 100px horizontal at desktop, 50/50 at mobile (≤1000px).
- **FR-N3-06** — Tablet (768–1199px) and mobile (≤767px) MUST also use stable row counts (`repeat(4, 1fr)` and `repeat(2, 1fr)` respectively — exact values per Designer's `design.md`). Rows MUST NOT use `auto` at any breakpoint.
- **FR-N3-07** — `tests/integration/AboutMe.bento.test.jsx` MUST use `page.locator(...).boundingBox()` at 3 viewports (1440×900, 768×1024, 375×812) and assert each tile's `width` and `height` match the design tokens within **±2px** tolerance.
- **FR-N3-08** — The component MUST pass `jest-axe` with 0 violations. `aria-label`s on decorative images MUST be present and semantic landmarks (`<aside>`, `<section id="about-me">`) MUST remain.

### Scenarios

- **SC-N3-01 (avatar hero — desktop)** — At viewport 1440×900, `.avatar_image` occupies the hero cell defined by `design.md` (a multi-row × multi-col area), with `boundingBox` height ≈ rows × row-track height.
- **SC-N3-02 (avatar 2×2 — tablet)** — At viewport 768×1024, `.avatar_image` occupies a 2-row × 2-col cell, square via `aspect-ratio: 1`.
- **SC-N3-03 (full-width — mobile)** — At viewport 375×812, `.avatar_image` spans full width (1 col × 2 rows) and is square.
- **SC-N3-04 (bio fills area, text capped 60ch)** — At viewport 1440×900, the bio text container fills its grid area (5×3 per `design.md`), with `<p>` text capped at `max-width: 60ch` (≈540px at 9px/char).

### Edge Cases

- **EC-N3-01 (long bio overflow)** — 4 paragraphs totaling 1200 words: the bio tile does NOT exceed its grid area; content is constrained by the cell; no page reflow.
- **EC-N3-02 (missing brand image)** — `brand-araldev.webp` 404s; `.brand_image` collapses to a 100×100 placeholder with `alt` text visible to AT (per FR-N3-08).
- **EC-N3-03 (320px viewport)** — Smaller than designed mobile: no horizontal scrollbar; tiles wrap or stack with no overflow.
- **EC-N3-04 (3440px ultra-wide)** — Tiles remain bounded by `--width-web-content` (or equivalent max-width); `max-width: 360px` on the avatar prevents grotesque scaling.

### Test Surface (TDD-Forward)

sdd-tasks will create:

- `tests/integration/AboutMe.bento.test.jsx` — Playwright `boundingBox()` at 3 viewports; tile dimensions ±2px.
- `tests/a11y/AboutMe.a11y.test.jsx` — `jest-axe` 0 violations; semantic landmarks intact.
- `tests/unit/AboutMeSection.module.css.test.js` *(NEW pattern, same as N2)* — `getComputedStyle` checks: `grid-template-rows` not containing `auto`, `height: 100%` on `> *`.
- `tests/visual/about-me-bento.spec.js` (Playwright — see N4) — 3-viewport snapshot + structural assertion.

### Constitution Alignment

- **I (Portfolio)** — fixes a visible layout bug.
- **II (Performance)** — `aspect-ratio` + `1fr` rows avoid CLS, contributing to LCP/CLS metrics.
- **III (A11y)** — `60ch` cap is a typography a11y rule (line length); alt text preserved.
- **IV (TDD/SDD)** — N4 visual test captures the deterministic tokens.
- **V (Security)** — no new dependencies.
- **VI (Animation)** — no new animations; the existing `useFadeInElement` hook is preserved.
- **VII (Progressive Enhancement)** — semantic `<aside>`, `<h2>`, `<p>` hierarchy preserved.

---

## Capability N4 — `visual-regression-tests`

### Domain
`testing` (cross-cutting infrastructure; new test surface not present in any prior feature).

### Type
**NEW** — installs a new devDep and a new test surface.

### Purpose
Add `tests/visual/` with `@playwright/test` to reproduce real-browser layout, snapshot critical sections at 3 viewports (1440, 768, 375), and provide structural assertions that jsdom cannot do (JobsCards height delta = 0, Bento `boundingBox` matches tokens). This is the structural fix for the 003 false-negative: jsdom cannot reproduce layout, so we MUST have a real-browser test surface.

### Functional Requirements

- **FR-N4-01** — A new devDependency `@playwright/test` MUST be added to `package.json` (justified in §6 Dependencies — jsdom cannot reproduce layout, root cause of 003 false-negative).
- **FR-N4-02** — A new directory `tests/visual/` MUST contain at least 3 spec files: `tests/visual/projects-cards.spec.js`, `tests/visual/jobs-cards.spec.js`, `tests/visual/about-me-bento.spec.js`. A `tests/visual/README.md` MUST document run + update instructions.
- **FR-N4-03** — Each spec MUST snapshot its target section at 3 viewports: 1440×900, 768×1024, 375×812. Baselines MUST be committed under `tests/visual/__snapshots__/`.
- **FR-N4-04** — `jobs-cards.spec.js` MUST assert `getBoundingClientRect().height` of every `[data-job-card]` is unchanged between `t=DOMContentLoaded` and `t=window.load` within **±1px** — this is the structural assertion that protects N2.
- **FR-N4-05** — `about-me-bento.spec.js` MUST assert each tile's `boundingBox()` matches the design tokens within **±2px** at all 3 viewports — this is the structural assertion that protects N3.
- **FR-N4-06** — `jest-axe` MUST be integrated into the Playwright specs via `@axe-core/playwright` (new devDep, also justified in §6). Each visual spec MUST run `axe.run()` against the target section and assert 0 violations.
- **FR-N4-07** — A `playwright.config.js` MUST configure `webServer: { command: 'pnpm dev', port: 5173, reuseExistingServer: true, timeout: 10_000 }`. Boot MUST complete in <10s; if slower, the test MUST fail with a clear error.
- **FR-N4-08** — The visual tests MUST be dev-time only — accessible via a separate `pnpm test:visual` script. Vitest config MUST exclude `tests/visual/**` so `pnpm test:run` does not pick them up. The exact command split is **Open Q2** (see §4); the default below is the separate-command path.

### Scenarios

- **SC-N4-01 (3 specs green against baseline)** — After N1/N2/N3 fixes land, `pnpm test:visual` exits 0; all 9 snapshots (3 specs × 3 viewports) match the committed baselines; 0 jest-axe violations across all specs.
- **SC-N4-02 (zero flaky tests)** — Running `pnpm test:visual` 3 consecutive times produces exit code 0 every time, with no `expect.toMatchSnapshot` retries logged.
- **SC-N4-03 (dev server boots <10s)** — With no dev server running, `pnpm test:visual` starts; the `webServer` spawns, listens on port 5173, and the first test fires within 10 seconds.
- **SC-N4-04 (command split honored)** — On a clean checkout, `pnpm test:run` does NOT include visual specs (Vitest config excludes `tests/visual/`); `pnpm test:visual` runs only visual specs in ≤60s for 3 specs at 3 viewports.

### Edge Cases

- **EC-N4-01 (viewport 0)** — A malformed viewport (e.g. `viewport: { width: 0, height: 0 }`) fails fast with a clear Playwright error; no infinite loop, no empty-page screenshot.
- **EC-N4-02 (no dev server)** — With nothing on port 5173, `webServer` spawns one; if port is busy, `reuseExistingServer: true` reuses the existing process.
- **EC-N4-03 (browser binaries not installed)** — Fresh `pnpm install` with no `~/.cache/ms-playwright/`: the developer sees a clear "run `npx playwright install chromium`" error; the test does NOT silently skip.
- **EC-N4-04 (stale snapshots from 003)** — On a stale branch, all baselines are detected as mismatches and the developer is guided to `pnpm test:visual --update`; no silent passes.

### Test Surface (TDD-Forward)

This capability IS the test surface. sdd-tasks will create:

- `tests/visual/projects-cards.spec.js` — 3-viewport snapshot of `ProjectsCards` section.
- `tests/visual/jobs-cards.spec.js` — 3-viewport snapshot + height-delta assertion.
- `tests/visual/about-me-bento.spec.js` — 3-viewport snapshot + `boundingBox` structural assertion.
- `playwright.config.js` — `webServer` boot, 3-viewport matrix, screenshot-on-failure.
- `tests/visual/README.md` — run + update instructions.
- `tests/visual/axe-fixture.js` — `@axe-core/playwright` helper wrapping `axe.run()`.
- `package.json` script: `"test:visual": "playwright test"`.

### Dependencies (justified)

| Package | Type | Justification |
|---------|------|---------------|
| `@playwright/test` | devDep | jsdom cannot reproduce real-browser layout. Without this, 003-class regressions keep passing CI. |
| `@axe-core/playwright` | devDep | Extends jest-axe semantics into Playwright; 003 a11y lives in Vitest/jsdom — this extends coverage to real-browser a11y. |

### Constitution Alignment

- **I (Portfolio)** — preserves visual identity by snapshot regression.
- **II (Performance)** — height-delta assertion is a CLS guard.
- **III (A11y)** — `@axe-core/playwright` extends jest-axe to real-browser.
- **IV (TDD/SDD)** — this IS the TDD test surface for N1/N2/N3 fixes (RED-first).
- **V (Security)** — no new runtime deps; devDeps only.
- **VI (Animation)** — visual snapshots include animation state, but only on stable frames.
- **VII (Progressive Enhancement)** — Playwright runs against the real SPA, so PE-fallback paths are exercised.

---

## 2. Cross-Cutting Test Strategy

| Capability | Unit | Integration | A11y | Visual |
|------------|------|-------------|------|--------|
| **N1** | `ProjectsCards.test.jsx` | filter + modal | `ProjectsCards.a11y.test.jsx` | `projects-cards.spec.js` |
| **N2** | `useFadeInJobCards.timing` + CSS | `JobsCards.relayout.test.jsx` (slow-image) | (re-use 002) | `jobs-cards.spec.js` |
| **N3** | `AboutMeSection.module.css` (`getComputedStyle`) | `AboutMe.bento.test.jsx` (`boundingBox`) | `AboutMe.a11y.test.jsx` | `about-me-bento.spec.js` |
| **N4** | — | — | via `@axe-core/playwright` | (all 3 specs) |

- Vitest stays the unit + integration + jsdom-a11y gate (`pnpm test:run`, `pnpm test:coverage`).
- Playwright is the visual + real-browser-a11y gate (`pnpm test:visual`).
- Coverage ≥80% applies to the **3 changed components** (ProjectsCards, JobCard, AboutMeSection) per constitution QG #1; visual tests are excluded from coverage counting.

## 3. TDD-Forward Ordering (P1 → P3)

1. **P1 = N4 (RED)** — `tests/visual/` is created BEFORE any fix. Baselines are committed against the **current (broken) source**. Visual specs intentionally fail or document current state. `pnpm test:visual` boots, the first run is the "broken baseline" record.
2. **P2 = N2 + N3 (GREEN)** — N2 + N3 fixes land. Visual specs flip to passing. Relayout test (`JobsCards.relayout.test.jsx`) and `boundingBox` test (`AboutMe.bento.test.jsx`) pass green. `jest-axe` and `axe-core/playwright` stay clean.
3. **P3 = N1 (GREEN)** — ProjectsCards is deleted and recreated. Visual snapshot for `projects-cards.spec.js` is regenerated and committed as the new baseline. Filter + modal integration tests pass green.

## 4. Open Questions (carried from proposal — ratify in sdd-design)

- **OQ-N1-01 (N1 organic shape)** — SVG `mask-image` (flexible, allows arbitrary organic curves) vs `border-radius: var(--border-radius)` (simpler, matches JobCard style). **Recommended**: `border-radius` for visual consistency with v2 language; reserve `mask-image` for a future "premium" variant. **Ratification needed before sdd-design.**
- **OQ-N4-02 (N4 command split)** — Playwright on every `pnpm test:run` (slow, ~60s added) vs separate `pnpm test:visual` (faster feedback, but Playwright is not in the default CI gate). **Recommended**: separate `pnpm test:visual`; Vitest stays the gate. **Ratification needed before sdd-design.**

## 5. Out of Scope (carried from proposal)

- NavHeader, light mode, i18n, CI/CD workflow, bundle optimization beyond the 800-line budget, 5 pre-existing lint errors (constitution QG #2 aspirational; repo is JS so QG #4 aspirational).

## 6. Deliverable Boundaries

- This spec covers **4 NEW capabilities, 0 MODIFIED**.
- Implementation MUST follow the TDD ordering (P1 = N4 RED, P2 = N2 + N3 GREEN, P3 = N1 GREEN) — see `Rollback Plan` in the proposal.
- All visual / CSS / class-name / file-path decisions are delegated to **sdd-design**. This spec describes WHAT, not HOW.
- All task breakdown and test sequencing are delegated to **sdd-tasks**.

---

**Version**: 0.1.0 · **Created**: 2026-06-02 · **Status**: Ready for Design
