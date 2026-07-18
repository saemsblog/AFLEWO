"use client";
import { useEffect, useState } from "react";

export function usePointerCapability() {
    // Assume hover on SSR; corrected on first paint.
    const [hasHover, setHasHover] = useState(true);

    useEffect(() => {
        const mql = window.matchMedia("(hover: hover)");
        const update = () => setHasHover(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, []);

    return { hasHover };
}
