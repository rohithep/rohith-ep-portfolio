# Design System: Rohith EP Portfolio ("Signal to System")

## Concept
**Signal to System** — A dark, cinematic, scroll-storytelling developer portfolio for **Rohith EP** (Software Engineer & AI Developer; BSc Computer Science, Farook College; MCA, College of Engineering Thalassery, 2026).

## Color Tokens
| Role | Dark (Default) | Light ("Daylight Blueprint") | CSS Variable |
|---|---|---|---|
| Background | `#07080D` | `#F4F6FB` | `--bg` |
| Surface / Card | `#0E1220` | `#FFFFFF` | `--surface` |
| Elevated Surface | `#151B2E` | `#EEF2FA` | `--surface-elevated` |
| Primary Text | `#EAF0FF` | `#0B1020` | `--text` |
| Muted Text | `#8A94B0` | `#4B5470` | `--muted` |
| Primary Accent (Signal) | `#2EE6FF` | `#0E7490` | `--accent` |
| Highlight (Amber CTA) | `#FFB547` | `#B45309` | `--highlight` |
| Border | `rgba(255,255,255,0.08)` | `rgba(11,16,32,0.10)` | `--border` |

## Typography
- **Display:** `Syne` (wide, editorial, futuristic display)
- **Body / UI:** `Inter` (clean precision readability)
- **Mono / Telemetry:** `Space Mono` (chapter numbers, coordinates, stack tags)

## Motion & Architecture Rules
1. **Lenis + GSAP ScrollTrigger** share one ticker (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add((t) => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`).
2. **Ownership Rule:** GSAP owns scroll-linked animations (pins, parallax, scrubbed timelines, SVG liquid hover). Framer Motion (`motion/react`) owns mount/unmount, preloader wipe, magnetic buttons, custom cursor, menu, and route transitions. Never animate the same property with both.
3. **Accessibility:** `prefers-reduced-motion` disables pins, parallax, and smooth scroll; visible focus rings; WCAG AA contrast in both themes.
4. **Anti-patterns:** No generic purple-pink AI gradients; no fake testimonials or fabricated metrics; no heavy video blocking mobile performance.
