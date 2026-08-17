"use client";
import React, { useEffect, useRef } from "react";
import { Mail, Phone, ArrowUp, Camera } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

/**
 * Footer — bookends the page against the dark tones used in
 * Philosophy/Testimonials/Enquire, so the site opens and closes on
 * the same ink-brown note. Four columns on desktop (brand, navigate,
 * services, contact), a bottom bar with copyright, and a floating
 * back-to-top button that eases the page back to the hero.
 *
 * Fonts: Anton / Playfair Display / Caveat, loaded once globally via
 * next/font in app/layout.tsx.
 * Requires `gsap` in your project: npm install gsap
 */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const navLinks = [
    { label: "Portfolio", href: "#portfolio" },
    { label: "The Studio", href: "#studio" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "FAQ", href: "#faq" },
    { label: "Enquire", href: "#enquire" },
];

const serviceLinks = [
    { label: "Wedding Day", href: "#services" },
    { label: "Pre-Wedding", href: "#services" },
    { label: "Destination", href: "#services" },
    { label: "Films", href: "#services" },
    { label: "Albums", href: "#services" },
];

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const backToTopRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const ctx = gsap.context(() => {
            if (reduceMotion) return;

            gsap.from(".ft-col", {
                y: 24,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out",
                stagger: 0.08,
                scrollTrigger: { trigger: footerRef.current, start: "top 85%" },
            });

            gsap.to(".ft-camera-mark", {
                y: 10,
                rotate: 4,
                duration: 4,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });

            // back-to-top fades in once the footer is in view
            gsap.fromTo(
                backToTopRef.current,
                { opacity: 0, y: 12 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
                }
            );
        }, footerRef);

        return () => ctx.revert();
    }, []);

    const scrollToTop = () => {
        gsap.to(window, { scrollTo: 0, duration: 1.1, ease: "power2.inOut" });
    };

    return (
        <footer
            ref={footerRef}
            className="relative overflow-hidden bg-[#2B2420] px-6 pb-8 pt-20 sm:px-10 lg:px-16"
        >
            <style>{`
.ft-link { position: relative; }
        .ft-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 1px;
          background-color: #C9922E;
          transition: width 0.25s ease;
        }
        .ft-link:hover::after { width: 100%; }
      `}</style>

            <Camera
                className="ft-camera-mark pointer-events-none absolute right-8 top-14 h-20 w-20 text-[#F4F1EA]/[0.03] sm:h-28 sm:w-28"
                strokeWidth={1.5}
            />

            <div className="mx-auto max-w-7xl">
                {/* back to top */}
                <button
                    ref={backToTopRef}
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    className="mb-12 flex h-11 w-11 items-center justify-center rounded-full border border-[#F4F1EA]/15 text-[#F4F1EA] opacity-0 transition-colors hover:border-[#C9922E] hover:text-[#C9922E]"
                >
                    <ArrowUp className="h-4 w-4" />
                </button>

                {/* columns */}
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    {/* brand */}
                    <div className="ft-col lg:col-span-4">
                        <p className="font-serif text-2xl text-[#F4F1EA]">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#C9922E] align-middle" />{" "}
                            Marigold <span className="text-[#C9922E]">&amp;</span> Co.
                        </p>
                        <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-[#F4F1EA]/60">
                            Storytelling wedding photography by Vishal — documenting real
                            moments, not staged ones, across India and beyond.
                        </p>
                        <p className="font-caption mt-5 text-2xl text-[#C9922E]">
                            based in Nashik, shooting everywhere
                        </p>
                    </div>

                    {/* navigate */}
                    <div className="ft-col lg:col-span-2 lg:col-start-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F4F1EA]/40">
                            Navigate
                        </p>
                        <ul className="mt-5 space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="ft-link text-[15px] text-[#F4F1EA]/75 transition-colors hover:text-[#F4F1EA]"
                                        style={{ color: "white" }}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* services */}
                    <div className="ft-col lg:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F4F1EA]/40">
                            Collections
                        </p>
                        <ul className="mt-5 space-y-3">
                            {serviceLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="ft-link text-[15px] text-[#F4F1EA]/75 transition-colors hover:text-[#F4F1EA]"
                                        style={{ color: "white" }}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* contact */}
                    <div className="ft-col lg:col-span-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F4F1EA]/40">
                            Get In Touch
                        </p>
                        <ul className="mt-5 space-y-3">
                            <li>
                                <a
                                    href="mailto:hello@vishalphotography.com"
                                    className="flex items-center gap-2.5 text-[15px] text-[#F4F1EA]/75 transition-colors hover:text-[#F4F1EA]"
                                >
                                    <Mail className="h-3.5 w-3.5 shrink-0 text-[#C9922E]" />
                                    <span className="text-white">hello@vishalphotography.com</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+919876543210"
                                    className="flex items-center gap-2.5 text-[15px] text-[#F4F1EA]/75 transition-colors hover:text-[#F4F1EA]"
                                >
                                    <Phone className="h-3.5 w-3.5 shrink-0 text-[#C9922E]" />
                                    <span className="text-white">+91 98765 43210</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 text-[15px] text-[#F4F1EA]/75 transition-colors hover:text-[#F4F1EA]"
                                >
                                    <FaInstagram className="h-3.5 w-3.5 shrink-0 text-[#C9922E]" />
                                    <span className="text-white">@vishal.photography</span>
                                </a>
                            </li>
                        </ul>

                        <a
                            href="#enquire"
                            className="mt-6 inline-block rounded-md bg-[#7C2331] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#661c28]"
                        >
                            <span className="text-white">Check Your Date</span>
                        </a>
                    </div>
                </div>

                {/* bottom bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#F4F1EA]/10 pt-8 sm:flex-row">
                    <p className="text-xs text-[#F4F1EA]/40">
                        © {new Date().getFullYear()} Marigold &amp; Co. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-[#F4F1EA]/40">
                        <a href="#" className="ft-link transition-colors hover:text-[#F4F1EA]/70">
                            Privacy
                        </a>
                        <a href="#" className="ft-link transition-colors hover:text-[#F4F1EA]/70">
                            Terms
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}