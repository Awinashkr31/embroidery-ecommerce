
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: { 'x-application-name': 'Crochet Wali' },
    fetch: (...args) => {
      // Force no-store to prevent browser heuristic caching of GET requests
      return fetch(args[0], { ...args[1], cache: 'no-store' });
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});
