"use client";

import { useEffect, useRef } from "react";

const images = [
  "/images/hero/1.jpg",
  "/images/hero/2.jpg",
  "/images/hero/3.jpg",
  "/images/hero/4.jpg",
  "/images/hero/5.jpg",
];

export default function ImageMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // Duplicate content for seamless infinite scroll. Guarded so this
    // can't compound — `track.innerHTML += track.innerHTML` had no
    // such guard, so under React 18 StrictMode (or any re-run of this
    // effect) it would double the content again on top of the
    // previous duplication, silently ballooning the DOM/image count.
    if (track.dataset.duplicated === "true") return;
    const clones = Array.from(track.children).map((child) =>
      child.cloneNode(true)
    );
    clones.forEach((clone) => track.appendChild(clone));
    track.dataset.duplicated = "true";
  }, []);

  return (
    <section className="image-marquee">
      <div className="image-marquee-track" ref={trackRef}>
        {images.map((src, i) => (
          <div className="image-card" key={i}>
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}
