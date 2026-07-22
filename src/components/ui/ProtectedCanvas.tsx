"use client";

import React, { useEffect, useRef, useState } from "react";

interface ProtectedCanvasProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  objectFit?: "contain" | "cover";
  watermarkSrc?: string;
  onClick?: () => void;
}

export default function ProtectedCanvas({
  src,
  alt = "Protected Media",
  className = "",
  style = {},
  objectFit = "cover",
  onClick,
}: ProtectedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mainImg = new Image();
    mainImg.crossOrigin = "anonymous";

    const draw = () => {
      if (!isMounted || !canvas || !ctx || !mainImg.naturalWidth) return;

      const container = containerRef.current;
      const rect = container ? container.getBoundingClientRect() : { width: 800, height: 600 };
      const displayWidth = rect.width || mainImg.naturalWidth || 800;
      const displayHeight = rect.height || mainImg.naturalHeight || 600;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(displayWidth * dpr));
      canvas.height = Math.max(1, Math.floor(displayHeight * dpr));

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const imgW = mainImg.naturalWidth || displayWidth;
      const imgH = mainImg.naturalHeight || displayHeight;
      const containerRatio = displayWidth / displayHeight;
      const imgRatio = imgW / imgH;

      let drawW = displayWidth;
      let drawH = displayHeight;
      let drawX = 0;
      let drawY = 0;

      if (objectFit === "contain") {
        if (imgRatio > containerRatio) {
          drawW = displayWidth;
          drawH = displayWidth / imgRatio;
          drawY = (displayHeight - drawH) / 2;
        } else {
          drawH = displayHeight;
          drawW = displayHeight * imgRatio;
          drawX = (displayWidth - drawW) / 2;
        }
      } else {
        if (imgRatio > containerRatio) {
          drawH = displayHeight;
          drawW = displayHeight * imgRatio;
          drawX = (displayWidth - drawW) / 2;
        } else {
          drawW = displayWidth;
          drawH = displayWidth / imgRatio;
          drawY = (displayHeight - drawH) / 2;
        }
      }

      // Draw clean base image for on-site viewing (no on-canvas watermark)
      ctx.drawImage(mainImg, drawX, drawY, drawW, drawH);

      ctx.restore();
      setLoaded(true);
    };

    mainImg.onload = () => {
      draw();
    };

    mainImg.onerror = () => {
      if (isMounted) setError(true);
    };

    mainImg.src = src;

    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
    };
  }, [src, objectFit]);

  useEffect(() => {
    const preventShortcuts = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u" || e.key === "S" || e.key === "s"))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", preventShortcuts, true);
    return () => window.removeEventListener("keydown", preventShortcuts, true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none no-download-wrapper ${className}`}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        ...style,
      }}
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        aria-label={alt}
        className="w-full h-full block select-none pointer-events-none"
        style={{ pointerEvents: "none", userSelect: "none" }}
      />

      {/* Transparent DOM Shield Overlay */}
      <div
        className="absolute inset-0 z-20 bg-transparent select-none"
        aria-hidden="true"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{ pointerEvents: "auto", userSelect: "none" }}
      />

      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse z-10">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
            Securing Media...
          </span>
        </div>
      )}
    </div>
  );
}
