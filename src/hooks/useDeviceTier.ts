"use client";
import { useEffect, useState } from "react";

export type DeviceTier = "mobile" | "tablet" | "desktop";

const QUERIES: Record<DeviceTier, string> = {
    mobile: "(max-width: 767px)",
    tablet: "(min-width: 768px) and (max-width: 1023px)",
    desktop: "(min-width: 1024px)",
};

export function useDeviceTier(): DeviceTier {
    // SSR-safe: default to "desktop" on the server; corrected immediately on mount.
    const [tier, setTier] = useState<DeviceTier>("desktop");

    useEffect(() => {
        const mqls = (Object.entries(QUERIES) as [DeviceTier, string][]).map(
            ([key, query]) => ({ key, mql: window.matchMedia(query) })
        );
        const resolve = () => {
            const match = mqls.find(({ mql }) => mql.matches);
            setTier(match?.key ?? "desktop");
        };
        resolve();
        mqls.forEach(({ mql }) => mql.addEventListener("change", resolve));
        return () => mqls.forEach(({ mql }) => mql.removeEventListener("change", resolve));
    }, []);

    return tier;
}
