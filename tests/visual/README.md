# Visual Regression Tests (N4)

> **Real-browser layout gate** for `004-ux-overhaul-and-relayout-root-fix`.
> This directory is the test surface that `jsdom + jest-axe` cannot
> reproduce. It runs the production Vite dev server in a real Chromium
> browser, snapshots three critical sections at three viewports, and
> asserts structural layout properties (height delta, `boundingBox`).
>
> **P1 is the RED baseline phase.** The snapshots and structural
> assertions are written against the *current (broken) source*. They
> capture the bug; they do not yet pass against a fixed source.

---

## Why this directory exists

`jsdom` (used by `pnpm test:run` and `pnpm test:coverage`) does **not**
reproduce real-browser layout. It cannot show:

- `clip-path: path("... 573 64 ...")` deforming against a fluid grid
  (the ProjectsCards bug from 003).
- Layout shift caused by async image decoding (the JobsCards first-paint
  relayout from 003).
- Bento grid rows that expand by content because `repeat(auto-fit, ...)`
  uses `auto` track sizing (the AboutMe bug from 003).

003 shipped with `pass-with-warnings` because the Vitest/jsdom gate
could not see these bugs. N4 closes that gap by adding a real-browser
gate that *can* see them. The 3 visible bugs the user reported are
captured as **RED baselines** in this directory; P2 and P3 of 004
flip them **GREEN** by fixing the underlying source.

---

## Quick start

```bash
# 1. One-time: install the Chromium browser binary
pnpm exec playwright install chromium

# 2. Run all visual specs (boots Vite dev server if not running)
pnpm test:visual

# 3. Update baselines after a deliberate visual change
pnpm test:visual:update
```

> The `pnpm test:visual` script is defined in `package.json`. The
> `test:visual:update` variant appends `--update-snapshots` so existing
> baselines are overwritten in place.

---

## What runs where

| Command                  | Runner    | Files                          | Network | Browser |
|--------------------------|-----------|--------------------------------|---------|---------|
| `pnpm test:run`          | Vitest    | `tests/{unit,integration,a11y}/**` | jsdom   | none    |
| `pnpm test:coverage`     | Vitest v8 | `tests/{unit,integration,a11y}/**` | jsdom   | none    |
| `pnpm test:visual`       | Playwright | `tests/visual/*.spec.js`      | Chromium| 1440/768/375 |
| `pnpm test:visual:update`| Playwright | `tests/visual/*.spec.js`      | Chromium| 1440/768/375 |

Vitest is configured (in `vitest.config.js`) to **exclude**
`tests/visual/**` so the two runners never collide. Playwright is
configured (in `playwright.config.js`) to **only** match `*.spec.js`
under `tests/visual/` for the same reason.

---

## The 3 specs and what they prove

| Spec                                  | Capability | Assertion                                                              | Status in P1 |
|---------------------------------------|------------|------------------------------------------------------------------------|---------------|
| `tests/visual/projects-cards.spec.js` | N1 (P3)    | Snapshot `#projects` at 3 viewports + axe-core clean                    | Baseline recorded (passes on first run) |
| `tests/visual/jobs-cards.spec.js`     | N2 (P2)    | Snapshot `#experience` + height-delta ≤ 1px between t=0 and t=after-window-load | **RED** — height delta is non-zero on broken source |
| `tests/visual/about-me-bento.spec.js` | N3 (P2)    | Snapshot `#about-me` + `boundingBox()` of each tile matches design tokens at 3 viewports | **RED** — Bento tiles do not match design tokens on broken source |

The T-007 and T-008 specs are **expected to fail in P1**. The failure
message is the deliverable: it documents the precise pixel/structural
delta between the broken state and the design contract. The orchestrator
runs `sdd-verify` on P1 to confirm the failure mode matches the
user-reported bug before approving P2.

---

## The RED → GREEN contract

This directory follows a strict **RED → GREEN** discipline per PR:

### P1 (this PR) — RED baseline

1. Specs are written **first** against the current source.
2. The snapshot specs (`projects-cards`) **record the baseline** of
   the current (broken) source. First run creates the PNG; subsequent
   runs compare against it.
3. The structural specs (`jobs-cards`, `about-me-bento`) **fail** on
   the current source. The failure messages become the bug report
   that drives P2.
4. No production code is changed in P1.

### P2 — N2 + N3 GREEN

1. P2 modifies `useFadeInJobCards`, `useFlipJobs`, and
   `JobCard.module.css` (N2); and `AboutMeSection.module.css` (N3).
2. After the fix, `pnpm test:visual` re-runs:
   - `jobs-cards.spec.js` height-delta assertion goes from RED to
     GREEN.
   - `about-me-bento.spec.js` `boundingBox` assertion goes from RED
     to GREEN.
3. `projects-cards.spec.js` snapshot may now differ from the baseline
   (still broken on N1). The baseline is **not** updated in P2.

### P3 — N1 GREEN

1. P3 deletes and recreates `ProjectsCards.{jsx,module.css}` without
   absolute `clip-path` polygons.
2. The ProjectsCards visual is now correct. The baseline recorded in
   P1 no longer matches.
3. The PR runs `pnpm test:visual:update` to regenerate
   `tests/visual/projects-cards.spec.js-snapshots/projects-*.png` and
   commits the new baselines.
4. All 3 specs are GREEN at the end of P3.

---

## Updating baselines

After a deliberate visual change (e.g. P3 recreates ProjectsCards):

```bash
# Regenerate baselines for the spec you changed
pnpm test:visual:update

# OR target a single spec + viewport
pnpm exec playwright test projects-cards.spec.js --project=desktop-1440 --update-snapshots
```

Always commit the regenerated PNGs in the same commit as the source
change. A baseline update without a source change is a red flag —
the diff between the old and new baseline IS the visual diff of your
work and should be reviewed.

---

## Debugging a failure

When a visual spec fails, the artifacts are in:

- `tests/visual/projects-cards.spec.js-snapshots/` (committed baselines)
- `playwright-report/` (HTML diff report; gitignored)
- `test-results/` (raw screenshots + traces; gitignored)

The fastest debug cycle:

```bash
# 1. Run only the failing spec + viewport
pnpm exec playwright test jobs-cards.spec.js --project=desktop-1440

# 2. Open the HTML report (shows side-by-side diff)
pnpm exec playwright show-report

# 3. Re-run with the trace viewer to see DOM events
pnpm exec playwright test jobs-cards.spec.js --trace on
```

For a single-test run with headed browser (debug visually):

```bash
pnpm exec playwright test jobs-cards.spec.js --project=desktop-1440 --headed
```

The Vite dev server is reused (`webServer.reuseExistingServer: true`),
so you can keep `pnpm dev` open in another terminal and the spec will
pick up your HMR changes on the next run.

---

## Browser binary install (one-time)

The first time anyone runs `pnpm test:visual`, the Chromium binary
must be installed. This is **not** automatic — it is a deliberate
choice to keep the `pnpm install` fast and avoid a 200 MB download
for contributors who do not run visual tests.

```bash
pnpm exec playwright install chromium
```

Sub-commands:

| Command                                       | Effect                                  |
|-----------------------------------------------|-----------------------------------------|
| `pnpm exec playwright install chromium`       | Download Chromium to `~/.cache/ms-playwright/` |
| `pnpm exec playwright install chromium --with-deps` | Same + install system libraries (Linux only)  |
| `pnpm exec playwright --version`              | Verify the install worked               |

> On Debian/Ubuntu, `--with-deps` runs `apt-get install` and may
> require `sudo`. Run without `--with-deps` if your CI image already
> has the system libraries.

---

## Pre-commit hook

A Husky pre-commit hook (`.husky/pre-commit`) installs in T-009. It
runs `pnpm test:visual` **only** when staged files include any path
under:

- `src/components/ProjectsCards/`
- `src/components/AboutMe/`
- `src/components/JobCard/`
- `src/components/JobsCards/`

Touching other files (e.g. a test file, a Hook, a CSS variable) does
not trigger the hook. This keeps the dev loop fast for unrelated
changes. Override locally with:

```bash
git commit --no-verify  # if you have a reason
```

The hook is opt-in at the project level: it auto-installs on
`pnpm install` via the `prepare` script. Contributors who clone fresh
get the hook automatically; CI does not run it (it uses `webServer`
in test mode, not a hook).

---

## Snapshot storage

Snapshots live in `__snapshots__/` directories next to each spec file:

```
tests/visual/
├── README.md                  (this file)
├── projects-cards.spec.js
├── projects-cards.spec.js-snapshots/
│   ├── projects-desktop-1440.png
│   ├── projects-tablet-768.png
│   └── projects-mobile-375.png
├── jobs-cards.spec.js
├── jobs-cards.spec.js-snapshots/
│   ├── jobs-desktop-1440.png
│   ├── jobs-tablet-768.png
│   └── jobs-mobile-375.png
├── about-me-bento.spec.js
└── about-me-bento.spec.js-snapshots/
    ├── about-me-desktop-1440.png
    ├── about-me-tablet-768.png
    └── about-me-mobile-375.png
```

The `__snapshots__/` directories ARE committed (they are the baselines).
The `playwright-report/` and `test-results/` directories are
gitignored (see `tests/visual/.gitignore`).

---

## Out of scope (for 004)

- WebKit and Firefox: 004 ships Chromium only (80% market share, single
  dev persona). Adding cross-browser is a follow-up that does not
  change the spec or the snapshot format.
- CI workflow: the `pnpm test:visual` script is dev-time only in 004.
  Wiring it into GitHub Actions is a follow-up.
- Visual coverage of every section: only ProjectsCards, JobsCards,
  and AboutMe are scoped. NavHeader, Contact, BackgroundHeroCanvas
  gain visual coverage in a later feature.
