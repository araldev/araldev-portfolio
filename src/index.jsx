import './index.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/600.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/400.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ReactLenis } from 'lenis/react'
import { ScrollSync } from './components/ScrollSync.jsx'

const isTouchDevice =
  window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0

const lenisOptions = {
  autoRaf: false,
  smoothWheel: true,
  smoothTouch: false
}

createRoot(document.getElementById('root')).render(
  isTouchDevice
    ? <App />
    : (
        <ReactLenis root options={lenisOptions}>
          <ScrollSync />
          <App />
        </ReactLenis>
      )
)
