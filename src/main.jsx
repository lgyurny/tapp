import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initTelegramApp } from './utils/telegram.js'
import './index.css'

// Inicializar SDK de Telegram
try {
  initTelegramApp()
} catch (e) {
  console.warn('Telegram SDK no disponible:', e.message)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)