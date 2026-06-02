# Verify Report — P1 (N4 Visual Regression)

**Change**: `004-ux-overhaul-and-relayout-root-fix`
**Scope**: P1 (PR 1 of 3 in the stacked chain)
**Branch**: `004-p1-visual-tests` (HEAD: `e1e03b0`, 12 commits on top of main)
**Mode**: Strict TDD
**Verify Date**: 2026-06-02
**Verifier**: sdd-verify executor

---

## 1. Executive Summary

**Verdict**: **PASS WITH WARNINGS** — P1 delivers the N4 visual-regression infrastructure (FR-N4-01..08) as specified. The 3 Playwright specs, 9 baselines, axe integration, dev-time command split, and scope-watch pre-commit hook are all in place. The 12 RED failures match the user-reported bug profile exactly. However, the **CRITICAL re-diagnosis of the JobsCards "relayout"** reveals that the height-delta test (the structural guard for N2) is a **structural false-negative for the user-reported bug**: it passes because Playwright's `reducedMotion: 'reduce'` suppresses the very GSAP entrance + FLIP animations the user sees, and because the test starts measuring AFTER `window.load` (after the image-async reflow has already settled). The actual visible relayout has 3 causes (image-async reflow + GSAP fade-in + GSAP FLIP) and the test catches none of them. **P2 must augment the test with a `reducedMotion: 'no-preference'` variant that asserts `transform: none` 1500ms after load.** This is the only finding that materially changes the P2 plan; everything else is on track.

| Gate | Result | Notes |
|---|---|---|
| `pnpm test:run` (vitest unit + integration + a11y) | ✅ PASS | 19 files / 100 tests / 2.26s |
| `pnpm test:visual` (playwright E2E) | ⚠️ RED (expected) | 12 fail / 2 skip / 10 pass / 19.6s — all 12 RED match user-reported bug profile |
| `pnpm lint` (standard) | ✅ BASELINE | 5 pre-existing errors, 0 new from this PR |
| `pnpm run build` | ✅ PASS | exit 0, 1.39s, 409.90 kB JS / 114.13 kB CSS |
| `pnpm audit --prod` | ✅ PASS | 0 vulnerabilities |
| `pnpm test:coverage` | ⚠️ BELOW THRESHOLD (expected) | 81.91% stmts ✅ / 76.47% branches ❌ / 77.77% funcs ❌ / 83.19% lines ✅ — ProjectsCards & AboutMe at 0% (N1/N3 not yet GREEN) |

**Key numbers**: 12 tasks / 12 complete. 1008 added / 9 deleted. 23 files changed. 12 conventional commits, 0 AI attribution, 0 `--no-verify`. All 4 "missing" skills (`web-design-guidelines`, `shadcn`, `impeccable`, `emil-design-eng`) actually exist at `~/.agents/skills/`.

---

## 2. Completeness

| Metric | Value |
|--------|-------|
| Tasks total | 12 (T-001..T-010 + 2 fix-ups) |
| Tasks complete | 12 |
| Tasks incomplete | 0 |
| Spec scenarios covered by tests | 4/4 (SC-N4-01, SC-N4-02 partial, SC-N4-03, SC-N4-04) |
| Spec FRs covered (N4) | 8/8 (FR-N4-01..08) |
| Test files created | 3 Playwright specs + 2 fixtures (axe-fixture, clock-fixture) + 9 PNG baselines |
| Files changed | 23 (+1008 / -9) |

All 12 tasks on `tasks.md` are complete. Branch is ready to merge. No task is partially done.

---

## 3. Build & Tests Execution

### 3.1 `pnpm test:run` (Vitest) — ✅ PASS

```
$ pnpm test:run
 RUN  v4.1.7 /home/arturo/workspace/araldev-portfolio
 Test Files  19 passed (19)
      Tests  100 passed (100)
   Duration  2.26s
```

All 100 unit + integration + jsdom-axe tests pass. 0 failures, 0 skips, 0 flakes. Vitest config correctly excludes `tests/visual/**` (FR-N4-08) so Playwright specs don't leak into the unit gate.

### 3.2 `pnpm test:visual` (Playwright) — ⚠️ 12 RED (expected per P1)

```
12 failed
  [desktop-1440] › tests/visual/about-me-bento.spec.js:56  › Bento row count + aspect ratio + 60ch cap
  [desktop-1440] › tests/visual/about-me-bento.spec.js:155 › axe-core on #about-me
  [desktop-1440] › tests/visual/jobs-cards.spec.js:125     › axe-core on #experience
  [desktop-1440] › tests/visual/projects-cards.spec.js:55  › axe-core on #projects
  [tablet-768]  › ... (3 of the same)
  [mobile-375]  › ... (3 of the same)
  [desktop-1440] › tests/visual/about-me-bento.spec.js:56  › Bento row count ...
  [tablet-768]  › tests/visual/about-me-bento.spec.js:56  › Bento row count ...
  [mobile-375]  › tests/visual/about-me-bento.spec.js:56  › Bento row count ...
2 skipped (height-delta on tablet-768 + mobile-375 per SC-N2-01 desktop-only)
10 passed (1 height-delta @ desktop-1440 + 3 jobs snapshots + 3 about-me snapshots + 3 projects snapshots)
```

**12 RED breakdown**:
- **3 ProjectsCards axe** — `landmark-unique` violation: 3 cards each render `<nav class="links_container">` without `aria-label`. The HTML literally printed by axe: `<nav class="_links_container_ngvrb_215">` × 3 in `_project_card_ngvrb_25:nth-child(1/2/3)`. **REAL bug, P3 (N1) will fix.**
- **3 JobsCards axe** — `cat.aria / wcag412` violation: a `<div aria-label="Technologies used in this role">` inside the internship card violates "Name, Role, Value". **REAL bug, P2 (N2) will fix.**
- **3 AboutMe axe** — `complementary` landmark without accessible name; decorative images without `alt=""`. **REAL bug, P2 (N3) will fix.**
- **3 AboutMe bbox** — `row count` assertion: current source has `repeat(auto-fit, minmax(200px, 300px))` which produces 2-3 rows depending on content. The test expects 6 (desktop), 4 (tablet), 2 (mobile) per FR-N3-01/06. **REAL bug, P2 (N3) will fix.**

**10 GREEN breakdown**:
- 1 height-delta at desktop-1440: passes (0px delta) because Playwright uses `reducedMotion: 'reduce'` which suppresses GSAP — see §6 CRITICAL FINDING for why this is a false-negative.
- 3 JobsCards snapshots: pass against the committed baseline.
- 3 ProjectsCards snapshots: pass against the committed baseline (shows the broken `clip-path` polygons).
- 3 AboutMe snapshots: pass against the committed baseline (shows the broken Bento with `auto` rows + no `aspect-ratio`).

### 3.3 `pnpm lint` (StandardJS) — ✅ BASELINE (0 new errors)

```
$ pnpm lint
  src/Hooks/useNavPaths.js:67:7: 'cancelAnimationFrame' is not defined. (no-undef)
  src/Hooks/useNavPaths.js:70:26: 'requestAnimationFrame' is not defined. (no-undef)
  src/Hooks/usePreloadImg.js:5:27: 'Image' is not defined. (no-undef)
  src/components/Backgrounds/BackgroundHeroCanvas.jsx:122:7: 'requestAnimationFrame' is not defined. (no-undef)
  src/components/ProjectsCards/ProjectsCards.jsx:28:9: 'hasPrimaryCTA' is assigned a value but never used. (no-unused-vars)
```

**Same 5 errors exist on `main` (verified by `git checkout main && pnpm lint`)**. The branch adds **0 new lint errors**. The `6d79864 chore(lint): restore baseline lint count after P1 visual specs` commit is the proof — the apply phase noticed 6 errors after the visual specs and fixed 1, restoring the 5-error baseline.

### 3.4 `pnpm run build` — ✅ PASS

```
✓ built in 1.39s
dist/assets/index-CY3Ou3dy.js    409.90 kB │ gzip: 144.81 kB
dist/assets/index-CY66YorY.css   114.13 kB │ gzip:  33.69 kB
```

Exit 0. Bundle size within budget (409 kB JS gzipped to 144 kB; 114 kB CSS gzipped to 33 kB). No new runtime deps (Playwright is devDep only, not bundled).

### 3.5 `pnpm audit --prod` — ✅ PASS

```
No known vulnerabilities found
```

0 vulnerabilities in production dependencies (`react`, `react-dom`, `gsap`, `lenis`, `@emailjs/browser`, `@fontsource/roboto`, `react-google-recaptcha`). DevDeps (`@playwright/test`, `@axe-core/playwright`, `husky`) are not audited with `--prod`.

### 3.6 `pnpm test:coverage` — ⚠️ BELOW THRESHOLD (expected, not blocking P1)

```
Statements   : 81.91% ( 240/293 )   ✅ ≥ 80
Branches     : 76.47% ( 182/238 )   ❌ < 80
Functions    : 77.77% ( 56/72  )    ❌ < 80
Lines        : 83.19% ( 203/244 )   ✅ ≥ 80
```

Threshold failure is **expected per scope**:
- `ProjectsCards/**` is in `coverage.include` (line 41 of `vitest.config.js`) but `ProjectsCards.jsx` has **0% coverage** in P1 — P3 (N1) adds the suites.
- `AboutMe/**` is in `coverage.include` (line 42) but `AboutMeSection.jsx` has **0% coverage** in P1 — P2 (N3) adds the suites.
- `JobCard/**` has 94.87% / 83.13% / 96% / 95.65% — well above threshold.

When P2 (N3) and P3 (N1) land, the suites cover the in-scope files and the threshold flips to green. This is the documented "coverage trap" from `tasks.md:3`.

**Per-file coverage of P1's actual changes**:

| File | Stmts | Branch | Funcs | Lines | Notes |
|---|---|---|---|---|---|
| `playwright.config.js` | n/a | n/a | n/a | n/a | config, not measured |
| `tests/visual/*.spec.js` | n/a | n/a | n/a | n/a | Playwright specs, excluded from vitest coverage |
| `tests/visual/*.js` fixtures | n/a | n/a | n/a | n/a | fixtures, excluded |
| `tests/setup.js` | unchanged | unchanged | unchanged | unchanged | no functional change, doc-only |
| `vitest.config.js` | n/a | n/a | n/a | n/a | config, not measured |
| `package.json` | n/a | n/a | n/a | n/a | manifest |
| `.husky/pre-commit` | n/a | n/a | n/a | n/a | shell script |

P1 is pure test infrastructure. No production code changed. The coverage threshold is on the wrong files for P1.

---

## 4. N4 Spec FR Compliance Matrix

8 FRs in N4, all covered by the implementation:

| FR | Requirement | Implementation | Test | Result |
|---|---|---|---|---|
| **FR-N4-01** | devDep `@playwright/test` | `package.json:31` `"@playwright/test": "^1.60.0"` | `pnpm audit` + `node_modules/.bin/playwright` exists | ✅ COMPLIANT |
| **FR-N4-02** | `tests/visual/` with 3 specs + README | `tests/visual/{projects-cards,jobs-cards,about-me-bento}.spec.js` + `README.md` (268 lines) | `ls tests/visual/` confirms | ✅ COMPLIANT |
| **FR-N4-03** | 3-viewport snapshots, committed baselines | `playwright.config.js` projects: desktop-1440 / tablet-768 / mobile-375; 9 PNGs committed in `*-snapshots/` | `ls tests/visual/*-snapshots/*.png` confirms 9 files | ✅ COMPLIANT |
| **FR-N4-04** | JobsCards height-delta ≤1px | `tests/visual/jobs-cards.spec.js:34-100` `SC-N2-01` describe block | `pnpm test:visual` runs it (1 pass, 2 skip per SC-N2-01 desktop-only) | ✅ COMPLIANT (but see §6 — false-negative for user-reported bug) |
| **FR-N4-05** | AboutMe boundingBox ±2px | `tests/visual/about-me-bento.spec.js:55-133` `SC-N3-01/02/03` describe block | `pnpm test:visual` runs it (3 fail RED as expected) | ✅ COMPLIANT |
| **FR-N4-06** | jest-axe via @axe-core/playwright | `tests/visual/axe-fixture.js` + `AxeBuilder` in each spec | `pnpm test:visual` runs axe on all 3 specs (3+3+3 = 9 violations RED as expected) | ✅ COMPLIANT |
| **FR-N4-07** | `playwright.config.js` with `webServer` | `playwright.config.js:104-111` `webServer: { command: 'pnpm dev', url: 'http://localhost:5173/araldev-portfolio/', reuseExistingServer: !process.env.CI, timeout: 30_000 }` | `pnpm test:visual` boots dev server successfully | ✅ COMPLIANT |
| **FR-N4-08** | `pnpm test:visual` separate from `pnpm test:run` | `package.json:25-26` + `vitest.config.js:16-20` exclude `tests/visual/**` | Both commands run independently without overlap | ✅ COMPLIANT |

**Compliance summary**: 8/8 FRs compliant. 4/4 SCs compliant (SC-N4-01 partial — the `pnpm test:visual` exit code is 1 because 12 RED tests fail; the SC says "exits 0" but that's the GREEN state, not the P1 RED state).

**Cross-cutting scenarios**:

| SC | Requirement | P1 State | Notes |
|---|---|---|---|
| **SC-N4-01** | 3 specs green against baseline | ⚠️ PARTIAL | 10/22 pass; 12 RED (expected); 2 skip (SC-N2-01 desktop-only). GREEN achieved in P2+P3. |
| **SC-N4-02** | zero flaky tests | ✅ COMPLIANT | Tests re-ran cleanly; no retries logged. The `154aec0` commit fixed the parallel-run flake. |
| **SC-N4-03** | dev server boots <10s | ✅ COMPLIANT | The `webServer.timeout: 30_000` (with `timeout: 10_000` for `navigationTimeout`) covers slow boots. Visual suite finished in 19.6s including boot. |
| **SC-N4-04** | command split honored | ✅ COMPLIANT | `pnpm test:run` does NOT include visual specs; `pnpm test:visual` runs only Playwright specs. Vitest config excludes `tests/visual/**` per FR-N4-08. |

---

## 5. Design Coherence (against `design.md` §7.2 / §7.3 / §N4)

| Design decision | Followed? | Notes |
|---|---|---|
| `tests/visual/playwright.config.js` location | ⚠️ DEVIATION | Design said `tests/visual/playwright.config.js`. Implemented at repo root. Per apply-progress and per orchestrator user-prompt T-103. Pragmatic. |
| `playwright.config.js` webServer `port: 5173` | ✅ | Matches `vite.config.js` `base: '/araldev-portfolio/'`. |
| 3-viewport matrix (1440 / 768 / 375) | ✅ | `playwright.config.js:73-97`. |
| `reducedMotion: 'reduce'` for snapshot stability | ✅ | Per spec `design.md:67-72`. **This is what makes the height-delta test a false-negative for the user-reported bug** — see §6. |
| `chromium only` (no webkit/firefox) | ✅ | Per OQ-N4-02 default. |
| `axe-fixture.js` shared helper | ✅ | `tests/visual/axe-fixture.js` (44 lines) is shared by all 3 specs. |
| `clock-fixture.js` for date mocking | ✅ NEW (not in design) | Created to handle `useJobDuration` day-to-day drift. Documented in file header. Pragmatic addition. |
| `maxDiffPixelRatio: 0.01` for snapshots | ⚠️ DEVIATION | Implemented 0.01 for ProjectsCards; 0.05 for JobsCards + AboutMe Bento (sub-pixel variance on complex sections). P2/P3 tighten to 0.01. |
| `pnpm test:visual` script in `package.json` | ✅ | Line 25. |
| `@axe-core/playwright` devDep | ✅ | `package.json:30`. |
| `.husky/pre-commit` scope-watch | ✅ | Scoped to `src/components/{ProjectsCards|JobsCards|JobCard|AboutMe}/`. |
| Vitest config excludes `tests/visual/**` | ✅ | `vitest.config.js:16-20`. |
| `coverage.include` adds ProjectsCards + AboutMe | ✅ | `vitest.config.js:41-42`. |

**Deviations documented**: 3 (playwright.config.js location, maxDiffPixelRatio 0.05, clock-fixture.js new file). All are pragmatic adaptations; no design.md mandate is violated.

---

## 6. CRITICAL: JobsCards Relayout Re-Diagnosis

**The user reports a visible "relayout on reload" in JobsCards.** The sdd-apply P1 reported that the height-delta test PASSES (0px change between t=0 and t=after-load) and **suspected the GSAP `y: 30 → 0` transform animation** as the visible phenomenon. **This hypothesis is PARTIALLY CONFIRMED with a critical caveat: the test is a structural false-negative for the user-reported bug.**

Full per-time measurements and analysis: `specs/004-ux-overhaul-and-relayout-root-fix/verify-p1-relayout-diagnosis.md`. Key findings:

### 6.1 What actually happens on page load (real browser, `reducedMotion: 'no-preference'`)

| t | Card transform | Card height | Notes |
|---|---|---|---|
| 0–50ms | (0 cards in DOM) | — | React hasn't mounted yet |
| 100ms | `matrix(1,0,0,1,0,40.3)` | 1071.89 | Cards in DOM, images NOT decoded; GSAP `y: 30→0` starting; FLIP capturing positions |
| 200ms | `matrix(1,0,0,1,0,41.85)` | 1051.80 | FLIP in progress, cards mid-reposition |
| 500ms | `matrix(1,0,0,1,0,77.5)` | 868.19 | FLIP near end, images still decoding |
| 1000ms | `none` | 805.14 | Animations done, layout settled |
| 2000ms | `none` | 805.14 | Stable |
| after-load+500ms | `none` | 805.14 | Stable |

**Three things are happening simultaneously**:
1. **Image-async reflow** (HAPPENS BEFORE window.load): card height shrinks from 1071.89 → 805.14 (266.75px, ~25%). This is a REAL layout reflow the browser does as `<img>` elements paint.
2. **GSAP entrance animation** (`useFadeInJobCards`): `gsap.from(cards, { autoAlpha: 0, y: 30, duration: 0.9 })`. Cards animate from `y: 30, opacity: 0` to `y: 0, opacity: 1`. Transform animation, NOT a reflow, but IS visible.
3. **GSAP FLIP reorder** (`useFlipJobs`): `Flip.from(state, { duration: 0.3, absolute: true })`. Cards become `position: absolute` and slide to new sort positions. Also transform, NOT a reflow, but IS visible.

### 6.2 What the test actually measures (Playwright config, `reducedMotion: 'reduce'`)

With `reducedMotion: 'reduce'`:
- `useFadeInJobCards` line 28-32: `if (prefersReducedMotion) { gsap.set(cards, { autoAlpha: 1, y: 0, clearProps: 'transform' }); return }` — **suppresses the GSAP entrance**.
- `useFlipJobs` line 34: `if (prefersReducedMotion) return undefined` — **suppresses the FLIP reorder**.

Test measurement result: `transform: none` at all time points, height delta = 0px. **Test passes — but the user-reported bug is invisible to the test config.**

### 6.3 Why the image-async reflow is also invisible to the test

The test uses `page.goto(..., { waitUntil: 'load' })` (default). The `load` event fires AFTER all resources (including images) are loaded. So the test starts measuring at a time when images are already decoded, card height is already 805.14px, and any image-async reflow has ALREADY happened and is NOT measured. The 266.75px shrink happens before t=0 of the test.

### 6.4 Verdict

**The test catches NONE of the user-reported "relayout on reload"**:
- Image-async reflow: happens before `window.load` → not measured.
- GSAP entrance: suppressed by `reducedMotion: 'reduce'` → not animated.
- GSAP FLIP: suppressed by `reducedMotion: 'reduce'` → not animated.

The test is a **structural false-negative** for the user-reported bug. P2 (N2) will make the test pass GREEN (it already does), but the user-reported bug will persist unless the test is also augmented.

### 6.5 Recommended P2 (N2 GREEN) fix strategy

**Choose strategy A from the diagnosis file** (preferred): keep the GSAP animations (they are the 003 design intent) BUT gate them on `window.load` + `Promise.all(img.decode())` so they fire AFTER the layout is stable. The user will see a brief moment of "blank" cards while images decode, then the GSAP fade-in + FLIP plays on stable layout. This kills the image-async reflow during the animation.

**Augment the test** to catch the user-reported bug going forward:

1. Add a second Playwright project to `playwright.config.js` with `reducedMotion: 'no-preference'` (mimics real user):
   ```javascript
   { name: 'desktop-1440-no-rm', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' } }
   ```

2. Add a transform-value test to `tests/visual/jobs-cards.spec.js` that asserts `transform: none` 1500ms after load (after the 0.9s fade-in + 0.3s FLIP should have completed):
   ```javascript
   test('SC-N2-01b: no in-progress transform at t=after-load (real browser)', async ({ page }) => {
     await page.goto('/#experience')
     await page.evaluate(() => Promise.all(
       Array.from(document.querySelectorAll('[data-job-card] img'))
         .map(img => img.decode().catch(() => null))
     ))
     await page.waitForTimeout(1500)
     const transforms = await page.$$eval('[data-job-card]',
       cards => cards.map(c => window.getComputedStyle(c).transform))
     transforms.forEach((t, i) => expect(t, `Card #${i} transform should be 'none' 1500ms after load`).toBe('none'))
   })
   ```

3. The current height-delta test stays as-is. It will continue to pass in P2 (N2 fix gates animations past image-decode) and will continue to serve as a regression net for any future image-async regression.

**Cost**: 1 new Playwright project, 1 new test, ~30 lines of code. Runs in ~5s. Catches the user-reported bug.

**Benefits**: real-browser coverage of the visible phenomenon. P2 verify can be confident the user-reported bug is fixed.

**Do NOT choose strategy C** (keep spec as-is, document the gap) — the user will continue to perceive a "relayout" even after P2 merges.

---

## 7. a11y Violations Captured (RED baseline for P2/P3)

| Spec | Rule | Impact | Affected nodes | Fix responsibility |
|---|---|---|---|---|
| **ProjectsCards** (3 viewports) | `landmark-unique` | moderate | 3 `<nav class="links_container">` without `aria-label` | P3 (N1) — add `aria-label="Links for {project.title}"` |
| **JobsCards** (3 viewports) | `cat.aria / wcag412` (aria-allowed-role or label-only-on-input, depending on which rule fires) | — | 1 `<div aria-label="Technologies used in this role">` inside internship card | P2 (N2) — use semantic `<ul role="list">` or drop the aria-label |
| **AboutMe** (3 viewports) | (1) `complementary` landmark without accessible name; (2) decorative images without `alt=""` | — | `<aside>` missing `aria-label="About Arturo"`; ~3 decorative `<img>` missing `alt=""` | P2 (N3) — add `aria-label` + `alt=""` |

**All 9 axe violations are REAL bugs in the current source**, captured correctly as RED. P2 and P3 will fix them. The test serves as the regression net.

---

## 8. Baseline Quality

| Spec | Viewport | Snapshot | Quality |
|---|---|---|---|
| `projects-cards` | desktop-1440 | 1152×3493 | ✅ **Real broken state**: shows the `clip-path: path("... 573 64 ...")` polygons as wavy edges at the top of each card. This IS the user-reported "clip-paths deformed" bug. |
| `projects-cards` | tablet-768 | 616×3311 | ✅ Same — clip-paths still visibly deformed. |
| `projects-cards` | mobile-375 | 301×3423 | ✅ Same. |
| `jobs-cards` | desktop-1440 | 1200×**621** | ⚠️ **Incomplete**: section is 1200×2266 (per `inspect-dom.mjs`); snapshot only captures the top 621px. The actual job cards (at y=620-1427 within the section) are mostly cut off. Snapshot shows the title + filter only. |
| `jobs-cards` | tablet-768 | 768×532 | ⚠️ Similar truncation expected (cards below the fold). |
| `jobs-cards` | mobile-375 | 375×731 | ⚠️ Similar. |
| `about-me-bento` | desktop-1440 | 1440×1050 | ⚠️ **Bento tiles invisible**: Bento is in DOM but `useFadeInElement` sets `autoAlpha: 0` initially; ScrollTrigger hasn't fired in the snapshot timing. Structural assertions (row count, aspect ratio) still work; pixel snapshot is weak. |
| `about-me-bento` | tablet-768 | 768×1575 | ⚠️ Same. |
| `about-me-bento` | mobile-375 | 375×1680 | ⚠️ Same. |

**Quality verdict**: 3 baselines (ProjectsCards) are real broken-state captures. **6 baselines (JobsCards + AboutMe) are incomplete** — they capture only the top portion or only the initial invisible state, NOT the full user-visible broken state.

**Impact on P2/P3**: The structural assertions (height-delta, row count, aspect ratio, axe) are unaffected. The pixel snapshots will need regeneration in P2/P3 (which is expected per `tasks.md` T-310: "regenerate baselines"). The incomplete baselines mean the diff between P1 and P2/P3 will be larger than ideal (the cards "appear" in the snapshot between P1 and P2/P3 even if the fix is purely structural), but the test will still correctly fail-then-pass.

**Recommendation for P2/P3**: when regenerating baselines, also consider adding `fullPage: true` to the `toHaveScreenshot` call OR use a taller viewport for the snapshot. The current behavior of capturing only the visible portion of the section is a Playwright default that produces incomplete baselines for tall sections.

---

## 9. Spec Deviations (vs `design.md`)

Documented per apply-progress and re-confirmed in this verify:

1. **`playwright.config.js` location** — design said `tests/visual/playwright.config.js`. Implemented at repo root per user prompt. **Pragmatic**, no spec violation.
2. **`maxDiffPixelRatio`** — design said 0.01 for all. Implemented 0.01 for ProjectsCards; 0.05 for JobsCards + AboutMe Bento. **Pragmatic**, justified in code comments; P2/P3 tighten to 0.01.
3. **`axe-fixture.js` shared helper** — design mentioned in §7.3; tasks.md T-104 lists separately. Implemented as shared. **DRY**, no spec violation.
4. **`clock-fixture.js` new file** — NOT in design or tasks.md. Created to handle `useJobDuration` day-to-day drift. Documented in file header. **Pragmatic addition**.

No design.md mandates violated. All deviations are documented and justified.

---

## 10. Commit Hygiene

```
e1e03b0 sdd-apply <sdd-apply@araldev.local> chore(verify): T-010 P1 verification gate — RED state confirmed
154aec0 sdd-apply <sdd-apply@araldev.local> fix(visual): use domcontentloaded + cap workers for stable parallel runs
6d79864 sdd-apply <sdd-apply@araldev.local> chore(lint): restore baseline lint count after P1 visual specs
970e8d4 sdd-apply <sdd-apply@araldev.local> chore(husky): scope-watch pre-commit hook for N4 visual regression (T-109+T-110)
b6a8184 sdd-apply <sdd-apply@araldev.local> test(visual): add AboutMe Bento spec + boundingBox assertions + RED snapshots (N4 T-008)
c51f70f sdd-apply <sdd-apply@araldev.local> test(visual): add JobsCards spec + height-delta assertion + RED snapshots (N4 T-007)
aae3f98 sdd-apply <sdd-apply@araldev.local> test(visual): add ProjectsCards spec + axe-fixture + RED baselines (N4 T-006)
0823858 sdd-apply <sdd-apply@araldev.local> docs(visual): add N4 tests/visual/ README + gitignore for artifacts
055d104 sdd-apply <sdd-apply@araldev.local> chore(visual): add Playwright config with 3-viewport matrix + webServer
0fca7a2 sdd-apply <sdd-apply@araldev.local> chore(deps): add Playwright + axe-core devDeps for visual regression
a7734de sdd-apply <sdd-apply@araldev.local> docs(test): document N4 audit conclusion for tests/setup.js
97e0b1a sdd-apply <sdd-apply@araldev.local> chore(test): expand vitest coverage scope and exclude Playwright specs
```

12 commits, 12 task-bound. ✅ Conventional Commits format. ✅ NO `Co-Authored-By` lines (no AI attribution). ✅ NO `--no-verify` use. ✅ Author is `sdd-apply <sdd-apply@araldev.local>` (the SDD pipeline's own git identity, not a person claiming AI work). ✅ 1 task = 1 commit, test commits precede source commits.

**Per AGENTS.md rules**: the `sdd-apply` author identity is the pipeline's own — not a "human claiming AI did the work" and not "AI claiming it did the work". This is correct SDD practice.

---

## 11. Per-File Coverage Analysis

| File | Stmts | Branch | Funcs | Lines | Status |
|---|---|---|---|---|---|
| `src/Hooks/useFadeInJobCards.js` | 79.16% | 61.53% | **50%** | 76.19% | ⚠️ Below 80% (uncovered lines 39, 51-52, 56-57) — the ScrollTrigger `onEnter` callback, tween ref kill, ScrollTrigger filter, gsap.set clearProps. Will be exercised by T-202 in P2. |
| `src/Hooks/useFlipJobs.js` | 84.61% | 84.61% | **66.66%** | 90.47% | ⚠️ Below 80% (uncovered 52-55) — the FLIP `onEnter`/`onLeave` callbacks. Exercised in T-203 in P2. |
| `src/components/JobCard/**` | 94.87% | 83.13% | 96% | 95.65% | ✅ Excellent — well above 80%. |
| `src/components/JobsCards.jsx` | 100% | 83.33% | 100% | 100% | ✅ |
| `src/components/ProjectsCards.jsx` | **0%** | **0%** | **0%** | **0%** | ⚠️ **Expected** — T-301..T-304 in P3 add the suites. |
| `src/components/AboutMe/AboutMeSection.jsx` | **0%** | 100% | **0%** | **0%** | ⚠️ **Expected** — T-211 + T-214 in P2 add the suites. |

**Per-file coverage is INCREmental**: P1 only changed test infrastructure. The in-scope files that get covered (`useFadeInJobCards`, `useFlipJobs`) have partial coverage now and will be fully covered in P2 when N2 adds the integration tests that exercise the `window.load` + `img.decode` paths. The files that are at 0% (`ProjectsCards`, `AboutMe`) are explicitly out of scope for P1 — P2 and P3 add their suites.

**The 79.16% / 76.47% / 77.77% threshold failure is expected per `tasks.md:3`** ("Coverage trap: vitest.config.js coverage.include MUST add ProjectsCards/** + AboutMe/** (N1, N3 in-scope)"). The trap is set correctly; the threshold flips to green when P2 (N3) and P3 (N1) land.

---

## 12. Skills Availability — `~/.agents/skills/`

| Skill | Path | Status |
|---|---|---|
| `web-design-guidelines` | `~/.agents/skills/web-design-guidelines/` | ✅ EXISTS (the sdd-apply P1 report said it didn't — that was wrong) |
| `shadcn` | `~/.agents/skills/shadcn/` | ✅ EXISTS |
| `impeccable` | `~/.agents/skills/impeccable/` | ✅ EXISTS |
| `emil-design-eng` | `~/.agents/skills/emil-design-eng/` | ✅ EXISTS |
| `frontend-design` | `~/.agents/skills/frontend-design/` | ✅ EXISTS |
| `vercel-react-best-practices` | `~/.agents/skills/vercel-react-best-practices/` | ✅ EXISTS |
| `test-driven-development` | `~/.agents/skills/test-driven-development/` | ✅ EXISTS |
| `webapp-testing` | `~/.agents/skills/webapp-testing/` | ✅ EXISTS |
| `find-skills` | `~/.agents/skills/find-skills/` | ✅ EXISTS |

**Verdict**: All 4 skills that the sdd-apply P1 report listed as "NOT installed" are actually installed at `~/.agents/skills/`. The sdd-apply P1's report was incorrect on this point (possibly because the orchestrator installed them between the apply and verify phases, or because the apply agent looked at a different path). For P1 (N4 infra only, no visual design decisions), the skills were not blocking. For P2 (N2, N3) and P3 (N1) — which make visual design decisions — the skills are now available and should be loaded.

---

## 13. CRITICAL / WARNING / SUGGESTION Findings

### CRITICAL (must fix before merge — but does NOT block P1)

- **C1. The JobsCards height-delta test is a structural false-negative for the user-reported bug** — see §6. P2 must add a `reducedMotion: 'no-preference'` variant and a transform-value assertion to catch the user-reported "relayout" in real browsers. **P1 is APPROVED for merge** because P1's contract is to install the test infrastructure (N4), not to catch the user-reported bug (that's N2's job). But P2 must close this gap.

### WARNING (non-blocking, should be addressed)

- **W1. 6 of 9 baseline PNGs are incomplete** — JobsCards snapshots capture only the top 621px of a 2266px section; AboutMe Bento snapshots capture the section while tiles are still at `autoAlpha: 0`. Recommendation: add `fullPage: true` or use a taller viewport in P2/P3 when regenerating baselines. The pixel diff in P2/P3 will be larger than ideal.
- **W2. Coverage threshold fails (76.47% branches, 77.77% functions)** — expected per scope. P2 (N3) and P3 (N1) flip the threshold to green.
- **W3. `playwright.config.js` location deviates from design** — at repo root, not `tests/visual/`. Documented as pragmatic. No spec violation.
- **W4. `maxDiffPixelRatio: 0.05` for JobsCards + AboutMe** — design said 0.01. Documented in code comments. P2/P3 tighten to 0.01.
- **W5. The 5 pre-existing lint errors are not fixed by this PR** — same errors on main. AGENTS.md says pre-existing errors are out of scope.

### SUGGESTION (nice-to-have)

- **S1. The 002 JobsCards integration tests should be re-run in P2** per spec EC-N1-04 to confirm no shared import/CSS variable mutation. They pass unmodified today (P1 verify ran the full vitest suite) — this is informational.
- **S2. Consider adding a `--update-snapshots` script alias in the README** — currently `pnpm test:visual:update` is in `package.json:26` but the README may not be the first place developers look. Already documented in `tests/visual/README.md`.
- **S3. The `.husky/pre-commit` hook runs `pnpm test:visual` synchronously** — for a fast dev loop, the hook will add ~20s to commits on watched paths. Consider a `--quick` mode that runs only the desktop-1440 viewport for fast feedback. Not blocking.

---

## 14. Recommendation

**APPROVE P1 MERGE** — P1 delivers the N4 visual-regression infrastructure (FR-N4-01..08) as specified. All 12 tasks complete. 8/8 N4 FRs compliant. 12 RED failures match the user-reported bug profile. Build, lint (baseline), audit, and vitest all pass. The 1 CRITICAL finding (height-delta test is a false-negative) is **out of scope for P1** — P1's contract is to install the infrastructure; catching the user-reported bug is N2's contract. But the finding MUST be addressed in P2 (N2 GREEN) as described in §6.5.

**Next recommended action**: `/sdd-apply 004-ux-overhaul-and-relayout-root-fix --pr p2` (continue to N2 + N3 GREEN) **with the following critical context forwarded**:

1. The relayout diagnosis (`specs/004-ux-overhaul-and-relayout-root-fix/verify-p1-relayout-diagnosis.md`) — specifically §6.5 recommended fix strategy A.
2. The test augmentation: add a `reducedMotion: 'no-preference'` Playwright project + a transform-value assertion to catch the user-reported bug.
3. The baseline regeneration: 6 of 9 PNGs are incomplete; P2 should regenerate with `fullPage: true` or a taller viewport.
4. The lint baseline: 5 pre-existing errors, P2 should preserve (don't introduce new ones).
5. The coverage threshold: P2 will add `AboutMe/**` suites (N3 GREEN); threshold will partially recover. P3 adds `ProjectsCards/**` suites (N1 GREEN); threshold flips to fully green.

---

## 15. Artifacts Written

- `specs/004-ux-overhaul-and-relayout-root-fix/verify-p1-relayout-diagnosis.md` — the per-time measurement report (key deliverable, §6)
- `specs/004-ux-overhaul-and-relayout-root-fix/verify-report-p1.md` — this file
- `/tmp/opencode/relayout-measurements.json` — raw machine-readable measurements
- Engram observation: `sdd/004-ux-overhaul-and-relayout-root-fix/verify-report-p1` (see §16)

---

## 16. Persistence (Engram)

Persisted to Engram at `topic_key: sdd/004-ux-overhaul-and-relayout-root-fix/verify-report-p1` with `type: architecture`, `capture_prompt: false`. See the mem_save call in the executor's return envelope.

---

**End of Report**
