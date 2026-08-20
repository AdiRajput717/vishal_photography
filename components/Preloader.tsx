"use client";

import React, { useEffect, useRef, useState } from "react";
import { Aperture, Camera } from "lucide-react";
import gsap from "gsap";

type PreloaderProps = {
    /** Minimum time (ms) the preloader stays up */
    minDuration?: number;
    /** Called once the exit animation has fully finished */
    onComplete?: () => void;
    /** Brand or photographer name */
    brandName?: string;
    /** Tagline displayed under brand name */
    tagline?: string;
};

export default function Preloader({
    minDuration = 3000, // Increased from 1800 to 3000 for a longer display
    onComplete,
    brandName = "VISHAL PHOTOGRAPHY",
    tagline = "developing your story...",
}: PreloaderProps) {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const irisRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const apertureRef = useRef<SVGSVGElement>(null);

    const doneRef = useRef(false);
    const loadedRef = useRef(false);
    const [minTimeReached, setMinTimeReached] = useState(false);

    // 1. Lock page scroll during preloader active phase
    useEffect(() => {
        if (visible) {
            const originalStyle = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [visible]);

    // 2. Smooth, real-world progress ticker with fallback safety
    useEffect(() => {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let rafId: number;
        const start = performance.now();

        const tick = (now: number) => {
            const elapsed = now - start;
            if (elapsed >= minDuration) {
                setMinTimeReached(true);
            }

            setProgress((prev) => {
                if (prev >= 100) return 100;
                const ceiling = loadedRef.current ? 100 : 92;
                // Ease progress speed near the target boundary
                const easeFactor = reduceMotion ? 0.15 : 0.05;
                const next = prev + (ceiling - prev) * easeFactor;
                return next > 99.2 ? 100 : next;
            });

            if (!doneRef.current) {
                rafId = requestAnimationFrame(tick);
            }
        };

        const handleLoad = () => {
            loadedRef.current = true;
        };

        if (document.readyState === "complete") {
            loadedRef.current = true;
        } else {
            window.addEventListener("load", handleLoad);
        }

        rafId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("load", handleLoad);
        };
    }, [minDuration]);

    // 3. GSAP Timeline Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Endless smooth rotation for aperture icon
            if (apertureRef.current) {
                gsap.to(apertureRef.current, {
                    rotate: 360,
                    duration: 4,
                    ease: "none",
                    repeat: -1,
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // 4. Trigger Shutter Exit Timeline on Completion
    useEffect(() => {
        if (progress < 100 || !minTimeReached || doneRef.current) return;
        doneRef.current = true;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                delay: 0.8, // Increased delay: holds at 100% for a moment before snapping shut
                onComplete: () => {
                    setVisible(false);
                    onComplete?.();
                },
            });

            // Fade content out and scale down slightly
            tl.to(contentRef.current, {
                opacity: 0,
                scale: 0.95,
                y: -10,
                duration: 0.35,
                ease: "power2.in",
            }).to(
                irisRef.current,
                {
                    clipPath: "circle(0% at 50% 50%)",
                    duration: 0.85,
                    ease: "power4.inOut",
                },
                "-=0.1"
            );
        }, containerRef);

        return () => ctx.revert();
    }, [progress, minTimeReached, onComplete]);

    if (!visible) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] select-none overflow-hidden"
            aria-hidden={!visible}
            role="status"
            aria-live="polite"
        >
            {/* Dynamic Viewfinder Overlay Container */}
            <div
                ref={irisRef}
                className="relative flex h-full w-full items-center justify-center bg-[#FAF6EE] text-[#2B2420]"
                style={{ clipPath: "circle(150% at 50% 50%)" }}
            >
                {/* Subtle Viewfinder HUD Details */}
                <div className="pointer-events-none absolute inset-8 flex justify-between text-xs font-mono opacity-30">
                    <div>RAW • 14-BIT</div>
                    <div>f/1.8 • 1/250s • ISO 400</div>
                </div>

                {/* Viewfinder Corner Markers */}
                <div className="pointer-events-none absolute inset-10 border border-[#2B2420]/15">
                    <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-[#7C2331]" />
                    <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-[#7C2331]" />
                    <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[#7C2331]" />
                    <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[#7C2331]" />
                </div>

                {/* Main Content Card */}
                <div
                    ref={contentRef}
                    className="flex flex-col items-center px-6 text-center z-10"
                >
                    {/* Central Aperture Icon (Timer Removed) */}
                    <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
                        <Aperture
                            ref={apertureRef}
                            className="h-20 w-20 text-[#7C2331] transition-transform duration-300"
                            strokeWidth={1.2}
                        />
                    </div>

                    {/* Typography */}
                    <h1 className="font-serif text-2xl font-medium tracking-tight sm:text-4xl text-[#2B2420]">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#C9922E] mr-2 -translate-y-0.5" />
                        {brandName}
                    </h1>
                    <p className="mt-2 text-lg italic text-[#7C2331] font-serif">
                        {tagline}
                    </p>

                    {/* Progress Meter with Relocated Timer */}
                    <div className="mt-10 flex flex-col w-48 sm:w-64 gap-2">
                        <div className="flex w-full items-end justify-between px-1 text-[10px] uppercase tracking-widest text-[#2B2420]/70 font-mono">
                            <div className="flex items-center gap-1.5">
                                <Camera className="h-3 w-3" />
                                <span>Calibrating</span>
                            </div>
                            <span className="font-semibold text-[#7C2331]">
                                {Math.round(progress)}%
                            </span>
                        </div>

                        <div className="h-[2px] w-full overflow-hidden rounded-full bg-[#2B2420]/10">
                            <div
                                className="h-full rounded-full bg-[#7C2331] transition-[width] duration-200 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}