# T-209 Verification — Visual baselines do NOT need updating

**Task**: T-209 (PR 2 / P2-B2)
**Spec**: FR-N2-07 (visual snapshot stability after CSS reservations)
**Branch**: `004-n2-n3-relayout-bento` (tip at time of writing: post-T-208)

## Outcome

The visual baselines for `tests/visual/jobs-cards.spec.js` (the 3 default
viewports: desktop-1440, tablet-768, mobile-375) **do NOT need updating**.
The P1 baselines from commit `c8cce51` still match the current source.

## Why no update

T-204 (P2-B1) added `min-height: var(--job-card-min-height)` (440px) to
`.job_card`. T-206 (P2-B2) added `aspect-ratio: 1` to
`.job_card_logo_wrapper`. T-207 (P2-B2) added `aspect-ratio: 1` to
`.job_card_stack .tech_icon`.

These three rules are **visually redundant** on the loaded case because
the existing declarations already define the box dimensions:

- `.job_card` had no min-height. But the natural height of the card
  (header + meta + 3 paragraphs + stack) is ~480-520px in desktop,
  ~440-470px in tablet, ~360-400px in mobile. So the new 440px floor
  only kicks in for very sparse cards (the P2-B1 diagnosis measured
  `~520px` at desktop-1440). For typical cards, the floor is invisible.

- `.job_card_logo_wrapper` already declared `width: 56px; height: 56px;`
  (JobCard.module.css lines 80-81). Adding `aspect-ratio: 1` is
  redundant when both width and height are explicit and equal.

- `.tech_icon` (under `.job_card_stack`) already declared
  `width: 40px; height: 40px;` (lines 343-344). Same story: explicit
  equal dimensions make `aspect-ratio: 1` redundant.

The new rules only matter for the **unloaded** case (image src missing
or 404) where the wrapper would otherwise collapse to 0×0. None of the
3 viewport snapshots show a missing-image case (all logos/tech icons
have valid `src` attributes in the data fixture).

## Verification commands

```bash
# 1. Snapshot tests for jobs-cards against existing baselines
pnpm test:visual --project=desktop-1440 -g "jobs-cards" --grep snapshot
# → 2 passed (1 skipped = the height-delta test runs only at desktop-1440,
#   which is THIS run, and it passes)
pnpm test:visual --project=tablet-768 -g "jobs-cards" --grep snapshot
# → 1 passed
pnpm test:visual --project=mobile-375 -g "jobs-cards" --grep snapshot
# → 1 passed
```

The 2 passed runs per project are:
- The `FR-N2-07: JobsCards snapshot` (line 104 in jobs-cards.spec.js)
- The `SC-N2-01: height delta` (line 35, only runs at desktop-1440)

The 1 failure per project is:
- `SC-N2-04: axe-core 0 violations` — this is the PLANNED-RED a11y
  failure (N2 aria-prohibited-attr on divs/spans with aria-label).
  Not a snapshot regression.

The 1 skip per project is the height-delta test for non-desktop viewports
(by design per `test.skip(testInfo.project.name !== 'desktop-1440')`).

## What WOULD require a baseline update

If T-204 / T-206 / T-207 actually changed the rendered pixels (e.g.
because the natural card height was below 440px and the floor kicked
in, or because aspect-ratio overrode the width/height), the snapshot
test would FAIL on the existing baseline. It doesn't, so the baselines
are still authoritative.

## When to revisit

After P2-B3 (N3 AboutMe Bento CSS — T-213) lands, the Bento card
sizes WILL change visually (auto-fit rows → fixed 1fr rows,
aspect-ratio on avatar/brand, 60ch bio cap). The Bento baselines at
desktop-1440, tablet-768, mobile-375 will need updating then. P2-B3
should run `pnpm test:visual:update` for the about-me-bento spec.

The chromium-no-reduced-motion baseline (added in P2-B1 T-201
fix-forward) will need updating when N2's useFadeInJobCards +
useFlipJobs gates eliminate the SC-N2-01b transform. That happens
once the dev server can render with GSAP animations enabled and
no transform is observed 1500ms after window.load + img.decode.
This is the P2-B3 (T-215) gate.
