// api/user.js → POST /api/user
// Endpoint protegido que devuelve los datos del usuario autenticado.
// Valida el initData de Telegram antes de responder.

import { validateTelegramData, parseUser, handleCors } from './_utils.js'

export default async function handler(req, res) {
  // Manejar CORS preflight
  if (handleCors(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Leer el initData que el frontend envía en el header
  const initData = req.headers['x-telegram-init-data']

  // Validar con HMAC-SHA256 usando el BOT_TOKEN
  if (!validateTelegramData(initData, process.env.BOT_TOKEN)) {
    return res.status(401).json({ error: 'Sesión de Telegram inválida' })
  }

  // Extraer datos del usuario del initData
  const user = parseUser(initData)
  if (!user) {
    return res.status(400).json({ error: 'No se pudo parsear el usuario' })
  }

  // ── Aquí conectarías tu base de datos ──────────────────────
  // Ejemplo con Vercel Postgres (neon):
  //   import { sql } from '@vercel/postgres'
  //   const { rows } = await sql`SELECT * FROM users WHERE tg_id = ${user.id}`
  //
  // Por ahora devolvemos datos de mock:
  const userData = {
    id:           user.id,
    name:         user.first_name,
    lastName:     user.last_name,
    username:     user.username,
    languageCode: user.language_code,
    // Datos que vendrían de tu DB:
    portfolio: {
      totalUsd:  '4821.36',
      change24h: '+3.42%',
      balances: {
        ton:  '1150.00',
        eth:  '0.45',
        usdc: '820.00',
      },
      staked: {
        ton: '250.00',
        eth: '0.00',
      }
    }
  }

  res.status(200).json({ ok: true, user: userData })
}
