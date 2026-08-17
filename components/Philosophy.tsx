"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type Belief = {
  index: string;
  statement: string;
  description: string;
  image: string;
};

const beliefs: Belief[] = [
  {
    index: "01",
    statement: "We don't pose. We wait.",
    description:
      "The best expression of the day already exists somewhere in the room. My job is to be close enough, and patient enough, to catch it before it passes.",
    image: "/images/philosophy/1.jpg",
  },
  {
    index: "02",
    statement: "Your family's chaos is the good stuff.",
    description:
      "Nobody remembers the perfectly arranged group photo. They remember the uncle who wouldn't stop laughing in it. I shoot for that.",
    image: "/images/philosophy/2.jpg",
  },
  {
    index: "03",
    statement: "Light first, plan second.",
    description:
      "A shot list is a suggestion. If the light through the window is doing something the itinerary didn't account for, we're following the light.",
    image: "/images/philosophy/3.jpg",
  },
  {
    index: "04",
    statement: "The moment you forgot is the one we remember.",
    description:
      "A hand squeezed under the table. A father stepping out to compose himself. Small, unscripted, and usually the first thing couples ask to see again.",
    image: "/images/philosophy/4.jpg",
  },
];

// 1 = enters from right
// -1 = enters from left
const dir = (i: number) => (i % 2 === 0 ? 1 : -1);

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);

  const imageLayerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const textLayerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mobileDotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const counterRef = useRef<HTMLSpanElement>(null);
  const closingRef = useRef<HTMLParagraphElement>(null);

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

      const n = beliefs.length;

      /*
       * REDUCED MOTION
       */
      if (reduceMotion) {
        images.forEach((el, i) => {
          if (!el) return;

          gsap.set(el, {
            xPercent: i === n - 1 ? 0 : dir(i) * 100,
          });
        });

        texts.forEach((el, i) => {
          if (!el) return;

          gsap.set(el, {
            xPercent: i === n - 1 ? 0 : dir(i) * 30,
            opacity: i === n - 1 ? 1 : 0,
          });
        });

        return;
      }

      /*
       * INITIAL IMAGE STACK
       */
      gsap.set(images, {
        xPercent: (i) => (i === 0 ? 0 : dir(i) * 100),
        scale: 1,
        opacity: (i) => (i === 0 ? 1 : 0),
        zIndex: (i) => i,
      });

      /*
       * INITIAL TEXT STACK
       */
      gsap.set(texts, {
        xPercent: (i) => (i === 0 ? 0 : dir(i) * 30),
        opacity: (i) => (i === 0 ? 1 : 0),
      });

      /*
       * MAIN SCROLL TIMELINE
       */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",

          // One viewport of scrolling per transition
          end: () => `+=${(n - 1) * 100}%`,

          scrub: 1.2,
          pin: true,
          anticipatePin: 1,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            const active = Math.min(
              n - 1,
              Math.max(0, Math.round(self.progress * (n - 1)))
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
              counterRef.current.textContent = `0${active + 1} / 0${n}`;
            }
          },
        },

        defaults: {
          ease: "power1.inOut",
        },
      });

      /*
       * CREATE EACH BELIEF TRANSITION
       */
      for (let i = 1; i < n; i++) {
        const prevImg = images[i - 1];
        const nextImg = images[i];

        const prevTxt = texts[i - 1];
        const nextTxt = texts[i];

        if (!prevImg || !nextImg || !prevTxt || !nextTxt) {
          continue;
        }

        const enterFrom = dir(i);
        const label = `step${i}`;

        /*
         * Each transition gets its own timeline position.
         */
        tl.addLabel(label, (i - 1) * 2);

        /*
         * Previous image moves slightly away
         */
        // Hide the previous image completely
        tl.to(
          prevImg,
          {
            xPercent: enterFrom * -12,
            scale: 0.94,
            opacity: 1,
            duration: 1.2,
            ease: "power1.inOut",
          },
          label
        );

        // Bring the next image in
        tl.to(
          nextImg,
          {
            xPercent: 0,
            opacity: 1,
            scale: 1,
            duration: 1.6,
            ease: "power2.out",
          },
          label
        );

        /*
         * Previous text leaves
         */
        tl.to(
          prevTxt,
          {
            xPercent: enterFrom * -14,
            opacity: 0,
            duration: 1.1,
          },
          `${label}+=0.1`
        );

        /*
         * New text enters
         */
        tl.fromTo(
          nextTxt,
          {
            xPercent: enterFrom * 30,
            opacity: 0,
          },
          {
            xPercent: 0,
            opacity: 1,
            duration: 1.3,
            ease: "power1.out",
          },
          `${label}+=0.8`
        );
      }

      /*
       * Closing line
       */
      if (closingRef.current) {
        gsap.from(closingRef.current, {
          opacity: 0,
          y: -16,
          duration: 0.8,
          ease: "power2.out",

          scrollTrigger: {
            trigger: closingRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      }

      /*
       * Refresh ScrollTrigger after everything is created.
       */
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, sectionRef);

    /*
     * Cleanup
     */
    return () => {
      ctx.revert();
    };
  }, []);

  /*
   * Jump to a particular belief
   */
  const scrollToIndex = (i: number) => {
    const trigger = ScrollTrigger.getAll().find(
      (st) => st.trigger === sectionRef.current
    );

    if (!trigger) return;

    const n = beliefs.length;

    if (n <= 1) return;

    const progress = i / (n - 1);

    const target =
      trigger.start + progress * (trigger.end - trigger.start);

    gsap.to(window, {
      scrollTo: target,
      duration: 0.9,
      ease: "power2.inOut",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative bg-[#2B2420]"
      style={{
        minHeight: "100vh",
      }}
    >
      <style>{`
        .ph-dot[data-active="true"] {
          background-color: #C9922E;
          width: 22px;
        }

        .ph-dot-mobile[data-active="true"] {
          background-color: #C9922E;
          width: 22px;
        }
      `}</style>

      {/*
       * IMPORTANT:
       * No `sticky` here.
       * ScrollTrigger handles the pinning.
       */}
      <div className="flex h-screen flex-col overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-6 sm:px-10 lg:px-16">

          {/* HEADER */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#F4F1EA]/10 py-5 lg:py-7">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9922E]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9922E]" />
                Philosophy
              </p>

              <h2 className="font-display mt-1 text-2xl uppercase leading-none text-[#F4F1EA] sm:text-3xl">
                What I Believe
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* COUNTER */}
              <span
                ref={counterRef}
                className="font-display text-sm tracking-widest text-[#F4F1EA]/40"
              >
                01 / 0{beliefs.length}
              </span>

              {/* DESKTOP DOTS */}
              <div className="hidden items-center gap-2 sm:flex">
                {beliefs.map((belief, i) => (
                  <button
                    key={belief.index}
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    data-active={i === 0 ? "true" : "false"}
                    onClick={() => scrollToIndex(i)}
                    aria-label={`Jump to belief ${belief.index}`}
                    className="ph-dot h-1.5 w-1.5 rounded-full bg-[#F4F1EA]/25 transition-all duration-300"
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="max-[720px]:mt-20 flex flex-1 flex-col items-center justify-center gap-8 py-6 lg:flex-row lg:gap-14">

            {/* TEXT STACK */}
            <div className="relative w-full max-w-md shrink-0 sm:h-[420px] lg:h-[480px] lg:flex-1">
              {beliefs.map((belief, i) => (
                <div
                  key={belief.index}
                  ref={(el) => {
                    textLayerRefs.current[i] = el;
                  }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <span className="font-display block text-sm tracking-widest text-[#C9922E]">
                    {belief.index}
                  </span>

                  <h3 className="font-serif mt-3 text-3xl font-semibold leading-tight text-[#F4F1EA] sm:text-4xl">
                    {belief.statement}
                  </h3>

                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#F4F1EA]/60 sm:text-base">
                    {belief.description}
                  </p>
                </div>
              ))}
            </div>

            {/* DIVIDER */}
            <div className="hidden h-[420px] w-px shrink-0 bg-[#F4F1EA]/10 lg:block lg:h-[480px]" />

            {/* IMAGE STACK */}
            <div className="max-[720px]:mt-20 relative h-[280px] w-full max-w-md shrink-0 sm:h-[420px] lg:h-[480px] lg:flex-1">
              {beliefs.map((belief, i) => (
                <div
                  key={belief.index}
                  ref={(el) => {
                    imageLayerRefs.current[i] = el;
                  }}
                  className="absolute inset-0 overflow-hidden rounded-sm shadow-[0_25px_60px_-18px_rgba(0,0,0,0.55)]"
                >
                  <img
                    src={belief.image}
                    alt={belief.statement}
                    className="h-full w-full object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* MOBILE DOTS */}
          <div className="flex shrink-0 items-center justify-center gap-2 pb-6 sm:hidden">
            {beliefs.map((belief, i) => (
              <span
                key={belief.index}
                ref={(el) => {
                  mobileDotRefs.current[i] = el;
                }}
                data-active={i === 0 ? "true" : "false"}
                className="ph-dot-mobile h-1.5 w-1.5 rounded-full bg-[#F4F1EA]/25 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </div>

      {/* CLOSING LINE */}
      <p
        ref={closingRef}
        className="font-caption relative z-10 -mt-2 pb-6 text-center text-3xl text-[#C9922E] sm:text-4xl"
      >
        — that's the whole philosophy, really.
      </p>
    </section>
  );
}