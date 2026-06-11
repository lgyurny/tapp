// src/hooks/useTelegramApp.js
// Hook principal que expone toda la funcionalidad del SDK de Telegram.

import { useEffect, useState, useCallback } from 'react'
import {
  getTWA,
  getTelegramUser,
  getColorScheme,
  haptic,
  getPlatform,
} from '../utils/telegram.js'

export function useTelegramApp() {
  const [colorScheme, setColorScheme] = useState(getColorScheme())
  const [viewportHeight, setViewportHeight] = useState(
    getTWA().viewportHeight || window.innerHeight
  )

  useEffect(() => {
    const twa = getTWA()

    // Escuchar cambios de tema
    twa.onEvent?.('themeChanged', () => {
      setColorScheme(getColorScheme())
    })

    // Escuchar cambios de tamaño del viewport
    twa.onEvent?.('viewportChanged', ({ height }) => {
      setViewportHeight(height)
    })
  }, [])

  const showAlert = useCallback((message) => {
    if (window.Telegram?.WebApp) {
      getTWA().showAlert?.(message)
    } else {
      alert(message)
    }
  }, [])

  const showConfirm = useCallback((message, callback) => {
    if (window.Telegram?.WebApp) {
      getTWA().showConfirm?.(message, callback)
    } else {
      const result = confirm(message)
      callback(result)
    }
  }, [])

  const openLink = useCallback((url) => {
    if (window.Telegram?.WebApp) {
      getTWA().openLink?.(url)
    } else {
      window.open(url, '_blank')
    }
  }, [])

  const openTelegramLink = useCallback((url) => {
    if (window.Telegram?.WebApp) {
      getTWA().openTelegramLink?.(url)
    } else {
      window.open(url, '_blank')
    }
  }, [])

  return {
    user:           getTelegramUser(),
    colorScheme,
    viewportHeight,
    platform:       getPlatform(),
    haptic,
    showAlert,
    showConfirm,
    openLink,
    openTelegramLink,
    isRealTelegram: !!window.Telegram?.WebApp,
  }
}
