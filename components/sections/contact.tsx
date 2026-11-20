"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy, FileText, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/content/projects";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { LineReveal } from "@/components/ui/line-reveal";
import { playSfx } from "@/lib/sfx";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const update = () => {
      setLocalTime(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      setCopied(true);
      playSfx("success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  return (
    <footer
      id="contact"
      className="border-t border-[var(--border)] bg-[var(--surface-elevated)]/65 pt-16 pb-10 transition-colors duration-500 sm:pt-24 sm:pb-12"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Contact
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold leading-[1.06] tracking-tight text-[var(--text)] sm:text-6xl lg:text-7xl lg:leading-[1.04]">
              <LineReveal>
                Let&apos;s work{" "}
                <span className="text-[var(--accent)]">together.</span>
              </LineReveal>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:mt-5 sm:text-base">
              Open to full-time Software Engineer &amp; AI Developer roles
              (relocatable) and remote freelance projects.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
              <MagneticButton
                href={`mailto:${SITE_CONFIG.email}`}
                className="rounded-full bg-[var(--text)] px-5 py-2.5 text-xs font-semibold text-[var(--bg)] transition-opacity hover:opacity-85 sm:px-6 sm:py-3"
              >
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
              </MagneticButton>

              <MagneticButton
                onClick={handleCopyEmail}
                className="max-w-full rounded-full border border-[var(--border)] px-4 py-2.5 text-xs font-semibold text-[var(--text)] transition-colors hover:border-[var(--text)] sm:px-5 sm:py-3"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 shrink-0" />
                    <span className="truncate">{SITE_CONFIG.email}</span>
                  </>
                )}
              </MagneticButton>

              <MagneticButton
                href={SITE_CONFIG.resumePath}
                download
                className="rounded-full border border-[var(--border)] px-4 py-2.5 text-xs font-semibold text-[var(--text)] transition-colors hover:border-[var(--text)] sm:px-5 sm:py-3"
              >
                <FileText className="h-4 w-4" />
                <span>Résumé (PDF)</span>
              </MagneticButton>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-6 lg:col-span-4 lg:items-end lg:text-right">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Location &amp; Local Time
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                Kerala, India {localTime ? `· ${localTime} IST` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-5 text-sm font-medium">
              <a
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--text)] hover:text-[var(--accent)]"
              >
                <span>GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={SITE_CONFIG.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--text)] hover:text-[var(--accent)]"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={SITE_CONFIG.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--text)] hover:text-[var(--accent)]"
              >
                <span>WhatsApp</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-8 text-xs text-[var(--muted)] sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Rohith EP</span>
          <button
            type="button"
            data-sfx-custom="true"
            onClick={() => {
              playSfx("whoosh");
              window.dispatchEvent(new CustomEvent("lenis:scroll-top"));
            }}
            className="cursor-pointer inline-flex items-center gap-1.5 text-[var(--text)] hover:text-[var(--accent)]"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
