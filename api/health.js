// api/health.js → GET /api/health
// Endpoint de salud para verificar que el backend responde.
// Usado por monitoreo, Telegram para validar el dominio, etc.

export default function handler(req, res) {
  res.status(200).json({
    status:    'ok',
    timestamp: Date.now(),
    env:       process.env.NODE_ENV || 'development',
    version:   '1.0.0',
  })
}
