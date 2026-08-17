"use client";
import React, { useEffect, useRef, useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Enquire — "Let's Start Planning" (contact / enquiry form)
 *
 * Sits right before the footer, tied to the nav's "Enquire" button.
 * Split layout: warm copy + contact details on the left (dark card,
 * echoes Philosophy/Testimonials), a real form on the right. Labels
 * float up on focus/fill using a CSS peer pattern — no JS needed for
 * that part. Submission is faked with a short delay so the button
 * and success state have something to animate around; wire the
 * `handleSubmit` function up to your actual backend/email service.
 *
 * Fonts: Anton / Playfair Display / Caveat, loaded once globally via
 * next/font in app/layout.tsx.
 * Requires `gsap` in your project: npm install gsap
 */

gsap.registerPlugin(ScrollTrigger);

type FormState = {
  name: string;
  email: string;
  phone: string;
  weddingDate: string;
  location: string;
  package: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  weddingDate: "",
  location: "",
  package: "",
  message: "",
};

function FloatingField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = true,
  as = "input",
}: {
  label: string;
  name: keyof FormState;
  type?: string;
  value: string;
  onChange: (name: keyof FormState, value: string) => void;
  required?: boolean;
  as?: "input" | "textarea";
}) {
  const Tag = as as any;
  return (
    <div className="relative">
      <Tag
        id={name}
        name={name}
        type={as === "input" ? type : undefined}
        rows={as === "textarea" ? 4 : undefined}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(name, e.target.value)
        }
        required={required}
        placeholder=" "
        className="peer w-full resize-none rounded-md border border-[#2B2420]/15 bg-white px-4 pb-2.5 pt-5 text-[15px] text-[#2B2420] outline-none transition-colors focus:border-[#7C2331]"
      />
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-4 top-4 origin-left text-[15px] text-[#6b6156] transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#7C2331] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
    </div>
  );
}

export default function Enquire() {
  const sectionRef = useRef<HTMLElement>(null);
  const successRef = useRef<SVGPathElement>(null);
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle"
  );

  const handleChange = (name: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // replace with your real submit call (API route, Formspree, email service, etc.)
    setTimeout(() => setStatus("success"), 1200);
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      gsap.from(".en-copy-item", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });

      gsap.from(".en-form", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // draw the success checkmark once the form succeeds
  useEffect(() => {
    if (status !== "success" || !successRef.current) return;
    const path = successRef.current;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out", delay: 0.15 });
  }, [status]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FAF6EE] px-6 py-24 sm:px-10 lg:px-16"
      id="enquire"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* ---- left: copy + contact card ---- */}
        <div className="lg:col-span-5">
          <p className="en-copy-item mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#7C2331]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9922E]" />
            Enquire
          </p>
          <h2 className="en-copy-item font-display text-5xl uppercase leading-[0.95] text-[#2B2420] sm:text-6xl">
            Let's Start Planning
          </h2>
          <p className="en-copy-item font-serif mt-5 max-w-md text-lg italic text-[#5b5248]">
            Tell me a little about your day. I reply to every enquiry
            personally, usually within 48 hours.
          </p>

          <div className="en-copy-item mt-10 rounded-lg bg-[#2B2420] p-8">
            <p className="font-caption text-2xl text-[#C9922E]">
              or reach me directly
            </p>
            <div className="mt-4 space-y-3">
              <a
                href="mailto:hello@vishalphotography.com"
                className="flex items-center gap-3 text-[#F4F1EA] transition-colors hover:text-[#C9922E]"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#C9922E]" />
                <span className="text-white">hello@vishalphotography.com</span>
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 text-[#F4F1EA] transition-colors hover:text-[#C9922E]"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#C9922E]" />
                <span className="text-white">+91 98765 43210</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#F4F1EA] transition-colors hover:text-[#C9922E]"
              >
                <FaInstagram className="h-4 w-4 shrink-0 text-[#C9922E]" />
                <span className="text-white">@vishal.photography</span>
              </a>
            </div>
          </div>
        </div>

        {/* ---- right: form ---- */}
        <div className="lg:col-span-7">
          <div className="en-form relative overflow-hidden rounded-lg border border-[#2B2420]/10 bg-white/60 p-6 shadow-[0_20px_45px_-20px_rgba(43,36,32,0.35)] sm:p-10">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg
                  viewBox="0 0 52 52"
                  className="h-16 w-16"
                  fill="none"
                >
                  <circle cx="26" cy="26" r="24" stroke="#7C2331" strokeWidth="2" opacity="0.2" />
                  <path
                    ref={successRef}
                    d="M15 27 L23 35 L38 18"
                    stroke="#7C2331"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h3 className="font-serif mt-5 text-2xl font-semibold text-[#2B2420]">
                  Got it — thank you!
                </h3>
                <p className="mt-2 max-w-sm text-[15px] text-[#6b6156]">
                  Your enquiry is in. I'll reply personally within 48 hours
                  with availability and next steps.
                </p>
                <button
                  onClick={() => {
                    setForm(initialState);
                    setStatus("idle");
                  }}
                  className="font-caption mt-6 text-xl text-[#7C2331] underline decoration-[#7C2331]/40 underline-offset-4"
                >
                  send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FloatingField
                    label="Your name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <FloatingField
                    label="Email address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FloatingField
                    label="Phone number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required={false}
                  />
                  <FloatingField
                    label="Wedding date"
                    name="weddingDate"
                    type="date"
                    value={form.weddingDate}
                    onChange={handleChange}
                    required={false}
                  />
                </div>

                <FloatingField
                  label="Venue / location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required={false}
                />

                {/* package select — styled to match the floating fields */}
                <div className="relative">
                  <select
                    id="package"
                    name="package"
                    value={form.package}
                    onChange={(e) => handleChange("package", e.target.value)}
                    required
                    className="w-full appearance-none rounded-md border border-[#2B2420]/15 bg-white px-4 py-3.5 text-[15px] text-[#2B2420] outline-none transition-colors focus:border-[#7C2331]"
                  >
                    <option value="" disabled>
                      Which collection interests you?
                    </option>
                    <option value="wedding-day">Wedding Day</option>
                    <option value="pre-wedding">Pre-Wedding</option>
                    <option value="destination">Destination</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>
                </div>

                <FloatingField
                  label="Tell me about your day"
                  name="message"
                  as="textarea"
                  value={form.message}
                  onChange={handleChange}
                  required={false}
                />

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group flex w-full items-center justify-center gap-2 rounded-md bg-[#7C2331] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#661c28] disabled:opacity-70"
                >
                  {status === "submitting" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Enquiry
                      <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#6b6156]">
                  No spam, ever — just a reply from an actual human.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}