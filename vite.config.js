import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/delhivery-api': {
        target: 'https://track.delhivery.com', // Default to Prod for now as user has Prod token
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/delhivery-api/, '')
      }
    }
  }
})
