// src/utils/web3Config.js
// Configuración de wagmi para conexión con redes EVM
// (Ethereum, Polygon, BSC, etc.)

import { createConfig, http } from 'wagmi'
import { polygon, mainnet, bsc } from 'wagmi/chains'
import { walletConnect, metaMask } from 'wagmi/connectors'

const WC_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo'

export const wagmiConfig = createConfig({
  chains: [polygon, mainnet, bsc],
  connectors: [
    walletConnect({
      projectId: WC_PROJECT_ID,
      metadata: {
        name:        'Mi Telegram dApp',
        description: 'dApp integrada en Telegram',
        url:         window.location.origin,
        icons:       [`${window.location.origin}/icon.png`],
      },
    }),
    metaMask(),
  ],
  transports: {
    [polygon.id]: http(
      import.meta.env.VITE_POLYGON_RPC_URL || 'https://polygon-rpc.com'
    ),
    [mainnet.id]: http(
      import.meta.env.VITE_ETH_RPC_URL || 'https://cloudflare-eth.com'
    ),
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
  },
})

// ABI mínimo de ERC-20 (lectura de balance y transferencia)
export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs:  [{ name: 'account', type: 'address' }],
    outputs: [{ name: '',        type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs:  [
      { name: 'to',     type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs:  [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs:  [],
    outputs: [{ name: '', type: 'string' }],
  },
]
