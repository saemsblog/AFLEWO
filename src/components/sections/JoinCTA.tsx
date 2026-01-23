"use client";

import Link from "next/link";
import { Users, Handshake, MessageSquare } from "lucide-react";

export default function JoinCTA() {
    return (
        <section className="section-padding bg-background relative overflow-hidden">
            <div className="max-container">
                <div className="text-center space-y-6 mb-20">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-gradient-gold">
                        BE THE VOICE.
                    </h2>
                    <p className="text-gold/60 text-xl max-w-2xl mx-auto font-medium">
                        AFLEWO is built by hands and hearts united. Find your place in the sound of heaven.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Volunteer", desc: "Join production, music, or hospitality.", icon: Users, href: "/join?tab=volunteer" },
                        { title: "Partner", desc: "Support the vision technically or financially.", icon: Handshake, href: "/join?tab=partner" },
                        { title: "Testify", desc: "Share your AFLEWO story with the world.", icon: MessageSquare, href: "/join?tab=testify" }
                    ].map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className="press-scale glass-card p-10 group hover:border-gold/30 hover:shadow-glow transition-all"
                        >
                            <item.icon className="text-gold mb-6 group-hover:scale-110 transition-transform" size={40} />
                            <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{item.title}</h3>
                            <p className="text-white/50 font-medium mb-8 leading-relaxed">
                                {item.desc}
                            </p>
                            <span className="text-gold font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                Reveal Opportunity <div className="w-8 h-[2px] bg-gold/30 group-hover:w-12 transition-all" />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Emerald glow beneath */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-emerald/5 blur-[150px] pointer-events-none" />
        </section>
    );
}
