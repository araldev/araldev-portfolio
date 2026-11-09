import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNavPaths } from '../../src/Hooks/useNavPaths.js'

const lenisMock = vi.hoisted(() => ({
  stop: vi.fn(),
  start: vi.fn(),
  scrollTo: vi.fn()
}))

vi.mock('lenis/react', () => ({
  useLenis: () => lenisMock
}))

beforeEach(() => {
  lenisMock.stop.mockClear()
  lenisMock.start.mockClear()
  lenisMock.scrollTo.mockClear()
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

// The hook scrolls on the next animation frame, so the assertions have
// to wait for it.
function nextFrame () {
  return new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

describe('useNavPaths', () => {
  it('scrolls to the section matching data-id', async () => {
    const section = document.createElement('section')
    section.id = 'projects'
    document.body.appendChild(section)

    const { result } = renderHook(() => useNavPaths({}))

    await act(async () => {
      result.current.handleClick({
        preventDefault: vi.fn(),
        target: { dataset: { id: 'projects' } }
      })
      await nextFrame()
    })

    expect(lenisMock.scrollTo).toHaveBeenCalledTimes(1)
    const [target, options] = lenisMock.scrollTo.mock.calls[0]
    expect(target).toBe(section)
    expect(options.offset).toBe(-80)
    expect(options.duration).toBe(1.5)

    section.remove()
  })

  it('uses a taller offset for the home section', async () => {
    const section = document.createElement('section')
    section.id = 'home'
    document.body.appendChild(section)

    const { result } = renderHook(() => useNavPaths({}))

    await act(async () => {
      result.current.handleClick({
        preventDefault: vi.fn(),
        target: { dataset: { id: 'home' } }
      })
      await nextFrame()
    })

    expect(lenisMock.scrollTo.mock.calls[0][1].offset).toBe(-(window.innerHeight * 2))

    section.remove()
  })

  it('warns and does not scroll when the click has no data-id', async () => {
    const { result } = renderHook(() => useNavPaths({}))

    await act(async () => {
      result.current.handleClick({ preventDefault: vi.fn(), target: { dataset: {} } })
      await nextFrame()
    })

    expect(console.warn).toHaveBeenCalled()
    expect(lenisMock.scrollTo).not.toHaveBeenCalled()
  })

  it('warns and does not scroll when the target section does not exist', async () => {
    const { result } = renderHook(() => useNavPaths({}))

    await act(async () => {
      result.current.handleClick({
        preventDefault: vi.fn(),
        target: { dataset: { id: 'does-not-exist' } }
      })
      await nextFrame()
    })

    expect(console.warn).toHaveBeenCalled()
    expect(lenisMock.scrollTo).not.toHaveBeenCalled()
  })

  it('closes the mobile menu when a nav link is clicked', async () => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = true
    document.body.appendChild(checkbox)

    const { result } = renderHook(() => useNavPaths({ navMenuRef: { current: checkbox } }))

    await act(async () => {
      result.current.handleClick({
        preventDefault: vi.fn(),
        target: { dataset: { id: 'projects' } }
      })
      await nextFrame()
    })

    expect(checkbox.checked).toBe(false)
    // The scroll lock must be released together with the menu.
    expect(lenisMock.start).toHaveBeenCalled()

    checkbox.remove()
  })

  it('freezes the scroll while the mobile menu is open', () => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    document.body.appendChild(checkbox)

    renderHook(() => useNavPaths({ navMenuRef: { current: checkbox } }))

    // Closed: the scroll stays free.
    expect(lenisMock.stop).not.toHaveBeenCalled()

    act(() => {
      checkbox.checked = true
      checkbox.dispatchEvent(new Event('change'))
    })
    expect(lenisMock.stop).toHaveBeenCalled()

    act(() => {
      checkbox.checked = false
      checkbox.dispatchEvent(new Event('change'))
    })
    expect(lenisMock.start).toHaveBeenCalled()

    checkbox.remove()
  })
})
