"use client";

import React, { useState, useEffect } from "react";
import FlipClockCountdownLib from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

interface FlipClockCountdownProps {
  targetDate: Date;
}

export default function FlipClockCountdown({ targetDate }: FlipClockCountdownProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-24 text-gold/30 uppercase tracking-widest font-black text-xs">
        Loading Clock...
      </div>
    );
  }

  // We are using the exact AFLEWO design mapped into the proven library props.
  return (
    <FlipClockCountdownLib
      to={targetDate.getTime()}
      labels={["DAYS", "HOURS", "MINS", "SECS"]}
      labelStyle={{
        fontSize: "10px",
        fontWeight: 900,
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.25em",
        marginTop: "16px",
        fontFamily: "inherit",
      }}
      digitBlockStyle={{
        width: "clamp(56px,8vw,96px)",
        height: "clamp(70px,10vw,120px)",
        fontSize: "clamp(2.2rem,6vw,4.2rem)",
        fontWeight: 900,
        color: "#D4AF37", // text-gold
        background: "linear-gradient(180deg, rgb(32,28,24) 0%, rgb(20,18,14) 100%)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.4)",
        borderRadius: "10px",
      }}
      dividerStyle={{
        color: "rgba(0,0,0,0.85)",
        height: 2,
      }}
      separatorStyle={{
        color: "rgba(212,175,55,0.4)", // text-gold/40
        size: "6px",
      }}
      duration={0.7}
      hideOnComplete={false}
    />
  );
}
