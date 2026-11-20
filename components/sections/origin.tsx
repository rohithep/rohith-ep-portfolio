"use client";

import { useEffect, useRef, useState } from "react";
import { TIMELINE_CHAPTERS } from "@/content/projects";
import { registerGsap } from "@/lib/gsap-register";
import { usePrefersReducedMotion } from "@/lib/smooth-scroll-provider";
import { LineReveal } from "@/components/ui/line-reveal";
import { playSfx } from "@/lib/sfx";

const SHORT_LABELS = [
  "Bio Science",
  "BSc CS",
  "MCA Distinction",
  "Mexilet AI",
  "Freelance",
];

export function Origin() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const mobileLineFillRef = useRef<HTMLDivElement>(null);
  const activeIdxRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const { gsap, ScrollTrigger } = registerGsap();

    const mm = gsap.matchMedia();

    // Desktop (1024px+): Pinned Horizontal Journey
    mm.add("(min-width: 1024px)", () => {
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!section || !viewport || !track) return;

      const getScrollDistance = () => {
        return Math.max(0, track.scrollWidth - viewport.clientWidth);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(getScrollDistance() * 1.25, 1400)}`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            if (progressFillRef.current) {
              progressFillRef.current.style.transform = `scaleX(${self.progress})`;
            }
            const total = TIMELINE_CHAPTERS.length;
            const idx = Math.min(
              total - 1,
              Math.floor(self.progress * total + 0.08)
            );
            if (idx !== activeIdxRef.current) {
              activeIdxRef.current = idx;
              setActiveIdx(idx);
              playSfx("step");
            }
          },
        },
      });

      tl.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        force3D: true,
      });
    });

    // Mobile & Tablet (<1024px): Vertical Timeline with Drawing Spine
    mm.add("(max-width: 1023px)", () => {
      if (mobileLineFillRef.current) {
        gsap.fromTo(
          mobileLineFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              end: "bottom 75%",
              scrub: 0.6,
            },
          }
        );
      }

      const cards = gsap.utils.toArray<HTMLElement>(".origin-mobile-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 24, opacity: 0.25 },
          {
            y: 0,
            opacity: 1,
            force3D: true,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 62%",
              scrub: 0.7,
              onEnter: () => playSfx("step"),
            },
          }
        );
      });
    });

    // Refresh ScrollTrigger measurements after layout settles
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(id);
      mm.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="origin"
      ref={sectionRef}
      className="relative border-t border-[var(--border)] bg-[var(--bg)] py-16 transition-colors duration-500 sm:py-24 lg:flex lg:h-[100svh] lg:min-h-[680px] lg:flex-col lg:justify-between lg:overflow-hidden lg:py-14"
    >
      {/* Section Header + Desktop Step Rail */}
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Experience &amp; Education
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
              <LineReveal>Background</LineReveal>
            </h2>
          </div>

          {/* Desktop Chapter Indicator */}
          <div className="hidden items-center gap-6 lg:flex">
            <span className="text-xs text-[var(--muted)]">
              Scroll to traverse timeline →
            </span>
            <div className="font-mono-tech rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text)]">
              <span className="text-[var(--accent)]">
                {String(activeIdx + 1).padStart(2, "0")}
              </span>
              <span className="mx-1.5 text-[var(--muted)]">/</span>
              <span>{String(TIMELINE_CHAPTERS.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>

        {/* Desktop Horizontal Progress Rail & Milestone Nodes */}
        <div className="mt-8 hidden lg:block">
          <div className="relative h-[2px] w-full bg-[var(--border)]">
            <div
              ref={progressFillRef}
              style={{ transform: "scaleX(0)" }}
              className="h-full w-full origin-left bg-[var(--accent)] will-change-transform"
            />
          </div>
          <div className="mt-3 grid grid-cols-5 gap-4">
            {TIMELINE_CHAPTERS.map((item, idx) => {
              const isReached = idx <= activeIdx;
              const isCurrent = idx === activeIdx;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2 text-xs transition-colors duration-300"
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${isCurrent
                      ? "scale-125 bg-[var(--accent)]"
                      : isReached
                        ? "bg-[var(--text)]"
                        : "bg-[var(--border)]"
                      }`}
                  />
                  <span
                    className={`font-mono-tech ${isCurrent
                      ? "font-semibold text-[var(--accent)]"
                      : isReached
                        ? "text-[var(--text)]"
                        : "text-[var(--muted)]"
                      }`}
                  >
                    {item.id}
                  </span>
                  <span
                    className={`truncate ${isCurrent
                      ? "font-medium text-[var(--text)]"
                      : "text-[var(--muted)]"
                      }`}
                  >
                    {SHORT_LABELS[idx] ?? item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Filmstrip Track (1024px+) */}
      <div
        ref={viewportRef}
        className="mx-auto my-auto hidden w-full max-w-7xl overflow-visible px-8 lg:block"
      >
        <div
          ref={trackRef}
          className="flex w-max items-stretch gap-7 pr-24 will-change-transform"
        >
          {TIMELINE_CHAPTERS.map((item, idx) => {
            const isActive = idx === activeIdx;
            return (
              <article
                key={item.id}
                className={`origin-card relative flex w-[430px] shrink-0 flex-col justify-between rounded-2xl border p-8 transition-all duration-500 xl:w-[460px] ${isActive
                  ? "border-[var(--accent)]/55 bg-[var(--surface)] shadow-sm"
                  : "border-[var(--border)] bg-[var(--surface)]/45 opacity-75 hover:opacity-100"
                  }`}
              >
                <div>
                  {/* Top Row: Period Badge & Giant Step Number */}
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono-tech inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs font-medium text-[var(--text)]">
                      {item.period}
                    </span>
                    <span
                      className={`font-display text-4xl font-bold leading-none tracking-tight transition-colors duration-300 ${isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--muted)]/35"
                        }`}
                    >
                      {item.id}
                    </span>
                  </div>

                  {/* Milestone Title & Institution */}
                  <h3 className="font-display mt-6 text-2xl font-bold leading-snug tracking-tight text-[var(--text)]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm font-medium text-[var(--accent)]">
                    {item.place}
                  </p>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                    {item.description}
                  </p>
                </div>

                {/* Tags Footer */}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono-tech rounded-md bg-[var(--bg)] px-2.5 py-1 text-[11px] text-[var(--muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Mobile & Tablet Vertical Timeline (<1024px) */}
      <div className="mx-auto mt-10 w-full max-w-7xl px-5 sm:px-8 lg:hidden">
        <div className="relative pl-6 sm:pl-8">
          {/* Vertical Spine Base & Fill */}
          <div className="
            absolute top-2 bottom-2 left-1.5 w-[2px] bg-[var(--border)] sm:left-2
          ">
            <div
              ref={mobileLineFillRef}
              style={{ transform: "scaleY(0)" }}
              className="h-full w-full origin-top bg-[var(--accent)] will-change-transform"
            />
          </div>

          <div className="space-y-8">
            {TIMELINE_CHAPTERS.map((item) => (
              <article
                key={item.id}
                className="origin-mobile-card relative rounded-xl border border-[var(--border)] bg-[var(--surface)]/55 p-5 sm:p-6"
              >
                {/* Node dot on the vertical spine */}
                <span className="absolute top-6 -left-[23px] h-3 w-3 rounded-full border-2 border-[var(--accent)] bg-[var(--bg)] sm:-left-[29px]" />

                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-tech text-xs font-medium text-[var(--accent)]">
                    {item.period}
                  </span>
                  <span className="font-mono-tech text-xs text-[var(--muted)]">
                    {item.id}
                  </span>
                </div>

                <h3 className="font-display mt-2 text-xl font-bold text-[var(--text)]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-[var(--accent)]">
                  {item.place}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {item.description}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono-tech rounded bg-[var(--bg)] px-2 py-0.5 text-[11px] text-[var(--muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
