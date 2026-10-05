"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useState } from "react";
import { profile } from "@/data/profile";
import { useApp } from "@/components/system/AppProvider";
import { scrollToSection } from "@/lib/navigate";
import { HeroGraph } from "./HeroGraph";

const RobotScene = dynamic(() => import("./RobotScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <span className="label animate-pulse">BOOTING AG-01…</span>
    </div>
  ),
});

function Word({ text, ready, delay, grad }: { text: string; ready: boolean; delay: number; grad?: boolean }) {
  return (
    <span className="flex" aria-hidden>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className={`inline-block select-none ${grad ? "text-grad" : ""}`}
          initial={{ y: "110%", rotate: 8, opacity: 0 }}
          animate={ready ? { y: "0%", rotate: 0, opacity: 1 } : {}}
          transition={{ type: "spring", stiffness: 120, damping: 16, delay: delay + i * 0.045 }}
          whileHover={{ y: -10, transition: { type: "spring", stiffness: 500, damping: 12 } }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const { pulse, sfx, showToast, setPaletteOpen } = useApp();
  const [pokes, setPokes] = useState(0);

  const onPoke = () => {
    sfx("success");
    const lines = [
      "AG-01 · Hi! I'm Avinaba's system unit.",
      "AG-01 · I carry databases, auth keys and an AI core.",
      "AG-01 · Try Ctrl/Cmd + K.",
      "AG-01 · Psst… click the logo 5× fast.",
    ];
    showToast(lines[pokes % lines.length]);
    setPokes((p) => p + 1);
  };

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { delay, type: "spring" as const, stiffness: 120, damping: 20 },
  });

  return (
    <section id="system" data-debug="Hero · SignalBus · RobotScene" tabIndex={-1} className="relative overflow-hidden outline-none" aria-labelledby="hero-title">
      {/* Quiet backdrop: grid + two soft light sources */}
      <div className="bp-grid mask-fade absolute inset-0 opacity-50" aria-hidden />
      <div className="glow pointer-events-none absolute -top-64 right-[-18%] h-[900px] w-[900px]" style={{ "--glow": "rgb(255 77 23 / 0.13)" } as React.CSSProperties} aria-hidden />
      <div className="glow pointer-events-none absolute -bottom-64 left-[-18%] h-[820px] w-[820px]" style={{ "--glow": "rgb(47 75 255 / 0.10)" } as React.CSSProperties} aria-hidden />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1500px] items-center gap-6 px-5 pt-28 pb-14 sm:px-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-4 lg:px-[6%] lg:pt-24">
        {/* Left: identity */}
        <div className="@container relative z-10 min-w-0">
          <motion.p {...fade(0.1)} className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11px] tracking-[0.18em] text-ink-2">
            <span className="h-1.5 w-1.5 rounded-full bg-mint pulse-dot" aria-hidden />
            SYSTEM READY <span className="text-muted">·</span> {profile.location.toUpperCase()}
            <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-amber/50 bg-amber/10 px-2 py-0.5 text-[10px] tracking-[0.12em] text-ink">
              <span className="text-amber" aria-hidden>★</span> RANK 1 IN COLLEGE · B.TECH CSE
            </span>
          </motion.p>

          <h1 id="hero-title" className="mt-5 font-display leading-[0.86] font-extrabold tracking-[-0.045em] text-ink">
            <span className="sr-only">Avinaba Ghosh — Software Engineer</span>
            <span className="block overflow-hidden pb-1 text-[clamp(2.4rem,14cqw,8.6rem)]">
              <Word text="AVINABA" ready={ready} delay={0.15} />
            </span>
            <span className="block overflow-hidden pb-2 text-[clamp(2.4rem,14cqw,8.6rem)]">
              <Word text="GHOSH" ready={ready} delay={0.45} grad />
            </span>
          </h1>

          <motion.div {...fade(0.9)} className="mt-5">
            <p className="font-display text-[15px] font-semibold tracking-[0.16em] sm:text-lg">SOFTWARE ENGINEER</p>
            <p className="mt-1 font-mono text-[11.5px] tracking-[0.14em] text-muted sm:text-[12.5px]">
              CLOUD DEVELOPER & CONSULTANT <span className="text-signal">@</span> BLUEVECTOR AI
            </p>
            <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-ink-2 sm:text-[17px]">{profile.headline}</p>
          </motion.div>

          <motion.div {...fade(1.05)} className="mt-7 flex flex-wrap gap-2.5">
            <button
              onClick={() => scrollToSection("work")}
              className="group flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-md)] transition-transform hover:-translate-y-0.5"
            >
              Enter the system
              <span className="transition-transform group-hover:translate-y-0.5" aria-hidden>
                ↓
              </span>
            </button>
            <button onClick={() => setPaletteOpen(true)} className="rounded-xl border border-line bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-paper-2">
              <span className="font-mono text-signal">⌘K</span> Command center
            </button>
            <a href="/resume" className="rounded-xl border border-line bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-paper-2">
              Resume mode
            </a>
          </motion.div>

          <motion.div {...fade(1.25)}>{ready && <HeroGraph />}</motion.div>
        </div>

        {/* Right: the 3D system unit, alone with room to breathe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, type: "spring", stiffness: 80, damping: 18 }}
          className="relative -mx-5 h-[340px] sm:-mx-10 sm:h-[440px] lg:mx-0 lg:h-[min(78svh,720px)]"
          title="AG-01 — click me"
        >
          {ready && <RobotScene celebrate={pulse} onPoke={onPoke} />}
          <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9.5px] tracking-[0.2em] whitespace-nowrap text-muted">AG-01 · CLICK TO INTERACT</span>
        </motion.div>
      </div>
    </section>
  );
}
