import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Centralized Supabase client for AFLEWO
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * M-Pesa STK Push Skeleton (69% complete)
 * This is the client-side interaction bridge for the financial integration.
 */
export const initiateDonation = async (amount: number, phone: string) => {
    console.log(`[STK Push] Initiating KES ${amount} to ${phone}...`);

    // Logic skeleton for calling the Cloudflare Worker via Edge function
    const response = await fetch('/api/payments/stk-push', {
        method: 'POST',
        body: JSON.stringify({ amount, phone }),
    });

    return response.json();
};

export const subscribeToTransactions = (txId: string, callback: (payload: any) => void) => {
    return supabase
        .channel('public:transactions')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'transactions',
                filter: `provider_tx_id=eq.${txId}`
            },
            (payload) => callback(payload.new)
        )
        .subscribe();
};
