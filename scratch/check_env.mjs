import { loadEnv } from 'vite';
const env = loadEnv('', process.cwd(), '');
console.log('RAZORPAY_KEY_ID:', env.RAZORPAY_KEY_ID || 'NOT SET');
console.log('RAZORPAY_KEY_SECRET:', env.RAZORPAY_KEY_SECRET ? 'SET (hidden)' : 'NOT SET');
