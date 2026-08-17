"use client";

import React, { useEffect, useRef } from "react";
import { MapPin, Calendar, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type Wedding = {
    couple: string;
    location: string;
    date: string;
    story: string;
    hero: string;
    tag: string;
};

const weddings: Wedding[] = [
    {
        couple: "Ananya & Rohan",
        location: "Udaipur, Rajasthan",
        date: "November 2025",
        story:
            "Three days at a lakeside haveli — a mehendi that ran into sunset, a baraat on horseback, and a couple who kept sneaking off to laugh at their own families.",
        hero: "/images/featured/1.jpg",
        tag: "destination",
    },
    {
        couple: "Meera & Aditya",
        location: "Coorg, Karnataka",
        date: "February 2026",
        story:
            "A quiet, coffee-estate wedding with fifty guests and no stage. Vows read under a rain tree, reception lit entirely by string lights and lanterns.",
        hero: "/images/featured/2.jpg",
        tag: "intimate",
    },
    {
        couple: "Priya & Karthik",
        location: "Chennai, Tamil Nadu",
        date: "August 2025",
        story:
            "A traditional five-day South Indian wedding — kashi yatra at dawn, saptapadi at noon, and a reception hall that somehow still felt personal.",
        hero: "/images/featured/3.jpg",
        tag: "traditional",
    },
    {
        couple: "Sana & Farhan",
        location: "Lonavala, Maharashtra",
        date: "May 2026",
        story:
            "A monsoon-season nikah moved indoors an hour before the ceremony — and somehow that made it better. Rain on the windows for the entire reception.",
        hero: "/images/featured/4.jpg",
        tag: "monsoon",
    },
];

export default function FeaturedWeddings() {
    const sectionRef = useRef<HTMLElement>(null);

    const imageLayerRefs = useRef<Array<HTMLDivElement | null>>([]);
    const textLayerRefs = useRef<Array<HTMLDivElement | null>>([]);
    const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const mobileDotRefs = useRef<Array<HTMLSpanElement | null>>([]);

    const counterRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const ctx = gsap.context(() => {
            const images = imageLayerRefs.current;
            const texts = textLayerRefs.current;
            const dots = dotRefs.current;
            const mobileDots = mobileDotRefs.current;

            const n = weddings.length;

            /*
             * REDUCED MOTION
             */
            if (reduceMotion) {
                images.forEach((el, i) => {
                    if (!el) return;

                    gsap.set(el, {
                        yPercent: i === n - 1 ? 0 : 100,
                        opacity: i === n - 1 ? 1 : 0,
                    });
                });

                texts.forEach((el, i) => {
                    if (!el) return;

                    gsap.set(el, {
                        yPercent: i === n - 1 ? 0 : 12,
                        opacity: i === n - 1 ? 1 : 0,
                    });
                });

                return;
            }

            /*
             * INITIAL IMAGE STATE
             */
            gsap.set(images, {
                yPercent: (i) => (i === 0 ? 0 : 100),
                scale: 1,
                opacity: (i) => (i === 0 ? 1 : 0),
            });

            /*
             * INITIAL TEXT STATE
             */
            gsap.set(texts, {
                yPercent: (i) => (i === 0 ? 0 : 12),
                opacity: (i) => (i === 0 ? 1 : 0),
            });

            /*
             * MAIN SCROLL TIMELINE
             */
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",

                    end: () => `+=${(n - 1) * 220}%`,

                    scrub: 1.4,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,

                    onUpdate: (self) => {
                        const active = Math.min(
                            n - 1,
                            Math.max(
                                0,
                                Math.round(self.progress * (n - 1))
                            )
                        );

                        /*
                         * Desktop dots
                         */
                        dots.forEach((dot, i) => {
                            if (!dot) return;

                            dot.dataset.active = String(i === active);
                        });

                        /*
                         * Mobile dots
                         */
                        mobileDots.forEach((dot, i) => {
                            if (!dot) return;

                            dot.dataset.active = String(i === active);
                        });

                        /*
                         * Counter
                         */
                        if (counterRef.current) {
                            counterRef.current.textContent = `0${active + 1
                                } / 0${n}`;
                        }
                    },
                },

                defaults: {
                    ease: "power1.inOut",
                },
            });

            /*
             * CREATE EACH WEDDING TRANSITION
             */
            for (let i = 1; i < n; i++) {
                const prevImg = images[i - 1];
                const nextImg = images[i];

                const prevTxt = texts[i - 1];
                const nextTxt = texts[i];

                if (!prevImg || !nextImg || !prevTxt || !nextTxt) {
                    continue;
                }

                const label = `step${i}`;

                /*
                 * Give every transition its own section
                 */
                tl.addLabel(label, (i - 1) * 1.6);

                /*
                 * PREVIOUS IMAGE
                 */
                tl.to(
                    prevImg,
                    {
                        yPercent: -8,
                        scale: 0.96,
                        opacity: 0,
                        duration: 1.2,
                        ease: "power1.inOut",
                    },
                    label
                );

                /*
                 * NEXT IMAGE
                 */
                tl.to(
                    nextImg,
                    {
                        yPercent: 0,
                        scale: 1,
                        opacity: 1,
                        duration: 1.6,
                        ease: "power2.out",
                    },
                    label
                );

                /*
                 * PREVIOUS TEXT
                 */
                tl.to(
                    prevTxt,
                    {
                        yPercent: -16,
                        opacity: 0,
                        duration: 1.1,
                    },
                    `${label}+=0.1`
                );

                /*
                 * NEXT TEXT
                 */
                tl.fromTo(
                    nextTxt,
                    {
                        yPercent: 14,
                        opacity: 0,
                    },
                    {
                        yPercent: 0,
                        opacity: 1,
                        duration: 1.3,
                        ease: "power1.out",
                    },
                    `${label}+=0.85`
                );
            }

            /*
             * Refresh after everything has been created.
             */
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        }, sectionRef);

        /*
         * CLEANUP
         */
        return () => {
            ctx.revert();
        };
    }, []);

    /*
     * Jump directly to a wedding.
     */
    const scrollToIndex = (i: number) => {
        const trigger = ScrollTrigger.getAll().find(
            (st) => st.trigger === sectionRef.current
        );

        if (!trigger) return;

        const n = weddings.length;

        if (n <= 1) return;

        const progress = i / (n - 1);

        const target =
            trigger.start +
            progress * (trigger.end - trigger.start);

        gsap.to(window, {
            scrollTo: target,
            duration: 0.9,
            ease: "power2.inOut",
        });
    };

    return (
        <section
            ref={sectionRef}
            id="portfolio"
            className="relative bg-[#FAF6EE]"
            style={{
                minHeight: "100vh",
            }}
        >
            <style>{`
                .fw-dot[data-active="true"] {
                    background-color: #7C2331;
                    width: 22px;
                }

                .fw-dot-mobile[data-active="true"] {
                    background-color: #7C2331;
                    width: 22px;
                }
            `}</style>

            {/* PINNED STAGE */}
            <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
                <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-6 sm:px-10 lg:px-16">

                    {/* HEADER */}
                    <div className="flex shrink-0 items-center justify-between border-b border-[#2B2420]/10 py-5 lg:py-7">
                        <div>
                            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#7C2331]">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9922E]" />
                                Real Weddings
                            </p>

                            <h2 className="font-display mt-1 text-2xl uppercase leading-none text-[#2B2420] sm:text-3xl">
                                Featured Weddings
                            </h2>
                        </div>

                        {/* COUNTER + DOTS */}
                        <div className="flex items-center gap-4">
                            <span
                                ref={counterRef}
                                className="font-display text-sm tracking-widest text-[#2B2420]/50"
                            >
                                01 / 0{weddings.length}
                            </span>

                            <div className="hidden items-center gap-2 sm:flex">
                                {weddings.map((wedding, i) => (
                                    <button
                                        key={wedding.couple}
                                        ref={(el) => {
                                            dotRefs.current[i] = el;
                                        }}
                                        data-active={
                                            i === 0 ? "true" : "false"
                                        }
                                        onClick={() => scrollToIndex(i)}
                                        aria-label={`Jump to ${wedding.couple}`}
                                        className="fw-dot h-1.5 w-1.5 rounded-full bg-[#2B2420]/25 transition-all duration-300"
                                        type="button"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-1 flex-col items-center justify-start gap-5 overflow-hidden pb-4 pt-4 sm:gap-6 sm:pb-10 lg:flex-row lg:items-center lg:justify-start lg:gap-12 lg:pb-12">

                        {/* PHOTO STACK */}
                        <div
                            className="
                                relative
                                h-[65vw]
                                w-[85vw]
                                aspect-[550/770]
                                shrink-0
                                sm:h-[340px]
                                sm:w-[243px]
                                sm:aspect-auto
                                lg:h-[550px]
                                lg:w-[750px]
                            "
                        >
                            {weddings.map((wedding, i) => (
                                <div
                                    key={wedding.couple}
                                    ref={(el) => {
                                        imageLayerRefs.current[i] = el;
                                    }}
                                    className="absolute inset-0"
                                    style={{
                                        zIndex: i + 1,
                                    }}
                                >
                                    <div className="relative h-full w-full overflow-hidden rounded-sm shadow-[0_25px_60px_-20px_rgba(43,36,32,0.5)] lg:rounded-md">
                                        <img
                                            src={wedding.hero}
                                            alt={`${wedding.couple} wedding, ${wedding.location}`}
                                            className="h-full w-full object-cover"
                                            loading={
                                                i === 0
                                                    ? "eager"
                                                    : "lazy"
                                            }
                                            width={550}
                                            height={770}
                                        />

                                        {/* TAG */}
                                        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#7C2331] shadow-sm">
                                            {wedding.tag}
                                        </span>

                                        {/* NUMBER */}
                                        <span className="font-display absolute bottom-4 right-4 text-3xl text-white/80 drop-shadow-sm">
                                            0{i + 1}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* DIVIDER */}
                        <div className="hidden h-[340px] w-px shrink-0 bg-[#2B2420]/10 lg:block lg:h-[400px]" />

                        {/* TEXT STACK */}
                        <div
                            className="
                                relative
                                h-[230px]
                                w-full
                                max-w-md
                                shrink-0
                                sm:h-[340px]
                                lg:h-[400px]
                                lg:flex-1
                            "
                        >
                            {weddings.map((wedding, i) => (
                                <div
                                    key={wedding.couple}
                                    ref={(el) => {
                                        textLayerRefs.current[i] = el;
                                    }}
                                    className="absolute inset-0 flex flex-col justify-center"
                                    style={{
                                        zIndex: i + 1,
                                    }}
                                >
                                    <span className="font-caption text-xl text-[#C9922E]">
                                        Story 0{i + 1}
                                    </span>

                                    <h3 className="font-serif mt-1 text-2xl font-semibold text-[#2B2420] sm:text-3xl lg:text-4xl">
                                        {wedding.couple}
                                    </h3>

                                    {/* META */}
                                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6b6156]">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-[#C9922E]" />
                                            {wedding.location}
                                        </span>

                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-[#C9922E]" />
                                            {wedding.date}
                                        </span>
                                    </div>

                                    {/* STORY */}
                                    <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#6b6156] sm:text-base">
                                        {wedding.story}
                                    </p>

                                    {/* LINK */}
                                    <a
                                        href="#"
                                        className="group mt-7 inline-flex w-fit items-center gap-1.5 border-b border-[#7C2331]/30 pb-1 text-sm font-semibold text-[#7C2331] transition-colors hover:border-[#7C2331]"
                                    >
                                        View Full Gallery

                                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MOBILE DOTS */}
                    <div className="flex shrink-0 items-center justify-center gap-2 pb-6 sm:hidden">
                        {weddings.map((wedding, i) => (
                            <span
                                key={wedding.couple}
                                ref={(el) => {
                                    mobileDotRefs.current[i] = el;
                                }}
                                data-active={
                                    i === 0 ? "true" : "false"
                                }
                                className="fw-dot-mobile h-1.5 w-1.5 rounded-full bg-[#2B2420]/25 transition-all duration-300"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}