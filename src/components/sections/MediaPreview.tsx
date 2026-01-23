"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";

const previews = [
    { title: "Nairobi Live 2024", type: "Video", image: "/images/12.jpg" },
    { title: "Worship in Mombasa", type: "Gallery", image: "/images/AFLEWO 2016-22.jpg" },
    { title: "The AFLEWO Story", type: "Documentary", image: "/images/hq720.jpg" },
];

export default function MediaPreview() {
    return (
        <section className="section-padding bg-background/50 relative overflow-hidden">
            <div className="max-container relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gradient-gold">
                            THE ARCHIVE
                        </h2>
                        <p className="text-gold/60 max-w-xl font-medium text-lg leading-relaxed">
                            Twenty-two years of glory. Witness the moments that defined a generation of worship across the continent.
                        </p>
                    </div>
                    <Link href="/media" className="press-scale flex items-center gap-4 bg-gold text-brown px-8 py-4 rounded-full font-black uppercase tracking-tighter hover:shadow-glow transition-all">
                        Explore Media <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {previews.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative aspect-[4/5] rounded-ios overflow-hidden glass-card"
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brown via-transparent to-transparent opacity-80" />

                            <div className="absolute inset-0 flex flex-col justify-end p-8 space-y-4">
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald bg-emerald/10 self-start px-3 py-1 rounded-full border border-emerald/20">
                                    {item.type}
                                </span>
                                <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-gold transition-colors">
                                    {item.title}
                                </h3>
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-gold group-hover:text-brown transition-all">
                                    <Play size={20} className="ml-1" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Glows */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald/10 blur-[120px] rounded-full -translate-x-1/2" />
        </section>
    );
}
