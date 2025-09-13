import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css' // import your global css (copied from original)

// Ensure there is a mount point with id="root" (create one if missing) and log a helpful message.
let rootEl = document.getElementById('root')
if (!rootEl) {
  console.warn('No element with id "root" found in the document. Creating a fallback #root element.')
  rootEl = document.createElement('div')
  rootEl.id = 'root'
  document.body.appendChild(rootEl)
}

createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)