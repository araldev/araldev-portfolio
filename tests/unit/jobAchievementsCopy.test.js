import { describe, it, expect } from 'vitest'
import { translations } from '../../src/i18n/translations.js'

// The "Key achievements" list is the one place where the copy still
// carried an em-dash separator. It reads as a stray dash mid-sentence
// and the list reads better as a plain comma-joined run.
const DASHES = /[—–]/

describe('job achievements copy', () => {
  for (const lang of Object.keys(translations)) {
    it(`has no dash separators in the achievements (${lang})`, () => {
      const jobs = translations[lang].jobsContent ?? {}

      for (const [key, job] of Object.entries(jobs)) {
        const achievements = job.achievements ?? []

        for (const [index, achievement] of achievements.entries()) {
          expect(
            achievement,
            `${key} achievement #${index} still contains a dash: "${achievement.slice(0, 120)}"`
          ).not.toMatch(DASHES)
        }
      }
    })
  }

  it('keeps the achievements readable after removing the dash', () => {
    const achievements = translations.es.jobsContent.nttData.achievements

    // The antepenultimate achievement is the one that had the dash.
    const antepenultimate = achievements[achievements.length - 3]

    expect(antepenultimate).toContain('prompts cerrados vs. abiertos')
    expect(antepenultimate).not.toMatch(DASHES)
  })
})
