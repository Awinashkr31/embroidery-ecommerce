import { createClient } from '@supabase/supabase-js';

const supabaseUrl = typeof process !== 'undefined' && process.env.NODE_ENV === 'test' ? 'http://localhost' : import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = typeof process !== 'undefined' && process.env.NODE_ENV === 'test' ? 'test-key' : import.meta.env?.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
