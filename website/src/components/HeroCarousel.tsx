"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { HeroSlide } from "@/data/site";
import { ChevronLeft, ChevronRight, PauseIcon, PlayIcon } from "./icons";

const SLIDE_MS = 6000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Big rotating banner. Auto-plays, can be paused, and works with the keyboard. */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  // null = nobody has pressed pause/play yet, so follow the device setting.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [hovering, setHovering] = useState(false);
  // People who ask their device for less motion get a still banner.
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const paused = userPaused ?? reducedMotion;
  const setPaused = (fn: (p: boolean) => boolean) => setUserPaused(fn(paused));

  useEffect(() => {
    if (paused || hovering) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [paused, hovering, slides.length]);

  const go = (step: number) => setIndex((i) => (i + step + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured offers"
      className="relative h-[280px] overflow-hidden rounded-tile bg-ink sm:h-[320px] lg:h-[360px]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={!active}
            inert={!active}
            className={`absolute inset-0 transition-opacity duration-[450ms] ease-snappy ${active ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={`${s.image}&w=1600`}
              alt={s.imageAlt}
              fill
              sizes="(min-width: 1280px) 1232px, 100vw"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              className="object-cover"
            />
            {/* Dark fade on the left so white text is always readable */}
            <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-black/0" />
            <div className="relative flex h-full max-w-xl flex-col justify-center gap-3 px-6 pb-8 text-white sm:px-12">
              <h2 className="text-[28px] leading-tight font-extrabold tracking-tight sm:text-[40px]">{s.title}</h2>
              <p className="text-[15px] text-white/90 sm:text-base">{s.text}</p>
              <Link
                href={s.cta.href}
                className="mt-2 w-fit rounded-full bg-white px-5 py-2.5 text-[15px] font-bold text-ink transition-colors duration-200 hover:bg-white/85"
              >
                {s.cta.label}
              </Link>
            </div>
          </div>
        );
      })}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`size-2.5 rounded-full border border-white transition-colors ${i === index ? "bg-white" : "bg-transparent"}`}
          />
        ))}
      </div>

      {/* Arrows + pause */}
      <div className="absolute right-4 bottom-3 flex gap-2">
        {[
          { label: "Previous slide", onClick: () => go(-1), icon: <ChevronLeft width={18} height={18} /> },
          { label: "Next slide", onClick: () => go(1), icon: <ChevronRight width={18} height={18} /> },
          {
            label: paused ? "Play slideshow" : "Pause slideshow",
            onClick: () => setPaused((p) => !p),
            icon: paused ? <PlayIcon width={14} height={14} /> : <PauseIcon width={16} height={16} />,
          },
        ].map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={b.onClick}
            aria-label={b.label}
            className="grid size-9 place-items-center rounded-full bg-white text-ink shadow-raise transition-transform duration-150 hover:scale-105"
          >
            {b.icon}
          </button>
        ))}
      </div>
    </section>
  );
}
