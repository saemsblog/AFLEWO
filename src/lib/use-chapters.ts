"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { chapters, type Chapter } from "./chapters";

export type { Chapter };

/**
 * useChaptersWithLiveData
 *
 * Client-side hook — fetches live chapter overrides from Supabase and merges
 * them onto the static chapter config. Falls back to static data gracefully
 * if the DB is unreachable (before migration, or network failure).
 *
 * Usage (inside any "use client" component):
 *   const chapters = useChaptersWithLiveData();
 */
export function useChaptersWithLiveData(): Chapter[] {
    const [merged, setMerged] = useState<Chapter[]>(chapters);

    useEffect(() => {
        supabase
            .from("chapters")
            .select("slug, status, contact_email, contact_phone, whatsapp_link, is_active")
            .then(({ data, error }) => {
                if (error || !data) return;
                setMerged(
                    chapters.map((c) => {
                        const live = data.find((d: { slug: string }) => d.slug === c.slug);
                        if (!live) return c;
                        return {
                            ...c,
                            // Override with live DB values if they exist
                            status: live.status || c.status,
                            contactEmail: live.contact_email || c.contactEmail,
                            contactPhone: live.contact_phone || c.contactPhone,
                            whatsappLink: live.whatsapp_link || c.whatsappLink,
                        };
                    })
                );
            });
    }, []);

    return merged;
}
