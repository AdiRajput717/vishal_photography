"use client";
import React, { useEffect, useRef } from "react";
import {
    MessageCircleHeart,
    Camera,
    Wand2,
    Gift,
    Camera as CameraMark,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Process — "How It Works"
 *
 * Returns to the light/cream palette after the dark Philosophy
 * section — a deliberate rhythm break. A straightforward four-step
 * timeline: a connecting line draws itself as you scroll past, each
 * step's dot "lights up" the moment the line reaches it, and the
 * step cards lift on hover. No pinning here — this section is meant
 * to be skimmed quickly, not lingered on.
 *
 * Fonts: Anton / Playfair Display / Caveat, loaded once globally via
 * next/font in app/layout.tsx.
 * Requires `gsap` in your project: npm install gsap
 */

gsap.registerPlugin(ScrollTrigger);

type Step = {
    index: string;
    title: string;
    timeframe: string;
    description: string;
    icon: React.ReactNode;
};

const steps: Step[] = [
    {
        index: "01",
        title: "Consultation",
        timeframe: "Within 48 hours of your enquiry",
        description:
            "A call to talk through your day, your families, and what you actually want remembered — not a sales pitch, a planning conversation.",
        icon: <MessageCircleHeart className="h-5 w-5" />,
    },
    {
        index: "02",
        title: "The Shoot",
        timeframe: "Your wedding day",
        description:
            "I arrive early, stay late, and mostly stay out of the way — camera up, close enough to catch what's real without getting in front of it.",
        icon: <Camera className="h-5 w-5" />,
    },
    {
        index: "03",
        title: "Editing & Culling",
        timeframe: "4–6 weeks after the wedding",
        description:
            "Every frame gets reviewed by hand. What makes the final gallery earns its place — no bulk filters, no rushed batch edits.",
        icon: <Wand2 className="h-5 w-5" />,
    },
    {
        index: "04",
        title: "Delivery",
        timeframe: "Gallery + optional album",
        description:
            "A private online gallery to relive, download and share — followed by a hand-bound album if you've added one to your collection.",
        icon: <Gift className="h-5 w-5" />,
    },
];

export default function Process() {
    const sectionRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const dotRefs = useRef<Array<HTMLDivElement | null>>([]);
    const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const ctx = gsap.context(() => {
            if (reduceMotion) return;

            gsap.from(".pr-eyebrow, .pr-heading, .pr-subhead", {
                y: 26,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.08,
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
            });

            // connecting line draws left-to-right as the row scrolls into view
            gsap.fromTo(
                lineRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    ease: "none",
                    transformOrigin: "left",
                    scrollTrigger: {
                        trigger: ".pr-timeline",
                        start: "top 70%",
                        end: "bottom 60%",
                        scrub: 0.6,
                    },
                }
            );

            // each dot "lights up" and each card rises as the line reaches it
            steps.forEach((_, i) => {
                gsap.to(dotRefs.current[i], {
                    backgroundColor: "#7C2331",
                    borderColor: "#7C2331",
                    color: "#fff",
                    scale: 1.15,
                    duration: 0.3,
                    scrollTrigger: {
                        trigger: ".pr-timeline",
                        start: `top+=${(i / steps.length) * 70}% 70%`,
                        toggleActions: "play none none reverse",
                    },
                });

                gsap.from(cardRefs.current[i], {
                    y: 36,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power3.out",
                    delay: i * 0.05,
                    scrollTrigger: { trigger: cardRefs.current[i], start: "top 88%" },
                });
            });

            gsap.to(".pr-camera-mark", {
                y: 12,
                rotate: 5,
                duration: 4.2,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#FAF6EE] px-6 py-24 sm:px-10 lg:px-16"
        >
                  <CameraMark
                className="pr-camera-mark pointer-events-none absolute right-8 top-10 h-16 w-16 text-[#2B2420]/[0.04] sm:h-24 sm:w-24"
                strokeWidth={1.5}
            />

            <div className="mx-auto max-w-7xl">
                {/* header */}
                <div className="mb-20 max-w-2xl">
                    <p className="pr-eyebrow mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#7C2331]">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9922E]" />
                        Process
                    </p>
                    <h2 className="pr-heading font-display text-5xl uppercase leading-[0.95] text-[#2B2420] sm:text-6xl md:text-7xl">
                        How It Works
                    </h2>
                    <p className="pr-subhead font-serif mt-5 text-lg italic text-[#5b5248] sm:text-xl">
                        From the first call to the album on your shelf — four steps,
                        nothing skipped.
                    </p>
                </div>

                {/* timeline */}
                <div className="pr-timeline relative">
                    {/* base track + animated fill line, desktop only */}
                    <div className="absolute left-0 right-0 top-6 hidden h-px bg-[#2B2420]/10 lg:block" />
                    <div
                        ref={lineRef}
                        className="absolute left-0 right-0 top-6 hidden h-px bg-[#7C2331] lg:block"
                        style={{ transform: "scaleX(0)" }}
                    />

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-8">
                        {steps.map((step, i) => (
                            <div key={step.index} className="relative">
                                {/* dot sitting on the line */}
                                <div className="mb-6 hidden lg:flex lg:justify-start">
                                    <div
                                        ref={(el) => { dotRefs.current[i] = el; }}
                                        className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#2B2420]/15 bg-[#FAF6EE] text-[#2B2420]/40 transition-colors"
                                    >
                                        {step.icon}
                                    </div>
                                </div>

                                {/* card */}
                                <div
                                    ref={(el) => { cardRefs.current[i] = el; }}
                                    className="group rounded-lg border border-[#2B2420]/10 bg-white/60 p-6 shadow-[0_10px_25px_-15px_rgba(43,36,32,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-15px_rgba(43,36,32,0.35)]"
                                >
                                    <div className="flex items-center gap-3 lg:hidden">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C2331] text-white">
                                            {step.icon}
                                        </div>
                                        <span className="font-display text-sm tracking-widest text-[#C9922E]">
                                            {step.index}
                                        </span>
                                    </div>

                                    <span className="font-display hidden text-sm tracking-widest text-[#C9922E] lg:block">
                                        {step.index}
                                    </span>
                                    <h3 className="font-serif mt-2 text-xl font-semibold text-[#2B2420]">
                                        {step.title}
                                    </h3>
                                    <p className="font-caption mt-1 text-lg text-[#7C2331]">
                                        {step.timeframe}
                                    </p>
                                    <p className="mt-3 text-[15px] leading-relaxed text-[#6b6156]">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-20 flex flex-col items-start gap-4 border-t border-[#2B2420]/10 pt-12 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-serif text-xl italic text-[#5b5248]">
                        Ready to start with step one?
                    </p>
                    <a
                        href="#enquire"
                        className="rounded-md bg-[#7C2331] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#661c28]"
                        style={{
                            color: "ivory",
                        }}
                    >
                        Book Your Consultation
                    </a>
                </div>
            </div>
        </section>
    );
}