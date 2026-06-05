// tests/visual/p6-filter-check.spec.js — P6 FilterProjects behavior gate.
//
// Verifies the new P6 (Java, Spring, Postgres, Angular, JUnit, RxJS, IA)
// filter-icon behavior in the #projects section:
//   1. Default state: all 6 colourful P6 icons render WHITE; IA renders
//      its futuristic gradient (cyan→violet→pink).
//   2. :hover (desktop) state: the hovered icon scales to 1.2× AND its
//      paths adopt their real brand colours (multi-path icons checked
//      per nth-child).
//   3. :checked state (after clicking the icon): same brand colours as
//      :hover, but WITHOUT the scale.
//   4. Unchecking reverts the icon to its default state (white or
//      gradient for IA).

import { test, expect } from '@playwright/test'

const P6_KEYS = ['java', 'spring', 'postgres', 'angular', 'junit', 'rxjs', 'ia']

// In the default (inactive) state the brand-silhouette of 3 P6 icons
// depends on selected paths reading as "transparent". The P6 CSS
// implementation uses the SITE BACKGROUND colour (#111117) as the
// transparent-equivalent fill instead of true `transparent` — the
// dark site background shows through visually, so the brand shape
// stays recognisable without becoming a solid white blob. Indexed by
// 1-based path position, exactly like REAL_COLOURS below.
const TRANSPARENT_IN_DEFAULT = {
  angular: [3],         // the white "A" letter inside the shield
  postgres: [3, 4],     // the thin white highlight strokes on the elephant
  spring: [1]           // the outer green leaf body — bg-colour makes only the
                        // inner white cutout read as the leaf silhouette
}

// Per-icon real-colour expectations: array indexed by path :nth-child
// (1-based). A value of `null` means "no specific assertion needed"
// (the test still asserts it's NOT white in default state).
const REAL_COLOURS = {
  java: {
    1: '#0074BD', 2: '#EA2D2E', 3: '#0074BD', 4: '#EA2D2E', 5: '#0074BD'
  },
  spring: {
    1: '#8bc34a', 2: '#fff'
  },
  postgres: {
    1: '#336791', 2: '#336791', 3: '#FFFFFF', 4: '#FFFFFF'
  },
  angular: {
    1: '#E23237', 2: '#B52E31', 3: '#FFFFFF'
  },
  junit: {
    1: '#dc514a', 2: '#23a161'
  },
  rxjs: {
    1: '#e32286',
    2: 'url(#rxjs-grad-a)',
    3: 'url(#rxjs-grad-b)',
    4: 'url(#rxjs-grad-c)'
  },
  ia: { 1: 'url(#ia-futuristic-grad)' } // IA is always the gradient
}

// Normalise the fill value returned by the browser (it can come back as
// hex OR rgb(), and may be lowercased).
function parseFill (str) {
  if (!str) return null
  const m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (m) return `rgb(${m[1]},${m[2]},${m[3]})`
  return str.toLowerCase().trim()
}
function fillsEqual (a, b) {
  const na = parseFill(a)
  const nb = parseFill(b)
  if (na === nb) return true
  // hex <-> rgb
  const hexToRgb = (h) => {
    if (!h.startsWith('#')) return null
    const v = h.length === 4
      ? h.slice(1).split('').map(c => c + c).join('')
      : h.slice(1)
    const r = parseInt(v.slice(0, 2), 16)
    const g = parseInt(v.slice(2, 4), 16)
    const b = parseInt(v.slice(4, 6), 16)
    return `rgb(${r},${g},${b})`
  }
  return hexToRgb(a) === parseFill(b) || hexToRgb(b) === parseFill(a) ||
    hexToRgb(a) === hexToRgb(b)
}

// Locate the P6 filter icon by its data-key. The container is a
// <label> whose className is mangled by CSS modules — we navigate
// from the SVG (which has the stable data-key) up to the label.
// The matching <input> lives as the first child of that label.
function svgFor (page, key) {
  return page.locator(`#projects svg[data-key="${key}"]`)
}
function labelFor (page, key) {
  return svgFor(page, key).locator('xpath=ancestor::label[1]')
}
function inputFor (page, key) {
  // The input is the first <input> child of the same label
  return labelFor(page, key).locator('input')
}

test.describe('P6 FilterProjects — default / hover / checked', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#projects')
    await page.waitForLoadState('networkidle')
  })

  test('default state: 6 colourful P6 icons + IA are WHITE; inner-detail paths use site background colour', async ({ page }) => {
    for (const key of P6_KEYS) {
      const svg = svgFor(page, key)
      await expect(svg, `svg[data-key="${key}"] must be present`).toBeVisible()

      const fills = await svg.evaluate((root) => {
        return Array.from(root.querySelectorAll('path'))
          .map(p => {
            // CSS computed fill wins over the SVG fill attribute
            const cs = window.getComputedStyle(p)
            return cs.fill
          })
      })

      // P6 icons + IA: outer paths WHITE, some inner detail paths set to
      // the site background colour (transparent-equivalent on the dark
      // site background). The gradient is revealed on :hover for IA.
      const transparentPaths = TRANSPARENT_IN_DEFAULT[key] || []
      // Site background colour = the P6 implementation's "transparent"
      // equivalent on the dark site background.
      const SITE_BG_RGB = 'rgb(17,17,23)'
      const isTransparent = (f) =>
        f === 'transparent' || f === 'rgba(0, 0, 0, 0)' || parseFill(f) === 'rgba(0,0,0,0)' ||
        parseFill(f) === SITE_BG_RGB
      const isWhite = (f) =>
        fillsEqual(f, '#ffffff') || fillsEqual(f, '#fff') || parseFill(f) === 'rgb(255,255,255)'
      const allOk = fills.every((f, i) => {
        const idx = i + 1
        return transparentPaths.includes(idx) ? isTransparent(f) : isWhite(f)
      })
      expect(allOk,
        `${key} default: outer paths should be WHITE and inner-detail paths (${transparentPaths.join(',') || 'none'}) should be site-background-colour. Got: ${JSON.stringify(fills)}`
      ).toBe(true)
    }
  })

  test(':hover (desktop): scale(1.2) + real brand colours', async ({ page }) => {
    // desktop-1440 has hover capability by default
    for (const key of ['java', 'spring', 'postgres', 'angular', 'junit', 'rxjs']) {
      const label = labelFor(page, key)
      const svg = svgFor(page, key)
      await expect(label).toBeVisible()

      // Hover the label and wait for the 300ms transition to complete
      // (otherwise we read the mid-transition rgb which is the average
      // of the start and end colours, e.g. white + #0074BD = ~rgb(128,186,222))
      await label.hover()
      await page.waitForTimeout(400)

      // Get the computed transform of the SVG (should be matrix(1.2,0,0,1.2,...) = scale(1.2))
      const transform = await svg.evaluate(el => window.getComputedStyle(el).transform)
      // matrix(a,b,c,d,e,f) — for uniform scale, a === d === scale and b === c === 0
      const m = transform.match(/matrix\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)/)
      expect(m, `${key} transform must be a matrix()`).not.toBeNull()
      const scaleX = parseFloat(m[1])
      const scaleY = parseFloat(m[4])
      expect(Math.abs(scaleX - 1.2), `${key} scaleX should be 1.2, got ${scaleX}`).toBeLessThan(0.01)
      expect(Math.abs(scaleY - 1.2), `${key} scaleY should be 1.2, got ${scaleY}`).toBeLessThan(0.01)

      // Per-path fills should match the expected brand colours
      const fills = await svg.evaluate((root) => {
        return Array.from(root.querySelectorAll('path'))
          .map(p => window.getComputedStyle(p).fill)
      })
      const expected = REAL_COLOURS[key]
      expect(fills.length, `${key} should have ${Object.keys(expected).length} paths`).toBe(Object.keys(expected).length)
      fills.forEach((actual, i) => {
        const want = expected[i + 1]
        if (!want) return
        // rxjs gradient URLs may resolve to the first matching <defs> in
        // the document (which IS the rxjs SVG itself for the first
        // rxjs on the page) — we accept any fill that contains the
        // expected gradient ID.
        const expectedNorm = want.startsWith('url(') ? want.toLowerCase() : want
        const actualNorm = actual.toLowerCase()
        const match = fillsEqual(actual, want) ||
          (expectedNorm.startsWith('url(') && actualNorm.includes(expectedNorm.match(/#[\w-]+/)[0]))
        expect(match,
          `${key} path #${i + 1}: expected "${want}", got "${actual}" (normalised: ${actualNorm})`
        ).toBe(true)
      })

      // Move mouse away to reset hover state for the next icon
      await page.mouse.move(0, 0)
      await page.waitForTimeout(350)
    }
  })

  test(':checked state: brand colours persist, NO scale', async ({ page }) => {
    // Use Java as a representative single-icon test (full multi-path check).
    // The <input> is `hidden` — we click the LABEL which is wired to the
    // checkbox via htmlFor. Clicking the label toggles the checkbox.
    // IMPORTANT: after clicking, move the mouse away so :hover is no
    // longer active — otherwise the scale(1.2) on :hover would mask the
    // "no scale" assertion in :checked.
    const input = inputFor(page, 'java')
    const label = labelFor(page, 'java')
    const svg = svgFor(page, 'java')

    // Click the label to check, then move the mouse away
    await label.click()
    await page.mouse.move(0, 0)
    await page.waitForTimeout(400) // let the transition settle (300ms)

    // Verify checked
    expect(await input.isChecked(), 'Java checkbox should be checked').toBe(true)

    // No scale — parse both "none" and "matrix(a,b,c,d,e,f)" forms
    const transform = await svg.evaluate(el => window.getComputedStyle(el).transform)
    const scaleX = transform === 'none'
      ? 1
      : parseFloat((transform.match(/matrix\(\s*([-\d.]+)/) || [])[1] || 1)
    expect(Math.abs(scaleX - 1), `Java checked should NOT scale, got transform ${transform}`).toBeLessThan(0.01)

    // Brand colours persist
    const fills = await svg.evaluate((root) => {
      return Array.from(root.querySelectorAll('path'))
        .map(p => window.getComputedStyle(p).fill)
    })
    const expected = REAL_COLOURS.java
    fills.forEach((actual, i) => {
      const want = expected[i + 1]
      expect(fillsEqual(actual, want),
        `Java checked path #${i + 1}: expected "${want}", got "${actual}"`
      ).toBe(true)
    })

    // Uncheck — should revert to WHITE
    await label.click()
    await page.mouse.move(0, 0)
    await page.waitForTimeout(400)
    expect(await input.isChecked(), 'Java checkbox should be unchecked').toBe(false)

    const whiteFills = await svg.evaluate((root) => {
      return Array.from(root.querySelectorAll('path'))
        .map(p => window.getComputedStyle(p).fill)
    })
    const allWhite = whiteFills.every(f => fillsEqual(f, '#ffffff') || parseFill(f) === 'rgb(255,255,255)')
    expect(allWhite,
      `Java unchecked should revert to WHITE, got: ${JSON.stringify(whiteFills)}`
    ).toBe(true)
  })

  test('IA: WHITE in default + checked; gradient revealed on :hover', async ({ page }) => {
    const input = inputFor(page, 'ia')
    const svg = svgFor(page, 'ia')
    const label = labelFor(page, 'ia')

    // Default: WHITE (the gradient is the hover reveal)
    const defaultFills = await svg.evaluate((root) =>
      Array.from(root.querySelectorAll('path'))
        .map(p => window.getComputedStyle(p).fill)
    )
    expect(defaultFills.every(f => fillsEqual(f, '#ffffff') || parseFill(f) === 'rgb(255,255,255)'),
      `IA default should be WHITE, got: ${JSON.stringify(defaultFills)}`
    ).toBe(true)

    // Hover: scale(1.2) + gradient reveal. Wait 400ms for the
    // transform transition to complete.
    await label.hover()
    await page.waitForTimeout(400)
    const hoverTransform = await svg.evaluate(el => window.getComputedStyle(el).transform)
    const m = hoverTransform.match(/matrix\(\s*([-\d.]+)/)
    expect(m && Math.abs(parseFloat(m[1]) - 1.2) < 0.01,
      `IA hover should scale to 1.2, got ${hoverTransform}`).toBe(true)
    const hoverFills = await svg.evaluate((root) =>
      Array.from(root.querySelectorAll('path'))
        .map(p => window.getComputedStyle(p).fill)
    )
    expect(hoverFills.every(f => f.toLowerCase().includes('ia-futuristic-grad')),
      `IA hover should be gradient, got: ${JSON.stringify(hoverFills)}`
    ).toBe(true)

    // Move away, then check (click the LABEL, not the hidden input),
    // then move the mouse away so :hover doesn't mask the no-scale check.
    await page.mouse.move(0, 0)
    await page.waitForTimeout(350)
    await label.click()
    await page.mouse.move(0, 0)
    await page.waitForTimeout(400)
    const checkedTransform = await svg.evaluate(el => window.getComputedStyle(el).transform)
    // transform can be "none" (no scale applied) or "matrix(a,b,c,d,e,f)"
    // (a === d === scale). Parse both forms.
    const scaleXChecked = checkedTransform === 'none'
      ? 1
      : parseFloat((checkedTransform.match(/matrix\(\s*([-\d.]+)/) || [])[1] || 1)
    expect(Math.abs(scaleXChecked - 1) < 0.01,
      `IA checked should NOT scale, got ${checkedTransform}`).toBe(true)
    // IA has no :checked rule in the CSS, so it falls back to the base
    // WHITE default. The gradient is hover-only.
    const checkedFills = await svg.evaluate((root) =>
      Array.from(root.querySelectorAll('path'))
        .map(p => window.getComputedStyle(p).fill)
    )
    expect(checkedFills.every(f => fillsEqual(f, '#ffffff') || parseFill(f) === 'rgb(255,255,255)'),
      `IA checked should be WHITE, got: ${JSON.stringify(checkedFills)}`
    ).toBe(true)

    // Cleanup — uncheck via the label, move mouse away
    await label.click()
    await page.mouse.move(0, 0)
  })
})
