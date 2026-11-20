"use client";

import { useState } from "react";
import { Preloader } from "@/components/sections/preloader";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Work } from "@/components/sections/work";
import { Origin } from "@/components/sections/origin";
import { Stack } from "@/components/sections/stack";
import { Contact } from "@/components/sections/contact";

export function PortfolioShell() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setHeroReady(true)} />
      <main className="relative">
        <Hero ready={heroReady} />
        <Manifesto />
        <Work />
        <Origin />
        <Stack />
      </main>
      <Contact />
    </>
  );
}
