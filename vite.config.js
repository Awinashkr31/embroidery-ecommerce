import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

import viteCompression from 'vite-plugin-compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async']
  },
  plugins: [
    react(),
    viteCompression({ algorithm: 'brotliCompress' }),
    viteCompression({ algorithm: 'gzip' })
    /* VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'firebase-messaging-sw.js',
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg', 'logo.png', 'robots.txt'],
      manifest: {
        name: 'Embroidery Admin',
        short_name: 'Embroidery Admin',
        description: 'Admin panel for Embroidery application',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }) */
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          icons: ['lucide-react'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          supabase: ['@supabase/supabase-js']
          // framer-motion & recharts intentionally excluded — they'll be code-split
          // into page chunks that actually use them (Checkout, ProductDetails, Admin)
        }
      }
    },
    sourcemap: false
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'react-helmet-async', 
      'lucide-react', 
      '@supabase/supabase-js',
      'firebase/auth',
      'firebase/app'
    ]
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none"
    }
  }
})
