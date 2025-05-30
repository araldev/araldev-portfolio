import './index.css'
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
