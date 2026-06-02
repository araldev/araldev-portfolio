// tests/visual/axe-fixture.js — Shared axe-core helper for N4 specs.
//
// Wraps @axe-core/playwright's AxeBuilder so the spec files can call
// `runAxe(page, '#projects')` instead of repeating the new-AxeBuilder
// ceremony. Returns the raw axe results object so callers can assert
// on `results.violations`, `results.passes`, or `results.incomplete`
// as needed.
//
// Per FR-N4-06: every visual spec runs axe against its target
// section and asserts 0 violations. The helper keeps the call sites
// uniform and the import surface small.

import AxeBuilder from '@axe-core/playwright'

/**
 * Run axe-core against a CSS selector within a Playwright page.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - CSS selector to scope the audit to
 * @param {string} [label] - optional human-readable label for failure messages
 * @returns {Promise<import('axe-core').Result[]>} the raw axe results
 */
export async function runAxe (page, selector, label = selector) {
  const builder = new AxeBuilder({ page }).include(selector)

  const results = await builder.analyze()
  if (results.violations.length > 0) {
    // Log violations for the test report before the assertion fails.
    // This makes the failure diff actionable: the developer sees which
    // rule fired and which element is offending without re-running
    // with --debug.
    // eslint-disable-next-line no-console
    console.error(
      `[axe] ${results.violations.length} violation(s) in ${label}:`,
      results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length
      }))
    )
  }
  return results
}
