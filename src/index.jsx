import './index.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/600.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/400.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ReactLenis } from 'lenis/react'
import { ScrollSync } from './components/ScrollSync.jsx'

createRoot(document.getElementById('root')).render(
  <ReactLenis root options={{ autoRaf: false, smooth: true }}>
    <ScrollSync />
    <App />
  </ReactLenis>
)
