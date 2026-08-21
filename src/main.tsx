import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './refinement.css'
import './clinical-saas.css'
import './workspace-scale.css'
import './workspace-pages.css'
import './workspace-detail.css'
import './workspace-mobile.css'
import './meddx-native.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
