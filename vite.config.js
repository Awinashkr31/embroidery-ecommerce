import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { createProxyMiddleware } from 'http-proxy-middleware'

// EMERGENCY FIX: Completely bypass all Node.js SSL Certificate Validation to ignore the Antivirus interceptor
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    {
      name: 'supabase-insecure-proxy',
      configureServer(server) {
        server.middlewares.use(
          '/supabase-api',
          createProxyMiddleware({
            target: 'https://yqtrlqkmitgnaehbawdm.supabase.co',
            changeOrigin: true,
            secure: false, // Core fix
            pathRewrite: { '^/supabase-api': '' }
          })
        )
      }
    }
  ],
  server: {
    proxy: {
      '/delhivery-api': {
        target: 'https://track.delhivery.com',
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
          'ui-icons': ['lucide-react']
        }
      }
    },
    sourcemap: true
  }
})
