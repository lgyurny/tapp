// src/providers/AppProviders.jsx
// Centraliza todos los providers en un solo componente.
// El orden importa: los providers externos van afuera.

import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '../utils/web3Config.js'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:              1,
      refetchOnWindowFocus: false,
      staleTime:          30_000, // 30 segundos
    },
  },
})

const MANIFEST_URL = `${window.location.origin}/tonconnect-manifest.json`

export function AppProviders({ children }) {
  return (
    // 1. TON Connect — para wallets TON (Tonkeeper, etc.)
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>

      {/* 2. Wagmi — para wallets EVM (MetaMask, WalletConnect) */}
      <WagmiProvider config={wagmiConfig}>

        {/* 3. React Query — para caché de peticiones al backend */}
        <QueryClientProvider client={queryClient}>

          {children}

        </QueryClientProvider>
      </WagmiProvider>
    </TonConnectUIProvider>
  )
}
