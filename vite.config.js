import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import basicSsl from '@vitejs/plugin-basic-ssl'

import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    basicSsl(),
    legacy({
      targets: ['defaults', 'not IE 11', 'ios >= 11', 'android >= 6'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
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
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-firebase': ['firebase/app', 'firebase/auth'],
          'ui-icons': ['lucide-react']
        }
      }
    },
    sourcemap: true
  }
})
