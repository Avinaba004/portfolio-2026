"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { projectSlugByName, stackEdges, stackNodes } from "@/data/system";
import { skillGroups } from "@/data/profile";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useApp } from "@/components/system/AppProvider";
import { SkillAtlas } from "./SkillAtlas";
import { useFinePointer } from "@/lib/hooks";

function DependencyGraph() {
  const [sel, setSel] = useState("python");
  const { sfx } = useApp();
  const node = stackNodes.find((n) => n.id === sel)!;
  const neighbors = useMemo(() => new Set(stackEdges.filter(([a, b]) => a === sel || b === sel).flat()), [sel]);
  const pos = (id: string) => stackNodes.find((n) => n.id === id)!;
  const packets = useFinePointer();

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      {/* Graph */}
      <div className="crop relative h-[460px] rounded-[28px] border border-line bg-card/60 sm:h-[600px]">
        <div className="bp-dots absolute inset-0 rounded-[28px] opacity-50" aria-hidden />
        <svg className="absolute inset-x-[11%] inset-y-[7%] h-[86%] w-[78%] overflow-visible sm:inset-[6%] sm:h-[88%] sm:w-[88%]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {stackEdges.map(([a, b]) => {
            const on = a === sel || b === sel;
            const A = pos(a);
            const B = pos(b);
            const d = `M${A.x},${A.y} L${B.x},${B.y}`;
            return (
              <g key={a + b}>
                <motion.path
                  d={d}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  animate={{ stroke: on ? "var(--signal)" : "rgba(17,17,20,0.16)", strokeWidth: on ? 2 : 1 }}
                />
                {on && packets && (
                  <circle r="0.7" fill="var(--signal)">
                    <animateMotion dur="1.4s" repeatCount="indefinite" path={a === sel ? d : `M${B.x},${B.y} L${A.x},${A.y}`} />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>
        <div className="absolute inset-x-[11%] inset-y-[7%] sm:inset-[6%]" role="listbox" aria-label="Technologies — select to see where they were used">
          {stackNodes.map((n, i) => {
            const isSel = n.id === sel;
            const near = neighbors.has(n.id);
            return (
              <motion.button
                key={n.id}
                role="option"
                aria-selected={isSel}
                onPointerEnter={() => {
                  if (n.id !== sel) sfx("tick");
                  setSel(n.id);
                }}
                onFocus={() => setSel(n.id)}
                onClick={() => setSel(n.id)}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 220, damping: 16 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <motion.span
                  animate={{ scale: isSel ? 1.15 : 1 }}
                  className={`block rounded-xl border px-2.5 py-1.5 whitespace-nowrap shadow-[var(--shadow-sm)] transition-colors sm:px-3.5 sm:py-2 ${
                    isSel
                      ? "border-ink bg-ink text-white"
                      : near
                        ? "border-signal bg-signal/10 text-ink"
                        : n.kind === "tech"
                          ? "border-line bg-card text-ink"
                          : "border-dashed border-line-strong bg-paper text-ink-2"
                  } ${n.kind === "tech" ? "font-display text-[10px] font-bold tracking-wider sm:text-xs" : "font-mono text-[9px] tracking-widest sm:text-[10px]"}`}
                >
                  {n.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
        <div className="absolute bottom-3 left-4 flex gap-4 font-mono text-[9.5px] text-muted">
          <span>■ TECHNOLOGY</span>
          <span>▢ CAPABILITY</span>
        </div>
      </div>

      {/* Detail */}
      <div className="panel flex flex-col !rounded-[28px] p-6 sm:p-8" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={sel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <div className="label">{node.kind === "tech" ? "TECHNOLOGY" : "CAPABILITY"}</div>
            <div className="mt-2 font-display text-4xl font-bold tracking-tight">{node.label}</div>
            <div className="mt-8 label">USED IN</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {node.usedIn.map((p) => {
                const slug = projectSlugByName[p];
                return slug ? (
                  <Link key={p} href={`/work/${slug}`} className="rounded-lg bg-ink px-3 py-1.5 font-display text-[11px] font-semibold tracking-wider text-white transition-transform hover:-translate-y-0.5">
                    {p} ↗
                  </Link>
                ) : (
                  <span key={p} className="rounded-lg border border-line bg-paper px-3 py-1.5 font-display text-[11px] font-semibold tracking-wider">
                    {p}
                  </span>
                );
              })}
            </div>
            <div className="mt-8 label">FOR</div>
            <ul className="mt-3 space-y-2">
              {node.purpose.map((p, i) => (
                <motion.li key={p} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-2.5 text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  {p}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
        <p className="mt-auto pt-8 font-mono text-[10px] text-muted">Hover or tab through the graph →</p>
      </div>
    </div>
  );
}

function SkillTicker() {
  const items = skillGroups.flatMap((g) => g.items);
  return (
    <div className="relative mt-16 overflow-hidden border-y border-line py-4" aria-label="Full skill list">
      <div className="marquee flex w-max gap-8 whitespace-nowrap">
        {[...items, ...items].map((s, i) => (
          <span key={i} className="font-mono text-xs tracking-widest text-ink-2" aria-hidden={i >= items.length}>
            {s.toUpperCase()} <span className="text-signal">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function StackGraph() {
  return (
    <Section id="stack" debug="StackGraph · SkillAtlas" labelledBy="stack-h">
      <SectionHeader
        index="04"
        kicker="MY ENGINEERING STACK"
        title={
          <span id="stack-h">
            Not a skill list.
            <br />A <span className="text-cobalt">dependency graph.</span>
          </span>
        }
        intro="Every technology is connected to where I used it and why. Hover a node to trace it through the system."
      />
      <DependencyGraph />
      <SkillAtlas />
      <SkillTicker />
    </Section>
  );
}
