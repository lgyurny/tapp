// api/_utils.js
// El guión bajo hace que Vercel NO exponga este archivo como endpoint.
// Contiene la lógica compartida de autenticación y helpers.

import crypto from 'crypto'

// ─────────────────────────────────────────────────────────────
// VALIDACIÓN DE initData DE TELEGRAM
// Verifica que la petición realmente viene de Telegram usando
// HMAC-SHA256 con el BOT_TOKEN como clave secreta derivada.
// Documentación: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
// ─────────────────────────────────────────────────────────────
export function validateTelegramData(initData, botToken) {
  if (!initData || !botToken) return false

  try {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    if (!hash) return false

    // Eliminar 'hash' antes de construir el string a verificar
    params.delete('hash')

    // Ordenar los parámetros alfabéticamente y unir con \n
    const dataString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n')

    // Derivar la clave secreta: HMAC-SHA256("WebAppData", BOT_TOKEN)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    // Calcular el hash esperado
    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataString)
      .digest('hex')

    // Verificar que el hash coincida y que no hayan pasado más de 24h
    const authDate = parseInt(params.get('auth_date') || '0')
    const isExpired = (Date.now() / 1000) - authDate > 86400

    return hash === expectedHash && !isExpired

  } catch (err) {
    console.error('Error validando initData:', err)
    return false
  }
}

// ─────────────────────────────────────────────────────────────
// PARSEAR USUARIO DESDE initData
// ─────────────────────────────────────────────────────────────
export function parseUser(initData) {
  try {
    const params = new URLSearchParams(initData)
    const userStr = params.get('user')
    if (!userStr) return null
    return JSON.parse(decodeURIComponent(userStr))
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────
// ENVIAR MENSAJE POR TELEGRAM BOT API
// ─────────────────────────────────────────────────────────────
export async function sendTelegramMessage(chatId, payload) {
  const token = process.env.BOT_TOKEN
  if (!token) throw new Error('BOT_TOKEN no configurado')

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, ...payload })
    }
  )
  return res.json()
}

// ─────────────────────────────────────────────────────────────
// MANEJAR CORS PREFLIGHT (OPTIONS)
// ─────────────────────────────────────────────────────────────
export function handleCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-telegram-init-data')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return true // señal de que ya se respondió
  }
  return false
}
