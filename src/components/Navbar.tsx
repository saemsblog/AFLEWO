"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
    { name: "Live", href: "#hero" },
    { name: "Timeline", href: "#about" },
    { name: "Music", href: "#music" },
    { name: "Events", href: "#events" },
    { name: "Support", href: "#donate" },
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
                "max-w-5xl mx-auto rounded-full transition-all duration-500 flex items-center justify-between px-8 py-3",
                isScrolled ? "glass-card bg-background/60 py-2" : "bg-transparent"
            )}>
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center font-black text-brown group-hover:rotate-12 transition-transform">
                        A
                    </div>
                    <span className="font-black text-xl tracking-tighter text-foreground">AFLEWO</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-bold uppercase tracking-widest text-foreground/70 hover:text-gold transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-4">
                    <button className="press-scale bg-gold text-brown px-6 py-2 rounded-full font-bold text-sm uppercase tracking-tighter shadow-glow">
                        Connect
                    </button>
                </div>
            </div>
        </nav>
    );
}
