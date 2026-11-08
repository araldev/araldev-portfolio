import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFadeInText } from '../../src/Hooks/useFadeInText.js'

// GSAP is stubbed: the hook only needs to build a timeline from the
// split spans. The stub records the tween target so we can assert the
// hook split the text into per-word spans.
const gsapMock = vi.hoisted(() => ({
  timeline: vi.fn(() => ({
    from: vi.fn(() => ({ kill: vi.fn() })),
    kill: vi.fn()
  }))
}))

vi.mock('gsap', () => ({ gsap: gsapMock }))

beforeEach(() => {
  gsapMock.timeline.mockClear()
})

function makeRef (node) {
  return { current: node }
}

describe('useFadeInText', () => {
  it('splits the text into one span per word', () => {
    const text = document.createElement('h1')
    text.textContent = 'Hello brave world'
    const trigger = document.createElement('div')

    renderHook(() => useFadeInText(makeRef(text), makeRef(trigger)))

    const spans = text.querySelectorAll('span')
    expect(spans).toHaveLength(3)
    expect([...spans].map(s => s.textContent)).toEqual(['Hello', 'brave', 'world'])
  })

  it('applies the background color to every span', () => {
    const text = document.createElement('h1')
    text.textContent = 'Hello world'
    const trigger = document.createElement('div')

    renderHook(() =>
      useFadeInText(makeRef(text), makeRef(trigger), 'words', 'linear-gradient(90deg, #00C9FF, #92FE9D)')
    )

    const spans = text.querySelectorAll('span')
    expect(spans).toHaveLength(2)
    for (const span of spans) {
      expect(span.style.background).toContain('linear-gradient')
    }
  })

  it('does not throw when the trigger element is missing', () => {
    // A missing trigger must not crash the hook. The guard has to bail
    // out when EITHER ref is null — not only when both are.
    const text = document.createElement('h1')
    text.textContent = 'Hello world'

    expect(() =>
      renderHook(() => useFadeInText(makeRef(text), makeRef(null)))
    ).not.toThrow()
  })

  it('does not throw when the text element is missing', () => {
    const trigger = document.createElement('div')

    expect(() =>
      renderHook(() => useFadeInText(makeRef(null), makeRef(trigger)))
    ).not.toThrow()
  })
})
