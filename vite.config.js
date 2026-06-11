import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process', 'stream', 'util', 'crypto'],
      globals: {
        Buffer:  true,
        global:  true,
        process: true,
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Silencia el warning del chunk grande
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          react:  ['react', 'react-dom'],
          ton:    ['@ton/ton', '@ton/core', '@ton/crypto'],
          wagmi:  ['wagmi', 'viem'],
        }
      }
    }
  },
})