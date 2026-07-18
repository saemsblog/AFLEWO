"use client";
import { useEffect, useState } from "react";

export function useAccessibilityPrefs() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [supportsGlass, setSupportsGlass] = useState(true);

    useEffect(() => {
        // Motion preference
        const motionMql = window.matchMedia("(prefers-reduced-motion: reduce)");
        const updateMotion = () => setPrefersReducedMotion(motionMql.matches);
        updateMotion();
        motionMql.addEventListener("change", updateMotion);

        // GPU / browser glass support check
        const glassOk =
            typeof CSS !== "undefined" &&
            (CSS.supports("backdrop-filter", "blur(1px)") ||
                CSS.supports("-webkit-backdrop-filter", "blur(1px)"));
        setSupportsGlass(glassOk);

        return () => motionMql.removeEventListener("change", updateMotion);
    }, []);

    return { prefersReducedMotion, supportsGlass };
}
