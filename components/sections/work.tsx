"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { PROJECTS } from "@/content/projects";
import { registerGsap } from "@/lib/gsap-register";
import { usePrefersReducedMotion } from "@/lib/smooth-scroll-provider";
import { LineReveal } from "@/components/ui/line-reveal";
import { playSfx } from "@/lib/sfx";

export function Work() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      // Clip-path horizontal slit reveal on project frames + pitch-stepped aperture shutter SFX
      const wrappers = gsap.utils.toArray<HTMLElement>(".editorial-frame");
      wrappers.forEach((frame, idx) => {
        let shutterFired = false;

        gsap.fromTo(
          frame,
          { clipPath: "inset(44% 0% 44% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: frame,
              start: "top 92%",
              end: "top 36%",
              scrub: 1.3,
              onUpdate(self) {
                if (!shutterFired && self.progress >= 0.56) {
                  shutterFired = true;
                  playSfx("shutter-open", false, idx);
                } else if (shutterFired && self.progress <= 0.14) {
                  shutterFired = false;
                }
              },
            },
          }
        );
      });

      // Inner image counter-scale & parallax pan
      const frames = gsap.utils.toArray<HTMLElement>(".editorial-media");
      frames.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -10, scale: 1.18 },
          {
            yPercent: 10,
            scale: 1.02,
            force3D: true,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest(".editorial-project"),
              start: "top bottom",
              end: "bottom top",
              scrub: 1.35,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="border-t border-[var(--border)] bg-[var(--section-work)] py-16 transition-colors duration-500 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Sticky Left Editorial Column */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                Selected Work
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
                <LineReveal>Projects &amp;</LineReveal>
                <LineReveal delay={0.08}>Case Studies</LineReveal>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                From AI video generation at Mexilet Technologies to live
                e-commerce storefronts and university systems.
              </p>
            </div>
          </div>

          {/* Scrolling Right Showcase Column */}
          <div className="space-y-16 sm:space-y-20 lg:col-span-8 lg:space-y-28">
            {PROJECTS.map((project, idx) => (
              <article
                key={project.slug}
                className="editorial-project group border-t border-[var(--border)] pt-6 sm:pt-8"
              >
                <div className="mb-4 flex items-baseline justify-between gap-3 sm:mb-5 sm:gap-4">
                  <div className="flex items-baseline gap-3 sm:gap-4">
                    <span className="font-mono-tech shrink-0 text-xs text-[var(--accent)]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={`/work/${project.slug}`}
                      data-sfx-custom="true"
                      onClick={() => playSfx("portal-open")}
                    >
                      <h3 className="font-display text-xl font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent)] sm:text-2xl lg:text-3xl">
                        <LineReveal>{project.title}</LineReveal>
                      </h3>
                    </Link>
                  </div>
                  <span className="font-mono-tech shrink-0 text-xs text-[var(--muted)]">
                    {project.year}
                  </span>
                </div>

                <Link
                  href={`/work/${project.slug}`}
                  data-sfx-custom="true"
                  onClick={() => playSfx("portal-open")}
                  className="editorial-frame block aspect-[16/10] w-full overflow-hidden rounded-lg bg-[var(--surface)] will-change-[clip-path]"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="editorial-media h-full w-full object-cover"
                  />
                </Link>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-12">
                  <p className="text-sm leading-relaxed text-[var(--muted)] sm:col-span-7">
                    {project.summary}
                  </p>
                  <div className="flex flex-col items-start justify-between gap-4 sm:col-span-5 sm:items-end">
                    <p className="text-xs text-[var(--muted)] sm:text-right">
                      {project.stack.join(" · ")}
                    </p>
                    <div className="flex items-center gap-5">
                      <Link
                        href={`/work/${project.slug}`}
                        data-sfx-custom="true"
                        onClick={() => playSfx("portal-open")}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text)] underline underline-offset-4 hover:text-[var(--accent)]"
                      >
                        <span>Read case study</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          data-sfx-custom="true"
                          onClick={() => playSfx("launch")}
                          className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--text)]"
                        >
                          <span>Live</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
