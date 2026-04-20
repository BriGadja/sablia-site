import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Preload Fraunces Variable (full axes) via Vite-hashed URL.
// Vite resolves this to the final hashed .woff2 path at build time.
import frauncesFullUrl from '@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2?url'

const preload = document.createElement('link')
preload.rel = 'preload'
preload.as = 'font'
preload.type = 'font/woff2'
preload.crossOrigin = 'anonymous'
preload.href = frauncesFullUrl
document.head.appendChild(preload)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
