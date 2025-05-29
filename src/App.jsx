import { AnimatedTitle } from './components/AnimatedTitle/AnimatedTitle.jsx'
import { BackgroundHero } from './components/Backgrounds/BackgroundHero.jsx'
import { HeroSection } from './components/Header/HeroSection.jsx'
import { NavHeader } from './components/Header/NavHeader.jsx'
import { Projects } from './components/Projects/Projects.jsx'

export default function () {
  return (
    <>
      <AnimatedTitle>
        <HeroSection />
      </AnimatedTitle>
      <main className='container_main'>
        <NavHeader />
        <Projects />
        <HeroSection />
        <BackgroundHero />
      </main>
    </>
  )
}
