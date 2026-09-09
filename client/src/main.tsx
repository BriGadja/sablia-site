import { inject } from '@vercel/analytics'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Vercel Web Analytics: the site had no measurement at all since the 2026-04 redesign (GA4 code
// gone, env vars unread). Pageviews here, the booking click in BookingModal.
inject({ mode: import.meta.env.PROD ? 'production' : 'development' })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
