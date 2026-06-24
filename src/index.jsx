import './index.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/600.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/400.css'
import { createRoot } from 'react-dom/client'
import { lazy, Suspense, useState, useEffect } from 'react'
import App from './App.jsx'
import { ScrollSync } from './components/ScrollSync.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'

// Lazy-load Lenis so the Google signalling XHR request (for cross-tab
// scroll sync) fires after the first paint instead of blocking it.
const ReactLenis = lazy(() => import('lenis/react'))

const lenisOptions = {
  autoRaf: false,
  smoothWheel: true,
  syncTouch: true
}

function AppWithLenis () {
  return (
    <Suspense fallback={null}>
      <ReactLenis root options={lenisOptions}>
        <LanguageProvider>
          <ScrollSync />
          <App />
        </LanguageProvider>
      </ReactLenis>
    </Suspense>
  )
}

function AppWithoutLenis () {
  return (
    <LanguageProvider>
      <ScrollSync />
      <App />
    </LanguageProvider>
  )
}

function Bootstrap () {
  // Start without Lenis on first paint so the Google signalling
  // channel (XHR to clients6.google.com) doesn't block the initial
  // render. After first paint, switch to the Lenis version.
  const [withLenis, setWithLenis] = useState(false)

  useEffect(() => {
    // requestAnimationFrame ensures we paint at least one frame before
    // mounting Lenis (which triggers the Google sync channel request).
    const rafId = requestAnimationFrame(() => {
      setWithLenis(true)
    })
    return () => cancelAnimationFrame(rafId)
  }, [])

  return withLenis ? <AppWithLenis /> : <AppWithoutLenis />
}

createRoot(document.getElementById('root')).render(<Bootstrap />)
