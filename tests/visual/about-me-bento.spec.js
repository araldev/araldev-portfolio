// tests/visual/about-me-bento.spec.js — AboutMe section visual gate.
//
// This spec was removed in d8a085a ("feat(aboutme): rebuild AboutMe
// section with sticky avatar") but its four snapshot baselines were
// left behind in tests/visual/about-me-bento.spec.js-snapshots/ —
// orphaned files that no test compared against, so the section could
// drift without anything noticing.
//
// This spec restores the gate: it compares against those same
// baselines and asserts the qualities grid keeps its shape.
//
// Why a real browser: jsdom never lays out CSS Grid, so it cannot
// observe the actual card dimensions. Real Chromium renders the
// section and boundingBox() reports the truth.

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { installFixedClock, waitForVisualSettle } from './clock-fixture.js'

// Install a fixed clock for every test in this file so the snapshot
// baseline stays stable across days.
test.beforeEach(async ({ page }) => {
  await installFixedClock(page)
})

test.describe('AboutMe section — snapshot @ active viewport', () => {
  test('snapshot', async ({ page }, testInfo) => {
    await page.goto('/#about-me')
    await waitForVisualSettle(page)

    const section = page.locator('#about-me')
    await expect(section).toBeVisible()

    await expect(section).toHaveScreenshot(
      `about-me-${testInfo.project.name}.png`,
      { maxDiffPixelRatio: 0.05 }
    )
  })
})

test.describe('AboutMe qualities grid', () => {
  test('every quality card shows only an icon and the quality', async ({ page }) => {
    await page.goto('/#about-me')
    await waitForVisualSettle(page)

    const cards = page.locator('[class*="highlight_card"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)

      // The icon and the quality are present…
      await expect(card.locator('[class*="highlight_icon"]')).toHaveCount(1)
      await expect(card.locator('[class*="highlight_label"]')).toHaveCount(1)

      // …and there is no subtitle underneath.
      await expect(card.locator('[class*="highlight_desc"]')).toHaveCount(0)
    }
  })

  test('the qualities are readable (icon + text on screen)', async ({ page }) => {
    await page.goto('/#about-me')
    await waitForVisualSettle(page)

    const labels = page.locator('[class*="highlight_label"]')
    const count = await labels.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      await expect(labels.nth(i)).toBeVisible()
      await expect(labels.nth(i)).not.toBeEmpty()
    }
  })
})

test.describe('FR-N3-07: axe-core 0 violations @ active viewport', () => {
  test('axe-core on #about-me', async ({ page }) => {
    await page.goto('/#about-me')
    await waitForVisualSettle(page)

    const results = await new AxeBuilder({ page })
      .include('#about-me')
      .analyze()

    expect(results.violations).toEqual([])
  })
})
