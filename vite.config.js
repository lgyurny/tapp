import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // permite acceso desde red local (probar en móvil)
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Separar vendors para mejor caché
        manualChunks: {
          react:   ['react', 'react-dom'],
          ton:     ['@tonconnect/ui-react', '@ton/ton'],
          web3:    ['wagmi', 'viem'],
        }
      }
    }
  },
  define: {
    // Necesario para algunas librerías Web3
    global: 'globalThis',
  }
})
