import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    basicSsl()
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
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-firebase': ['firebase/app', 'firebase/auth'],
          'ui-icons': ['lucide-react']
        }
      }
    },
    sourcemap: true
  }
})
