"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";

const mediaItems = [
    {
        title: "The Altar of 15,000",
        category: "Nairobi",
        year: "2024",
        image: "/archival-1.jpg",
        size: "large"
    },
    {
        title: "Night of Worship",
        category: "Mombasa",
        year: "2016",
        image: "/archival-2.jpg",
        size: "small"
    },
    {
        title: "A Decade of Grace",
        category: "Documentary",
        year: "2014",
        image: "/mission-1.jpg",
        size: "medium"
    },
    {
        title: "Coast Revival",
        category: "Mombasa",
        year: "2009",
        image: "/archival-2.jpg",
        size: "small"
    }
];

export default function MediaPreview() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".bento-item", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
                scale: 0.9,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "expo.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="section-padding bg-background relative" id="media">
            <div className="max-container">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div className="space-y-4">
                        <span className="text-gold font-black uppercase tracking-widest text-xs">The Archive</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter">THE SOUND <br /><span className="text-gold">OF HEAVEN.</span></h2>
                    </div>
                    <Link href="/media" className="press-scale flex items-center gap-3 text-gold font-black uppercase tracking-widest text-xs hover:gap-5 transition-all">
                        Explore Full Gallery <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px]">
                    {mediaItems.map((item, i) => (
                        <div
                            key={i}
                            className={`bento-item relative rounded-3xl overflow-hidden glass-card border-white/5 group 
                                ${item.size === "large" ? "md:col-span-2 md:row-span-2" : ""}
                                ${item.size === "medium" ? "md:col-span-2 md:row-span-1" : ""}
                                ${item.size === "small" ? "md:col-span-1 md:row-span-1" : ""}
                            `}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-3 text-gold">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gold/10 rounded-md">{item.category}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{item.year}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white">{item.title}</h3>
                                </div>

                                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <button className="p-4 bg-gold rounded-full text-brown flex items-center justify-center">
                                        <Play size={20} fill="currentColor" stroke="none" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
