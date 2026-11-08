import { useEffect } from 'react'

/**
 * Dismissal paths for the mobile menu.
 *
 * The menu state lives in the DOM, not in React: the hidden checkbox
 * (`navMenuRef`) is the single source of truth and the CSS reacts to it
 * through `:has(.checkbox:checked)`. That is why this hook reads
 * `checked` straight from the DOM node instead of relying on React
 * state.
 *
 * Two ways to dismiss an open menu:
 *  - Clicking outside of it (the backdrop, the nav bar, any page
 *    content behind the panel).
 *  - Pressing Escape.
 *
 * Clicks inside `panelRef` (the slide-in panel) and inside `toggleRef`
 * (the hamburger/X button) are ignored: the former must not close the
 * menu on every interaction, and the latter toggles the checkbox
 * natively, so dismissing it here would immediately re-open it.
 *
 * @param {object} params
 * @param {React.RefObject<HTMLInputElement>} params.navMenuRef - checkbox controlling the menu
 * @param {React.RefObject<HTMLElement>} params.panelRef - slide-in panel; clicks inside are ignored
 * @param {React.RefObject<HTMLElement>} params.toggleRef - hamburger/X button; clicks inside are ignored
 * @param {Function} params.onClose - callback that closes the menu
 */
export function useDismissMenu ({ navMenuRef, panelRef, toggleRef, onClose }) {
  useEffect(() => {
    function isMenuOpen () {
      return Boolean(navMenuRef?.current?.checked)
    }

    function handleClick (event) {
      if (!isMenuOpen()) return

      const target = event.target
      if (panelRef?.current?.contains(target)) return
      if (toggleRef?.current?.contains(target)) return

      onClose()
    }

    function handleKeyDown (event) {
      if (event.key !== 'Escape') return
      if (!isMenuOpen()) return

      onClose()
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [navMenuRef, panelRef, toggleRef, onClose])
}
