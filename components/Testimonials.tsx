"use client";
import React, { useEffect, useRef } from "react";
import { Quote, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Testimonials — "Kind Words"
 *
 * One large featured quote up top (scroll reveal, like the other
 * sections), followed by a horizontal marquee of shorter reviews
 * that scrolls continuously on its own — the one place on the page
 * with motion that isn't scroll-driven, which makes the section feel
 * alive even if the visitor never scrolls past the fold. The marquee
 * pauses on hover so people can actually read a card that catches
 * their eye.
 *
 * Fonts: Anton / Playfair Display / Caveat, loaded once globally via
 * next/font in app/layout.tsx.
 * Requires `gsap` in your project: npm install gsap
 */

gsap.registerPlugin(ScrollTrigger);

type Review = {
    couple: string;
    location: string;
    quote: string;
    photo: string;
};

const featured: Review = {
    couple: "Ananya & Rohan",
    location: "Udaipur wedding, Nov 2025",
    quote:
        "We handed Vishal three days and zero instructions, and got back a story we didn't know we were living while it happened. Every photo feels like a memory we forgot we had — not a picture someone told us to take.",
    photo: "https://picsum.photos/seed/review-featured/300/300",
};

const reviews: Review[] = [
    {
        couple: "Meera & Aditya",
        location: "Coorg, Feb 2026",
        quote:
            "He disappeared into the background so completely that my grandmother forgot he was there — and that's exactly why the photos of her are the ones I cry looking at.",
        photo: "https://picsum.photos/seed/review-1/200/200",
    },
    {
        couple: "Priya & Karthik",
        location: "Chennai, Aug 2025",
        quote:
            "Five days of rituals and he never once asked us to redo a moment for the camera. Every single photo actually happened.",
        photo: "https://picsum.photos/seed/review-2/200/200",
    },
    {
        couple: "Sana & Farhan",
        location: "Lonavala, May 2026",
        quote:
            "The rain ruined our outdoor plans and somehow made the photos better. He just adapted and kept shooting like it was always the plan.",
        photo: "https://picsum.photos/seed/review-3/200/200",
    },
    {
        couple: "Ritika & Dev",
        location: "Jaipur, Dec 2025",
        quote:
            "Our families are loud and chaotic and he captured that instead of fighting it. The gallery feels like us, not like a template.",
        photo: "https://picsum.photos/seed/review-4/200/200",
    },
    {
        couple: "Ishaan & Naina",
        location: "Goa, Jan 2026",
        quote:
            "Same-day highlight reel had guests crying at our own reception. Still not sure how he edited that fast without it looking rushed.",
        photo: "https://picsum.photos/seed/review-5/200/200",
    },
    {
        couple: "Kavya & Arjun",
        location: "Mysore, Oct 2025",
        quote:
            "We almost skipped a photographer to save budget. Genuinely the one vendor decision I'd never change.",
        photo: "https://picsum.photos/seed/review-6/200/200",
    },
];

export default function Testimonials() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const marqueeTween = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const ctx = gsap.context(() => {
            // ---- header + featured quote reveal ----
            gsap.from(".tm-eyebrow, .tm-heading, .tm-featured", {
                y: 26,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.1,
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
            });

            if (reduceMotion || !trackRef.current) return;

            // ---- infinite marquee ----
            // track is rendered twice back-to-back; animate exactly -50%
            // then snap back to 0, so the loop is seamless
            const track = trackRef.current;
            marqueeTween.current = gsap.to(track, {
                xPercent: -50,
                duration: 38,
                ease: "none",
                repeat: -1,
            });

            // pause the loop on hover / touch so reviews are readable
            const pause = () => marqueeTween.current?.pause();
            const resume = () => marqueeTween.current?.play();
            track.addEventListener("mouseenter", pause);
            track.addEventListener("mouseleave", resume);

            return () => {
                track.removeEventListener("mouseenter", pause);
                track.removeEventListener("mouseleave", resume);
            };
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const renderCard = (review: Review, key: string) => (
        <div
            key={key}
            className="mx-4 flex w-[320px] shrink-0 flex-col rounded-lg border border-[#2B2420]/10 bg-white p-6 shadow-[0_10px_25px_-15px_rgba(43,36,32,0.3)] sm:w-[360px]"
        >
            <div className="flex items-center gap-1 text-[#C9922E]">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
            </div>
            <p className="font-serif mt-4 flex-1 text-[15px] italic leading-relaxed text-[#4a423b]">
                “{review.quote}”
            </p>
            <div className="mt-5 flex items-center gap-3 border-t border-[#2B2420]/10 pt-4">
                <img
                    src={review.photo}
                    alt={review.couple}
                    className="h-10 w-10 rounded-full object-cover"
                    loading="lazy"
                />
                <div>
                    <p className="font-serif text-sm font-semibold text-[#2B2420]">
                        {review.couple}
                    </p>
                    <p className="text-xs text-[#6b6156]">{review.location}</p>
                </div>
            </div>
        </div>
    );

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#FAF6EE] py-4"
        >
                  <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
                {/* header */}
                <div className="mb-14 max-w-2xl">
                    <p className="tm-eyebrow mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#7C2331]">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9922E]" />
                        Testimonials
                    </p>
                    <h2 className="tm-heading font-display text-5xl uppercase leading-[0.95] text-[#2B2420] sm:text-6xl md:text-7xl">
                        Kind Words
                    </h2>
                </div>

                {/* featured quote */}
                <div className="tm-featured relative mb-16 max-w-3xl rounded-lg bg-[#2B2420] p-8 sm:p-12">
                    <Quote className="h-8 w-8 text-[#C9922E]/40" />
                    <p className="font-serif mt-4 text-xl italic leading-relaxed text-[#F4F1EA] sm:text-2xl">
                        “{featured.quote}”
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                        <img
                            src={featured.photo}
                            alt={featured.couple}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-[#C9922E]/40"
                            loading="lazy"
                        />
                        <div>
                            <p className="font-serif font-semibold text-[#F4F1EA]">
                                {featured.couple}
                            </p>
                            <p className="font-caption text-lg text-[#C9922E]">
                                {featured.location}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* ---- marquee, full-bleed ---- */}
            <div className="relative">
                {/* edge fades so cards don't hard-cut against the page background */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAF6EE] to-transparent sm:w-32" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAF6EE] to-transparent sm:w-32" />

                <div className="overflow-hidden">
                    <div ref={trackRef} className="flex w-max py-2">
                        {/* rendered twice, back to back, for a seamless -50% loop */}
                        {reviews.map((r, i) => renderCard(r, `a-${i}`))}
                        {reviews.map((r, i) => renderCard(r, `b-${i}`))}
                    </div>
                </div>
            </div>
        </section>
    );
}