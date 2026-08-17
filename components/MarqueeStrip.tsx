"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const items = [
  "The Wedding Edit",
  "Ivory Journal",
  "Aisle & Co. Magazine",
  "Bright Occasions",
  "Studio Notes India",
];

export default function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const width = track.scrollWidth / 2;
    const tween = gsap.to(track, {
      x: -width,
      duration: 26,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  // Duplicate items for seamless loop
  const allItems = [...items, ...items];

  return (
    <section
      className="border-t border-b border-sand overflow-hidden bg-paper"
      style={{ padding: "26px 0" }}
      aria-label="Featured in"
    >
      <div className="text-marquee-track" ref={trackRef}>
        {allItems.map((item, i) => (
          <span key={`${item}-${i}`}>
            {i > 0 && <span>&#10052;</span>}
            {item}
          </span>
        ))}
        {/* Extra snowflake at end for seamless loop */}
        <span>&#10052;</span>
      </div>
    </section>
  );
}
