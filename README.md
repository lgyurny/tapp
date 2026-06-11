# 🚀 Mi Telegram dApp

Telegram Mini App con integración Web3 para TON y redes EVM.
Desplegada en Vercel con Serverless Functions como backend.

---

## 📁 Estructura del proyecto

```
mi-telegram-dapp/
├── api/                          ← Backend (Vercel Serverless Functions)
│   ├── _utils.js                 ← Utilidades privadas (validación Telegram)
│   ├── health.js                 ← GET  /api/health
│   ├── user.js                   ← POST /api/user  (requiere auth)
│   └── webhook.js                ← POST /api/webhook (Telegram Bot)
├── public/
│   └── tonconnect-manifest.json  ← Requerido por TON Connect
├── src/
│   ├── hooks/
│   │   ├── useTelegramApp.js     ← SDK de Telegram
│   │   └── useTonContract.js     ← Interacción con TON
│   ├── providers/
│   │   └── AppProviders.jsx      ← TonConnect + Wagmi + ReactQuery
│   ├── utils/
│   │   ├── telegram.js           ← Abstracción del SDK + mock para dev
│   │   ├── api.js                ← Cliente HTTP del frontend
│   │   └── web3Config.js         ← Configuración wagmi (EVM)
│   ├── App.jsx                   ← Componente principal
│   ├── main.jsx                  ← Entry point
│   └── index.css                 ← Estilos globales
├── .env.example                  ← Plantilla de variables de entorno
├── .gitignore
├── index.html                    ← Incluye el SDK de Telegram
├── vercel.json                   ← Configuración de despliegue
├── vite.config.js
└── package.json
```

---

## ⚙️ Setup local

### 1. Clonar e instalar dependencias
```bash
git clone https://github.com/TU_USUARIO/mi-telegram-dapp.git
cd mi-telegram-dapp
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env.local
# Editar .env.local con tus valores reales
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
# → http://localhost:5173
```

> ⚠️ En desarrollo `window.Telegram.WebApp` no existe.
> El archivo `src/utils/telegram.js` incluye un mock automático.

---

## 🚀 Deploy en Vercel

### Pasos:
1. Subir el proyecto a GitHub
2. Ir a [vercel.com](https://vercel.com) → New Project → seleccionar el repo
3. Agregar las variables de entorno en el dashboard de Vercel:
   - `BOT_TOKEN` → Tu token de @BotFather
   - `VITE_APP_URL` → La URL de Vercel (la conoces después del primer deploy)
   - `VITE_WALLETCONNECT_PROJECT_ID` → De [cloud.walletconnect.com](https://cloud.walletconnect.com)
4. Deploy

### Después del primer deploy:
```bash
# 1. Actualizar VITE_APP_URL con la URL real en Vercel
# 2. Actualizar public/tonconnect-manifest.json con la URL real
# 3. Registrar el webhook de Telegram:

curl "https://api.telegram.org/botTU_BOT_TOKEN/setWebhook" \
  -d "url=https://TU-APP.vercel.app/api/webhook"

# 4. Configurar en BotFather:
#    /myapps → tu bot → Edit Web App URL → https://TU-APP.vercel.app
```

---

## 🤖 Configurar el Bot en Telegram

1. Abrir @BotFather en Telegram
2. `/newbot` → seguir instrucciones → guardar el `BOT_TOKEN`
3. `/newapp` → seleccionar el bot → pegar la URL de Vercel
4. `/setmenubutton` → configurar botón de acceso directo

---

## 🔒 Seguridad

- El `initData` de Telegram se valida con **HMAC-SHA256** en cada endpoint
- El `BOT_TOKEN` vive solo en variables de entorno del servidor (nunca en el frontend)
- HTTPS es automático en Vercel (Telegram lo requiere obligatoriamente)

---

## 📚 Recursos

- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- [TON Connect Docs](https://docs.ton.org/develop/dapps/ton-connect/overview)
- [wagmi Docs](https://wagmi.sh)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
