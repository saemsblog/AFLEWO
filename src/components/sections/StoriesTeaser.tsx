"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Quote, Heart, Sparkles, ArrowRight } from "lucide-react";

const stories = [
    {
        content: "AFLEWO 2025 has been refreshing, empowering and full of God's presence. Thousands came despite the rain.",
        name: "Winners' Chapel Testimony",
        role: "Host Partner",
        stat: "10K+ Attended"
    },
    {
        content: "Since 2004, the vision of corporate worship has birthed 8 chapters across Kenya, Tanzania and Rwanda.",
        name: "Hubert de Rogue Maura",
        role: "Chairman",
        stat: "8 Chapters"
    }
];

export default function StoriesTeaser() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".story-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
                x: -30,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power2.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="section-padding bg-brown text-white relative overflow-hidden" id="stories">
            <div className="max-container flex flex-col lg:flex-row gap-20 items-center">
                <div className="flex-1 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                        <Sparkles size={14} /> The AFLEWO Spirit
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                        HEIRS OF <br />
                        <span className="text-gold">GLORY.</span>
                    </h2>
                    <p className="text-white/60 text-xl font-medium leading-relaxed font-serif-spiritual italic">
                        "Behind every worship night is a story of transformation. From the hidden prayers of volunteers to the global echoes of our anthem."
                    </p>
                    <Link href="/stories" className="press-scale inline-flex items-center gap-4 bg-gold text-brown px-10 py-5 rounded-full font-black uppercase tracking-tighter hover:brightness-110 transition-all">
                        Read the full stories <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="flex-1 space-y-6 w-full">
                    {stories.map((story, i) => (
                        <div key={i} className="story-card glass-card-elevated p-10 relative overflow-hidden group">
                            <Quote className="absolute top-8 right-8 text-gold/10 group-hover:text-gold/20 transition-colors" size={80} />

                            <div className="relative z-10 space-y-6">
                                <p className="text-2xl font-bold tracking-tight text-white leading-snug">
                                    "{story.content}"
                                </p>

                                <div className="flex justify-between items-end border-t border-white/5 pt-6">
                                    <div>
                                        <h4 className="font-black text-gold uppercase tracking-widest text-xs mb-1">{story.name}</h4>
                                        <p className="text-white/40 text-[10px] font-bold uppercase">{story.role}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-gold">
                                        <Heart size={14} fill="currentColor" />
                                        <span className="text-xs font-black">{story.stat}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Decorative Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </section>
    );
}
