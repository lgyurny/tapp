// src/App.jsx
// Componente raíz de la aplicación.
// Aquí va el código completo del artifact que se construyó.
// Por claridad se muestra la estructura base con las secciones principales.

import { useState, useEffect } from 'react'
import { useTelegramApp }  from './hooks/useTelegramApp.js'
import { useTonContract }  from './hooks/useTonContract.js'
import { fetchUser }       from './utils/api.js'
import { haptic }          from './utils/telegram.js'

// ─────────────────────────────────────────────────────────────
// DATOS MOCK (reemplazar con llamadas reales a la API)
// ─────────────────────────────────────────────────────────────
const MOCK_STAKES = [
  { id: 1, amount: '250.00', token: 'TON', apy: '12.4%', since: '15d', rewards: '1.274' },
  { id: 2, amount: '0.45',   token: 'ETH', apy: '8.1%',  since: '7d',  rewards: '0.00071' },
]

const MOCK_TX_HISTORY = [
  { hash: '0xA3f4...9b2c', type: 'Stake',  amount: '+250 TON',            status: 'confirmed', time: '2h ago' },
  { hash: 'EQBx2...k9mN', type: 'Swap',   amount: '-0.1 ETH → 184 USDC', status: 'confirmed', time: '1d ago' },
  { hash: '0x7c1a...44ef', type: 'Reward', amount: '+1.274 TON',           status: 'pending',   time: '3h ago' },
]

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function App() {
  const { user, colorScheme, isRealTelegram } = useTelegramApp()
  const { isConnected, address }              = useTonContract()

  const [tab,         setTab]         = useState('home')
  const [connected,   setConnected]   = useState(false)
  const [walletType,  setWalletType]  = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [toast,       setToast]       = useState(null)
  const [userData,    setUserData]    = useState(null)

  // Cargar datos del usuario desde el backend cuando se conecta
  useEffect(() => {
    if (connected) {
      fetchUser()
        .then(data => setUserData(data.user))
        .catch(err => console.warn('Backend no disponible, usando mock:', err.message))
    }
  }, [connected])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleConnect = (type) => {
    setLoading(true)
    haptic.impact('medium')
    setTimeout(() => {
      setWalletType(type)
      setConnected(true)
      setLoading(false)
      haptic.notify('success')
      showToast(type === 'ton' ? '✅ Tonkeeper conectado' : '✅ MetaMask conectado')
    }, 1400)
  }

  const handleDisconnect = () => {
    setConnected(false)
    setWalletType(null)
    setUserData(null)
    haptic.notify('warning')
    showToast('👋 Wallet desconectada')
  }

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div style={{
      maxWidth:       '390px',
      margin:         '0 auto',
      minHeight:      '100vh',
      display:        'flex',
      flexDirection:  'column',
      background:     '#0A0C10',
      color:          '#E8EAF0',
      fontFamily:     'system-ui, sans-serif',
      position:       'relative',
    }}>
      {/* Toast de notificaciones */}
      {toast && (
        <div style={{
          position:     'fixed',
          top:          '70px',
          left:         '50%',
          transform:    'translateX(-50%)',
          background:   '#181C24',
          border:       '1px solid #2E3545',
          borderRadius: '10px',
          padding:      '10px 16px',
          fontSize:     '12px',
          fontFamily:   'monospace',
          zIndex:       1000,
          whiteSpace:   'nowrap',
          boxShadow:    '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <header style={{
        padding:        '16px 20px 12px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        borderBottom:   '1px solid #232835',
        background:     'rgba(10,12,16,0.9)',
        position:       'sticky',
        top:            0,
        zIndex:         100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background:    'linear-gradient(135deg, #4F8EF7, #7C5CFC)',
            borderRadius:  '8px',
            padding:       '6px 10px',
            fontSize:      '11px',
            fontWeight:    700,
            letterSpacing: '1px',
            color:         'white',
          }}>
            TGdApp
          </div>
          <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace' }}>
            v1.0.0
          </span>
        </div>
        <div style={{
          width:        '32px',
          height:       '32px',
          borderRadius: '50%',
          background:   'linear-gradient(135deg, #4F8EF7, #7C5CFC)',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          fontWeight:   700,
          fontSize:     '13px',
          color:        'white',
        }}>
          {user?.first_name?.[0] || 'U'}
        </div>
      </header>

      {/* Contenido principal */}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: connected ? '80px' : '0' }}>
        {!connected ? (
          // ── Pantalla de conexión ────────────────────────────
          <div style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '40px 24px',
            textAlign:      'center',
            minHeight:      'calc(100vh - 65px)',
          }}>
            <div style={{
              width:        '80px',
              height:       '80px',
              background:   'linear-gradient(135deg, #4F8EF7, #7C5CFC)',
              borderRadius: '24px',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              marginBottom: '24px',
              fontSize:     '36px',
            }}>
              🔐
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '10px' }}>
              Hola, {user?.first_name || 'Dev'} 👋
            </h1>
            <p style={{ color: '#6B7280', marginBottom: '32px', maxWidth: '280px', lineHeight: 1.6 }}>
              Conecta tu wallet para acceder. Tus claves nunca salen de tu dispositivo.
            </p>

            {/* Opciones de wallet */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { type: 'ton', icon: '💎', name: 'Tonkeeper',  desc: 'TON · TON Connect v2' },
                { type: 'evm', icon: '🦊', name: 'MetaMask',   desc: 'EVM · WalletConnect v2' },
              ].map(w => (
                <button
                  key={w.type}
                  onClick={() => handleConnect(w.type)}
                  disabled={loading}
                  style={{
                    background:   '#111318',
                    border:       '1px solid #232835',
                    borderRadius: '14px',
                    padding:      '14px 18px',
                    display:      'flex',
                    alignItems:   'center',
                    gap:          '14px',
                    cursor:       loading ? 'not-allowed' : 'pointer',
                    color:        '#E8EAF0',
                    textAlign:    'left',
                    transition:   'border-color 0.2s',
                    opacity:      loading ? 0.7 : 1,
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{w.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{w.name}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace' }}>{w.desc}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#6B7280' }}>→</span>
                </button>
              ))}
            </div>

            {!isRealTelegram && (
              <p style={{ marginTop: '20px', fontSize: '10px', color: '#6B7280', fontFamily: 'monospace' }}>
                ⚠️ Modo desarrollo — SDK de Telegram simulado
              </p>
            )}
          </div>
        ) : (
          // ── App principal (después de conectar) ─────────────
          <div style={{ padding: '20px' }}>
            {/* Portfolio card */}
            <div style={{
              background:   'linear-gradient(135deg, #0F1420, #131926)',
              border:       '1px solid #2E3545',
              borderRadius: '20px',
              padding:      '22px',
              marginBottom: '20px',
            }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Portfolio Total
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>
                  {userData ? `$${userData.portfolio?.totalUsd}` : '$4,821.36'}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'monospace' }}>
                  {walletType === 'ton' ? '≈ 1,150 TON' : '≈ 1.94 ETH'}
                </div>
              </div>
              <div style={{
                background:   'rgba(255,255,255,0.04)',
                border:       '1px solid #232835',
                borderRadius: '8px',
                padding:      '8px 12px',
                fontFamily:   'monospace',
                fontSize:     '11px',
                color:        '#6B7280',
                cursor:       'pointer',
                display:      'flex',
                justifyContent: 'space-between',
              }}
                onClick={() => showToast('📋 Dirección copiada')}
              >
                <span>{walletType === 'ton' ? 'EQBx2...k9mN' : '0x4A3f...8c2D'}</span>
                <span>⎘</span>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
              {[
                { label: 'Stake', icon: '⚡', action: () => showToast('🔒 Función de stake') },
                { label: 'Swap',  icon: '🔄', action: () => showToast('🔄 Próximamente') },
                { label: 'Send',  icon: '📤', action: () => showToast('📤 Próximamente') },
                { label: 'Buy',   icon: '💳', action: () => showToast('💳 Próximamente') },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={() => { haptic.impact('light'); a.action() }}
                  style={{
                    background:    '#111318',
                    border:        '1px solid #232835',
                    borderRadius:  '12px',
                    padding:       '12px 8px',
                    display:       'flex',
                    flexDirection: 'column',
                    alignItems:    'center',
                    gap:           '6px',
                    cursor:        'pointer',
                    color:         '#E8EAF0',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{a.icon}</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280' }}>{a.label}</span>
                </button>
              ))}
            </div>

            {/* Stakes activos */}
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Posiciones
              </span>
              <span style={{ fontSize: '11px', color: '#4F8EF7', cursor: 'pointer', fontFamily: 'monospace' }}>
                Reclamar todo →
              </span>
            </div>
            {MOCK_STAKES.map(s => (
              <div key={s.id} style={{
                background:   '#111318',
                border:       '1px solid #232835',
                borderRadius: '14px',
                padding:      '16px',
                marginBottom: '10px',
                cursor:       'pointer',
                borderTop:    '2px solid #4F8EF7',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace', marginBottom: '2px' }}>
                      {s.token} · Staking
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'monospace' }}>
                      {s.amount} <span style={{ fontSize: '14px', color: '#6B7280' }}>{s.token}</span>
                    </div>
                  </div>
                  <div style={{
                    background:   'rgba(34,211,160,0.1)',
                    border:       '1px solid rgba(34,211,160,0.2)',
                    color:        '#22D3A0',
                    borderRadius: '6px',
                    padding:      '3px 8px',
                    fontSize:     '11px',
                    fontWeight:   700,
                    fontFamily:   'monospace',
                  }}>
                    {s.apy} APY
                  </div>
                </div>
                <div style={{
                  display:      'flex',
                  gap:          '16px',
                  marginTop:    '10px',
                  paddingTop:   '10px',
                  borderTop:    '1px solid #232835',
                }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}>Duración</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace' }}>{s.since}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}>Rewards</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: '#22D3A0' }}>+{s.rewards} {s.token}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Historial */}
            <div style={{ marginTop: '20px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Historial
              </span>
            </div>
            {MOCK_TX_HISTORY.map((tx, i) => (
              <div key={i} style={{
                display:     'flex',
                alignItems:  'center',
                gap:         '12px',
                padding:     '12px 0',
                borderBottom: '1px solid #232835',
                cursor:      'pointer',
              }}>
                <div style={{
                  width:        '36px',
                  height:       '36px',
                  borderRadius: '10px',
                  background:   '#181C24',
                  border:       '1px solid #232835',
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'center',
                  fontSize:     '16px',
                  flexShrink:   0,
                }}>
                  {tx.type === 'Stake' ? '⚡' : tx.type === 'Swap' ? '🔄' : '🎁'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{tx.type}</div>
                  <div style={{ fontSize: '10px', color: '#6B7280', fontFamily: 'monospace' }}>{tx.hash}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>{tx.amount}</div>
                  <div style={{
                    display:      'inline-block',
                    fontSize:     '9px',
                    fontFamily:   'monospace',
                    fontWeight:   700,
                    padding:      '2px 6px',
                    borderRadius: '20px',
                    background:   tx.status === 'confirmed' ? 'rgba(34,211,160,0.12)' : 'rgba(245,158,66,0.12)',
                    color:        tx.status === 'confirmed' ? '#22D3A0' : '#F59E42',
                    border:       `1px solid ${tx.status === 'confirmed' ? 'rgba(34,211,160,0.2)' : 'rgba(245,158,66,0.2)'}`,
                  }}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}

            {/* Botón desconectar */}
            <button
              onClick={handleDisconnect}
              style={{
                marginTop:    '24px',
                width:        '100%',
                background:   'transparent',
                border:       '1px solid rgba(247,82,106,0.3)',
                borderRadius: '12px',
                padding:      '12px',
                color:        '#F7526A',
                fontSize:     '13px',
                fontWeight:   700,
                cursor:       'pointer',
              }}
            >
              Desconectar Wallet
            </button>
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      {connected && (
        <nav style={{
          position:   'fixed',
          bottom:     0,
          left:       '50%',
          transform:  'translateX(-50%)',
          width:      '390px',
          background: 'rgba(10,12,16,0.95)',
          backdropFilter: 'blur(24px)',
          borderTop:  '1px solid #232835',
          display:    'flex',
          zIndex:     200,
        }}>
          {[
            { id: 'home',  icon: '🏠', label: 'Home' },
            { id: 'stake', icon: '⚡', label: 'Stake' },
            { id: 'swap',  icon: '🔄', label: 'Swap'  },
            { id: 'opts',  icon: '⚙️', label: 'Config' },
          ].map(n => (
            <div
              key={n.id}
              onClick={() => { haptic.select(); setTab(n.id) }}
              style={{
                flex:           1,
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                gap:            '4px',
                padding:        '12px 0 16px',
                cursor:         'pointer',
                color:          tab === n.id ? '#4F8EF7' : '#6B7280',
                borderTop:      tab === n.id ? '2px solid #4F8EF7' : '2px solid transparent',
              }}
            >
              <span style={{ fontSize: '18px' }}>{n.icon}</span>
              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {n.label}
              </span>
            </div>
          ))}
        </nav>
      )}
    </div>
  )
}
