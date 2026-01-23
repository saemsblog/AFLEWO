"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Users, Calendar, QrCode, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
    {
        name: "Nairobi",
        status: "Mother Chapter",
        established: "2004",
        venue: "Winners' Chapel International",
        capacity: "15,000+",
        highlight: "Latest: Grace for Wholeness (Oct 2025)",
        size: "large",
        link: "https://aflewo.org",
        color: "text-gold"
    },
    {
        name: "Nakuru",
        status: "Registration Open",
        established: "2013",
        venue: "Deliverance Church",
        highlight: "2026 Season Registration Active",
        size: "medium",
        link: "https://facebook.com/aflewonakuru",
        hasQr: true
    },
    {
        name: "Eldoret",
        status: "Auditions Active",
        established: "2025",
        venue: "Regional Hub",
        highlight: "Choir, Band, Media & Dance",
        size: "small",
        link: "https://facebook.com/aflewoeldoret"
    },
    {
        name: "Mombasa",
        status: "Prayer Circle",
        established: "2009",
        venue: "JCC Bamburi Centre",
        highlight: "Nightly Zoom Prayer Circle",
        size: "medium",
        link: "https://facebook.com/aflewomombasa"
    },
    {
        name: "Rwanda",
        status: "Kigali Chapter",
        established: "2011",
        venue: "CLA Nyarutarama",
        highlight: "NYE 2026 Ushered",
        size: "small",
        link: "https://facebook.com/afleworwanda"
    },
    {
        name: "Tanzania",
        status: "Dar es Salaam",
        established: "2010",
        venue: "CCC Upanga Church",
        highlight: "4,000+ Participants",
        size: "small",
        link: "https://facebook.com/aflewotanzania"
    },
    {
        name: "Nyeri",
        status: "Mt. Kenya Hub",
        established: "2010",
        venue: "PCEA Nyamachaki",
        highlight: "Pastors' Fellowship Support",
        size: "small",
        link: "https://aflewo.org"
    },
    {
        name: "Meru",
        status: "Active Chapter",
        established: "2012",
        venue: "KEMU Chapel",
        highlight: "Expansion Vision Active",
        size: "small",
        link: "https://aflewo.org"
    },
    {
        name: "Machakos",
        status: "Emerging",
        established: "2026",
        venue: "Machakos Stadium",
        highlight: "Birthed from the Eastern Choir",
        size: "small",
        link: "https://aflewo.org"
    },
    {
        name: "Kisumu",
        status: "Lake Hub",
        established: "2026",
        venue: "Jomo Kenyatta Ground",
        highlight: "Expansion Vision Active",
        size: "small",
        link: "https://aflewo.org"
    }
];

export default function ChaptersSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".chapter-card", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                y: 100,
                opacity: 0,
                stagger: 0.1,
                duration: 1.2,
                ease: "expo.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="section-padding bg-background relative overflow-hidden" id="chapters">
            <div className="max-container">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                            <MapPin size={12} /> The Prophetic House
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            CHAPTERS OF <br /><span className="text-gold">IDENTITY.</span>
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 text-right">
                        <p className="text-foreground/50 max-w-sm font-bold text-sm uppercase tracking-widest leading-relaxed">
                            A continental network of worship, uniting 8+ major hubs across East Africa.
                        </p>
                        <Link href="https://whatsapp.com/channel/AFLEWO" className="press-scale inline-flex items-center gap-2 text-gold font-black uppercase tracking-widest text-[10px] hover:gap-4 transition-all">
                            Join our WhatsApp Channel <MessageCircle size={14} />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[1200px]">
                    {chapters.map((chapter, i) => (
                        <div
                            key={i}
                            className={`chapter-card glass-card-elevated p-10 flex flex-col justify-between group hover:border-gold/30 transition-all duration-700 relative overflow-hidden
                                ${chapter.size === "large" ? "md:col-span-2 md:row-span-2" : ""}
                                ${chapter.size === "medium" ? "md:col-span-2 md:row-span-1" : ""}
                                ${chapter.size === "small" ? "md:col-span-1 md:row-span-1" : ""}
                            `}
                        >
                            {/* Background Pattern */}
                            <div className="absolute -right-8 -top-8 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none grayscale brightness-0 invert">
                                <MapPin size={128} />
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${chapter.color || "text-gold/60"}`}>
                                            {chapter.status}
                                        </span>
                                        <h3 className="text-4xl font-black tracking-tighter group-hover:text-gold transition-colors">{chapter.name}</h3>
                                    </div>
                                    {chapter.hasQr && (
                                        <div className="p-2 glass-card bg-gold/10 border-gold/30 rounded-lg text-gold animate-pulse">
                                            <QrCode size={20} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-foreground/40 text-sm font-medium leading-relaxed max-w-[250px]">
                                    {chapter.highlight}
                                </p>
                            </div>

                            <div className="pt-8 border-t border-white/5 relative z-10">
                                <div className="flex flex-col gap-3 mb-8">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                                        <Calendar size={14} className="text-gold" />
                                        <span>EST. {chapter.established}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                                        <MapPin size={14} className="text-gold" />
                                        <span>{chapter.venue}</span>
                                    </div>
                                    {chapter.capacity && (
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                                            <Users size={14} className="text-gold" />
                                            <span>{chapter.capacity} Souls</span>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href={chapter.link}
                                    className="press-scale w-full inline-flex items-center justify-between px-6 py-4 glass-card group-hover:bg-gold group-hover:text-brown transition-all duration-500 rounded-full font-black text-[10px] uppercase tracking-widest"
                                >
                                    Connect with Chapter <ExternalLink size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
