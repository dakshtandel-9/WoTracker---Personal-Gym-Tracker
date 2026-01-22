// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project URL and anon public key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_SUPABASE_URL.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        storageKey: 'wotracker-auth',
        storage: localStorage,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    }
});
