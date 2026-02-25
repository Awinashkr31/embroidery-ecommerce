import { createClient } from '@supabase/supabase-js';

// EMERGENCY PROXY: Route through local Vite proxy to bypass Antivirus SSL block
const supabaseUrl = window.location.origin + '/supabase-api';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
