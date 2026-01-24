"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";

const partners = [
    { name: "Co-operative Bank", logo: "/Coop-Bank1.jpg", url: "https://www.co-opbank.co.ke" },
    { name: "Blacktree Studios", logo: "/Blacktree Studios.jpg", url: "#" },
    { name: "SBN Media", logo: "/SBN media.jpg", url: "#" },
    { name: "Saem's Codes", logo: "/Saem's Codes.jpg", url: "#" },
];

export default function PartnersSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".partner-item", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                },
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "power2.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="partners" ref={containerRef} className="py-20 bg-background border-y border-white/5">
            <div className="max-container">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Prophetic Alignment</span>
                    <h2 className="text-4xl font-black tracking-tighter">OUR <span className="text-gold">PARTNERS</span></h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-center">
                    {partners.map((partner, i) => (
                        <Link
                            key={i}
                            href={partner.url}
                            target="_blank"
                            className="partner-item group relative grayscale hover:grayscale-0 transition-all duration-500 flex items-center justify-center p-8 glass-card rounded-lg border-white/5 hover:border-gold/30"
                        >
                            <div className="relative w-full aspect-[3/2]">
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    fill
                                    className="object-contain"
                                    sizes="(max-w-768px) 50vw, 25vw"
                                />
                            </div>
                            <div className="absolute inset-x-0 -bottom-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] font-black uppercase tracking-widest text-gold bg-background px-3 py-1 rounded-full border border-gold/20">
                                    {partner.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
