import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
// In a real scenario, ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env
// Casting import.meta to any to avoid TypeScript errors when vite-env.d.ts is missing or not configured
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);