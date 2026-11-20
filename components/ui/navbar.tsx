"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Moon, Sun, Volume2, VolumeX, X } from "lucide-react";
import { SITE_CONFIG } from "@/content/projects";
import {
  isSfxEnabled,
  playSfx,
  setSfxEnabled,
  subscribeSfx,
  unlockAudioContext,
} from "@/lib/sfx";

const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#origin" },
  { label: "Capabilities", href: "/#stack" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setSoundOn(isSfxEnabled());
    const unsub = subscribeSfx((enabled) => setSoundOn(enabled));

    const updateProgress = () => {
      if (!progressRef.current) return;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
      progressRef.current.style.transform = `scaleX(${ratio})`;
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => {
      unsub();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  const isDark = resolvedTheme === "dark";

  const handleToggleSound = () => {
    unlockAudioContext();
    setSfxEnabled(!soundOn);
  };

  const handleToggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? "light" : "dark";
    playSfx(nextTheme === "light" ? "theme-light" : "theme-dark");

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!doc.startViewTransition || prefersReduced) {
      setTheme(nextTheme);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const root = document.documentElement;
    root.classList.add("theme-transitioning");

    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
      root.classList.toggle("dark", nextTheme === "dark");
      root.classList.toggle("light", nextTheme === "light");
      root.style.colorScheme = nextTheme;
    });

    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 680,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});

    transition.finished.finally(() => {
      root.classList.remove("theme-transitioning");
    });
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
        {/* Thin Vermilion Scroll Progress Line at Very Top of Nav */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-transparent">
          <div
            ref={progressRef}
            style={{ transform: "scaleX(0)" }}
            className="h-full w-full origin-left bg-[var(--accent)] will-change-transform"
          />
        </div>

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="font-display text-sm font-bold tracking-[-0.02em] text-[var(--text)] transition-opacity hover:opacity-70"
          >
            Rohith EP
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Sound Effects Toggle */}
            <button
              type="button"
              data-sfx-custom="true"
              onClick={handleToggleSound}
              aria-label={soundOn ? "Mute sound effects" : "Enable sound effects"}
              title={soundOn ? "Sound Effects: On" : "Sound Effects: Off"}
              className={`cursor-pointer flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                mounted && soundOn
                  ? "border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--text)] hover:text-[var(--text)]"
              }`}
            >
              {mounted ? (
                soundOn ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )
              ) : (
                <span className="h-4 w-4" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              data-sfx-custom="true"
              onClick={handleToggleTheme}
              aria-label="Toggle color theme"
              className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors hover:border-[var(--text)]"
            >
              {mounted ? (
                isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )
              ) : (
                <span className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              data-sfx-custom="true"
              onClick={() => {
                setMenuOpen(true);
                playSfx("whoosh");
              }}
              aria-label="Open navigation menu"
              className="cursor-pointer flex h-9 items-center gap-2 rounded-full border border-[var(--border)] px-3.5 text-xs font-medium text-[var(--text)] md:hidden"
            >
              <Menu className="h-4 w-4" />
              <span>Menu</span>
            </button>

            <Link
              href="/#contact"
              className="hidden rounded-full bg-[var(--text)] px-4 py-2 text-xs font-semibold text-[var(--bg)] transition-opacity hover:opacity-85 md:inline-flex"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex flex-col justify-between bg-[var(--bg)] p-6 sm:p-10"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold text-[var(--text)]">
                Rohith EP
              </span>
              <button
                type="button"
                data-sfx-custom="true"
                onClick={() => {
                  setMenuOpen(false);
                  playSfx("whoosh");
                }}
                aria-label="Close navigation menu"
                className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-4xl font-bold tracking-tight text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)]">
              <span>{SITE_CONFIG.location}</span>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-[var(--text)] underline underline-offset-4"
              >
                {SITE_CONFIG.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
