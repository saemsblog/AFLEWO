"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Music as MusicIcon, Sparkles } from "lucide-react";

export default function MusicPage() {
    return (
        <main className="bg-background min-h-screen flex flex-col">
            <Navbar />

            <section className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/5 blur-[120px] rounded-full"
                    />
                </div>

                <div className="max-container text-center space-y-12 relative z-10">
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 bg-gold rounded-full mx-auto flex items-center justify-center text-brown aflewo-glow-gold shadow-glow"
                    >
                        <MusicIcon size={40} />
                    </motion.div>

                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-black uppercase tracking-widest">
                            <Sparkles size={14} /> The AFLEWO Studio Project
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white">
                            COMING <span className="text-gradient-gold">SOON.</span>
                        </h1>
                        <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto uppercase tracking-tighter leading-none">
                            For the first time in 22 years, we are going to the studio. The sound of Africa, recorded for eternity. 2026.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <input
                            type="email"
                            placeholder="Get notified on release"
                            className="bg-white/5 border border-white/10 rounded-full px-8 py-4 w-full md:w-80 text-white outline-none focus:ring-1 focus:ring-gold"
                        />
                        <button className="press-scale bg-white text-brown px-10 py-4 rounded-full font-black uppercase tracking-tighter hover:bg-gold transition-all">
                            Notify Me
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
