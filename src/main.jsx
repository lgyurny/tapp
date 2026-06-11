// src/main.jsx
// Entry point de la aplicación.
// Inicializa el SDK de Telegram e inyecta los providers.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppProviders } from './providers/AppProviders.jsx'
import App from './App.jsx'
import { initTelegramApp } from './utils/telegram.js'
import './index.css'

// Inicializar el SDK de Telegram antes de renderizar
initTelegramApp()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
)
