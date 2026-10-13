import React from 'react'
import ReactDOM from 'react-dom/client'
import { preload } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import heroImage from './assets/hero.webp'
import './index.css'

if (window.location.pathname === '/') {
  preload(heroImage, { as: 'image', fetchPriority: 'high' })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)