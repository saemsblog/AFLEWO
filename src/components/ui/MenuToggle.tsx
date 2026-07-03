"use client";

import { useRef, useEffect } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "../../../public/menu-close-lottie.json";

/**
 * MenuToggle — Lottie-driven hamburger ↔ close icon
 *
 * Animation analysis (Q8QSoa57gH.json, 240 frames @ 60fps):
 *  - Frame   0  : Menu state (3 horizontal bars)
 *  - Frame  ~60 : X state (fully formed cross)
 *  - Frame ~168 : Back to Menu state (loop point before idle)
 *
 * Strategy:
 *  - On OPEN  (menu → X) : play frames 0 → 60, then pause
 *  - On CLOSE (X → menu) : play frames 60 → 168, then pause at 0
 *    (we seek to 0 after pause so next open starts clean)
 */

interface MenuToggleProps {
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
}

// Key frame positions derived from JSON keyframe analysis
const FRAME_MENU = 0;
const FRAME_X    = 60;
const FRAME_END  = 168;

export default function MenuToggle({ isOpen, onToggle, className = "" }: MenuToggleProps) {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    // Track whether the lottie is mounted and ready
    const readyRef = useRef(false);
    // Prevent animation triggering on initial mount
    const prevOpenRef = useRef<boolean | null>(null);

    useEffect(() => {
        if (!readyRef.current) return;
        if (prevOpenRef.current === null) {
            // First real render after mount — snap to correct state without animation
            prevOpenRef.current = isOpen;
            if (isOpen) {
                lottieRef.current?.goToAndStop(FRAME_X, true);
            } else {
                lottieRef.current?.goToAndStop(FRAME_MENU, true);
            }
            return;
        }

        if (isOpen && prevOpenRef.current === false) {
            // Menu → X : play forward 0 → 60
            lottieRef.current?.goToAndStop(FRAME_MENU, true);
            lottieRef.current?.setDirection(1);
            lottieRef.current?.playSegments([FRAME_MENU, FRAME_X], true);
        } else if (!isOpen && prevOpenRef.current === true) {
            // X → Menu : play forward 60 → 168
            lottieRef.current?.goToAndStop(FRAME_X, true);
            lottieRef.current?.setDirection(1);
            lottieRef.current?.playSegments([FRAME_X, FRAME_END], true);
        }

        prevOpenRef.current = isOpen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleReady = () => {
        readyRef.current = true;
        // Start at menu state, paused
        lottieRef.current?.goToAndStop(FRAME_MENU, true);
        prevOpenRef.current = false;
    };

    return (
        <button
            type="button"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
            onClick={onToggle}
            className={`relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none ${className}`}
        >
            <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                autoplay={false}
                loop={false}
                onDOMLoaded={handleReady}
                style={{ width: 32, height: 32 }}
                // Invert fill from black (#0b0b0b) to white via CSS filter
                // The Lottie JSON uses fill ~#0B0B0B (dark); we invert to white
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            />
            {/* CSS filter: invert the dark Lottie shapes to white */}
            <style>{`
                .lottie-menu-toggle svg path,
                .lottie-menu-toggle svg rect {
                    fill: white !important;
                }
            `}</style>
        </button>
    );
}
