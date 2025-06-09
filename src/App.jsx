import { useRef } from 'react'
import { AnimatedTitle } from './components/AnimatedTitle/AnimatedTitle.jsx'
import { HeroSection } from './components/HeroSection/HeroSection.jsx'
import { NavHeader } from './components/NavHeader/NavHeader.jsx'
import { ProjectsCards } from './components/Projects/ProjectsCards.jsx'
import { useAnimatedNavHeader } from './Hooks/useAnimatedNavHeader.js'
import { BackgroundHeroCanvas } from './components/Backgrounds/BackgroundHeroCanvas.jsx'
import { IsIconCheckFilterProvider } from './contexts/IsIconCheckFilter.jsx'
import { NavToTop } from './components/NavToTop/NavToTop.jsx'
import { useAnimatedNavToTop } from './Hooks/useAnimatedNavToTop.js'

export default function () {
  const mainRef = useRef()
  const navHeaderRef = useRef()
  const navToTopRef = useRef()
  useAnimatedNavHeader({ mainRef, navHeaderRef })
  useAnimatedNavToTop({ mainRef, navToTopRef })
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
        <NavToTop ref={navToTopRef} />
        <BackgroundHeroCanvas />
      </main>
    </>
  )
}
