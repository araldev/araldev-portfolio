import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/araldev-portfolio/',
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./tests/setup.js'],
    css: false,
    // FR-N4-08: Playwright specs live under tests/visual/ and are run by
    // `pnpm test:visual`, not by Vitest. Excluding them from the default
    // test discovery prevents Vitest from trying to load @playwright/test
    // and @axe-core/playwright (which are Node-only and break in jsdom).
    exclude: [
      '**/node_modules/**',
      'dist/**',
      'tests/visual/**'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // 004 (UX Overhaul & Relayout Root-Fix) adds ProjectsCards and
      // AboutMe to the coverage scope so the SC-005 ≥80% gate applies to
      // the new code in those components (N1 in P3, N3 in P2). Pre-PR
      // scoping keeps existing out-of-scope files (NavHeader, AboutMe
      // styles already in scope, etc.) at 0% until each feature's suite
      // is added. Vitest still RUNS every test file; this only restricts
      // which files are counted in the coverage report.
      include: [
        'src/Hooks/useJobDuration.js',
        'src/Hooks/useSortJobs.js',
        'src/Hooks/useFadeInJobCards.js',
        'src/Hooks/useFlipJobs.js',
        'src/Hooks/useBeaconPulse.js',
        'src/Hooks/useIsFeaturedJob.js',
        'src/Hooks/usePrefersReducedMotion.js',
        'src/components/JobCard/**',
        'src/components/JobsCards/**',
        'src/components/ProjectsCards/**',
        'src/components/AboutMe/**'
      ],
      exclude: [
        'src/**/*.module.css'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
})
