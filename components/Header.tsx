"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { href: "#portfolio", label: "Portfolio" },
  { href: "#studio", label: "The Studio" },
  { href: "#philosophy", label: "Philosophy" },
  { href: "#faq", label: "FAQ" },
];

const HERO_ID = "top";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);

  /* ----------------------------------------
     MOBILE MENU
  ---------------------------------------- */

  useEffect(() => {
    isOpenRef.current = isOpen;

    document.documentElement.classList.toggle(
      "nav-open",
      isOpen
    );

    if (isOpen) {
      gsap.to(headerRef.current, {
        y: 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  /* ----------------------------------------
     CLOSE MOBILE MENU ON DESKTOP RESIZE
  ---------------------------------------- */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 720 && isOpenRef.current) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* ----------------------------------------
     NAVBAR SCROLL BEHAVIOR
  ---------------------------------------- */

  useEffect(() => {
    const header = headerRef.current;

    if (!header) return;

    let heroHeight =
      document.getElementById(HERO_ID)?.offsetHeight ??
      window.innerHeight;

    const updateHeroHeight = () => {
      heroHeight =
        document.getElementById(HERO_ID)?.offsetHeight ??
        window.innerHeight;
    };

    window.addEventListener("resize", updateHeroHeight);

    let lastScroll = window.scrollY;
    let hidden = false;

    const scrollTrigger = ScrollTrigger.create({
      start: "top -80",

      onUpdate: (self) => {
        const scrollY = self.scroll();

        header.classList.toggle(
          "is-scrolled",
          scrollY > 80
        );

        /* Don't hide navbar while menu is open */
        if (isOpenRef.current) {
          lastScroll = scrollY;
          return;
        }

        const scrollingDown = scrollY > lastScroll;
        const pastHero = scrollY > heroHeight;

        /* Hide while scrolling down past hero */
        if (
          pastHero &&
          scrollingDown &&
          !hidden
        ) {
          hidden = true;

          gsap.to(header, {
            y: "-110%",
            duration: 0.4,
            ease: "power2.inOut",
            overwrite: true,
          });
        }

        /* Show while scrolling up */
        if (
          (!pastHero || !scrollingDown) &&
          hidden
        ) {
          hidden = false;

          gsap.to(header, {
            y: 0,
            duration: 0.4,
            ease: "power2.inOut",
            overwrite: true,
          });
        }

        lastScroll = scrollY;
      },
    });

    return () => {
      scrollTrigger.kill();
      window.removeEventListener(
        "resize",
        updateHeroHeight
      );
    };
  }, []);

  const closeNav = () => {
    setIsOpen(false);
  };

  return (
    <header
      ref={headerRef}
      id="siteHeader"
      className="fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 ease-in-out"
    >
      <style jsx>{`
        header {
          padding: 22px var(--edge);
        }

        header.is-scrolled {
          background: rgba(250, 246, 238, 0.92);
          backdrop-filter: blur(10px);
          box-shadow: 0 1px 0 rgba(36, 28, 21, 0.08);
        }

        @media (max-width: 720px) {
          header {
            padding: 14px 20px;
          }

          header.is-scrolled {
            background: rgba(250, 246, 238, 0.96);
          }
        }
      `}</style>

      {/* HEADER BAR */}

      <div
        className="relative z-[130] mx-auto flex h-12 items-center justify-between"
        style={{
          maxWidth: "var(--container)",
        }}
      >
        {/* LOGO */}

        <a
          href="#top"
          aria-label="Go to top"
          onClick={closeNav}
          className="flex items-center"
        >
          <span className="block h-10 w-auto">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="block h-full w-auto object-contain"
              loading="lazy"
            />
          </span>
        </a>

        {/* NAVIGATION */}

        <nav
          id="mainNav"
          className={
            "main-nav flex items-center gap-8 " +
            "max-[720px]:fixed max-[720px]:left-0 max-[720px]:right-0 " +
            "max-[720px]:top-[72px] max-[720px]:z-[110] max-[720px]:w-full " +
            "max-[720px]:flex-col max-[720px]:items-stretch max-[720px]:gap-0 " +
            "max-[720px]:bg-[#FAF6EE] max-[720px]:px-7 max-[720px]:py-6 " +
            "max-[720px]:shadow-[0_20px_50px_rgba(43,36,32,0.10)] " +
            (isOpen
              ? "max-[720px]:flex"
              : "max-[720px]:hidden")
          }
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeNav}
              className="nav-link text-[0.82rem] tracking-[0.02em] text-ink-soft transition-colors hover:text-ink max-[720px]:block max-[720px]:border-b max-[720px]:border-[#2B2420]/10 max-[720px]:px-2 max-[720px]:py-[18px] max-[720px]:text-base"
            >
              {link.label}
            </a>
          ))}

          {/* ENQUIRE */}

          <a
            href="#enquire"
            onClick={closeNav}
            className="rounded-[2px] bg-maroon px-5 py-[10px] text-center font-medium text-[0.82rem] tracking-[0.02em] transition-colors hover:bg-maroon-deep hover:text-ivory max-[720px]:mt-5 max-[720px]:w-full max-[720px]:py-3.5 max-[720px]:text-sm"
            style={{
              color: "ivory",
            }}
          >
            Enquire
          </a>
        </nav>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          aria-label={
            isOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative z-[140] hidden h-10 w-10 items-center justify-center max-[720px]:flex"
        >
          <span
            className="absolute block h-[1.5px] w-[23px] bg-ink transition-transform duration-300 ease-in-out"
            style={{
              transform: isOpen
                ? "rotate(45deg)"
                : "translateY(-4px)",
            }}
          />

          <span
            className="absolute block h-[1.5px] w-[23px] bg-ink transition-transform duration-300 ease-in-out"
            style={{
              transform: isOpen
                ? "rotate(-45deg)"
                : "translateY(4px)",
            }}
          />
        </button>
      </div>

      {/* MOBILE BACKDROP */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeNav}
          className="fixed inset-0 z-[90] bg-black/10 backdrop-blur-[1px]"
        />
      )}
    </header>
  );
}