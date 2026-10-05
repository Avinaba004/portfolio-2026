"use client";

import { useCallback, useEffect, useState } from "react";
import { Boot } from "@/components/hero/Boot";
import { Hero } from "@/components/hero/Hero";
import { WhatIBuild } from "@/components/sections/WhatIBuild";
import { ProjectGalaxy } from "@/components/work/ProjectGalaxy";
import { Incidents } from "@/components/sections/Incidents";
import { StackGraph } from "@/components/sections/StackGraph";
import { DNA } from "@/components/sections/DNA";
import { Timeline } from "@/components/sections/Timeline";
import { Lab } from "@/components/lab/Lab";
import { ConsoleSection, Contact } from "@/components/sections/ConsoleAndContact";
import { scrollToSection } from "@/lib/navigate";

/**
 * Every section is server-rendered with the page (no late pop-in, stable scroll height).
 * The only async asset is the 3D unit (three.js); the boot screen waits for it and the fonts.
 */
export function HomeClient() {
  const [ready, setReady] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    let alive = true;
    const fallback = setTimeout(() => alive && setAssetsReady(true), 8000); // never trap visitors on a slow network
    Promise.all([import("@/components/hero/RobotScene"), document.fonts?.ready])
      .catch(() => undefined)
      .then(() => alive && setAssetsReady(true));
    return () => {
      alive = false;
      clearTimeout(fallback);
    };
  }, []);

  // Honour deep links like /#lab after navigation from another route.
  useEffect(() => {
    if (!ready || !location.hash) return;
    const id = location.hash.slice(1);
    const t = setTimeout(() => scrollToSection(id), 350);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <>
      <Boot assetsReady={assetsReady} onDone={onDone} />
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
