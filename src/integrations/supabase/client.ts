import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const isBrowser = typeof window !== 'undefined';

/**
 * Typed Supabase client for AFLEWO.
 * Safe for both server components (SSR) and client components.
 * Import as: import { supabase } from "@/integrations/supabase/client";
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: isBrowser ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: isBrowser,
  },
});