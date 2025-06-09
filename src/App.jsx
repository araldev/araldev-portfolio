import { useRef } from 'react'
import { AnimatedTitle } from './components/AnimatedTitle/AnimatedTitle.jsx'
import { HeroSection } from './components/HeroSection/HeroSection.jsx'
import { NavHeader } from './components/NavHeader/NavHeader.jsx'
import { ProjectsCards } from './components/Projects/ProjectsCards.jsx'
import { useAnimatedNavHeader } from './Hooks/useAnimatedNavHeader.js'
import { BackgroundHeroCanvas } from './components/Backgrounds/BackgroundHeroCanvas.jsx'
import { IsIconCheckFilterProvider } from './contexts/IsIconCheckFilter.jsx'

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
        <IsIconCheckFilterProvider>
          <ProjectsCards />
        </IsIconCheckFilterProvider>
        <BackgroundHeroCanvas />
      </main>
    </>
  )
}
