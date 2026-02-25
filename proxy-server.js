process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // DANGEROUS: Bypass all SSL checks for proxy

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
app.use(cors());

// Proxy Supabase API requests
app.use(
  '/supabase',
  createProxyMiddleware({
    target: 'https://yqtrlqkmitgnaehbawdm.supabase.co',
    changeOrigin: true,
    secure: false, // Do not verify SSL certs
    pathRewrite: {
      '^/supabase': '', // remove base path
    },
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
  })
);

app.listen(5174, () => {
  console.log('UNSECURE PROXY RUNNING ON http://localhost:5174');
  console.log('Forwarding /supabase to https://yqtrlqkmitgnaehbawdm.supabase.co (SSL bypassed)');
});
