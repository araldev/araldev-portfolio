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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // Scope coverage to the JobCard feature (002) so the SC-005 ≥80%
      // threshold applies to the new code only. Pre-existing files
      // (ProjectsCards, useNavPaths, BackgroundHeroCanvas, …) are
      // explicitly out of scope for this iteration per the prior 04-developer
      // handoff and are measured as 0% in CI until a later feature adds
      // their suites. Vitest still RUNS every test file; this only
      // restricts which files are counted in the coverage report.
      include: [
        'src/Hooks/useJobDuration.js',
        'src/Hooks/useSortJobs.js',
        'src/Hooks/useFadeInJobCards.js',
        'src/Hooks/useFlipJobs.js',
        'src/Hooks/useBeaconPulse.js',
        'src/Hooks/useIsFeaturedJob.js',
        'src/Hooks/usePrefersReducedMotion.js',
        'src/components/JobCard/**',
        'src/components/JobsCards/**'
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
