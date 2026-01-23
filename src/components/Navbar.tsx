"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const links = [
    { name: "About", href: "/about" },
    { name: "Media", href: "/media" },
    { name: "Stories", href: "/stories" },
    { name: "Join", href: "/join" },
    { name: "Music", href: "/music" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
            isScrolled ? "mt-4" : "mt-0"
        )}>
            <div className={cn(
                "max-w-6xl mx-auto rounded-full transition-all duration-700 flex items-center justify-between px-8 py-4",
                isScrolled ? "glass-card-elevated py-3 mt-4" : "bg-transparent"
            )}>
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-500">
                        <Image
                            src="/brand/AFLEWO-LOGO-1-Photoroom.svg"
                            alt="AFLEWO"
                            fill
                            className="object-contain brightness-0 invert"
                        />
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-gold transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-4">
                    <button className="press-scale bg-white text-brown px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-glow hover:bg-gold transition-all">
                        Connect
                    </button>
                </div>
            </div>
        </nav>
    );
}
