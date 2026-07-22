"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import SvgIcon from "@/components/ui/SvgIcon";

// ─── Spring preset ─────────────────────────────────────────────────────────────
const SPRING = { type: "spring", stiffness: 340, damping: 34, mass: 0.9 } as const;

const opportunities = [
    {
        title: "Volunteer",
        desc: "Join production, music, or hospitality teams. Be part of the 1,000+ volunteers that make AFLEWO happen.",
        icon: "people" as const,
        href: "/join?tab=volunteer",
        stat: "1,000+ Volunteers",
        accent: "from-gold/12 to-gold/3",
    },
    {
        title: "Partner",
        desc: "Support the vision financially or in kind. Become a pillar of continental worship.",
        icon: "handshake" as const,
        href: "/join?tab=partners",
        stat: "50+ Partners",
        accent: "from-gold/10 to-gold/2",
    },
    {
        title: "Share Your Story",
        desc: "Share your AFLEWO experience. Let your testimony connect others to the movement.",
        icon: "chat" as const,
        href: "/testify",
        stat: "Your Voice Matters",
        accent: "from-gold/8 to-gold/1",
    },
];

export default function JoinCTA() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerInView = useInView(sectionRef, { once: true, margin: "-12%" });

    return (
        <section ref={sectionRef} id="join" className="py-24 md:py-32 px-6 bg-background relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-1/3 -left-24 w-[350px] h-[350px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-gold/3 blur-[120px] pointer-events-none" />

            <div className="max-container relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ ...SPRING, delay: 0 }}
                    className="text-center space-y-5 mb-16 md:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gold/8 border border-gold/18 rounded-full text-gold text-[8px] font-black uppercase tracking-[0.3em]">
                        <SvgIcon name="favorite" size={12} />
                        Join the Movement
                    </div>
                    <h2
                        className="font-black tracking-tighter leading-[0.88] text-white"
                        style={{ fontSize: "clamp(3rem,8vw,7rem)" }}
                    >
                        BE THE <span className="text-gold">VOICE.</span>
                    </h2>
                    <p className="text-white/40 text-[13px] md:text-[15px] max-w-xl mx-auto font-medium leading-relaxed">
                        AFLEWO is built by hands and hearts united. Find your place in the sound of heaven rising across Africa.
                    </p>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {opportunities.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24, scale: 0.97 }}
                            animate={headerInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ ...SPRING, delay: 0.08 + i * 0.07 }}
                        >
                            <Link
                                href={item.href}
                                className="group block h-full active:scale-[0.98] transition-transform duration-150"
                                style={{ WebkitTapHighlightColor: "transparent" }}
                            >
                                <div
                                    className="relative rounded-[1.75rem] border border-white/6 overflow-hidden p-8 md:p-10 flex flex-col h-full hover:border-gold/22 transition-colors duration-400"
                                    style={{ background: "rgba(255,255,255,0.018)", backdropFilter: "blur(20px) saturate(160%)" }}
                                >
                                    {/* Hover gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <div className="relative z-10 flex flex-col h-full gap-6">
                                        {/* Icon + stat row */}
                                        <div className="flex items-start justify-between">
                                            <div className="p-3.5 rounded-2xl bg-gold/8 border border-gold/12 text-gold flex items-center justify-center group-hover:bg-gold/14 transition-colors duration-300">
                                                <SvgIcon name={item.icon} size={28} className="text-gold" />
                                            </div>
                                            <div className="text-right">
                                                <SvgIcon name="star" size={13} className="text-gold ml-auto mb-1" />
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gold/60">{item.stat}</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3
                                            className="font-black text-white tracking-tight leading-tight group-hover:text-gold transition-colors duration-300"
                                            style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)" }}
                                        >
                                            {item.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-white/40 font-medium text-[13px] leading-relaxed flex-1">
                                            {item.desc}
                                        </p>

                                        {/* Footer CTA */}
                                        <div className="pt-5 border-t border-white/5">
                                            <span className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.22em] text-gold/60 group-hover:text-gold transition-colors duration-300">
                                                Get Involved
                                                <SvgIcon name="chevron_right" size={14} className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bottom accent line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* CTA button */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ ...SPRING, delay: 0.35 }}
                    className="mt-14 text-center"
                >
                    <Link
                        href="/join"
                        className="inline-flex items-center gap-3 bg-gold text-brown px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all shadow-[0_0_24px_rgba(212,175,55,0.2)] active:scale-95"
                    >
                        See All Ways to Join
                        <SvgIcon name="chevron_right" size={16} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
