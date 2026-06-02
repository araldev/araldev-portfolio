/**
 * Pure helper: format a job's duration in compact form (e.g. "2y 4m", "8m", "1y").
 * Lives outside React — testable, no hooks.
 *
 * Edge cases (covered by tests):
 *  - Same start/end month → "1m" minimum (never "0m")
 *  - `current: true` without `endDate` → uses today's date
 *  - `current: true` with `endDate` defined → ignores endDate (EC-003)
 *  - Inverted dates (endDate < startDate) → throws Error in dev
 *  - Malformed dates → catches and returns "—"
 *
 * @param {Object} job - Job with startDate, endDate, current
 * @param {Date} [now] - injectable "now" for tests
 * @returns {string}
 */
export function formatDuration (job, now = new Date()) {
  if (!job || !job.startDate) return '—'

  let start
  let end

  try {
    start = parseISOMonth(job.startDate)
    if (!start) return '—'
    if (job.current || !job.endDate) {
      end = new Date(now)
    } else {
      end = parseISOMonth(job.endDate)
    }
    if (!end) return '—'
  } catch (_e) {
    return '—'
  }

  if (job.current && job.endDate) {
    // EC-003: silently ignore endDate when current is true.
    end = new Date(now)
  }

  if (end < start) {
    throw new Error(`[formatDuration] job "${job.id}": endDate < startDate`)
  }

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  if (months < 1) months = 1 // minimum 1 month

  const years = Math.floor(months / 12)
  const remMonths = months % 12

  if (years === 0) return `${remMonths}m`
  if (remMonths === 0) return `${years}y`
  return `${years}y ${remMonths}m`
}

/**
 * Parse "YYYY-MM" into a Date anchored to the 1st of that month.
 * @param {string} iso
 * @returns {Date|null}
 */
function parseISOMonth (iso) {
  if (typeof iso !== 'string') return null
  const m = /^(\d{4})-(\d{2})$/.exec(iso)
  if (!m) return null
  const year = Number(m[1])
  const month = Number(m[2])
  if (month < 1 || month > 12) return null
  return new Date(year, month - 1, 1)
}

/**
 * React hook wrapper (mirrors the project's hook convention).
 *
 * Catches any error thrown by `formatDuration` (per spec EC-004: "Fechas
 * invertidas → lanza Error en dev, muestra '—' en prod") so a malformed
 * `job.startDate`/`job.endDate` never crashes the component tree.
 *
 * @param {Object} job
 * @returns {string}
 */
export function useJobDuration (job) {
  try {
    return formatDuration(job)
  } catch (e) {
    // In production we swallow and render "—"; in dev we still surface a
    // console warning so the developer notices bad data.
    if (typeof console !== 'undefined' && console.error) {
      // eslint-disable-next-line no-console
      console.error('[useJobDuration]', e?.message || e)
    }
    return '—'
  }
}
