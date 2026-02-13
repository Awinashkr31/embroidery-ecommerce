import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    })
  ],
  server: {
    proxy: {
      '/delhivery-api': {
        target: 'https://track.delhivery.com', // Default to Prod for now as user has Prod token
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/delhivery-api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'ui-icons': ['lucide-react']
        }
      }
    },
    sourcemap: true
  }
})
