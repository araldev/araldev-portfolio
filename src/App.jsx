import { useRef } from 'react'
import { AnimatedTitle } from './components/AnimatedTitle/AnimatedTitle.jsx'
import { BackgroundHero } from './components/Backgrounds/BackgroundHero.jsx'
import { HeroSection } from './components/HeroSection/HeroSection.jsx'
import { NavHeader } from './components/NavHeader/NavHeader.jsx'
import { Projects } from './components/Projects/Projects.jsx'
import { useAnimatedNavHeader } from './Hooks/useAnimatedNavHeader.js'

export default function () {
  const mainRef = useRef()
  const navHeaderRef = useRef()
  useAnimatedNavHeader({ mainRef, navHeaderRef })
  return (
    <>
      <NavHeader ref={navHeaderRef} />
      <AnimatedTitle>
        <HeroSection />
      </AnimatedTitle>
      <main ref={mainRef} className='container_main'>
        <Projects />
      </main>
    </>
  )
}
