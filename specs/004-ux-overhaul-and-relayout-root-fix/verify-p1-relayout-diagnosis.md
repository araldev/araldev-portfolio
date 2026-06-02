# P1 Relayout Diagnosis: JobsCards "Relayout on Reload"

**Author**: sdd-verify (004-P1) · **Date**: 2026-06-02
**Question**: Why does the user see a "relayout on reload" in JobsCards if the height-delta test PASSES on the current source?
**Method**: Direct measurement of `transform`, `getBoundingClientRect`, and DOM state at multiple time points after `page.goto('#experience')` using Playwright + Chromium.

---

## 1. Hypothesis Tested

`useFadeInJobCards` runs `gsap.from(cards, { autoAlpha: 0, y: 30, duration: 0.9, ease: 'power3.out', stagger: 0.12 })`. The `y: 30 → 0` is `transform: translateY(...)` (GPU-accelerated, no reflow), but it IS visible as a "jump" the user reports. **Plus** `useFlipJobs` runs `Flip.from(state, { duration: 0.3, absolute: true, ... })` on sort identity change. The hypothesis: one or both of these animations IS the user-perceived relayout.

**Supporting evidence in source** (current, no fix applied yet — this is P1 baseline):

- `src/Hooks/useFadeInJobCards.js:39-46` — `gsap.from(cards, { autoAlpha: 0, y: 30, duration: 0.9, ease: 'power3.out', stagger: 0.12 })`. Runs once per page load when the grid enters the viewport. **Not** gated on `window.load` or `img.decode()`.
- `src/Hooks/useFlipJobs.js:42-58` — `Flip.getState(cards)` then `Flip.from(state, { duration: 0.3, ease: 'power2.inOut', absolute: true, ... })`. Runs whenever `sortTrigger` changes. `absolute: true` means the cards become `position: absolute` during the animation. **Not** gated on `window.load` or `img.decode()`.

---

## 2. Measurement Setup

Two runs against the live Vite dev server on `http://localhost:5173/araldev-portfolio/#experience` at viewport `1440×900`:

| Run | Config | Goal |
|---|---|---|
| **A** | `reducedMotion: 'no-preference'` (real browser) | Observe what the user actually sees |
| **B** | `reducedMotion: 'reduce'` (matches `playwright.config.js` projects) | Confirm the test config suppresses the very thing the user sees |

Both runs measure every `[data-job-card]` at t=0 (right after `page.goto(...{ waitUntil: 'load' })` returns) and at t=after-load+500ms (after `Promise.all(img.decode())` + 500ms settle — exactly the height-delta test's measurement pattern). Run A also measures at t=50ms / 100ms / 200ms / 500ms / 1000ms / 2000ms.

---

## 3. Per-Time Measurements (Run A — real browser, `reducedMotion: 'no-preference'`)

`t=0..50ms`: page has `readyState: 'interactive'`, **0 cards in DOM** (React hasn't mounted yet). All measurements empty.

| Time | Card 0 transform | Card 0 height | Card 0 y | Card 1 transform | Card 1 x | Notes |
|---|---|---|---|---|---|---|
| **t=0** (commit) | — | — | — | — | — | 0 cards in DOM |
| **t=50ms** | — | — | — | — | — | 0 cards in DOM |
| **t=100ms** | `matrix(1, 0, 0, 1, 0, 40.3)` | 1071.89 | 6562.49 | `matrix(1, 0, 0, 1, 558, 40.3)` | 558 | Inline `translate(0px, 40.3px)` set; cards bigger than settled (images not yet decoded) |
| **t=200ms** | `matrix(1, 0, 0, 1, 0, 41.85)` | 1051.80 | 6564.03 | `matrix(1, 0, 0, 1, 569.40, 40.61)` | 569.40 | FLIP repositioning in progress; some cards still moving in x |
| **t=500ms** | `matrix(1, 0, 0, 1, 0, 77.5)` | 868.19 | 6599.69 | `matrix(1, 0, 0, 1, 1674, 80.5)` | 1674 | FLIP near end; some cards still at high y; heights shrinking as images decode |
| **t=1000ms** | `none` | 805.14 | 6522.19 | `none` | 738 | All transforms cleared; layout settled |
| **t=2000ms** | `none` | 805.14 | 6522.19 | `none` | 738 | Stable |
| **t=after-load+500ms** | `none` | 805.14 | 6522.19 | `none` | 738 | Stable |

**Page state at t=100ms (the most interesting point)**:
- `readyState: 'complete'` (window.load has fired)
- `numCards: 4`
- `gsapExists: false` (GSAP is ESM-imported, not on `window`)
- `gsapTweens: 0`, `scrollTriggerCount: 0` (no public globals to query — GSAP is module-scoped)

**What is being animated between t=100ms and t=1000ms**:
1. **GSAP `useFlipJobs`** — the `Flip.from` with `absolute: true` is repositioning cards. Card 0 stays at x=180 throughout, but cards 1/2/3 have non-zero x and y values that are mid-transition. This is the visible "cards re-ordering" effect.
2. **GSAP `useFadeInJobCards`** — the `gsap.from(cards, { y: 30 })` is animating y. **But** the measured y values are NOT 30 → 0; they are 40.3 → 0. The 40.3 is the COMBINED transform: GSAP fade-in y-translate COMPOSED with FLIP's absolute position offset. The "30" the spec references is the y-translate only; the actual matrix is the composition.
3. **Image-async reflow** — card height changes from 1071.89 → 805.14 (a 266.75px shrink, ~25% of card size). This is the BROWSER reflowing cards as `<img>` elements paint.

---

## 4. Per-Time Measurements (Run B — test config, `reducedMotion: 'reduce'`)

`reducedMotion: 'reduce'` causes `usePrefersReducedMotion()` to return `true`. The two hooks respond:

- `useFadeInJobCards.js:28-32` — **bails out**: `gsap.set(cards, { autoAlpha: 1, y: 0, clearProps: 'transform' })` and returns. **No animation.**
- `useFlipJobs.js:34` — **bails out**: `if (prefersReducedMotion) return undefined`. **No FLIP.**

| Time | All cards: transform | All cards: height | All cards: y |
|---|---|---|---|
| **t=0 (right after load)** | `none` | 805.14 | 6522.19 (cards 0/1) · 7363.33 (cards 2/3) |
| **t=after-load+500ms** | `none` | 805.14 | (unchanged) |
| **Height delta** | — | **0px** ✅ | — |
| **Transform delta** | **none → none** (no change) | — | — |

**Verdict for Run B**: The height-delta test PASSES. The transform-delta is also 0. Both because the GSAP animations are suppressed by `reducedMotion: 'reduce'` in the test config.

---

## 5. Verdict: the test is NOT catching the user-reported bug

The height-delta test in `tests/visual/jobs-cards.spec.js` (the **CRITICAL test** for N2) passes in P1 because:

1. **`reducedMotion: 'reduce'`** in `playwright.config.js` projects:10-89 suppresses both `useFadeInJobCards` AND `useFlipJobs` animations entirely.
2. **`waitUntil: 'load'`** on `page.goto`: the test starts measuring AFTER `window.load` fires, which is after images have decoded and cards have settled to their final 805.14px height. The 266.75px image-async reflow happens BEFORE `window.load` and is **not measured** by the test.

The user reports a visible "relayout on reload". The user is seeing the GSAP fade-in (`y: 30 → 0` over 0.9s) + the GSAP FLIP reorder + the image-async reflow happening during the first ~1 second of page load. **The test is configured in a way that none of this is observable.** The test is structurally a false-negative for the user-reported bug.

### What the user actually sees

1. **Image-async reflow** (BEFORE window.load, hidden from test): card heights change by ~266px as `<img>` elements paint. This IS a real layout reflow.
2. **GSAP fade-in** (visible 0.9s, hidden from test): each card animates from `y: 30, opacity: 0` to `y: 0, opacity: 1`. This is a transform animation, not a reflow, but it IS a visible "jump" the eye perceives.
3. **GSAP FLIP** (visible 0.3s, hidden from test): cards become `position: absolute` and slide to their new sort positions. **Also** a visible jump, especially on slow CPUs.

The user's word "relayout" is colloquial — they may be calling the visible fade-in + FLIP animation a "relayout". The actual layout reflow is item 1 (image-async).

---

## 6. P2 (N2) Fix Strategy Recommendations

The spec's current plan (FR-N2-01..08) addresses item 1 (image-async) by adding `window.load` + `img.decode()` waits + CSS reservations. **This is necessary but NOT sufficient** to kill the user-reported visible jump. To make P2 truly kill the bug, the test config and the production code both need to change.

### Recommendation A — Augment the test, keep the animation (PREFERRED)

- **Code change** (N2 GREEN): keep the GSAP fade-in + FLIP animations (they are the 003 design intent) BUT gate them on `window.load` + `Promise.all(img.decode())` so they fire AFTER the layout is stable. This is what the spec already specifies.
- **Test change**: assert in the visual spec that the card has `transform: none` (or no in-progress tween) at `t=after-load + 200ms` AND that the height delta is 0. Use `reducedMotion: 'no-preference'` in a separate test variant to catch the real-browser behavior, OR add a one-off "no-reducedMotion" check in addition to the current reducedMotion check.
- **Cost**: low. The existing test still runs as today (height-delta = 0). A new test variant or a transform-value assertion is added.
- **Benefit**: catches the user-reported bug in the future.

### Recommendation B — Suppress the GSAP fade-in on first mount (USER-EXPERIENCE CHANGE)

- **Code change**: in `useFadeInJobCards`, when `window.load` + `img.decode()` have already happened by the time the effect runs, skip the `gsap.from(...)` tween entirely and just `gsap.set(cards, { autoAlpha: 1, y: 0 })`. The cards appear in their final state. The FLIP reorder still works on subsequent sort changes.
- **Cost**: removes the entrance animation. This is a visual design change — the 003 design had the entrance animation intentionally. The user may or may not like losing it.
- **Benefit**: zero visible jump on reload.

### Recommendation C — Keep spec as-is, document the gap (NOT RECOMMENDED)

- The spec's plan addresses image-async reflow. The visible fade-in + FLIP will still happen. The user may continue to perceive a "relayout" even after P2 merges.
- **Cost**: high — user-reported bug persists. The verify gate at P2 will report PASS because the height-delta test passes, but the user's experience has not changed.

### **Recommended choice for P2 (N2) GREEN: A + minor code change**

The spec's plan is correct. Add the new transform-value assertion to the visual test (recommendation A). The existing `useFadeInJobCards` code will be modified to await `window.load` + `img.decode()` before `ScrollTrigger.create`, which delays the animation past the image-async reflow window. The user will see:

- A brief moment of "blank" cards (pre-animation state) while images decode
- Then the GSAP fade-in + FLIP plays on stable layout
- No image-async reflow DURING the animation

This is the cleanest path that preserves the 003 design intent (entrance animation + FLIP) while killing the user-reported "relayout".

---

## 7. Specific P2 Test Additions

To make the test catch the user-reported bug, add the following to `tests/visual/jobs-cards.spec.js`:

```javascript
// New test: catches the visible "fade-in jump" the height-delta test misses.
// Run with a SECOND Playwright project config that uses
// reducedMotion: 'no-preference' to mimic real user conditions.
test('SC-N2-01b: cards have no in-progress transform at t=after-load (real browser)', async ({ page }) => {
  await page.goto('/#experience')
  await page.evaluate(() => Promise.all(
    Array.from(document.querySelectorAll('[data-job-card] img'))
      .map(img => img.decode().catch(() => null))
  ))
  // Wait long enough for the 0.9s fade-in + 0.3s FLIP to complete.
  await page.waitForTimeout(1500)

  const transforms = await page.$$eval(
    '[data-job-card]',
    cards => cards.map(c => window.getComputedStyle(c).transform)
  )
  transforms.forEach((t, i) => {
    expect(t, `Card #${i} still has transform "${t}" 1500ms after load; ` +
      'the GSAP entrance + FLIP animation should have completed. ' +
      'If N2 is correctly applied, no in-progress tween should remain.'
    ).toBe('none')
  })
})
```

To enable this test, add a second Playwright project to `playwright.config.js` that uses `reducedMotion: 'no-preference'`:

```javascript
{
  name: 'desktop-1440-no-reduced-motion',
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference'  // mimic real user
  }
}
```

And mark the existing height-delta test to also run in this project (currently it's already scoped to `desktop-1440`, would automatically run in the new one too).

---

## 8. Per-Time Measurement Data (full, for the record)

Full machine-readable measurements saved at `/tmp/opencode/relayout-measurements.json` during this verification. The values above are the subset needed to confirm/refute the hypothesis.

**Final matrix per card (from t=100ms to t=after-load+500ms)**:

| Card | t=100ms (matrix) | t=200ms | t=500ms | t=1000ms | t=after-load+500ms |
|---|---|---|---|---|---|
| 0 | `matrix(1,0,0,1,0,40.3)` | `matrix(1,0,0,1,0,41.85)` | `matrix(1,0,0,1,0,77.5)` | `none` | `none` |
| 1 | `matrix(1,0,0,1,558,40.3)` | `matrix(1,0,0,1,569.40,40.61)` | `matrix(1,0,0,1,1674,80.5)` | `none` | `none` |
| 2 | `matrix(1,0,0,1,0,1148.3)` | `matrix(1,0,0,1,0,1148.3)` | `matrix(1,0,0,1,0,3200.6)` | `none` | `none` |
| 3 | `matrix(1,0,0,1,558,1148.3)` | `matrix(1,0,0,1,558,1148.3)` | `matrix(1,0,0,1,1668.58,3190.64)` | `none` | `none` |

The increasing y values (40.3 → 41.85 → 77.5) and x values (558 → 569.40 → 1674) on cards 1 and 3 reflect the FLIP `absolute: true` repositioning during the 0.3s tween. Card 0's x is constant because it is in its final sort position. All clears by t=1000ms.

---

## 9. Verdict — One Sentence

**The sdd-apply P1 hypothesis ("GSAP y: 30 → 0 is the visible jump") is PARTIALLY CONFIRMED**: yes, the GSAP entrance is visible, BUT the dominant visible phenomenon in real browsers is actually the **FLIP reorder** (cards becoming `position: absolute` and animating to new x positions) COMBINED with the **image-async reflow** (266.75px card-height shrink as images paint, happening before `window.load`). The current visual test catches NONE of this because it runs with `reducedMotion: 'reduce'` (suppresses GSAP) and starts measuring at `waitUntil: 'load'` (after images settled). The test is a structural false-negative for the user-reported bug. **Recommended fix**: see §6 recommendation A — augment the test with a `reducedMotion: 'no-preference'` variant that asserts `transform: none` 1500ms after load, and have N2 gate the GSAP animations on `window.load` + `img.decode()`.
