"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Boot } from "@/components/hero/Boot";
import { Hero } from "@/components/hero/Hero";
import { WhatIBuild } from "@/components/sections/WhatIBuild";
import { ProjectGalaxy } from "@/components/work/ProjectGalaxy";
import { scrollToSection } from "@/lib/navigate";

// Below-the-fold sections are split into their own chunks.
const Incidents = dynamic(() => import("@/components/sections/Incidents").then((m) => m.Incidents));
const StackGraph = dynamic(() => import("@/components/sections/StackGraph").then((m) => m.StackGraph));
const DNA = dynamic(() => import("@/components/sections/DNA").then((m) => m.DNA));
const Timeline = dynamic(() => import("@/components/sections/Timeline").then((m) => m.Timeline));
const Lab = dynamic(() => import("@/components/lab/Lab").then((m) => m.Lab));
const ConsoleSection = dynamic(() => import("@/components/sections/ConsoleAndContact").then((m) => m.ConsoleSection));
const Contact = dynamic(() => import("@/components/sections/ConsoleAndContact").then((m) => m.Contact));

export function HomeClient() {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  // Honour deep links like /#lab after navigation from another route.
  useEffect(() => {
    if (!ready || !location.hash) return;
    const id = location.hash.slice(1);
    const t = setTimeout(() => scrollToSection(id), 350);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <>
      <Boot onDone={onDone} />
      <main id="main">
        <Hero ready={ready} />
        <WhatIBuild />
        <ProjectGalaxy />
        <Incidents />
        <StackGraph />
        <DNA />
        <Timeline />
        <Lab />
        <ConsoleSection />
        <Contact />
      </main>
    </>
  );
}
