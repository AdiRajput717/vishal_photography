"use client";

import React, { useEffect, useRef } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Post = {
    image: string;
    likes: string;
    comments: string;
    caption: string;
};

const posts: Post[] = [
    {
        image: "/images/work/1.jpg",
        likes: "1.2k",
        comments: "34",
        caption: "Golden hour at the Udaipur haveli 🌅",
    },
    {
        image: "/images/work/2.jpg",
        likes: "980",
        comments: "21",
        caption: "Mehendi chaos, exactly as it should be",
    },
    {
        image: "/images/work/3.jpg",
        likes: "2.1k",
        comments: "58",
        caption: "First look, Coorg",
    },
    {
        image: "/images/work/4.jpg",
        likes: "1.5k",
        comments: "40",
        caption: "Details worth the extra ten minutes",
    },
    {
        image: "/images/work/5.jpg",
        likes: "870",
        comments: "19",
        caption: "Rain didn't stop this one",
    },
    {
        image: "/images/work/6.jpg",
        likes: "1.8k",
        comments: "47",
        caption: "Reception lights, Chennai",
    },
    {
        image: "/images/work/7.jpg",
        likes: "3.4k",
        comments: "72",
        caption: "The look before the vows",
    },
    {
        image: "/images/work/8.jpg",
        likes: "1.1k",
        comments: "26",
        caption: "Baraat on horseback",
    },
];

export default function InstagramFeed() {
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const ctx = gsap.context(() => {
            /*
             * Header animation
             */
            if (!reduceMotion) {
                gsap.from(".ig-eyebrow, .ig-heading, .ig-handle, .ig-follow", {
                    y: 24,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out",
                    stagger: 0.08,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        once: true,
                    },
                });

                /*
                 * Grid animation
                 */
                if (gridRef.current) {
                    gsap.from(".ig-post", {
                        y: 30,
                        opacity: 0,
                        scale: 0.96,
                        duration: 0.6,
                        ease: "power2.out",
                        stagger: 0.06,
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: "top 85%",
                            once: true,
                        },
                    });
                }
            }
        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#FAF6EE] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28"
        >

            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end lg:mb-12">

                    <div>
                        <p className="ig-eyebrow mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#7C2331]">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9922E]" />
                            Follow Along
                        </p>

                        <h2 className="ig-heading font-display text-5xl uppercase leading-[0.95] text-[#2B2420] sm:text-6xl">
                            Recent Work
                        </h2>

                        <p className="ig-handle font-caption mt-2 text-2xl text-[#7C2331]">
                            @vishal.photography
                        </p>
                    </div>

                    {/* FOLLOW BUTTON */}
                    <a
                        href="https://instagram.com/vishal.photography"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Follow Vishal Photography on Instagram"
                        className="ig-follow flex shrink-0 items-center gap-2 rounded-md bg-[#7C2331] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#661c28] hover:-translate-y-0.5"
                    >
                        <FaInstagram className="h-4 w-4" />
                        Follow on Instagram
                    </a>
                </div>

                {/* GRID */}
                <div
                    ref={gridRef}
                    className="ig-grid grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
                >
                    {posts.map((post, i) => (
                        <a
                            key={`${post.image}-${i}`}
                            href="https://instagram.com/vishal.photography"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View Instagram post: ${post.caption}`}
                            className="ig-post group relative block aspect-square overflow-hidden rounded-sm bg-[#e9e2d3]"
                        >
                            {/* IMAGE */}
                            <img
                                src={post.image}
                                alt={post.caption}
                                width={500}
                                height={500}
                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                                loading={i < 4 ? "eager" : "lazy"}
                            />

                            {/* HOVER OVERLAY */}
                            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#2B2420]/85 via-[#2B2420]/0 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-4">

                                {/* CAPTION */}
                                <p className="font-serif mb-2 line-clamp-2 text-xs italic text-[#F4F1EA] sm:text-sm">
                                    {post.caption}
                                </p>

                                {/* STATS */}
                                <div className="flex items-center gap-3 text-[#F4F1EA]">

                                    <span className="flex items-center gap-1 text-xs font-semibold">
                                        <Heart className="h-3.5 w-3.5 fill-current" />
                                        {post.likes}
                                    </span>

                                    <span className="flex items-center gap-1 text-xs font-semibold">
                                        <MessageCircle className="h-3.5 w-3.5" />
                                        {post.comments}
                                    </span>

                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}