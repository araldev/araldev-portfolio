// Quick visual + DOM check of the new brand icons in JobsCards stack.
import { test, expect } from '@playwright/test'

test('verify P6 brand icons rendered with hardcoded colours', async ({ page }) => {
  await page.goto('/#experience')
  await page.waitForLoadState('networkidle')

  // CSS modules mangle class names, so locate by aria-label of the
  // JobCardStack <section> (text is set by JobCardStack.jsx:29).
  const stack = page.locator('#experience section[aria-label*="Technologies used"]').first()
  await expect(stack).toBeVisible()

  // Inventory: enumerate every <svg> child and capture (viewBox, fills)
  const icons = await stack.evaluate((root) => {
    const svgs = Array.from(root.querySelectorAll('svg'))
    return svgs.map(svg => {
      const ds = Array.from(svg.querySelectorAll('path'))
        .map(p => p.getAttribute('d') || '')
        .filter(Boolean)
      const fills = new Set()
      svg.querySelectorAll('[fill]').forEach(el => {
        const f = el.getAttribute('fill')
        if (f) fills.add(f)
      })
      svg.querySelectorAll('[stop-color]').forEach(el => {
        const sc = el.getAttribute('stop-color')
        if (sc) fills.add(sc)
      })
      svg.querySelectorAll('[style*="fill"]').forEach(el => {
        const m = el.getAttribute('style').match(/fill:\s*([^;'"]+)/)
        if (m) fills.add(m[1].trim())
      })
      return {
        viewBox: svg.getAttribute('viewBox'),
        pathCount: ds.length,
        firstPathChars: ds[0] ? ds[0].slice(0, 60) : null,
        fills: [...fills]
      }
    })
  })

  console.log('=== P6 icons inventory in first JobCard stack ===')
  for (const ic of icons) {
    console.log(JSON.stringify(ic))
  }
  console.log('=== total icons:', icons.length, '===')

  // We need the 7 P6 icons (Java, Spring, Postgres, Angular, JUnit, RxJS, IA)
  expect(icons.length, 'stack must contain the 7 P6 icons').toBeGreaterThanOrEqual(7)

  // Build a flat set of all fills present
  const allFills = new Set(icons.flatMap(i => i.fills))
  const allViewBoxes = new Set(icons.map(i => i.viewBox))

  // The P6 viewBoxes that must be present
  const p6ViewBoxes = [
    '0 0 128 128',          // Java
    '0 0 48 48',            // Spring
    '-4 0 264 264',         // Postgres
    '-8 0 272 272',         // Angular
    '12.1 8.4 262.8 272.2', // RxJS
    '0 0 512 512'           // IA
  ]
  for (const vb of p6ViewBoxes) {
    expect(allViewBoxes.has(vb), `viewBox "${vb}" must be present in the rendered stack`).toBe(true)
  }

  // The P6 brand colours that must be present somewhere in the rendered DOM.
  // (JUnit shares 128x128 with Java so we can't disambiguate by viewBox
  // alone — we check colour presence instead. Note: JUnit colours come
  // back as `rgb(220, 81, 74)` from getAttribute('style') because Chromium
  // normalises style declarations; we accept both hex and rgb forms.)
  const parseRgb = (str) => {
    const m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
    if (m) return `rgb(${m[1]},${m[2]},${m[3]})`
    if (str.startsWith('#')) return str.toLowerCase()
    return str
  }
  const allFillsNorm = new Set([...allFills].map(parseRgb))
  // Helper: check if any fill in the rendered stack matches a target colour
  // in either hex or rgb(r,g,b) form.
  const hasColor = (hex, rgb) => allFillsNorm.has(hex.toLowerCase()) || allFillsNorm.has(rgb)

  const required = [
    { name: 'Java blue',     hex: '#0074BD', rgb: 'rgb(0,116,189)' },
    { name: 'Java red',      hex: '#EA2D2E', rgb: 'rgb(234,45,46)' },
    { name: 'Spring green',  hex: '#8bc34a', rgb: 'rgb(139,195,74)' },
    { name: 'Spring white',  hex: '#fff',    rgb: 'rgb(255,255,255)' },
    { name: 'Postgres blue', hex: '#336791', rgb: 'rgb(51,103,145)' },
    { name: 'Angular red',   hex: '#E23237', rgb: 'rgb(226,50,55)' },
    { name: 'Angular dark',  hex: '#B52E31', rgb: 'rgb(181,46,49)' },
    { name: 'JUnit red',     hex: '#dc514a', rgb: 'rgb(220,81,74)' },
    { name: 'JUnit green',   hex: '#23a161', rgb: 'rgb(35,161,97)' },
    { name: 'RxJS pink',     hex: '#e32286', rgb: 'rgb(227,34,134)' },
    // IA was previously a single black fill; after the futuristic
    // gradient swap, its "brand identity" is a linearGradient with
    // 3 stops (cyan / violet / hot pink). Accept any of those as
    // evidence the gradient is wired up.
    { name: 'IA gradient stop cyan',    hex: '#00E0FF', rgb: 'rgb(0,224,255)' },
    { name: 'IA gradient stop violet',  hex: '#7C3AED', rgb: 'rgb(124,58,237)' },
    { name: 'IA gradient stop pink',    hex: '#FF1493', rgb: 'rgb(255,20,147)' }
  ]
  const missing = required.filter(c => !hasColor(c.hex, c.rgb)).map(c => c.name)
  console.log('=== missing colours:', JSON.stringify(missing), '===')
  expect(missing, `Missing brand colours in rendered stack: ${missing.join(', ')}`).toEqual([])

  // Negative check: NO svg should still have fill="currentColor" (old pattern)
  const stillCurrentColor = icons.filter(i => i.fills.includes('currentColor'))
  expect(stillCurrentColor, `Some icons still use fill="currentColor" (old pattern): ${JSON.stringify(stillCurrentColor)}`).toEqual([])
})
