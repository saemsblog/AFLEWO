"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Handshake, MessageSquare, ArrowRight } from "lucide-react";

export default function JoinPage() {
    return (
        <main className="bg-background min-h-screen">
            <Navbar />

            <section className="pt-32 pb-24 px-6">
                <div className="max-container space-y-24">
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-gradient-gold">
                            JOIN THE UNIT.
                        </h1>
                        <p className="text-gold/60 text-xl font-medium max-w-2xl">
                            Whether you serve in the choir, lead production, or partner with your resources—you are AFLEWO.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Volunteer Track */}
                        <div className="glass-card p-12 space-y-8 relative group overflow-hidden">
                            <Users className="text-gold w-12 h-12" />
                            <h2 className="text-4xl font-black tracking-tight">Volunteer</h2>
                            <ul className="space-y-4 text-white/50 font-medium">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full" /> Mass Choir</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full" /> Tech & Production</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full" /> Ushering & Hospitality</li>
                            </ul>
                            <button className="press-scale flex items-center justify-between w-full bg-white/5 border border-white/10 p-5 rounded-ios font-black text-xs tracking-widest uppercase hover:bg-gold hover:text-brown transition-all mt-12">
                                Apply to serve <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Partner Track */}
                        <div className="glass-card p-12 space-y-8 relative group overflow-hidden">
                            <Handshake className="text-emerald w-12 h-12" />
                            <h2 className="text-4xl font-black tracking-tight text-white">Partner</h2>
                            <ul className="space-y-4 text-white/50 font-medium">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald rounded-full" /> Institutional Support</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald rounded-full" /> Equipment Grants</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald rounded-full" /> Chapter Sponsorship</li>
                            </ul>
                            <button className="press-scale flex items-center justify-between w-full bg-emerald text-white p-5 rounded-ios font-black text-xs tracking-widest uppercase hover:bg-white hover:text-brown transition-all mt-12">
                                Become a partner <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Story Track */}
                        <div className="glass-card p-12 space-y-8 relative group overflow-hidden">
                            <MessageSquare className="text-gold w-12 h-12" />
                            <h2 className="text-4xl font-black tracking-tight text-white">Testify</h2>
                            <p className="text-white/50 font-medium leading-relaxed">
                                Share your personal journey with AFLEWO. Your story can inspire the next worshipper.
                            </p>
                            <button className="press-scale flex items-center justify-between w-full bg-gold text-brown p-5 rounded-ios font-black text-xs tracking-widest uppercase hover:bg-white transition-all mt-12">
                                Submit Story <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
