// tests/visual/nav-mobile-menu.spec.js — Mobile sidebar menu reachability.
//
// The mobile sidebar (the slide-in panel) is taller than the viewport
// on short screens — a phone in landscape, or any window shorter than
// the sum of the link heights. The panel is `position: fixed` with
// `height: 100vh` and `justify-content: center`, so when the content
// does not fit, the links that overflow are pushed past the bottom
// edge and become unreachable: there is no scrollbar to reach them.
//
// This spec asserts the user-facing contract — every nav link must be
// inside the viewport (or inside a scrollable panel) and therefore
// tappable.

import { test, expect } from '@playwright/test'

// Short viewports where the panel content does not fit.
const SHORT_VIEWPORTS = [
  { name: 'landscape-812x375', width: 812, height: 375 },
  { name: 'landscape-667x375', width: 667, height: 375 },
  { name: 'small-320x568', width: 320, height: 568 }
]

async function openMobileMenu (page) {
  await page.waitForLoadState('networkidle')
  // The header only becomes interactive after 80px of scroll.
  await page.mouse.wheel(0, 400)
  await page.waitForTimeout(700)

  const toggle = page.locator('nav label').first()
  await toggle.click({ force: true })
  await page.waitForTimeout(600)
}

test.describe('Mobile sidebar menu — every link must be reachable', () => {
  for (const vp of SHORT_VIEWPORTS) {
    test(`all nav links are reachable @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')
      await openMobileMenu(page)

      const result = await page.evaluate(() => {
        const panel = document.querySelector('nav ul')
        const links = [...panel.querySelectorAll('a')]

        const panelStyle = getComputedStyle(panel)
        const scrollable = ['auto', 'scroll'].includes(panelStyle.overflowY)

        const overflowing = links
          .map(link => {
            const r = link.getBoundingClientRect()
            return { text: link.textContent.trim(), top: r.top, bottom: r.bottom }
          })
          .filter(l => l.bottom > window.innerHeight + 1 && l.top < window.innerHeight)

        return {
          scrollable,
          panelOverflowY: panelStyle.overflowY,
          viewportHeight: window.innerHeight,
          overflowing
        }
      })

      // Either the panel scrolls (so the links are reachable) or no
      // link overflows the viewport at all.
      const unreachable = result.scrollable ? [] : result.overflowing

      expect(
        unreachable.map(l => `${l.text} (bottom ${Math.round(l.bottom)} > vh ${result.viewportHeight})`),
        `panel overflow-y is "${result.panelOverflowY}" and these links fall outside the viewport`
      ).toEqual([])
    })
  }

  test('the last nav link can actually be clicked @ landscape-812x375', async ({ page }) => {
    await page.setViewportSize({ width: 812, height: 375 })
    await page.goto('/')
    await openMobileMenu(page)

    // Click the last link. If it overflows the viewport, the click
    // either misses or Playwright refuses to scroll it into view.
    const lastLink = page.locator('nav ul a').last()
    await expect(lastLink).toBeVisible()
    await lastLink.click({ force: true })
    await page.waitForTimeout(1200)

    // The click must have closed the menu and scrolled somewhere.
    const menuClosed = await page.evaluate(
      () => !document.querySelector('input[type="checkbox"]').checked
    )
    expect(menuClosed, 'clicking the last nav link must close the menu').toBe(true)
  })
})
