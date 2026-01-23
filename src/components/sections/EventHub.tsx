"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Calendar as CalendarIcon, Clock, Bell, Plus, ExternalLink, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";

const events = [
    {
        title: "Eldoret Auditions",
        date: "Feb 15, 2026",
        start: "20260215T090000Z",
        end: "20260215T170000Z",
        time: "09:00 AM",
        type: "Audition",
        chapter: "Eldoret",
        location: "Eldoret Regional Hub"
    },
    {
        title: "Nakuru Rehearsals",
        date: "Mar 02, 2026",
        start: "20260302T170000Z",
        end: "20260302T200000Z",
        time: "05:00 PM",
        type: "Rehearsal",
        chapter: "Nakuru",
        location: "Deliverance Church"
    },
    {
        title: "Mombasa Prayer Circle",
        date: "Every Night",
        start: "20260123T210000Z",
        end: "20260123T220000Z",
        time: "09:00 PM",
        type: "Zoom",
        chapter: "Mombasa",
        location: "Zoom Virtual Altar"
    },
    {
        title: "Nairobi Pre-Launch",
        date: "Apr 10, 2026",
        start: "20260410T180000Z",
        end: "20260410T220000Z",
        time: "06:00 PM",
        type: "Event",
        chapter: "Nairobi",
        location: "Winners' Chapel International"
    },
];

export default function EventHub() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [timeLeft, setTimeLeft] = useState({ days: 42, hours: 12, mins: 59, secs: 59 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
                if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
                return prev;
            });
        }, 1000);

        const ctx = gsap.context(() => {
            gsap.from(".hub-panel", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
                y: 60,
                opacity: 0,
                stagger: 0.2,
                duration: 1.2,
                ease: "power4.out"
            });
        }, sectionRef);

        return () => {
            clearInterval(timer);
            ctx.revert();
        };
    }, []);

    const addToGoogleCalendar = (event: typeof events[0]) => {
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.type + " for AFLEWO " + event.chapter)}&location=${encodeURIComponent(event.location)}`;
        window.open(url, '_blank');
    };

    const downloadICS = (event: typeof events[0]) => {
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.type} for AFLEWO ${event.chapter}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const TimeUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center gap-2">
            <div className="relative glass-card-elevated w-20 h-24 md:w-28 md:h-32 flex items-center justify-center rounded-2xl border-white/10 group overflow-hidden">
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-4xl md:text-6xl font-black text-white group-hover:text-gold transition-colors">
                    {value.toString().padStart(2, '0')}
                </span>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{label}</span>
        </div>
    );

    return (
        <section ref={sectionRef} className="section-padding bg-background relative overflow-hidden" id="events">
            <div className="max-container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Event Calendar Panel */}
                    <div className="lg:col-span-7 hub-panel glass-card-elevated p-8 md:p-12 rounded-[3rem] border-white/5">
                        <div className="flex justify-between items-center mb-12">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black tracking-tighter">THE CALENDAR.</h2>
                                <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest italic">Sync with your prophetic journey</p>
                            </div>
                            <button className="p-4 rounded-full glass-card hover:bg-gold hover:text-brown transition-all border-white/10 group">
                                <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {events.map((event, i) => (
                                <div key={i} className="group flex flex-col md:flex-row md:items-center justify-between p-6 glass-card rounded-2xl hover:border-gold/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex flex-col items-center justify-center text-gold border border-gold/20">
                                            <span className="text-lg font-black leading-none">{event.date.split(' ')[1].replace(',', '')}</span>
                                            <span className="text-[8px] font-black uppercase">{event.date.split(' ')[0]}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-bold tracking-tight text-white group-hover:text-gold transition-colors">{event.title}</h4>
                                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/30">
                                                <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                                                <span className="flex items-center gap-1"><MapPin size={12} /> {event.chapter}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex gap-3">
                                        <button
                                            onClick={() => downloadICS(event)}
                                            className="flex-1 md:flex-none px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                                        >
                                            Sync iCloud
                                        </button>
                                        <button
                                            onClick={() => addToGoogleCalendar(event)}
                                            className="flex-1 md:flex-none px-6 py-3 rounded-full bg-gold text-brown text-[8px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
                                        >
                                            Google Cal
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                            <span>* All times in East Africa Time (EAT)</span>
                            <Link href="#" className="flex items-center gap-2 text-gold/60 hover:text-gold transition-colors">
                                View Full 2026 Roadmap <ExternalLink size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Countdown Panel */}
                    <div className="lg:col-span-5 hub-panel h-full flex flex-col gap-6">
                        <div className="flex-1 glass-card-elevated p-10 md:p-12 rounded-[3rem] border-white/5 relative overflow-hidden flex flex-col justify-center text-center">
                            <div className="absolute top-0 right-0 p-8">
                                <Sparkles className="text-gold animate-pulse" />
                            </div>

                            <div className="space-y-12 relative z-10">
                                <div className="space-y-4">
                                    <span className="text-gold font-black uppercase tracking-[0.4em] text-xs">Prophetic Countdown</span>
                                    <h2 className="text-4xl font-black tracking-tighter">THE NEXT ALTAR.</h2>
                                    <p className="text-foreground/40 text-xs font-medium max-w-[250px] mx-auto">Registration for Eldoret & Nakuru 2026 ends in:</p>
                                </div>

                                <div className="flex justify-center gap-2 md:gap-4">
                                    <TimeUnit value={timeLeft.days} label="Days" />
                                    <TimeUnit value={timeLeft.hours} label="Hours" />
                                    <TimeUnit value={timeLeft.mins} label="Mins" />
                                    <TimeUnit value={timeLeft.secs} label="Secs" />
                                </div>

                                <button className="press-scale w-full py-5 rounded-full bg-white text-brown font-black uppercase tracking-tighter hover:bg-gold transition-all shadow-glow">
                                    Register Now
                                </button>
                            </div>

                            {/* Decorative Grid */}
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                        </div>

                        <div className="glass-card p-8 rounded-[2rem] border-white/5 flex items-center justify-between group cursor-pointer hover:border-gold/30 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-gold/10 text-gold group-hover:scale-110 transition-transform">
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-white">Alerts On</h4>
                                    <p className="text-[10px] text-white/40 font-medium">Notify me for Dar es Salaam 2026</p>
                                </div>
                            </div>
                            <div className="w-12 h-6 rounded-full bg-gold p-1 flex items-center justify-end">
                                <div className="w-4 h-4 rounded-full bg-white" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
