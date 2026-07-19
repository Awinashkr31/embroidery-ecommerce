import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Plugin to run /api Vercel functions locally in Vite
const localApiPlugin = () => ({
  name: 'local-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url.startsWith('/api/create-order') && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString() });
        req.on('end', async () => {
          try {
            const env = loadEnv('', process.cwd(), '');
            const { amount, currency = 'INR', receipt = `receipt_${Date.now()}` } = JSON.parse(body || '{}');
            if (!amount || amount < 100) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Amount must be at least 100 paise' }));
            }
            const razorpay = new Razorpay({
                key_id: env.RAZORPAY_KEY_ID,
                key_secret: env.RAZORPAY_KEY_SECRET,
            });
            const order = await razorpay.orders.create({ amount, currency, receipt });
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            return res.end(JSON.stringify(order));
          } catch (err) {
            console.error('API Error:', err);
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.error?.description || err.message || 'Internal Server Error' }));
          }
        });
        return;
      }
      
      if (req.url.startsWith('/api/verify-payment') && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString() });
        req.on('end', async () => {
          try {
            const env = loadEnv('', process.cwd(), '');
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(body || '{}');
            const secret = env.RAZORPAY_KEY_SECRET;
            const hmac = crypto.createHmac('sha256', secret);
            hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
            const expectedSignature = hmac.digest('hex');
            
            res.setHeader('Content-Type', 'application/json');
            if (expectedSignature === razorpay_signature) {
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true }));
            } else {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Invalid signature' }));
            }
          } catch (err) {
            console.error('API Error:', err);
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
          }
        });
        return;
      }
      
      next();
    });
  }
});

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async']
  },
  plugins: [
    react(),
    viteCompression({ algorithm: 'brotliCompress' }),
    viteCompression({ algorithm: 'gzip' }),
    localApiPlugin()
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
    sourcemap: 'hidden'
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
