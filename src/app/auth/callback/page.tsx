"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

/**
 * OAuth Callback Handler
 * Supabase redirects here after Google OAuth completes.
 * This page exchanges the auth code for a session and redirects to the portal.
 */
function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (error) {
        console.error("[auth/callback] Error:", error);
        router.replace(`/auth?error=${encodeURIComponent(error.message)}`);
        return;
      }

      const redirect = searchParams.get("redirect") || "/portal";
      router.replace(redirect);
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    }>
      <CallbackInner />
    </Suspense>
  );
}
