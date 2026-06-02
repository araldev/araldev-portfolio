import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../../src/App.jsx'

// Mock all the heavy/animated modules so App can mount in jsdom
vi.mock('../../src/components/AnimatedTitle/AnimatedTitle.jsx', () => ({
  AnimatedTitle: ({ children }) => <div data-testid='animated-title'>{children}</div>
}))
vi.mock('../../src/components/HeroSection/HeroSection.jsx', () => ({
  HeroSection: () => <section id='hero' />
}))
vi.mock('../../src/components/NavHeader/NavHeader.jsx', () => ({
  NavHeader: () => <header data-testid='nav-header' />
}))
vi.mock('../../src/components/NavToTop/NavToTop.jsx', () => ({
  NavToTop: () => null
}))
vi.mock('../../src/components/Backgrounds/BackgroundHeroCanvas.jsx', () => ({
  BackgroundHeroCanvas: () => null
}))
vi.mock('../../src/components/Contact/ContactSection.jsx', () => ({
  ContactSection: () => <section id='contact' />
}))
vi.mock('../../src/components/AboutMe/AboutMeSection.jsx', () => ({
  AboutMeSection: () => <section id='about-me' />
}))
vi.mock('../../src/components/Footer/Footer.jsx', () => ({
  Footer: () => <footer />
}))
vi.mock('../../src/components/ProjectsCards/ProjectsCards.jsx', () => ({
  ProjectsCards: () => <section id='projects' />
}))
vi.mock('../../src/components/JobsCards/JobsCards.jsx', () => ({
  JobsCards: () => <section id='experience' data-testid='jobs-section' />
}))
vi.mock('../../src/Hooks/useAnimatedNavHeader.js', () => ({
  useAnimatedNavHeader: () => {}
}))
vi.mock('../../src/Hooks/useAnimatedNavToTop.js', () => ({
  useAnimatedNavToTop: () => {}
}))

describe('App smoke test', () => {
  it('mounts without crashing and renders the experience section', () => {
    render(<App />)
    expect(screen.getByTestId('jobs-section')).toBeInTheDocument()
    expect(screen.getByTestId('jobs-section')).toHaveAttribute('id', 'experience')
  })
})
