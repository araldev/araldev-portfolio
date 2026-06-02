import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JobCardStack } from '../../src/components/JobCard/JobCardStack.jsx'

vi.mock('../../src/components/JobCard/JobCard.module.css', () => ({
  default: new Proxy({}, { get: (_, key) => String(key) })
}))

let mockIsIconCheck = {}
vi.mock('../../src/Hooks/useIsIconCheckFilter.js', () => ({
  useIsIconCheckFilter: () => ({ isIconCheck: mockIsIconCheck, setIsIconCheck: vi.fn() })
}))

beforeEach(() => {
  mockIsIconCheck = {
    js: false,
    react: false,
    css: false,
    html: false,
    ts: false,
    git: false,
    gitHub: false,
    gsap: false,
    tailwind: false,
    storybook: false,
    vite: false,
    npm: false
  }
})

const stack = {
  js: <svg data-testid='svg-js' />,
  react: <svg data-testid='svg-react' />,
  ts: <svg data-testid='svg-ts' />
}

describe('JobCardStack', () => {
  it('renders one span per stack key', () => {
    render(<JobCardStack stack={stack} />)
    expect(screen.getByTestId('svg-js')).toBeInTheDocument()
    expect(screen.getByTestId('svg-react')).toBeInTheDocument()
    expect(screen.getByTestId('svg-ts')).toBeInTheDocument()
  })

  it('hides entirely when stack is empty (FR-005)', () => {
    const { container } = render(<JobCardStack stack={{}} />)
    expect(container.firstChild).toBeNull()
  })

  it('hides entirely when stack is undefined (FR-005 edge case)', () => {
    const { container } = render(<JobCardStack stack={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('exposes a descriptive aria-label on the container', () => {
    render(<JobCardStack stack={stack} />)
    expect(screen.getByLabelText('Technologies used in this role')).toBeInTheDocument()
  })
})
