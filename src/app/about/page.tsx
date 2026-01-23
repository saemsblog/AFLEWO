"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { History, Shield, Globe, Award } from "lucide-react";
import Image from "next/image";

const milestones = [
    { year: "2004", title: "The Spark", desc: "AFLEWO was birthed in a small room in Nairobi, fueled by a vision to unite the continent in worship.", venue: "Nairobi, Kenya" },
    { year: "2010", title: "One People", desc: "Expansion into neighboring East African countries, breaking tribal and national barriers.", venue: "Kampala & Kigali" },
    { year: "2016", title: "A Decade of Worship", desc: "A massive gathering that solidified the movement's presence in the Pan-African space.", venue: "Kasarani Stadium" },
    { year: "2024", title: "20 Years of Glory", desc: "Celebrating two decades of faithfulness and the growth of the worship ecosystem.", venue: "Winning the Heart of Africa" },
    { year: "2026", title: "The Future Sound", desc: "Launching the AFLEWO Original Music project and the digital archiving initiative.", venue: "Global Echo" },
];

export default function AboutPage() {
    return (
        <main className="bg-background min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-24 px-6 relative">
                <div className="max-container text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-6 py-2 glass-card rounded-full text-gold text-sm font-black tracking-widest uppercase"
                    >
                        <Shield size={16} /> Since 2004
                    </motion.div>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-gradient-gold">
                        OUR IDENTITY.
                    </h1>
                    <p className="max-w-3xl mx-auto text-gold/60 text-xl font-medium leading-relaxed">
                        AFLEWO (Africa Let's Worship) is a call to the nations. We are a Pan-African movement dedicated to igniting and uniting the continent through creative, cultural, and spiritual expression.
                    </p>
                </div>
            </section>

            {/* Mission & Vision Cards */}
            <section className="section-padding bg-brown/20">
                <div className="max-container grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="glass-card p-12 space-y-6">
                        <Globe className="text-emerald w-12 h-12" />
                        <h2 className="text-4xl font-black tracking-tight">Our Mission</h2>
                        <p className="text-white/60 text-lg leading-loose">
                            To create a platform where the diverse cultures of Africa converge in a single, powerful sound of worship—transcending tribal, denominational, and national boundaries.
                        </p>
                    </div>
                    <div className="glass-card p-12 space-y-6">
                        <Award className="text-gold w-12 h-12" />
                        <h2 className="text-4xl font-black tracking-tight">Our Vision</h2>
                        <p className="text-white/60 text-lg leading-loose">
                            To see an Africa that is spiritually resilient, culturally authentic, and globally impactful, united by the common thread of God's love and the gospel message.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Timeline */}
            <section className="section-padding relative">
                <div className="max-container relative">
                    <div className="text-center mb-24 space-y-4">
                        <h2 className="text-5xl font-black tracking-tighter">THE JOURNEY</h2>
                        <div className="w-24 h-1 bg-gold mx-auto" />
                    </div>

                    <div className="relative">
                        {/* Central Line */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gold/10 hidden md:block" />

                        <div className="space-y-32">
                            {milestones.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className={`relative flex items-center justify-between gap-16 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    <div className="flex-1 hidden md:block" />

                                    {/* Middle Dot */}
                                    <div className="absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full glass-card border-gold/30 flex items-center justify-center z-10 hidden md:flex">
                                        <div className="w-3 h-3 rounded-full bg-gold aflewo-glow-gold" />
                                    </div>

                                    <div className="flex-1 glass-card p-10 space-y-4 relative group hover:border-gold/50 transition-all">
                                        <div className="text-gold font-black text-6xl opacity-20 absolute top-4 right-8 group-hover:opacity-40 transition-opacity">
                                            {item.year}
                                        </div>
                                        <div className="text-xs font-black text-emerald uppercase tracking-[0.2em]">{item.venue}</div>
                                        <h3 className="text-3xl font-black tracking-tight">{item.title}</h3>
                                        <p className="text-white/50 leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
