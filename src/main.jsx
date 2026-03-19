import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import OrnelasProtectApp from './ornelas_protect_app_completo.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OrnelasProtectApp />
  </StrictMode>,
)