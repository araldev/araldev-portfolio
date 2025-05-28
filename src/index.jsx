import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ScrollProvider } from './contexts/ScrollProvider.jsx'

createRoot(document.getElementById('root')).render(
  <ScrollProvider>
    <App />
  </ScrollProvider>
)
