"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
    { year: "2004", title: "The Spark", description: "AFLEWO founded as a small worship gathering in Nairobi, Kenya." },
    { year: "2008", title: "Stadium Scale", description: "First massive worship night at Nyayo National Stadium, uniting thousands." },
    { year: "2012", title: "One Africa", description: "Expansion to chapters across East and Central Africa." },
    { year: "2018", title: "Digital Harvest", description: "Launching digital archives and global streaming platforms." },
    { year: "2024", title: "20 Years of Glory", description: "Two decades of consistent, inter-denominational worship." },
    { year: "2026", title: "The Future Sound", description: "Deployment of the Next-Gen Digital Platform for African Worship." },
];

export default function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Vertical Line
            gsap.fromTo(
                lineRef.current,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top center",
                        end: "bottom center",
                        scrub: true,
                    },
                }
            );

            // Animate Milestone Cards
            gsap.utils.toArray(".milestone-card").forEach((card: any, i) => {
                gsap.from(card, {
                    x: i % 2 === 0 ? -100 : 100,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 px-6 bg-brown relative" id="about">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-24">
                    <h2 className="text-5xl md:text-7xl font-black text-gold uppercase tracking-tighter mb-6">Our Journey</h2>
                    <p className="text-gold/60 text-xl font-medium max-w-2xl mx-auto">Digitizing the heartbeat of African worship since 2004.</p>
                </div>

                <div className="relative pt-12">
                    {/* Vertical Line */}
                    <div
                        ref={lineRef}
                        className="absolute left-1/2 top-0 bottom-0 w-1 bg-gold/30 origin-top transform -translate-x-1/2 hidden md:block"
                    />

                    <div className="space-y-24 md:space-y-32">
                        {milestones.map((m, i) => (
                            <div key={m.year} className={`relative flex flex-col md:flex-row items-center ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                                {/* Year Marker */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 z-20 hidden md:flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-gold border-4 border-brown flex items-center justify-center font-black text-brown">
                                        {m.year.slice(2)}
                                    </div>
                                </div>

                                {/* Content Card */}
                                <div className={`w-full md:w-[45%] milestone-card`}>
                                    <div className="glass-card p-8 md:p-10 border-gold/20 hover:border-gold/50 transition-colors">
                                        <span className="text-gold font-black text-3xl md:text-5xl mb-4 block">{m.year}</span>
                                        <h3 className="text-2xl font-bold text-foreground mb-3">{m.title}</h3>
                                        <p className="text-foreground/70 leading-relaxed text-lg">{m.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
