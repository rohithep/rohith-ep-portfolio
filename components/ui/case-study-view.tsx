"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Maximize2,
  X,
} from "lucide-react";
import type { Project, ProjectGalleryItem } from "@/content/projects";
import { registerGsap } from "@/lib/gsap-register";
import { usePrefersReducedMotion } from "@/lib/smooth-scroll-provider";
import { playSfx } from "@/lib/sfx";

export function CaseStudyView({
  project,
  nextProject,
}: {
  project: Project;
  nextProject?: Project;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const [lightboxItem, setLightboxItem] = useState<ProjectGalleryItem | null>(
    null
  );

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      // 1. Hero screenshot slit reveal + aperture sound
      if (heroFrameRef.current) {
        gsap.fromTo(
          heroFrameRef.current,
          { clipPath: "inset(35% 0% 35% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.05,
            ease: "power3.out",
            onStart: () => {
              playSfx("shutter-open", false, 0);
            },
          }
        );
      }

      // 2. Architecture Phase cards sequential reveal + step detent sound
      const archCards = gsap.utils.toArray<HTMLElement>(".cs-arch-card");
      archCards.forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 26, opacity: 0.15 },
          {
            y: 0,
            opacity: 1,
            force3D: true,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 58%",
              scrub: 0.9,
              onEnter: () => playSfx("step"),
            },
          }
        );
      });

      // 3. Gallery figures slit reveal + pitch-stepped aperture shutter sound
      const galleryCards = gsap.utils.toArray<HTMLElement>(".cs-gallery-card");
      galleryCards.forEach((card, idx) => {
        let fired = false;
        gsap.fromTo(
          card,
          { clipPath: "inset(38% 0% 38% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              end: "top 44%",
              scrub: 1.15,
              onUpdate(self) {
                if (!fired && self.progress >= 0.58) {
                  fired = true;
                  playSfx("shutter-open", false, idx + 1);
                } else if (fired && self.progress <= 0.12) {
                  fired = false;
                }
              },
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion, project.slug]);

  return (
    <main ref={containerRef} className="min-h-screen pt-24 pb-20 sm:pt-28 sm:pb-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Top Back Link */}
        <Link
          href="/#work"
          data-sfx-custom="true"
          onClick={() => playSfx("portal-close")}
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Selected Work</span>
        </Link>

        {/* Hero Header */}
        <div className="mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.14em]">
              <span className="text-[var(--accent)]">{project.category}</span>
              <span className="text-[var(--muted)]">·</span>
              <span className="text-[var(--muted)]">{project.context}</span>
              <span className="text-[var(--muted)]">·</span>
              <span className="text-[var(--text)]">{project.year}</span>
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              {project.summary}
            </p>
          </div>

          {project.liveUrl && (
            <div className="shrink-0">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                data-sfx-custom="true"
                onClick={() => playSfx("launch")}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-5 py-3 text-xs font-semibold text-[var(--bg)] transition-opacity hover:opacity-85"
              >
                <span>Visit Live Site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Metadata Strip */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-y border-[var(--border)] py-6 sm:grid-cols-4">
          <div data-sfx="hover">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Role
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--text)]">
              {project.role}
            </p>
          </div>
          <div data-sfx="hover">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Organization / Client
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--text)]">
              {project.context}
            </p>
          </div>
          <div data-sfx="hover">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Year
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--text)]">
              {project.year}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Live URL
            </p>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                data-sfx-custom="true"
                onClick={() => playSfx("launch")}
                className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                <span>
                  {project.liveUrl
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
                Internal / Private Build
              </p>
            )}
          </div>
        </div>

        {/* Project Hero Screenshot */}
        <div
          ref={heroFrameRef}
          onMouseEnter={() => playSfx("focus")}
          className="mt-10 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] will-change-[clip-path]"
        >
          <img
            src={project.image}
            alt={project.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>

        {/* Problem & Approach */}
        <div className="mt-14 grid grid-cols-1 gap-8 border-t border-[var(--border)] pt-12 md:grid-cols-2 md:gap-12">
          <div data-sfx="card">
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              The Problem
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text)]/90 sm:text-base">
              {project.problem}
            </p>
          </div>

          <div data-sfx="card">
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              The Engineering Approach
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text)]/90 sm:text-base">
              {project.approach}
            </p>
          </div>
        </div>

        {/* Optional 3-Phase System Architecture Breakdown */}
        {project.architecture && project.architecture.length > 0 && (
          <div className="mt-14 border-t border-[var(--border)] pt-12">
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              System Architecture &amp; Workflow
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {project.architecture.map((step, idx) => (
                <div
                  key={step.phase}
                  data-sfx="card"
                  onClick={() => playSfx("shutter-open", false, idx)}
                  className="cs-arch-card flex cursor-default flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)]/55 p-6 transition-colors hover:border-[var(--accent)]/55"
                >
                  <div>
                    <span className="font-mono-tech text-xs font-semibold text-[var(--accent)]">
                      {step.phase}
                    </span>
                    <h3 className="font-display mt-2 text-lg font-bold text-[var(--text)]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Product & Interface Gallery with Full-Screen Lightbox */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-14 border-t border-[var(--border)] pt-12">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                Interface &amp; Feature Highlights
              </h2>
              <span className="text-xs text-[var(--muted)]">
                Click any screenshot to inspect
              </span>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {project.gallery.map((item, idx) => (
                <figure
                  key={item.src}
                  data-sfx-custom="true"
                  onMouseEnter={() => playSfx("focus")}
                  onClick={() => {
                    playSfx("shutter-open", false, idx + 1);
                    setLightboxItem(item);
                  }}
                  className="cs-gallery-card group cursor-pointer overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]/45 transition-colors hover:border-[var(--accent)]/60 will-change-[clip-path]"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <figcaption className="border-t border-[var(--border)] px-4 py-3 text-xs font-medium text-[var(--muted)] transition-colors group-hover:text-[var(--text)]">
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Key Contributions & Tech Stack */}
        <div className="mt-14 border-t border-[var(--border)] pt-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            Key Contributions &amp; Deliverables
          </h2>
          <ul className="mt-5 space-y-3">
            {project.deliverables.map((item) => (
              <li
                key={item}
                data-sfx="hover"
                className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text)] transition-colors hover:text-[var(--accent)] sm:text-base"
              >
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Technology Stack
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  data-sfx="hover"
                  className="font-mono-tech cursor-default rounded-full border border-[var(--border)] bg-[var(--surface)]/50 px-3.5 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Next Project Navigation Footer */}
        {nextProject && nextProject.slug !== project.slug && (
          <div className="mt-16 border-t border-[var(--border)] pt-10">
            <Link
              href={`/work/${nextProject.slug}`}
              data-sfx-custom="true"
              onClick={() => playSfx("portal-open")}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-6 transition-colors hover:border-[var(--accent)]/60 sm:p-8"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                  Next Case Study
                </p>
                <p className="font-display mt-2 text-2xl font-bold text-[var(--text)] transition-colors group-hover:text-[var(--accent)] sm:text-3xl">
                  {nextProject.title}
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Full-Screen Screenshot Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => {
              playSfx("portal-close");
              setLightboxItem(null);
            }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90svh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-[#0B0B0C] shadow-2xl"
            >
              <button
                type="button"
                data-sfx-custom="true"
                onClick={() => {
                  playSfx("portal-close");
                  setLightboxItem(null);
                }}
                aria-label="Close image preview"
                className="cursor-pointer absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={lightboxItem.src}
                alt={lightboxItem.caption}
                className="max-h-[80svh] w-full object-contain"
              />
              <div className="border-t border-white/10 px-5 py-3.5 text-xs font-medium text-[#F5F4F0]">
                {lightboxItem.caption}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
