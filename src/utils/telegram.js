// src/utils/telegram.js
// Abstracción del SDK de Telegram WebApp.
// Centraliza toda la interacción con window.Telegram.WebApp.

// ─────────────────────────────────────────────────────────────
// MOCK para desarrollo local (fuera de Telegram el SDK no existe)
// ─────────────────────────────────────────────────────────────
const MOCK_TWA = {
  initData: 'mock_init_data',
  initDataUnsafe: {
    user: {
      id:            982341765,
      first_name:    'Carlos',
      last_name:     'Reyes',
      username:      'carlosreyes',
      language_code: 'es',
    },
    auth_date: Math.floor(Date.now() / 1000).toString(),
    hash:      'mock_hash',
  },
  themeParams: {
    bg_color:         '#0A0C10',
    text_color:       '#E8EAF0',
    hint_color:       '#6B7280',
    button_color:     '#4F8EF7',
    button_text_color:'#FFFFFF',
  },
  colorScheme:  'dark',
  platform:     'unknown',
  version:      '7.0',
  isExpanded:   true,
  viewportHeight: window?.innerHeight || 800,
  expand:          () => {},
  ready:           () => {},
  close:           () => {},
  enableClosingConfirmation:  () => {},
  disableClosingConfirmation: () => {},
  MainButton: {
    text:      '',
    color:     '#4F8EF7',
    textColor: '#FFFFFF',
    isVisible: false,
    isActive:  true,
    setText:   (text) => { MOCK_TWA.MainButton.text = text },
    show:      () => { MOCK_TWA.MainButton.isVisible = true },
    hide:      () => { MOCK_TWA.MainButton.isVisible = false },
    enable:    () => {},
    disable:   () => {},
    onClick:   () => {},
    offClick:  () => {},
    showProgress: () => {},
    hideProgress: () => {},
  },
  BackButton: {
    isVisible: false,
    show:      () => {},
    hide:      () => {},
    onClick:   () => {},
    offClick:  () => {},
  },
  HapticFeedback: {
    impactOccurred:    (style) => console.log('[Haptic] impact:', style),
    notificationOccurred: (type)  => console.log('[Haptic] notif:', type),
    selectionChanged:  ()     => console.log('[Haptic] selection'),
  },
}

// Obtener la instancia real o el mock
export const getTWA = () => window.Telegram?.WebApp || MOCK_TWA

// ─────────────────────────────────────────────────────────────
// INICIALIZAR LA APP
// ─────────────────────────────────────────────────────────────
export function initTelegramApp() {
  const twa = getTWA()
  twa.expand()
  twa.ready()

  // Verificar versión antes de llamar funciones modernas
  const version = parseFloat(twa.version || '6.0')
  if (version >= 6.2) {
    twa.enableClosingConfirmation()
  }

  return twa
}

// ─────────────────────────────────────────────────────────────
// DATOS DEL USUARIO
// ─────────────────────────────────────────────────────────────
export function getTelegramUser() {
  return getTWA().initDataUnsafe?.user || null
}

export function getInitData() {
  return getTWA().initData || ''
}

// ─────────────────────────────────────────────────────────────
// TEMA Y COLORES
// ─────────────────────────────────────────────────────────────
export function getThemeParams() {
  return getTWA().themeParams || {}
}

export function getColorScheme() {
  return getTWA().colorScheme || 'dark'
}

// ─────────────────────────────────────────────────────────────
// MAIN BUTTON (botón inferior nativo de Telegram)
// ─────────────────────────────────────────────────────────────
export function showMainButton(text, onClick) {
  const btn = getTWA().MainButton
  btn.setText(text)
  btn.onClick(onClick)
  btn.show()
}

export function hideMainButton() {
  getTWA().MainButton.hide()
}

export function setMainButtonLoading(loading) {
  const btn = getTWA().MainButton
  if (loading) {
    btn.showProgress()
    btn.disable()
  } else {
    btn.hideProgress()
    btn.enable()
  }
}

// ─────────────────────────────────────────────────────────────
// BACK BUTTON
// ─────────────────────────────────────────────────────────────
export function showBackButton(onClick) {
  const btn = getTWA().BackButton
  btn.onClick(onClick)
  btn.show()
}

export function hideBackButton() {
  getTWA().BackButton.hide()
}

// ─────────────────────────────────────────────────────────────
// HAPTIC FEEDBACK
// ─────────────────────────────────────────────────────────────
export const haptic = {
  // Estilos: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
  impact: (style = 'medium') => getTWA().HapticFeedback.impactOccurred(style),
  // Tipos: 'error' | 'success' | 'warning'
  notify: (type = 'success') => getTWA().HapticFeedback.notificationOccurred(type),
  select: () => getTWA().HapticFeedback.selectionChanged(),
}

// ─────────────────────────────────────────────────────────────
// PLATAFORMA
// ─────────────────────────────────────────────────────────────
export function getPlatform() {
  return getTWA().platform // 'ios' | 'android' | 'tdesktop' | 'unknown'
}

export function isIOS() {
  return getTWA().platform === 'ios'
}

export function isMobile() {
  const p = getTWA().platform
  return p === 'ios' || p === 'android'
}
