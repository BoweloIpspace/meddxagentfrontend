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
import './workspace-cleanup.css'
import './engine-contract.css'
import './mobile-app.css'
import './mobile-native.css'
import './production-polish.css'
import './responsive-platform.css'
import './dark-mode.css'
import App from './App'
import { ThemeProvider } from './theme/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
