// src/App.jsx — versión mínima de diagnóstico
export default function App() {
  return (
    <div style={{
      minHeight:      '100vh',
      background:     '#0A0C10',
      color:          '#E8EAF0',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      fontFamily:     'system-ui, sans-serif',
      fontSize:       '18px',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
      <div style={{ fontWeight: 700 }}>App funcionando</div>
      <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px' }}>
        Telegram SDK: {window.Telegram?.WebApp ? '✅ activo' : '⚠️ mock'}
      </div>
    </div>
  )
}