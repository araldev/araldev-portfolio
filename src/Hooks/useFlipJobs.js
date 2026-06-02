/**
 * P4 simplification: the FLIP reorder animation is gone. With the
 * filter removed from JobsCards, `sortJobs` never changes after mount
 * (`useSortJobs` now returns a stable `useMemo` reference) — there is
 * nothing for FLIP to animate, but the hook still ran in mount,
 * captured a state, and on the next rAF fired `Flip.from({absolute:true})`,
 * which applies `position: absolute` + `transform: translate(x,y)`
 * inline to every card and never clears those styles. That left
 * `transform: translate(0, 42.6px)` permanently on every card and
 * caused the SC-N2-01b transform assertion to fail.
 *
 * The hook is kept as a no-op so JobsCards.jsx can keep its import
 * without a refactor. The 5s load/decoded budget is preserved as a
 * re-export for any future test that wants to assert it.
 *
 * @param {React.MutableRefObject<HTMLElement>} _gridRef
 * @param {any} _sortTrigger
 */
export const WINDOW_LOAD_TIMEOUT_MS = 5000

export function useFlipJobs (_gridRef, _sortTrigger) {
  // Intentional no-op. See the JSDoc above.
}
