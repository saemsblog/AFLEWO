"use client";

import Link from "next/link";
import { Instagram, Twitter, Youtube, Facebook, ArrowUpRight } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brown pt-24 pb-12 px-6 border-t border-gold/10">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
                    {/* Logo & Vision */}
                    <div className="md:col-span-5 space-y-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center font-black text-brown">
                                A
                            </div>
                            <span className="font-black text-2xl tracking-tighter text-foreground">AFLEWO</span>
                        </Link>
                        <p className="text-gold/60 text-xl font-medium leading-relaxed">
                            Igniting and uniting Africa through worship. One God, one people, one Africa. Deploying digital resilience for the sound of heaven.
                        </p>
                        <div className="flex gap-4">
                            <button className="p-3 glass-card rounded-ios text-gold hover:bg-gold hover:text-brown transition-all"><Instagram size={20} /></button>
                            <button className="p-3 glass-card rounded-ios text-gold hover:bg-gold hover:text-brown transition-all"><Twitter size={20} /></button>
                            <button className="p-3 glass-card rounded-ios text-gold hover:bg-gold hover:text-brown transition-all"><Youtube size={20} /></button>
                            <button className="p-3 glass-card rounded-ios text-gold hover:bg-gold hover:text-brown transition-all"><Facebook size={20} /></button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="font-black text-gold uppercase tracking-widest text-xs">Explore</h4>
                        <ul className="space-y-4 text-foreground/70 font-bold">
                            <li><Link href="#hero" className="hover:text-gold transition-all">Archives</Link></li>
                            <li><Link href="#about" className="hover:text-gold transition-all">Timeline</Link></li>
                            <li><Link href="#music" className="hover:text-gold transition-all">Music</Link></li>
                            <li><Link href="#events" className="hover:text-gold transition-all">Events</Link></li>
                        </ul>
                    </div>

                    {/* Chapters */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="font-black text-gold uppercase tracking-widest text-xs">Chapters</h4>
                        <ul className="space-y-4 text-foreground/70 font-bold">
                            <li><Link href="#" className="hover:text-gold transition-all">Nairobi</Link></li>
                            <li><Link href="#" className="hover:text-gold transition-all">Mombasa</Link></li>
                            <li><Link href="#" className="hover:text-gold transition-all">Kampala</Link></li>
                            <li><Link href="#" className="hover:text-gold transition-all">Kigali</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="md:col-span-3 space-y-6">
                        <h4 className="font-black text-gold uppercase tracking-widest text-xs">Stay Connected</h4>
                        <div className="space-y-4">
                            <p className="text-sm text-gold/60 font-medium">Join 10k+ worshippers receiving monthly updates.</p>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="email@africa.com"
                                    className="w-full bg-background/20 border-gold/10 rounded-ios py-3 pl-4 pr-12 text-sm focus:ring-1 focus:ring-gold outline-none"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gold hover:scale-110 transition-transform">
                                    <ArrowUpRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gold/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gold/30">
                    <div>© {currentYear} AFLEWO Digital • Nairobi, Kenya</div>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-gold">Privacy Policy</Link>
                        <Link href="#" className="hover:text-gold">Terms of Worship</Link>
                        <Link href="#" className="hover:text-gold">Mailing List</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
