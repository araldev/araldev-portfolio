// tests/visual/p6-filter-screenshots.spec.js — captura screenshots de los
// 3 estados clave del FilterProjects P6 (default / hover / checked) para
// evidencia visual rápida. NO es un test de aserción.
import { test } from '@playwright/test'

const SCREENSHOTS_DIR = 'test-results/p6-filter-screenshots'

test('P6 FilterProjects — captura de 3 estados (default / hover / checked)', async ({ page }, testInfo) => {
  await page.goto('/#projects')
  await page.waitForLoadState('networkidle')

  // Ubicar el form del filter
  const filter = page.locator('#projects form')
  await filter.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)

  // 1) Default state — todos blancos, IA gradient
  await page.mouse.move(0, 0)
  await page.waitForTimeout(400)
  await filter.screenshot({ path: `${SCREENSHOTS_DIR}/1-default.png` })

  // 2) Hover state — hover sobre Java (label)
  const javaLabel = page.locator('#projects svg[data-key="java"]').locator('xpath=ancestor::label[1]')
  await javaLabel.hover()
  await page.waitForTimeout(500)
  await filter.screenshot({ path: `${SCREENSHOTS_DIR}/2-hover-java.png` })

  // 3) Hover state — hover sobre IA (para mostrar el gradient escalado)
  await page.mouse.move(0, 0)
  await page.waitForTimeout(400)
  const iaLabel = page.locator('#projects svg[data-key="ia"]').locator('xpath=ancestor::label[1]')
  await iaLabel.hover()
  await page.waitForTimeout(500)
  await filter.screenshot({ path: `${SCREENSHOTS_DIR}/3-hover-ia.png` })

  // 4) Checked state — click Java + Spring para mostrar dos íconos activos
  await page.mouse.move(0, 0)
  await page.waitForTimeout(400)
  await javaLabel.click()
  await page.mouse.move(0, 0)
  await page.waitForTimeout(400)
  const springLabel = page.locator('#projects svg[data-key="spring"]').locator('xpath=ancestor::label[1]')
  await springLabel.click()
  await page.mouse.move(0, 0)
  await page.waitForTimeout(500)
  await filter.screenshot({ path: `${SCREENSHOTS_DIR}/4-checked-java-spring.png` })

  // 5) Checked + Hover sobre IA (gradient + scale)
  await iaLabel.hover()
  await page.waitForTimeout(500)
  await filter.screenshot({ path: `${SCREENSHOTS_DIR}/5-checked-hover-ia.png` })

  console.log('=== screenshots guardados en', SCREENSHOTS_DIR, '===')
})
