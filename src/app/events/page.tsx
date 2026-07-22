"use client";

import { events, parseEventDate, AFLEWOEvent } from "@/lib/events";
import { chapters } from "@/lib/chapters";
import Footer from "@/components/Footer";
import Link from "next/link";
import SvgIcon from "@/components/ui/SvgIcon";
import FlipClockCountdown from "@/components/ui/FlipClock";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ─── Spring presets (Apple Design — damping 1.0 = critically damped, no overshoot) ──
const SPRING = { type: "spring", stiffness: 360, damping: 36, mass: 0.85 } as const;
const SPRING_SLOW = { type: "spring", stiffness: 260, damping: 32, mass: 1.0 } as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const EVENT_TYPES = ["All", "Rehearsal", "Audition", "Mission", "Commissioning", "Training", "Event", "Meeting"];
const CHAPTER_NAMES = ["All Chapters", ...Array.from(new Set(events.map((e) => e.chapter))).sort()];
const FLAGSHIP_DATE = new Date("2026-10-02T18:00:00+03:00");

function getTypeStyle(type: string) {
    switch (type) {
        case "Audition":      return { pill: "bg-purple-500/12 text-purple-300 border-purple-500/20", dot: "bg-purple-400" };
        case "Rehearsal":     return { pill: "bg-blue-500/12 text-blue-300 border-blue-500/20", dot: "bg-blue-400" };
        case "Mission":       return { pill: "bg-emerald-500/12 text-emerald-300 border-emerald-500/20", dot: "bg-emerald-400" };
        case "Commissioning": return { pill: "bg-yellow-500/12 text-yellow-300 border-yellow-500/20", dot: "bg-yellow-400" };
        case "Training":      return { pill: "bg-orange-500/12 text-orange-300 border-orange-500/20", dot: "bg-orange-400" };
        case "Event":         return { pill: "bg-pink-500/12 text-pink-300 border-pink-500/20", dot: "bg-pink-400" };
        default:              return { pill: "bg-white/5 text-white/40 border-white/10", dot: "bg-white/30" };
    }
}

function getChapterSlug(name: string): string {
    return chapters.find((c) => c.name.toLowerCase() === name.toLowerCase())?.slug ?? name.toLowerCase();
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ event, past, delay = 0 }: { event: AFLEWOEvent; past: boolean; delay?: number }) {
    const shouldReduceMotion = useReducedMotion();
    const s = getTypeStyle(event.type);

    const handleAddToCalendar = () => {
        if (!event.start || !event.end) return;
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("AFLEWO: " + event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description ?? "")}&location=${encodeURIComponent(event.location)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <motion.div
            layoutId={`event-${event.id}`}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={shouldReduceMotion ? { duration: 0.18 } : { ...SPRING_SLOW, delay }}
            whileHover={past ? {} : { y: -4 }}
            className={`group relative rounded-[1.75rem] border overflow-hidden flex flex-col ${past ? "border-white/4 opacity-45" : "border-white/6"}`}
            style={{ background: "rgba(255,255,255,0.018)", backdropFilter: "blur(20px) saturate(160%)" }}
        >
            {/* Accent stripe */}
            <div className={`h-[3px] w-full ${past ? "bg-white/8" : "bg-gradient-to-r from-gold/60 via-gold/30 to-transparent"}`} />

            {/* Hover ambient */}
            <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/4 transition-colors duration-500 pointer-events-none" />

            <div className="p-6 flex flex-col gap-4 flex-1 relative z-10">
                {/* Type + live */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${s.pill}`}>
                            {event.type}
                        </span>
                        {event.isLive && (
                            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] bg-red-500/12 border border-red-500/20 text-red-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                Live
                            </span>
                        )}
                        {past && (
                            <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] bg-white/4 border border-white/8 text-white/30">
                                Past
                            </span>
                        )}
                    </div>
                    {event.visibility === "member" && (
                        <SvgIcon name="lock" size={13} className="text-white/18 shrink-0 mt-0.5" />
                    )}
                </div>

                {/* Date display */}
                <div className="space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gold/60">{event.chapter}</p>
                    <p className="text-[2.2rem] font-black tracking-tighter text-white leading-none tabular-nums">
                        {event.date === "TBD" ? "TBD" : event.time}
                    </p>
                    <p className="text-[9px] font-bold text-white/35 uppercase tracking-[0.25em]">{event.date}</p>
                </div>

                {/* Title */}
                <div>
                    <h3 className="text-[15px] font-black tracking-tight text-white leading-snug group-hover:text-gold transition-colors duration-300">
                        {event.title}
                    </h3>
                    {(event.description ?? event.location) && (
                        <p className="text-white/35 text-[10px] font-medium mt-1.5 leading-relaxed line-clamp-2">
                            {event.description ?? event.location}
                        </p>
                    )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-white/30">
                    <SvgIcon name="location_on" size={12} className="text-gold/40 shrink-0" />
                    <span className="text-[9px] font-bold tracking-wide truncate">{event.location}</span>
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2 flex-wrap pt-3 border-t border-white/4">
                    <Link
                        href={`/chapters/${getChapterSlug(event.chapter)}`}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white/4 hover:bg-gold/10 border border-white/4 hover:border-gold/20 text-white/40 hover:text-gold text-[8px] font-black uppercase tracking-[0.18em] active:scale-95 transition-all"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        <SvgIcon name="groups" size={10} />
                        Chapter
                    </Link>
                    <Link
                        href={`/media?chapter=${encodeURIComponent(event.chapter)}`}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white/4 hover:bg-white/8 border border-white/4 text-white/30 hover:text-white/60 text-[8px] font-black uppercase tracking-[0.18em] active:scale-95 transition-all"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        <SvgIcon name="photo_library" size={10} />
                        Archive
                    </Link>
                    {event.start && !past && (
                        <button
                            onClick={handleAddToCalendar}
                            className="ml-auto inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-gold/10 hover:bg-gold border border-gold/18 hover:border-gold text-gold hover:text-brown text-[8px] font-black uppercase tracking-[0.18em] active:scale-95 transition-all"
                            style={{ WebkitTapHighlightColor: "transparent" }}
                            title="Add to Google Calendar"
                        >
                            <SvgIcon name="event" size={10} />
                            + Cal
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Flagship Countdown Banner ─────────────────────────────────────────────────
function FlagshipCountdown() {
    const [diff, setDiff] = useState(FLAGSHIP_DATE.getTime() - Date.now());

    useEffect(() => {
        const id = setInterval(() => setDiff(Math.max(0, FLAGSHIP_DATE.getTime() - Date.now())), 1000);
        return () => clearInterval(id);
    }, []);

    if (diff <= 0) return null;

    return (
        <div
            className="rounded-[1.75rem] border border-white/5 relative overflow-hidden"
            style={{
                background: "rgba(20,16,12,0.9)",
                backdropFilter: "blur(24px) saturate(160%)",
            }}
        >
            {/* Ambient glow centered */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none" />

            <div className="relative z-10 p-10 md:p-14 flex flex-col items-center text-center">
                
                {/* ── Titles ── */}
                <div className="space-y-3 mb-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold/80">
                        Next Event Countdown
                    </span>
                    <h2
                        className="font-black tracking-tighter leading-[0.9] text-white"
                        style={{ fontSize: "clamp(2rem,4vw,3.5rem)", letterSpacing: "-0.04em" }}
                    >
                        Alumni Connect
                    </h2>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.25em]">
                        Nairobi · Aug 07, 2026
                    </p>
                </div>

                {/* ── FlipClock ── */}
                <div className="mb-12">
                    <FlipClockCountdown targetDate={new Date("2026-08-07T18:00:00+03:00")} />
                </div>

                {/* ── Full width button ── */}
                <Link
                    href="/join"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gold text-brown rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:brightness-110 transition-all active:scale-[0.99] shadow-[0_4px_24px_rgba(212,175,55,0.15)]"
                >
                    <SvgIcon name="check_circle" size={16} />
                    Register Now
                </Link>
            </div>
        </div>
    );
}

// ─── Inner page (uses useSearchParams — requires Suspense) ────────────────────
function EventsInner() {
    const shouldReduceMotion = useReducedMotion();
    const searchParams = useSearchParams();
    const defaultChapter = searchParams.get("chapter") ?? "All Chapters";

    const [typeFilter, setTypeFilter] = useState("All");
    const [chapterFilter, setChapterFilter] = useState(defaultChapter);
    const [showPast, setShowPast] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const { upcoming, past } = useMemo(() => {
        if (!mounted) return { upcoming: [], past: [] };
        const now = new Date();
        const sorted = [...events].sort((a, b) => {
            const da = parseEventDate(a.date);
            const db = parseEventDate(b.date);
            if (!da) return 1;
            if (!db) return -1;
            return da.getTime() - db.getTime();
        });
        const matchFilter = (e: AFLEWOEvent) =>
            (typeFilter === "All" || e.type === typeFilter) &&
            (chapterFilter === "All Chapters" || e.chapter === chapterFilter);
        const u: AFLEWOEvent[] = [];
        const p: AFLEWOEvent[] = [];
        sorted.forEach((e) => {
            if (!matchFilter(e)) return;
            const d = parseEventDate(e.date);
            if (!d || d >= now) u.push(e);
            else p.push(e);
        });
        return { upcoming: u, past: p.reverse() };
    }, [typeFilter, chapterFilter, mounted]);

    const stagger = (i: number) => shouldReduceMotion ? { duration: 0.15 } : { ...SPRING_SLOW, delay: i * 0.045 };

    return (
        <>
            {/* ── Sticky filter bar ── */}
            <motion.section
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.25 }}
                className="px-6 pt-5 pb-4 sticky top-0 z-30 border-b border-white/4"
                style={{ background: "rgba(10,8,6,0.8)", backdropFilter: "blur(28px) saturate(180%)" }}
            >
                <div className="max-container flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    {/* Type filter */}
                    <div className="flex overflow-x-auto hide-scrollbar gap-1 p-1 rounded-full border border-white/5 bg-white/2">
                        {EVENT_TYPES.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTypeFilter(t)}
                                className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.18em] transition-all whitespace-nowrap ${typeFilter === t ? "bg-gold text-brown shadow-[0_0_12px_rgba(212,175,55,0.35)]" : "text-white/35 hover:text-white hover:bg-white/5"}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Chapter filter */}
                    <div className="flex overflow-x-auto hide-scrollbar gap-1 p-1 rounded-full border border-white/5 bg-white/2">
                        {CHAPTER_NAMES.map((c) => (
                            <button
                                key={c}
                                onClick={() => setChapterFilter(c)}
                                className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.18em] transition-all whitespace-nowrap ${chapterFilter === c ? "bg-white/15 text-white border border-white/8" : "text-white/25 hover:text-white hover:bg-white/5 border border-transparent"}`}
                            >
                                {c === "All Chapters" ? "All" : c}
                            </button>
                        ))}
                    </div>

                    {/* Past toggle */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        transition={SPRING}
                        onClick={() => setShowPast((v) => !v)}
                        className={`ml-auto shrink-0 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.18em] border transition-all ${showPast ? "bg-white/8 border-white/15 text-white/60" : "border-white/6 text-white/25 hover:text-white/45"}`}
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        {showPast ? "Hide Past" : "Show Past"}
                    </motion.button>
                </div>

                {/* Count line */}
                <div className="max-container mt-2.5 flex items-center gap-3">
                    <div className="h-px bg-white/8 flex-1" />
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
                        {upcoming.length} upcoming · {past.length} past
                    </p>
                    <div className="h-px bg-white/8 flex-1" />
                </div>
            </motion.section>

            {/* ── Upcoming events grid ── */}
            <section className="px-6 py-14 min-h-[50vh]">
                <div className="max-container space-y-8">
                    <motion.div
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={stagger(0)}
                        className="flex items-center gap-3"
                    >
                        <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] animate-pulse" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/70">Upcoming Events</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gold/15 to-transparent" />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {upcoming.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={SPRING}
                                className="text-center py-28 space-y-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/4 border border-white/8 flex items-center justify-center mx-auto">
                                    <SvgIcon name="event_busy" size={28} className="text-white/18" />
                                </div>
                                <p className="text-white/25 font-black uppercase tracking-[0.2em] text-[10px]">No upcoming events for this filter</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="grid"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                            >
                                {upcoming.map((ev, i) => (
                                    <EventCard key={ev.id} event={ev} past={false} delay={i * 0.045} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* ── Past events ── */}
            <AnimatePresence>
                {showPast && past.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={SPRING}
                        className="px-6 pb-20 overflow-hidden"
                    >
                        <div className="max-container space-y-8">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-white/15" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Past Events</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-white/8 to-transparent" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {past.map((ev, i) => (
                                    <EventCard key={ev.id} event={ev} past={true} delay={i * 0.03} />
                                ))}
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EventsPage() {
    const shouldReduceMotion = useReducedMotion();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const totalEvents = events.length;
    const upcomingCount = mounted
        ? events.filter((e) => { const d = parseEventDate(e.date); return d && d >= new Date(); }).length
        : "—";
    const chapterCount = new Set(events.map((e) => e.chapter)).size;

    const stagger = (i: number) => shouldReduceMotion ? { duration: 0.15 } : { ...SPRING_SLOW, delay: i * 0.07 };

    return (
        <main className="bg-background min-h-screen">
            {/* ── Hero header ── */}
            <section className="pt-36 pb-14 px-6 border-b border-white/4 relative overflow-hidden">
                {/* Ambient glows */}
                <div className="absolute top-[-25%] right-[5%] w-[600px] h-[500px] rounded-full bg-gold/4 blur-[140px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[15%] w-[400px] h-[300px] rounded-full bg-purple-500/4 blur-[110px] pointer-events-none" />

                <div className="max-container relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        {/* Title block */}
                        <motion.div
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={stagger(0)}
                            className="space-y-4"
                        >
                            <span className="inline-block text-gold font-black uppercase tracking-[0.4em] text-[9px]">
                                2026 Season Calendar
                            </span>
                            <h1
                                className="font-black tracking-tighter leading-[0.85] text-white"
                                style={{ fontSize: "clamp(3rem,9vw,7rem)" }}
                            >
                                IT'S ALL<br />
                                ABOUT <span className="text-gold">EVENTS.</span>
                            </h1>
                            <p className="text-white/35 max-w-md font-bold text-[10px] uppercase tracking-[0.2em] leading-relaxed pt-1">
                                {upcomingCount} upcoming events across {chapterCount} chapters — rehearsals, auditions, missions, and worship nights.
                            </p>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={stagger(1)}
                            className="grid grid-cols-3 gap-3 shrink-0"
                        >
                            {[
                                { label: "Total Events", value: `${totalEvents}` },
                                { label: "Upcoming", value: `${upcomingCount}` },
                                { label: "Chapters", value: `${chapterCount}` },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    className="p-5 rounded-[1.5rem] border border-white/5 text-center"
                                    style={{ background: "rgba(255,255,255,0.018)", backdropFilter: "blur(16px)" }}
                                >
                                    <p className="text-3xl font-black text-gold tracking-tight">{s.value}</p>
                                    <p className="text-[8px] font-black uppercase tracking-[0.22em] text-white/25 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Nav links */}
                    <motion.div
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={stagger(2)}
                        className="mt-10 flex flex-wrap gap-3"
                    >
                        {[
                            { href: "/chapters", icon: "groups", label: "All Chapters" },
                            { href: "/media", icon: "photo_library", label: "Media Archive" },
                        ].map(({ href, icon, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/5 hover:border-gold/25 hover:bg-white/4 text-white/40 hover:text-gold text-[9px] font-black uppercase tracking-[0.18em] active:scale-95 transition-all"
                                style={{ background: "rgba(255,255,255,0.018)", backdropFilter: "blur(12px)" }}
                            >
                                <SvgIcon name={icon} size={13} /> {label}
                            </Link>
                        ))}
                        <Link
                            href="/join"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gold text-brown rounded-xl text-[9px] font-black uppercase tracking-[0.18em] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.12)]"
                        >
                            <SvgIcon name="group_add" size={13} /> Join the Movement
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── Flagship Flip-Clock Countdown ── */}
            <section className="px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={stagger(3)}
                    className="max-container"
                >
                    <FlagshipCountdown />
                </motion.div>
            </section>

            {/* ── Filtered event list (needs Suspense for useSearchParams) ── */}
            <Suspense
                fallback={
                    <div className="flex items-center justify-center py-40">
                        <SvgIcon name="sync" size={36} className="text-gold/30 animate-spin" />
                    </div>
                }
            >
                <EventsInner />
            </Suspense>

            {/* ── CTA ── */}
            <section className="px-6 py-20 border-t border-white/4 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-[500px] h-[250px] bg-gold/4 blur-[120px] pointer-events-none rounded-tl-[100%]" />
                <div className="max-container relative z-10">
                    <div
                        className="rounded-[2rem] border border-gold/12 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10"
                        style={{
                            background: "linear-gradient(135deg, rgba(212,175,55,0.07) 0%, rgba(212,175,55,0.01) 100%)",
                            backdropFilter: "blur(24px)",
                        }}
                    >
                        <div className="space-y-4 text-center md:text-left">
                            <span className="inline-block text-gold font-black uppercase tracking-[0.4em] text-[9px]">Be Part of Something Eternal</span>
                            <h2
                                className="font-black tracking-tighter leading-none text-white"
                                style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}
                            >
                                JOIN THE<br />
                                <span className="text-gold">MOVEMENT.</span>
                            </h2>
                            <p className="text-white/35 max-w-sm font-bold text-[10px] uppercase tracking-[0.18em] leading-relaxed">
                                Register for auditions across Choir, Band, Media, Ushering, Security, and Dance at any chapter near you.
                            </p>
                        </div>
                        <div className="flex flex-col w-full md:w-auto gap-3 shrink-0">
                            <Link
                                href="/join"
                                className="flex items-center justify-center gap-2.5 px-9 py-4.5 bg-gold text-brown rounded-xl font-black text-[10px] uppercase tracking-[0.18em] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_24px_rgba(212,175,55,0.2)]"
                            >
                                <SvgIcon name="group_add" size={16} /> Join Now
                            </Link>
                            <Link
                                href="/chapters"
                                className="flex items-center justify-center gap-2.5 px-9 py-4.5 rounded-xl border border-gold/18 text-gold font-black text-[10px] uppercase tracking-[0.18em] hover:bg-gold/8 active:scale-95 transition-all"
                                style={{ background: "rgba(212,175,55,0.03)" }}
                            >
                                <SvgIcon name="groups" size={16} /> Browse Chapters
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
