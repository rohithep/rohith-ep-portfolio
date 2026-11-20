"use client";

import { useEffect, useRef } from "react";
import { registerGsap } from "@/lib/gsap-register";
import { usePrefersReducedMotion } from "@/lib/smooth-scroll-provider";
import { playSfx } from "@/lib/sfx";

interface ManifestoWord {
  text: string;
  accent?: boolean;
}

const MANIFESTO_LINES: ManifestoWord[][] = [
  [
    { text: "I" },
    { text: "design" },
    { text: "and" },
    { text: "engineer" },
  ],
  [
    { text: "intelligent", accent: true },
    { text: "software,", accent: true },
    { text: "full-stack" },
  ],
  [
    { text: "web" },
    { text: "platforms," },
    { text: "and" },
    { text: "custom", accent: true },
  ],
  [
    { text: "e-commerce", accent: true },
    { text: "experiences" },
    { text: "built" },
  ],
  [
    { text: "to" },
    { text: "perform" },
    { text: "in" },
    { text: "the" },
    { text: "real" },
    { text: "world." },
  ],
];

const FLAT_WORDS = MANIFESTO_LINES.flat();

const REAL_STATS = [
  {
    from: 0,
    to: 6,
    pad: 2,
    suffix: "",
    label: "Projects Shipped",
    detail: "AI, Full-Stack Web, Mobile & E-Commerce",
  },
  {
    from: 0,
    to: 3,
    pad: 2,
    suffix: "",
    label: "Live Client Builds",
    detail: "Kanaa.online, Custom Shopify & Agency",
  },
  {
    from: 2016,
    to: 2026,
    pad: 0,
    suffix: "",
    label: "MCA First Class with Distinction (CUSAT)",
    detail: "BSc Computer Science · Farook College",
  },
];

export function Manifesto() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const statsDividerRef = useRef<HTMLDivElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lastWordIdxRef = useRef<number>(-1);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      // Top section rule draw
      if (topLineRef.current) {
        gsap.fromTo(
          topLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            force3D: true,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 88%",
              end: "top 45%",
              scrub: 0.8,
            },
          }
        );
      }

      // Style A: Magnetic Word Stream from the Right (Line by Line) + Scroll SFX
      const lineEls = gsap.utils.toArray<HTMLElement>(".manifesto-line");
      if (lineEls.length && headingRef.current) {
        const totalWords = FLAT_WORDS.length;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 88%",
            end: "bottom 66%",
            scrub: 0.7,
            onUpdate(self) {
              if (self.progress <= 0.01 || self.progress >= 0.99) return;
              const currentWordIdx = Math.min(
                totalWords - 1,
                Math.floor(self.progress * totalWords)
              );
              if (currentWordIdx !== lastWordIdxRef.current) {
                lastWordIdxRef.current = currentWordIdx;
                const wordObj = FLAT_WORDS[currentWordIdx];
                playSfx(wordObj?.accent ? "word-accent" : "word-snap");
              }
            },
          },
        });

        lineEls.forEach((lineEl, lineIdx) => {
          const words = lineEl.querySelectorAll<HTMLElement>(".manifesto-word");
          tl.fromTo(
            words,
            {
              x: 110,
              y: 12,
              rotate: 2,
              opacity: 0,
              filter: "blur(5px)",
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              opacity: 1,
              filter: "blur(0px)",
              stagger: 0.07,
              duration: 0.5,
              force3D: true,
              ease: "power3.out",
            },
            lineIdx * 0.24
          );
        });
      }

      // Stats divider draw
      if (statsDividerRef.current) {
        gsap.fromTo(
          statsDividerRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            force3D: true,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsGridRef.current,
              start: "top 90%",
              end: "top 60%",
              scrub: 0.8,
            },
          }
        );
      }

      // Real Stat Number Counters + Counter Tick SFX
      REAL_STATS.forEach((stat, idx) => {
        const el = numRefs.current[idx];
        if (!el) return;
        const counter = { val: stat.from };
        let prevRounded = stat.from;
        gsap.to(counter, {
          val: stat.to,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsGridRef.current,
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            const rounded = Math.round(counter.val);
            if (rounded !== prevRounded) {
              prevRounded = rounded;
              // Drive counter ticks from the 10-step 2016->2026 counter so every step ticks cleanly
              if (idx === 2 || idx === 0) {
                playSfx("counter");
              }
            }
            el.textContent =
              (stat.pad
                ? String(rounded).padStart(stat.pad, "0")
                : String(rounded)) + stat.suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-24 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          ref={topLineRef}
          className="mb-10 h-px w-full origin-left bg-[var(--border)] sm:mb-14"
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Editorial Label */}
          <div className="lg:col-span-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              About
            </p>
          </div>

          {/* Right Kinetic Statement + Real Stats */}
          <div className="lg:col-span-9">
            <h2
              ref={headingRef}
              aria-label="I design and engineer intelligent software, full-stack web platforms, and custom e-commerce experiences built to perform in the real world."
              className="font-display space-y-1 text-2xl font-bold leading-[1.2] tracking-tight text-[var(--text)] sm:text-4xl lg:text-6xl lg:leading-[1.15]"
            >
              {MANIFESTO_LINES.map((line, lineIdx) => (
                <span key={lineIdx} className="manifesto-line block">
                  {line.map((word, wordIdx) => (
                    <span
                      key={wordIdx}
                      data-sfx="hover"
                      className={`manifesto-word mr-[0.26em] inline-block cursor-default transition-colors duration-200 will-change-transform ${
                        word.accent
                          ? "text-[var(--accent)]"
                          : "text-[var(--text)] hover:text-[var(--accent)]"
                      }`}
                    >
                      {word.text}
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            {/* Self-Drawing Divider + Real Stat Counters */}
            <div ref={statsGridRef} className="mt-14 pt-10">
              <div
                ref={statsDividerRef}
                className="mb-10 h-px w-full origin-left bg-[var(--border)]"
              />
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                {REAL_STATS.map((stat, idx) => (
                  <div
                    key={stat.label}
                    data-sfx="card"
                    className="group space-y-1.5 rounded-xl p-2 -m-2 transition-colors hover:bg-[var(--surface)]/40"
                  >
                    <div className="font-display text-4xl font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent)] sm:text-5xl">
                      <span
                        ref={(el) => {
                          numRefs.current[idx] = el;
                        }}
                      >
                        {stat.pad
                          ? String(stat.to).padStart(stat.pad, "0")
                          : String(stat.to)}
                        {stat.suffix}
                      </span>
                      <span className="text-[var(--accent)]">.</span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {stat.label}
                    </p>
                    <p className="text-xs text-[var(--muted)]">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
