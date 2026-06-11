// src/utils/api.js
// Cliente HTTP para comunicarse con las Serverless Functions del backend.
// Incluye el initData de Telegram en cada petición autenticada.

import { getInitData } from './telegram.js'

const BASE_URL = import.meta.env.VITE_API_URL || ''

// ─────────────────────────────────────────────────────────────
// HELPER BASE — todas las peticiones pasan por aquí
// ─────────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Header de autenticación con Telegram
      'x-telegram-init-data': getInitData(),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Error desconocido' }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }

  return res.json()
}

// ─────────────────────────────────────────────────────────────
// ENDPOINTS
// ─────────────────────────────────────────────────────────────

// Verificar que el backend responde
export async function checkHealth() {
  return request('/api/health', { method: 'GET' })
}

// Obtener datos del usuario autenticado
export async function fetchUser() {
  return request('/api/user', { method: 'POST' })
}

// (Ejemplos de endpoints adicionales que puedes implementar)

// export async function fetchStakes() {
//   return request('/api/stakes', { method: 'GET' })
// }

// export async function createStake(amount, token) {
//   return request('/api/stakes', {
//     method: 'POST',
//     body: JSON.stringify({ amount, token }),
//   })
// }
