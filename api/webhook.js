// api/webhook.js → POST /api/webhook
// Recibe todas las actualizaciones del bot de Telegram.
// Se registra en Telegram con: setWebhook?url=.../api/webhook

import { sendTelegramMessage, handleCors } from './_utils.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const update = req.body

  try {
    await processUpdate(update)
  } catch (err) {
    console.error('Error procesando update:', err)
    // Siempre responder 200 a Telegram, sino reintenta indefinidamente
  }

  res.status(200).json({ ok: true })
}

async function processUpdate(update) {
  // ── Mensaje de texto ───────────────────────────────────────
  if (update.message) {
    const { chat, from, text } = update.message

    if (text === '/start') {
      await sendTelegramMessage(chat.id, {
        text: `👋 Hola ${from.first_name}!\n\nBienvenido a la dApp. Toca el botón para comenzar.`,
        reply_markup: {
          inline_keyboard: [[{
            text: '🚀 Abrir dApp',
            web_app: { url: process.env.VITE_APP_URL }
          }]]
        }
      })
      return
    }

    if (text === '/help') {
      await sendTelegramMessage(chat.id, {
        text: [
          '📖 *Comandos disponibles:*',
          '',
          '/start — Abrir la dApp',
          '/help  — Ver esta ayuda',
          '/stats — Ver estadísticas',
        ].join('\n'),
        parse_mode: 'Markdown'
      })
      return
    }

    if (text === '/stats') {
      await sendTelegramMessage(chat.id, {
        text: [
          '📊 *Tus estadísticas:*',
          '',
          '💎 TON stakeado: 250.00',
          '📈 APY actual: 12.4%',
          '🎁 Rewards pendientes: 1.274 TON',
        ].join('\n'),
        parse_mode: 'Markdown'
      })
      return
    }
  }

  // ── Callback query (botones inline) ───────────────────────
  if (update.callback_query) {
    const { id, data, from } = update.callback_query

    // Responder al callback para quitar el "loading" del botón
    await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/answerCallbackQuery`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: id, text: '✅ Acción procesada' })
      }
    )
  }
}
