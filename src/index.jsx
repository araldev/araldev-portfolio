import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Header } from './components/Header/Header'

createRoot(document.getElementById('root')).render(
  <>
    <Header />
    <App />
  </>
)
