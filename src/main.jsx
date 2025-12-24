import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SmoothScrollProvider } from './context/SmoothScrollProvider'
import './index.css'

// Ensure there is a mount point with id="root" (create one if missing)
let rootEl = document.getElementById('root')
if (!rootEl) {
  console.warn('No element with id "root" found. Creating fallback.')
  rootEl = document.createElement('div')
  rootEl.id = 'root'
  document.body.appendChild(rootEl)
}

createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <SmoothScrollProvider>
        <App />
      </SmoothScrollProvider>
    </BrowserRouter>
  </React.StrictMode>
)