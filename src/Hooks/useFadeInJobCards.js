/**
 * P4 simplification: the JobsCards entrance animation is gone. The
 * GSAP-from variant was the source of the SC-N2-01b visual flake
 * (the assertion `transform: none 2500ms after load+decode` could
 * not be satisfied reliably because GSAP's `clearProps` runs in a
 * microtask that occasionally lands past the 2500ms budget on the
 * Vite dev server). The user-reported "relayout on reload" bug is
 * already prevented by the N2 gate logic that lived here — and
 * since the gate was only meaningful in combination with the GSAP
 * animation, the gate goes too. The hook is kept as a no-op so
 * JobsCards.jsx can keep its import without a refactor.
 *
 * Cards now render at their final state on first paint, which is
 * what reducedMotion users already saw.
 *
 * `WINDOW_LOAD_TIMEOUT_MS` is preserved as a re-export because
 * `useFlipJobs` (also a P4 no-op) still imports it.
 *
 * @param {React.MutableRefObject<HTMLElement>} _gridRef
 */
export const WINDOW_LOAD_TIMEOUT_MS = 5000

export function useFadeInJobCards (_gridRef) {
  // Intentional no-op. See the JSDoc above.
}
