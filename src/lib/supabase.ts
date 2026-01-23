import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * AFLEWO Backend Foundation
 * 
 * Tables to create:
 * 1. chapters - Chapter metadata and status
 * 2. events - Centralized calendar items
 * 3. alumni - Alumni records and testimonials
 * 4. media - Archival links and CDN assets
 */

export async function getChapters() {
    const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching chapters:', error);
        return [];
    }
    return data;
}
