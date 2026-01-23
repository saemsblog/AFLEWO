"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import DonateSection from "@/components/sections/DonateSection";
import Image from "next/image";

const stories = [
    { title: "The Rehearsal Room", desc: "Long before the lights go up, hundreds of voices unite in a small, humble room. This is where the brotherhood begins.", image: "/images/images.jpg" },
    { title: "Pan-African Arrival", desc: "Buses crossing borders. Worship leaders from Rwanda, Uganda, and Tanzania joining the Kenyan heart.", image: "/images/12.jpg" },
    { title: "The Kasarani Night", desc: "A stadium transformed. 30,000 souls becoming one single echo of praise in the heart of Africa.", image: "/images/AFLEWO 2016-22.jpg" },
];

export default function StoriesPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <main ref={containerRef} className="bg-background min-h-screen">
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-24 px-6 text-center">
                <div className="max-container space-y-4">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-gradient-gold">
                        THE PROCESS.
                    </h1>
                    <p className="text-gold/60 text-xl font-medium mx-auto max-w-2xl">
                        A journey from unity to glory. Experience the story of how AFLEWO comes to life.
                    </p>
                </div>
            </section>

            {/* Immersive Scroll Section */}
            <section className="relative">
                {stories.map((story, i) => (
                    <div key={i} className="min-h-screen flex items-center justify-center p-6 md:p-24 sticky top-0 bg-background">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="max-container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                        >
                            <div className="relative aspect-[4/5] rounded-ios overflow-hidden glass-card">
                                <Image
                                    src={story.image}
                                    alt={story.title}
                                    fill
                                    className="object-cover opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brown via-transparent to-transparent opacity-80" />
                            </div>
                            <div className="space-y-8">
                                <span className="text-gold font-black text-xs uppercase tracking-[0.4em]">Step 0{i + 1}</span>
                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{story.title}</h2>
                                <p className="text-white/60 text-xl font-medium leading-relaxed">
                                    {story.desc}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </section>

            {/* The Natural Transition to Donation */}
            <div className="relative z-10">
                <section className="section-padding bg-gold text-brown text-center">
                    <div className="max-container space-y-8">
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter">
                            BECOME PART OF THE STORY.
                        </h2>
                        <p className="text-brown/70 text-xl max-w-3xl mx-auto font-bold uppercase tracking-tight">
                            Your support ensures the sound of heaven continues to echo across Africa. Inspired? Partner with us today.
                        </p>
                    </div>
                </section>

                <DonateSection />
            </div>

            <Footer />
        </main>
    );
}
