"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function StoriesTeaser() {
    return (
        <section className="section-padding bg-brown relative">
            <div className="max-container">
                <div className="glass-card p-12 md:p-24 rounded-[3rem] border-gold/10 relative overflow-hidden group">
                    {/* Animated Background Element */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 blur-[100px] rounded-full group-hover:bg-gold/20 transition-colors duration-700" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald/10 border border-emerald/20 rounded-full text-emerald text-xs font-black uppercase tracking-widest">
                                <Sparkles size={14} /> The AFLEWO Process
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-white">
                                STORIES OF <span className="text-gold">IMPACT.</span>
                            </h2>
                            <p className="text-white/60 text-xl font-medium leading-relaxed">
                                Behind every worship night is a story of transformation. From the hidden prayers of volunteers to the global echoes of our anthem, explore the heart of the movement.
                            </p>
                            <Link href="/stories" className="inline-flex press-scale bg-white text-brown px-10 py-5 rounded-full font-black uppercase tracking-tighter hover:bg-gold transition-all">
                                Read the Stories
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="p-8 glass-card border-white/5 space-y-4"
                            >
                                <Heart className="text-emerald" size={32} />
                                <h4 className="font-black text-2xl text-white">100k+</h4>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-loose">Worshippers Engaged Yearly</p>
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="p-8 glass-card border-white/5 space-y-4 mt-8"
                            >
                                <Sparkles className="text-gold" size={32} />
                                <h4 className="font-black text-2xl text-white">22 Yrs</h4>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-loose">Continuity & Growth</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
