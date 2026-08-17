"use client";
import React, { useEffect, useRef } from "react";
import { Camera, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * TheStudio — "The Studio" (about / bio)
 *
 * Sits after Featured Weddings. A quieter section by design — no
 * pinning here, since the previous section already asked for a lot
 * of scroll attention. Instead: a portrait polaroid with a cursor
 * tilt (same interaction language as Services), a short founder
 * story, a handwritten signature line, and a stat strip that counts
 * up once when it enters view.
 *
 * Fonts: Anton / Playfair Display / Caveat, loaded once globally via
 * next/font in app/layout.tsx.
 * Requires `gsap` in your project: npm install gsap
 */

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { value: 180, suffix: "+", label: "Weddings shot" },
    { value: 9, suffix: "", label: "Years behind the camera" },
    { value: 14, suffix: "", label: "States covered" },
    { value: 32, suffix: "", label: "Countries traveled for love" },
];

export default function TheStudio() {
    const sectionRef = useRef<HTMLElement>(null);
    const portraitRef = useRef<HTMLDivElement>(null);
    const statRefs = useRef<Array<HTMLSpanElement | null>>([]);

    useEffect(() => {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const ctx = gsap.context(() => {
            if (reduceMotion) return;

            // ---- portrait + copy entrance ----
            gsap.from(".ts-portrait-wrap", {
                x: -50,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
            });
            gsap.from(
                ".ts-eyebrow, .ts-heading, .ts-copy, .ts-signature, .ts-cta",
                {
                    y: 26,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power3.out",
                    stagger: 0.08,
                    scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
                }
            );

            // ---- floating detail polaroid drifts in behind the portrait ----
            gsap.from(".ts-detail", {
                y: 40,
                x: 20,
                opacity: 0,
                rotate: 0,
                scale: 0.85,
                duration: 0.8,
                ease: "back.out(1.6)",
                delay: 0.35,
                scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
            });

            // ---- stat strip: reveal + count up ----
            gsap.from(".ts-stat", {
                y: 24,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: { trigger: ".ts-stats", start: "top 85%" },
            });

            statRefs.current.forEach((el, i) => {
                if (!el) return;
                const target = { val: 0 };
                gsap.to(target, {
                    val: stats[i].value,
                    duration: 1.6,
                    ease: "power1.out",
                    scrollTrigger: { trigger: ".ts-stats", start: "top 85%", once: true },
                    onUpdate: () => {
                        el.textContent = Math.round(target.val).toString();
                    },
                });
            });

            // ---- idle camera mark drift, consistent with other sections ----
            gsap.to(".ts-camera-mark", {
                y: 12,
                rotate: -6,
                duration: 4.5,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handlePortraitMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const el = portraitRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, {
            rotateY: px * 10,
            rotateX: -py * 10,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 800,
        });
    };

    const handlePortraitLeave = () => {
        gsap.to(portraitRef.current, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.6)",
        });
    };

    return (
        <section
            ref={sectionRef}
            id="studio"
            className="relative overflow-hidden bg-[#FAF6EE] px-6 py-24 sm:px-10 lg:px-16"
        >
            <style>{`
.ts-tilt { transform-style: preserve-3d; will-change: transform; }
      `}</style>

            <Camera
                className="ts-camera-mark pointer-events-none absolute left-8 bottom-10 h-16 w-16 text-[#2B2420]/[0.04] sm:h-24 sm:w-24"
                strokeWidth={1.5}
            />

            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
                {/* ---- portrait ---- */}
                <div className="ts-portrait-wrap relative lg:col-span-5">
                    <div
                        ref={portraitRef}
                        onMouseMove={handlePortraitMove}
                        onMouseLeave={handlePortraitLeave}
                        className="ts-tilt relative mx-auto w-[280px] cursor-pointer rounded-sm border-[10px] border-b-[50px] border-white bg-white shadow-[0_25px_55px_-18px_rgba(43,36,32,0.45)] sm:w-[340px]"
                    >
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e9e2d3]">
                            <img
                                src="/images/studio/1.jpg"
                                alt="Vishal, founder and lead photographer at Marigold & Co."
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <p className="font-caption pointer-events-none absolute bottom-[10px] left-0 right-0 text-center text-2xl leading-none text-[#2B2420]/80">
                            behind the lens
                        </p>
                    </div>

                    {/* small floating detail polaroid, tucked behind the portrait */}
                    <div className="ts-detail absolute -right-2 bottom-6 hidden h-28 w-24 rotate-6 overflow-hidden rounded-sm border-[6px] border-b-[16px] border-white bg-white shadow-[0_15px_30px_-10px_rgba(43,36,32,0.4)] sm:-right-6 sm:block sm:h-32 sm:w-28">
                        <img
                            src="/images/studio/2.jpg"
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* ---- copy ---- */}
                <div className="lg:col-span-7">
                    <p className="ts-eyebrow mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#7C2331]">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9922E]" />
                        The Studio
                    </p>
                    <h2 className="ts-heading font-display text-5xl uppercase leading-[0.95] text-[#2B2420] sm:text-6xl">
                        Vishal, in his own words
                    </h2>

                    <div className="ts-copy mt-6 max-w-xl space-y-4 text-[15px] leading-relaxed text-[#6b6156] sm:text-base">
                        <p>
                            I picked up a camera at nineteen to shoot my cousin's sangeet
                            because the hired photographer cancelled. Nine years and 180
                            weddings later, I still shoot the way I did that night — close
                            to the people, out of the way of the moment, chasing the
                            reaction rather than the pose.
                        </p>
                        <p>
                            I'm based out of Nashik but I'm on a flight more often than
                            not. Every wedding gets the same brief from me: I'm not there
                            to direct your day, I'm there to notice it.
                        </p>
                    </div>

                    <p className="ts-signature font-caption mt-6 flex items-center gap-2 text-3xl text-[#7C2331]">
                        — Vishal
                        <span className="font-serif text-sm not-italic text-[#6b6156]">
                            , founder & lead photographer
                        </span>
                    </p>

                    <div className="ts-cta mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <a
                            href="#enquire"
                            className="rounded-md bg-[#7C2331] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#661c28]"
                            style={{
                                color: "ivory",
                            }}
                        >
                            Work With Me
                        </a>
                        <span className="flex items-center gap-1.5 text-sm text-[#6b6156]">
                            <MapPin className="h-3.5 w-3.5 text-[#C9922E]" />
                            Based in Nashik — shooting everywhere
                        </span>
                    </div>
                </div>
            </div>

            {/* ---- stat strip ---- */}
            <div className="ts-stats mx-auto mt-24 grid max-w-7xl grid-cols-2 gap-8 border-t border-[#2B2420]/10 pt-12 sm:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={stat.label} className="ts-stat text-center sm:text-left">
                        <div className="font-display flex items-baseline justify-center gap-1 text-4xl text-[#2B2420] sm:justify-start sm:text-5xl">
                            <span ref={(el) => { statRefs.current[i] = el; }}>0</span>
                            <span className="text-[#C9922E]">{stat.suffix}</span>
                        </div>
                        <p className="mt-2 text-sm text-[#6b6156]">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}