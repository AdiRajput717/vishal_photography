"use client";

import React, { useEffect, useRef } from "react";
import { Camera, Heart, Plane, BookImage, Clapperboard, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * ServicesSection — "The Collections"
 * Built to sit under the Marigold & Co. hero. Reuses the same
 * language: cream ground, maroon + gold accents, a bold condensed
 * display face for headlines, and hand-set polaroids (tilted,
 * taped, captioned) as the recurring visual signature.
 *
 * Fonts: Anton / Playfair Display / Caveat, loaded once globally via
 * next/font in app/layout.tsx.
 * Loaded via Google Fonts import below — remove if your app already
 * loads these globally.
 *
 * Motion (GSAP):
 *  - Header + polaroids + feature strip reveal on scroll (ScrollTrigger).
 *  - Polaroids settle into their tilt from flat/scattered — like being
 *    laid down on a table one at a time.
 *  - Each polaroid tracks the cursor for a subtle 3D tilt (interactive,
 *    not scroll-based) and lifts on hover.
 *  - CTA buttons have a small magnetic pull toward the cursor.
 *  - Respects prefers-reduced-motion throughout.
 *
 * Requires `gsap` in your project: npm install gsap
 */

gsap.registerPlugin(ScrollTrigger);

type Service = {
    title: string;
    caption: string;
    description: string;
    image: string;
    rotate: number;
    icon: React.ReactNode;
};

const services: Service[] = [
    {
        title: "Wedding Day",
        caption: "the main event",
        description:
            "Full-day coverage from the first cup of chai to the last dance — every ritual, reaction and in-between moment, told in order.",
        image: "/images/services/1.jpg",
        rotate: -3,
        icon: <Heart className="h-4 w-4" />,
    },
    {
        title: "Pre-Wedding",
        caption: "just the two of you",
        description:
            "An easy, unposed session before the chaos begins — a quiet portrait of who you are as a couple, away from the guest list.",
        image: "/images/services/2.jpg",
        rotate: 2,
        icon: <Camera className="h-4 w-4" />,
    },
    {
        title: "Destination",
        caption: "anywhere you say 'I do'",
        description:
            "Beaches, hill stations, family villages abroad — I travel light and shoot loose, so the location becomes part of the story.",
        image: "/images/services/3.jpg",
        rotate: -2,
        icon: <Plane className="h-4 w-4" />,
    },
    {
        title: "Engagement",
        caption: "the version with sound",
        description:
            "A short documentary edit set to the day's own audio — vows, laughter, the band warming up — cut without narration or gloss.",
        image: "/images/services/4.jpg",
        rotate: 3,
        icon: <Clapperboard className="h-4 w-4" />,
    },
    {
        title: "Albums",
        caption: "something to hold",
        description:
            "Hand-bound, archival-print albums, sequenced like a story with a beginning, middle and end — not a folder of files.",
        image: "/images/services/5.jpg",
        rotate: -1,
        icon: <BookImage className="h-4 w-4" />,
    },
];

const included = [
    "Full-day, two-photographer coverage",
    "Online gallery, delivered within 3 weeks",
    "Same-day highlight reel for socials",
    "Custom shot list & timeline planning",
];

export default function ServicesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
    const ctaRefs = useRef<Array<HTMLAnchorElement | null>>([]);

    useEffect(() => {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const ctx = gsap.context(() => {
            if (reduceMotion) return;

            // ---- header reveal ----
            gsap.from(".sv-eyebrow, .sv-heading, .sv-subhead", {
                y: 28,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.08,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });

            // ---- polaroids: land flat, then settle into their tilt ----
            cardRefs.current.forEach((card, i) => {
                if (!card) return;
                const rotate = services[i].rotate;
                gsap.fromTo(
                    card,
                    { y: 70, opacity: 0, rotate: 0, scale: 0.94 },
                    {
                        y: 0,
                        opacity: 1,
                        rotate,
                        scale: 1,
                        duration: 0.9,
                        ease: "back.out(1.6)",
                        delay: i * 0.12,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                        },
                    }
                );
            });

            // ---- feature strip ----
            gsap.from(".sv-strip", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".sv-strip",
                    start: "top 88%",
                },
            });
            gsap.from(".sv-strip-item", {
                x: -16,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".sv-strip",
                    start: "top 82%",
                },
            });

            // ---- floating camera mark: gentle idle drift ----
            gsap.to(".sv-camera-mark", {
                y: 14,
                rotate: 6,
                duration: 4,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // ---- interactive: cursor-tilt on polaroids ----
    const handleCardMove = (
        e: React.MouseEvent<HTMLDivElement>,
        baseRotate: number
    ) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
            rotateY: px * 14,
            rotateX: -py * 14,
            rotate: baseRotate * 0.4,
            y: -8,
            scale: 1.04,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 700,
            transformOrigin: "center",
        });
    };

    const handleCardLeave = (
        e: React.MouseEvent<HTMLDivElement>,
        baseRotate: number
    ) => {
        gsap.to(e.currentTarget, {
            rotateY: 0,
            rotateX: 0,
            rotate: baseRotate,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.6)",
        });
    };

    // ---- interactive: magnetic CTA buttons ----
    const handleCtaMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, {
            x: x * 0.25,
            y: y * 0.4,
            duration: 0.4,
            ease: "power2.out",
        });
    };

    const handleCtaLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
        gsap.to(e.currentTarget, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
        });
    };

    return (
        <section
            ref={sectionRef}
            id="services"
            className="relative overflow-hidden bg-[#FAF6EE] px-6 py-24 sm:px-10 lg:px-16"
        >
            {/* fonts */}
            <style>{`
.sv-card { transform-style: preserve-3d; will-change: transform; }
      `}</style>

            {/* idle-drifting camera mark, echoes the hero */}
            <Camera
                className="sv-camera-mark pointer-events-none absolute right-8 top-10 h-16 w-16 text-[#2B2420]/[0.04] sm:h-24 sm:w-24"
                strokeWidth={1.5}
            />

            <div className="mx-auto max-w-7xl">
                {/* header */}
                <div className="mb-16 max-w-2xl">
                    <p className="sv-eyebrow mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#7C2331]">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9922E]" />
                        Services
                    </p>
                    <h2 className="sv-heading font-display text-5xl uppercase leading-[0.95] text-[#2B2420] sm:text-6xl md:text-7xl">
                        The Collections
                    </h2>
                    <p className="sv-subhead font-serif mt-5 text-lg italic text-[#5b5248] sm:text-xl">
                        Storytelling wedding photographer — every collection is built
                        around the same idea: document the day as it actually happened,
                        not as it was staged for a camera.
                    </p>
                </div>

                {/* polaroid grid */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-5 lg:gap-y-8">
                    {services.map((service, i) => (
                        <div
                            key={service.title}
                            className={`relative ${i === 4
                                ? "sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:w-full"
                                : ""
                                }`}
                        >
                            <div
                                ref={(el) => { cardRefs.current[i] = el; }}
                                onMouseMove={(e) => handleCardMove(e, service.rotate)}
                                onMouseLeave={(e) => handleCardLeave(e, service.rotate)}
                                className="sv-card cursor-pointer rounded-sm border-[10px] border-b-[46px] border-white bg-white shadow-[0_10px_25px_-8px_rgba(43,36,32,0.35)]"
                            >
                                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e9e2d3]">
                                    <img
                                        src={service.image}
                                        alt={`${service.title} photography example`}
                                        className="h-full w-full object-cover transition-transform duration-500 ease-out"
                                        loading="lazy"
                                    />
                                    <span className="absolute left-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#7C2331] text-white shadow-sm">
                                        {service.icon}
                                    </span>
                                </div>

                                {/* handwritten caption on the polaroid's white strip */}
                                <p className="font-caption pointer-events-none absolute bottom-[6px] left-0 right-0 text-center text-xl leading-none text-[#2B2420]/80">
                                    {service.caption}
                                </p>
                            </div>

                            <div className="mt-5 px-1">
                                <h3 className="font-serif text-xl font-semibold text-[#2B2420]">
                                    {service.title}
                                </h3>
                                <p className="mt-2 text-[15px] leading-relaxed text-[#6b6156]">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* what's included strip */}
                <div className="sv-strip mt-20 flex flex-col items-start gap-8 rounded-2xl bg-[#2B2420] px-8 py-10 sm:px-12 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C9922E]">
                            Every collection includes
                        </p>
                        <h3 className="font-display mt-2 text-3xl uppercase text-white sm:text-4xl">
                            No hidden reels
                        </h3>
                    </div>
                    <ul className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                        {included.map((item) => (
                            <li
                                key={item}
                                className="sv-strip-item flex items-start gap-3 text-[#F4F1EA]"
                            >
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C9922E]" />
                                <span className="text-[15px]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA row, echoes hero buttons — magnetic on hover */}
                <div className="mt-14 flex flex-row items-center gap-3">
                    <a
                        ref={(el) => {
                            ctaRefs.current[0] = el;
                        }}
                        href="#enquire"
                        onMouseMove={handleCtaMove}
                        onMouseLeave={handleCtaLeave}
                        className="rounded-md bg-[#7C2331] px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#661c28] sm:px-8 sm:py-3.5"
                        style={{
                            color: "ivory",
                        }}
                    >
                        Check Your Date
                    </a>

                    <a
                        ref={(el) => {
                            ctaRefs.current[1] = el;
                        }}
                        href="#portfolio"
                        onMouseMove={handleCtaMove}
                        onMouseLeave={handleCtaLeave}
                        className="rounded-md border border-[#2B2420]/20 px-5 py-3 text-center text-sm font-semibold text-[#2B2420] transition-colors hover:border-[#2B2420]/40 sm:px-8 sm:py-3.5"
                    >
                        See Full Portfolio
                    </a>
                </div>
            </div>
        </section>
    );
}