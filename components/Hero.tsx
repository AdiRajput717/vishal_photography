"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const polaroidImages = [
  { src: "https://picsum.photos/seed/vishal-p1/200/220", className: "hp-1", depth: 0.5 },
  { src: "https://picsum.photos/seed/vishal-p2/200/240", className: "hp-2", depth: 0.8 },
  { src: "https://picsum.photos/seed/vishal-p3/200/220", className: "hp-3", depth: 0.6 },
  { src: "https://picsum.photos/seed/vishal-p4/200/240", className: "hp-4", depth: 0.9 },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const heroDecor = ".h-polaroid, .hero-camera";

    if (reduceMotion) {
      gsap.set(".reveal-up", { opacity: 1, y: 0 });
      gsap.set(heroDecor, { opacity: 1 });
      return;
    }

    // Hero reveal timeline
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.15,
    });

    tl.to(".hero-h1", { opacity: 1, y: 0, duration: 0.9 })
      .to(".hero-tagline", { opacity: 1, y: 0, duration: 0.8 }, "-=0.55")
      .to(".hero-actions", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
      .fromTo(
        heroDecor,
        { opacity: 0, y: 30, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "back.out(1.5)",
        },
        "-=1"
      );

    // Idle float loop
    const floatTweens: gsap.core.Tween[] = [];
    gsap.utils.toArray<HTMLElement>(heroDecor).forEach((p, i) => {
      const tw = gsap.to(p, {
        y: "+=12",
        duration: 2.6 + i * 0.35,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.25,
      });
      floatTweens.push(tw);
    });

    // Mouse parallax
    const section = sectionRef.current;
    let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

    if (section && window.matchMedia("(hover:hover)").matches) {
      mouseMoveHandler = (e: MouseEvent) => {
        const cx = window.innerWidth / 2;
        const dx = (e.clientX - cx) / cx;
        gsap.utils.toArray<HTMLElement>(heroDecor).forEach((p) => {
          const depth = parseFloat(p.dataset.depth || "0.5");
          gsap.to(p, {
            x: dx * 16 * depth,
            duration: 0.6,
            ease: "power2.out",
          });
        });
      };
      section.addEventListener("mousemove", mouseMoveHandler);
    }

    return () => {
      tl.kill();
      floatTweens.forEach((tw) => tw.kill());
      if (section && mouseMoveHandler) {
        section.removeEventListener("mousemove", mouseMoveHandler);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden min-h-[90svh] max-md:min-h-[45svh]"
      style={{
        padding: "85px var(--edge) 50px",
      }}
      id="top"
    >
      <div className="relative z-3 mx-auto text-center" style={{ maxWidth: "1106px" }}>
        {/* Floating Polaroids + Camera */}
        <div className="hero-polaroids relative h-0">
          {/* Polaroid 1 */}
          <figure
            className="h-polaroid hp-1"
            data-depth="0.5"
            style={{ top: "-168px", left: "2%", transform: "rotate(-14deg)" }}
          >
            <img src={polaroidImages[0].src} alt="" />
          </figure>

          {/* Polaroid 2 */}
          <figure
            className="h-polaroid hp-2"
            data-depth="0.8"
            style={{
              top: "-158px",
              left: "41%",
              width: "92px",
              transform: "rotate(-9deg)",
            }}
          >
            <img src={polaroidImages[1].src} alt="" />
          </figure>

          {/* Camera SVG */}
          <span
            className="hero-camera absolute z-4"
            data-depth="0.3"
            style={{ top: "-90px", right: "29%", transform: "rotate(6deg)" }}
          >
            <svg viewBox="0 0 64 48" width="52" height="40">
              <rect x="1" y="10" width="62" height="36" rx="4" fill="#161616" />
              <rect x="20" y="2" width="18" height="10" rx="2" fill="#161616" />
              <circle cx="32" cy="29" r="13" fill="#FAF6EE" />
              <circle cx="32" cy="29" r="9" fill="#161616" />
              <circle cx="32" cy="29" r="4" fill="#4A4038" />
              <circle cx="53" cy="18" r="2.4" fill="#FAF6EE" />
            </svg>
          </span>

          {/* Polaroid 3 */}
          <figure
            className="h-polaroid hp-3"
            data-depth="0.6"
            style={{
              top: "90px",
              left: "22%",
              width: "96px",
              transform: "rotate(-9deg)",
            }}
          >
            <img src={polaroidImages[2].src} alt="" />
          </figure>

          {/* Polaroid 4 */}
          <figure
            className="h-polaroid hp-4"
            data-depth="0.9"
            style={{ top: "-118px", right: "3%", transform: "rotate(9deg)" }}
          >
            <img src={polaroidImages[3].src} alt="" />
          </figure>
        </div>

        {/* Headline */}
        <h1 className="hero-h1 reveal-up uppercase text-ink leading-[0.94] tracking-[-0.01em]"
          style={{ fontSize: "clamp(2.6rem, 9vw, 8.2rem)", fontFamily: "var(--font-headline)" }}
        >
          VISHAL PHOTOGRAPHY
          <span
            className="inline-flex items-center justify-center bg-ink text-ivory rounded-full align-middle select-none ml-2"
            style={{
              width: "0.64em",
              height: "0.64em",
              fontSize: "0.32em",
              verticalAlign: "super",
              transform: "translateY(-0.1em)",
            }}
          >
            <span className="font-sans font-bold text-[0.62em] leading-none">R</span>
          </span>
        </h1>

        {/* Tagline */}
        <p className="hero-tagline reveal-up font-body text-[1.05rem] text-ink-soft mt-[20px] mb-10" style={{ marginTop: '20px' }}>
          Storytelling Wedding Photographer.
        </p>

        {/* CTA Buttons */}
        <div className="hero-actions reveal-up pt-7 flex gap-4 justify-center flex-wrap">
          <a
            href="#portfolio"
            className="font-body text-[0.82rem] font-medium tracking-[0.03em] px-7 py-[15px] rounded-[2px] inline-block transition-all duration-250 ease-in-out bg-maroon text-white hover:bg-maroon-deep"
            style={{
              color: "ivory",
            }}
          >
            View Weddings
          </a>
          <a
            href="#enquire"
            className="font-body text-[0.82rem] font-medium tracking-[0.03em] px-7 py-[15px] rounded-[2px] inline-block transition-all duration-250 ease-in-out border border-ink-soft text-ink hover:border-ink hover:bg-ink/4"
          >
            Plan Your Date
          </a>
        </div>
      </div>
    </section >
  );
}
