"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Play, Image as ImageIcon, Youtube } from "lucide-react";
import Image from "next/image";

const categories = ["All", "Nairobi", "Eldoret", "Mombasa", "Regional"];

const galleryItems = [
    { title: "Kasarani 2016", cat: "Nairobi", image: "/images/AFLEWO 2016-22.jpg", type: "image" },
    { title: "AFLEWO Chronicles", cat: "Documentary", image: "/images/hq720.jpg", type: "video", url: "https://www.youtube.com/watch?v=CW_qocLAFcw" },
    { title: "One Africa Anthem", cat: "Regional", image: "/images/G2LyhBZXwAE-feP.jpg", type: "video", url: "https://youtu.be/2dis3SL4IPQ?si=Fudq-kpJPT3dlJsU" },
    { title: "Live Worship 2024", cat: "Nairobi", image: "/images/12.jpg", type: "image" },
    { title: "Eldoret Chapter", cat: "Eldoret", image: "/images/1759518172292.jpg", type: "image" },
    { title: "Worship Documentary", cat: "Documentary", image: "/images/images (1).jpg", type: "video", url: "https://youtu.be/UHnlOzcbC_w?si=m2vpOlWwQtKYFL8Q" },
];

export default function MediaPage() {
    return (
        <main className="bg-background min-h-screen">
            <Navbar />

            <section className="pt-32 pb-24 px-6">
                <div className="max-container space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-gradient-gold">
                            MEDIA HUB.
                        </h1>
                        <p className="text-gold/60 text-xl font-medium max-w-2xl">
                            The collective memory of a movement. Browse through two decades of worship, rehearsals, and impact stories.
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-wrap gap-4">
                        {categories.map((cat) => (
                            <button key={cat} className="press-scale px-6 py-2 rounded-full glass-card border-gold/10 text-xs font-black uppercase tracking-widest hover:bg-gold hover:text-brown transition-all">
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {galleryItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative aspect-video rounded-ios overflow-hidden glass-card cursor-pointer"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brown via-transparent to-transparent opacity-80" />

                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold/60">{item.cat}</span>
                                            <h3 className="text-xl font-black tracking-tight text-white group-hover:text-gold transition-colors">{item.title}</h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gold text-brown flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            {item.type === 'video' ? <Play size={16} fill="currentColor" /> : <ImageIcon size={16} />}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Video Embed Hub */}
                    <div className="pt-24 space-y-12">
                        <h2 className="text-4xl font-black tracking-tighter flex items-center gap-4">
                            <Youtube className="text-gold" size={32} /> LIVE ARCHIVES
                        </h2>
                        <div className="aspect-video w-full rounded-ios overflow-hidden glass-card border-gold/20">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/CW_qocLAFcw"
                                title="AFLEWO Live"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
