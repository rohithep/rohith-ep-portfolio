import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrollProvider } from "@/lib/smooth-scroll-provider";
import { SoundProvider } from "@/components/ui/sound-provider";
import { Navbar } from "@/components/ui/navbar";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { SITE_CONFIG } from "@/content/projects";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "Rohith EP — Software Engineer & AI Developer",
    template: "%s | Rohith EP",
  },
  description:
    "Portfolio of Rohith EP (BSc Computer Science, Farook College; MCA First Class with Distinction, CUSAT 2026). Software Engineer & AI Developer building AI applications, full-stack web platforms, and custom e-commerce systems.",
  keywords: [
    "Rohith EP",
    "Software Engineer",
    "AI Developer",
    "Next.js Developer",
    "Full-Stack Developer Kerala",
    "Shopify Developer",
    "Flutter Developer",
  ],
  authors: [{ name: "Rohith EP", url: SITE_CONFIG.url }],
  creator: "Rohith EP",
  openGraph: {
    title: "Rohith EP — Software Engineer & AI Developer",
    description:
      "MCA 2026 graduate building AI applications, Next.js full-stack platforms, and high-converting e-commerce storefronts.",
    url: SITE_CONFIG.url,
    siteName: "Rohith EP Portfolio",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohith EP — Software Engineer & AI Developer",
    description:
      "MCA 2026 graduate building AI applications, Next.js full-stack platforms, and high-converting e-commerce storefronts.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rohith EP",
  jobTitle: "Software Engineer & AI Developer",
  url: SITE_CONFIG.url,
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "College of Engineering Thalassery (CUSAT)",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Farook College, Kozhikode",
    },
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Large Language Models",
    "Python",
    "Next.js",
    "React",
    "TypeScript",
    "Flutter",
    "Shopify",
    "PostgreSQL",
  ],
  sameAs: [SITE_CONFIG.github, SITE_CONFIG.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider>
          <SoundProvider>
            <SmoothScrollProvider>
              <CustomCursor />
              <Navbar />
              {children}
            </SmoothScrollProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
