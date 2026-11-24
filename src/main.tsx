import React from 'react'
import ReactDOM from 'react-dom/client'
import { preload } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

if (window.location.pathname === '/') {
  preload('/hero_rotate/1.webp', { as: 'image', fetchPriority: 'high' })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)