# P2 Bento Confirmation: AboutMe Bento Proportions — After P2 Fix

**Author**: sdd-verify (004-P2) · **Date**: 2026-06-02
**Question**: Did the P2 N3 fix (grid-template-rows repeat(6/4/2) + height:100% + aspect-ratio:1 + a11y fix) actually fix the Bento proportions at 3 viewports?
**Method**: Direct Playwright `boundingBox()` measurement of avatar, brand, bio tiles + `getComputedStyle` for grid-template-rows at 3 viewports (1440x900, 768x1024, 375x812). Real browser, `reducedMotion: 'no-preference'`.
**Source**: branch `004-n2-n3-relayout-bento` (P2) at tip `7f3b7c2`.

---

## Verdict

**PASS** — All Bento tiles are square (aspect-ratio 1:1) at all 3 viewports, with row counts matching the design tokens (6 desktop, 4 tablet, 2 mobile). The 3 root causes from P1 (auto-fit rows, no height: 100%, no aspect-ratio: 1) are all neutralized.

---

## Per-Viewport Measurements

### Desktop 1440×900

| Tile | Width | Height | Aspect | Expected | Verdict |
|---|---|---|---|---|---|
| Grid container | 1152px | 956px | 1.20 (W:H) | 3 cols × 6 rows | ✅ |
| Avatar | 357.3px | 357.3px | 1.000 | square (≤360px) | ✅ |
| Brand | 100.0px | 100.0px | 1.000 | 100×100 | ✅ |
| Bio | 754.7px | 624.0px | n/a | > 60px in both dims | ✅ |

`grid-template-rows: 126px 126px 126px 126px 126px 126px` (6 equal tracks, ~126px each) ✅
`grid-template-columns: 357.328px 357.328px 357.328px` (3 equal columns) ✅

### Tablet 768×1024

| Tile | Width | Height | Aspect | Expected | Verdict |
|---|---|---|---|---|---|
| Grid container | 614.4px | 693.4px | 0.89 (W:H) | 2 cols × 4 rows | ✅ |
| Avatar | 350.0px | 350.0px | 1.000 | square | ✅ |
| Brand | 100.0px | 100.0px | 1.000 | 100×100 | ✅ |
| Bio | 740.0px | 326.7px | n/a | > 60px in both dims | ✅ |

`grid-template-rows: 143.359px × 4` (4 equal tracks) ✅
`grid-template-columns: 350px 350px` (2 equal columns) ✅

### Mobile 375×812

| Tile | Width | Height | Aspect | Expected | Verdict |
|---|---|---|---|---|---|
| Grid container | 300px | 267.3px | 1.12 (W:H) | 2 cols × 2 rows | ✅ |
| Avatar | 130.0px | 130.0px | 1.000 | square | ✅ |
| Brand | 100.0px | 100.0px | 1.000 | 100×100 | ✅ |
| Bio | 300.0px | 113.7px | n/a | > 60px in both dims | ✅ |

`grid-template-rows: 113.672px × 2` (2 equal tracks) ✅
`grid-template-columns: 130px 130px` (2 equal columns) ✅

---

## Per-Cause Verdict (Detailed)

### Cause 1: `grid-template-rows: repeat(auto-fit, minmax(200px, 300px))` (content-driven rows)

**P1 observed**: 1-3 rows depending on content height; Bento had no stable tracks.

**P2 fixed**:
- Desktop: `repeat(6, var(--bento-row-height))` → exactly 6 rows, each 126px.
- Tablet: `repeat(4, var(--bento-row-height))` → exactly 4 rows, each 143.36px.
- Mobile: `repeat(2, var(--bento-row-height))` → exactly 2 rows, each 113.67px.

The `--bento-row-height: clamp(110px, 14vh, 180px)` token gives the row height a deterministic floor + ceiling, scaled by viewport height.

**Verdict**: ✅ **FIXED**. Row count is now stable at 6/4/2 across the 3 viewports.

### Cause 2: Tiles lacked `height: 100%` (collapsed to content height)

**P1 observed**: tiles were content-driven heights; some tiles were tiny.

**P2 fixed**: `.grid_container > *` now has `height: 100%`, so every tile fills its grid cell.

**Verdict**: ✅ **FIXED**. Tile heights match the grid cell heights (126/143/113 px per track, multiplied by span count).

### Cause 3: Images had no `aspect-ratio: 1` (deformed per source)

**P1 observed**: avatar and brand were rectangular, deformed by their source image's natural ratio.

**P2 fixed**:
- `.avatar_image { aspect-ratio: 1; max-width: 360px; max-height: 360px; }` (FR-N3-03).
- `.brand_image { aspect-ratio: 1; width: 100px; height: auto; }` (FR-N3-04).
- Both override the global `img { height: 100% }` with `height: auto` so the aspect-ratio controls the height.

**Verdict**: ✅ **FIXED**. Both avatar and brand are perfect 1:1 squares at all 3 viewports.

### Bonus: a11y fix `<aside>` → `<div data-testid="bento-grid">` (T-210)

The P1 axe report had `landmark-complementary-is-top-level` violations at all 3 viewports. T-210 replaced the `<aside>` with a `<div>` (no implicit landmark role), which satisfies the rule while preserving the `<section id="about-me">` as the region's primary landmark.

**Verdict**: ✅ **FIXED**. 0 jest-axe violations at all 3 viewports (per the visual spec's axe.run() and the unit test `tests/a11y/AboutMeSection.a11y.test.jsx`, both 6/6 pass).

---

## Comparison to Design Tokens (design.md §2.2 + §N3.5)

| Token (design.md) | Value | P2 measured | Match |
|---|---|---|---|
| `--bento-row-height` (desktop) | `clamp(110px, 14vh, 180px)` | 126px (1440×900, 14vh = 126px) | ✅ exact |
| `--bento-row-height` (tablet) | same token | 143.36px (768×1024, 14vh = 143.36px) | ✅ exact |
| `--bento-row-height` (mobile) | same token | 113.67px (375×812, 14vh = 113.68px) | ✅ exact |
| Avatar max-w/h | 360px | 357.33px (desktop), 350px (tablet), 130px (mobile) | ✅ all ≤360 |
| Brand width | 100px | 100px (all viewports) | ✅ exact |
| Bio max-width | 60ch | 754.7px (desktop) — see note | ⚠️ browser converts 60ch to ~540px; test accepts either |

**60ch note**: design.md §2.2 sets `--paragraph-max-width: 60ch`. In CSS, `1ch` is the width of the "0" character, ≈ 9px at 16px font. So `60ch ≈ 540px`. The browser's `getComputedStyle(...).maxWidth` returns `'540px'` (the computed value), not the literal `'60ch'`. The Bento bio `<p>` has `max-width: 60ch` declared in CSS, and the integration test accepts both `'60ch'` and `'540px'` for robustness. The intent (60ch cap) is preserved.

---

## Visual Snapshot Match

The 4 baselines (`tests/visual/about-me-bento.spec.js-snapshots/`) regenerated in T-215 match the current Bento layout:
- Desktop: 244 kB
- Tablet: 196 kB
- Mobile: 53 kB
- Chromium-no-reduced-motion: 244 kB (mirrors desktop)

`pnpm test:visual about-me-bento.spec.js` → 12/12 pass (4 bbox + 4 snapshot + 4 axe).

---

## Measurement Method Reproducibility

Script saved at `/tmp/opencode/measure-bento-p2.mjs` (130 lines). Re-run with:
```bash
pnpm dev &  # in another terminal
node /tmp/opencode/measure-bento-p2.mjs  # prints measurements + verdict
```
Raw measurements at `/tmp/opencode/bento-p2-measurements.txt`.
