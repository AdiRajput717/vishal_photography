"use client";
import React, { useEffect, useRef } from "react";
import { Play, Volume2, Heart } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * InstagramReels — "Watch The Moments"
 *
 * A single row of vertical (9:16) reel thumbnails on continuous,
 * seamless autoplay. Three things on top of that:
 *   1. Hovering the row pauses the autoplay so a reel can be read.
 *   2. Click-and-drag (mouse or touch) lets you manually scrub
 *      through the reels — dragging past a threshold also cancels
 *      the click-through to Instagram, so a drag never accidentally
 *      fires as a link click.
 *   3. The loop is driven by a single gsap.ticker callback rather
 *      than a tween, so autoplay and manual dragging share one
 *      source of truth (`posRef`) instead of fighting each other.
 *
 * A second, opposite-direction row (rowTwo) was previously defined
 * and partially wired up but never rendered — removed as dead code.
 * Re-add it the same way as row one if you want a second marquee.
 *
 * Fonts: Anton / Playfair Display / Caveat, loaded once globally via
 * next/font in app/layout.tsx.
 * Requires `gsap` in your project: npm install gsap
 */

gsap.registerPlugin(ScrollTrigger);

type Reel = {
    thumbnail: string;
    views: string;
    duration: string;
    caption: string;
};

const rowOne: Reel[] = [
    { thumbnail: "https://picsum.photos/seed/reel-1/450/800", views: "12.4k", duration: "0:34", caption: "Baraat on horseback, Udaipur" },
    { thumbnail: "https://picsum.photos/seed/reel-2/450/800", views: "8.9k", duration: "0:21", caption: "Mehendi in slow motion" },
    { thumbnail: "https://picsum.photos/seed/reel-3/450/800", views: "21.7k", duration: "0:47", caption: "First look, Coorg" },
    { thumbnail: "https://picsum.photos/seed/reel-4/450/800", views: "6.2k", duration: "0:18", caption: "Behind the scenes, golden hour" },
    { thumbnail: "https://picsum.photos/seed/reel-5/450/800", views: "15.1k", duration: "0:29", caption: "Reception entrance, Chennai" },
    { thumbnail: "https://picsum.photos/seed/reel-6/450/800", views: "9.8k", duration: "0:40", caption: "Monsoon nikah, Lonavala" },
];

export default function InstagramReels() {
    const sectionRef = useRef<HTMLElement>(null);
    const rowWrapRef = useRef<HTMLDivElement>(null); // visible row area — hover-to-pause listens here
    const trackRef = useRef<HTMLDivElement>(null); // the doubled, translated strip of cards

    // all drag/autoplay state lives in refs so the ticker callback
    // always reads live values without needing to re-subscribe
    const posRef = useRef(0); // current x translation, px (negative = scrolled left)
    const singleWidthRef = useRef(0); // width of ONE un-duplicated set of cards, px
    const draggingRef = useRef(false);
    const hoveringRef = useRef(false);
    const startXRef = useRef(0);
    const startPosRef = useRef(0);
    const dragDistanceRef = useRef(0);

    // ---- header scroll-reveal, unrelated to the marquee mechanics ----
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".rl-eyebrow, .rl-heading, .rl-follow", {
                y: 24,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out",
                stagger: 0.06,
                scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // ---- the marquee itself: autoplay + hover-pause + drag, one source of truth ----
    useEffect(() => {
        const track = trackRef.current;
        const rowWrap = rowWrapRef.current;
        if (!track || !rowWrap) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // track renders rowOne twice, back to back — half its scrollWidth
        // is exactly the distance of one full, seamless loop
        const measure = () => {
            singleWidthRef.current = track.scrollWidth / 2;
        };
        measure();

        const wrap = (val: number) => {
            const w = singleWidthRef.current || 1;
            return gsap.utils.wrap(-w, 0, val);
        };

        // ---- continuous autoplay ----
        const SPEED = 40; // px per second
        const tick = (_time: number, deltaMs: number) => {
            if (reduceMotion || draggingRef.current || hoveringRef.current) return;
            posRef.current = wrap(posRef.current - SPEED * (deltaMs / 1000));
            gsap.set(track, { x: posRef.current });
        };
        gsap.ticker.add(tick);

        // ---- hover to pause ----
        const handleEnter = () => {
            hoveringRef.current = true;
        };
        const handleLeave = () => {
            hoveringRef.current = false;
        };
        rowWrap.addEventListener("mouseenter", handleEnter);
        rowWrap.addEventListener("mouseleave", handleLeave);

        // ---- click-and-drag to navigate (mouse + touch, via Pointer Events) ----
        const handlePointerDown = (e: PointerEvent) => {
            draggingRef.current = true;
            dragDistanceRef.current = 0;
            startXRef.current = e.clientX;
            startPosRef.current = posRef.current;
            track.setPointerCapture?.(e.pointerId);
            track.style.cursor = "grabbing";
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (!draggingRef.current) return;
            const delta = e.clientX - startXRef.current;
            dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.abs(delta));
            posRef.current = wrap(startPosRef.current + delta);
            gsap.set(track, { x: posRef.current });
        };

        const endDrag = (e: PointerEvent) => {
            draggingRef.current = false;
            track.style.cursor = "grab";
            track.releasePointerCapture?.(e.pointerId);
        };

        track.addEventListener("pointerdown", handlePointerDown);
        track.addEventListener("pointermove", handlePointerMove);
        track.addEventListener("pointerup", endDrag);
        track.addEventListener("pointercancel", endDrag);

        // if the pointer moved more than a few px, treat it as a drag —
        // swallow the click so it doesn't also open the reel's link
        const handleClickCapture = (e: MouseEvent) => {
            if (dragDistanceRef.current > 6) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        track.addEventListener("click", handleClickCapture, true);

        const handleResize = () => measure();
        window.addEventListener("resize", handleResize);

        return () => {
            gsap.ticker.remove(tick);
            rowWrap.removeEventListener("mouseenter", handleEnter);
            rowWrap.removeEventListener("mouseleave", handleLeave);
            track.removeEventListener("pointerdown", handlePointerDown);
            track.removeEventListener("pointermove", handlePointerMove);
            track.removeEventListener("pointerup", endDrag);
            track.removeEventListener("pointercancel", endDrag);
            track.removeEventListener("click", handleClickCapture, true);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const renderReel = (reel: Reel, key: string) => (
        <a
            key={key}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            className="group relative mx-2.5 block h-[300px] w-[168px] shrink-0 select-none overflow-hidden rounded-xl bg-[#e9e2d3] shadow-[0_15px_30px_-12px_rgba(43,36,32,0.4)] sm:h-[360px] sm:w-[202px]"
        >
            <img
                src={reel.thumbnail}
                alt={reel.caption}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B2420]/80 via-[#2B2420]/0 to-[#2B2420]/10" />

            {/* play icon, always visible — these are reels, not static posts */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#2B2420] shadow-md">
                    <Play className="ml-0.5 h-4 w-4 fill-current" />
                </span>
            </div>

            {/* duration badge */}
            <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                {reel.duration}
            </span>

            {/* views + caption */}
            <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="font-serif line-clamp-2 text-xs italic text-[#F4F1EA] sm:text-[13px]">
                    {reel.caption}
                </p>
                <div className="mt-1.5 flex items-center gap-1 text-[#F4F1EA]/90">
                    <Heart className="h-3 w-3 fill-current" />
                    <span className="text-[11px] font-semibold">{reel.views}</span>
                </div>
            </div>

            {/* muted-sound icon, small realism touch */}
            <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                <Volume2 className="h-3 w-3" />
            </span>
        </a>
    );

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#2B2420] py-24"
        >
            <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
                {/* header */}
                <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
                    <div>
                        <p className="rl-eyebrow mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#C9922E]">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9922E]" />
                            Reels
                        </p>
                        <h2 className="rl-heading font-display text-5xl uppercase leading-[0.95] text-[#F4F1EA] sm:text-6xl">
                            Watch The Moments
                        </h2>
                        <p className="font-caption mt-2 text-2xl text-[#C9922E]">
                            @vishal.photography
                        </p>
                    </div>

                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rl-follow flex shrink-0 items-center gap-2 rounded-md bg-[#7C2331] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#661c28]"
                    >
                        <FaInstagram className="h-4 w-4" />
                        Follow on Instagram
                    </a>
                </div>
            </div>

            {/* ---- row, autoplay + hover-pause + drag-to-navigate, full-bleed ---- */}
            <div ref={rowWrapRef} className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#2B2420] to-transparent sm:w-32" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#2B2420] to-transparent sm:w-32" />
                <div className="overflow-hidden">
                    <div
                        ref={trackRef}
                        className="flex w-max cursor-grab touch-pan-y"
                        style={{ touchAction: "pan-y" }}
                    >
                        {rowOne.map((r, i) => renderReel(r, `r1-a-${i}`))}
                        {rowOne.map((r, i) => renderReel(r, `r1-b-${i}`))}
                    </div>
                </div>
            </div>
        </section>
    );
}