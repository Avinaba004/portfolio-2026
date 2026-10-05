"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { heroLinks, heroProjects, heroSkills, projectSlugByName } from "@/data/system";
import { useApp } from "@/components/system/AppProvider";
import { useInterval, useReducedMotionPref } from "@/lib/hooks";

type Skill = (typeof heroSkills)[number];
type Proj = (typeof heroProjects)[number];
type Sel = { kind: "skill"; id: Skill } | { kind: "project"; id: Proj } | null;
type Pt = { x: number; y: number };

/**
 * The hero's system graph as a compact "signal bus": skills on one rail, systems on the other.
 * Hover / focus / tap a skill → curved signals light the systems that use it (and vice versa).
 */
export function HeroGraph() {
  const { sfx } = useApp();
  const wrap = useRef<HTMLDivElement>(null);
  const skillRefs = useRef(new Map<string, HTMLElement>());
  const projRefs = useRef(new Map<string, HTMLElement>());
  const [hover, setHover] = useState<Sel>(null);
  const [auto, setAuto] = useState(0);
  const [inView, setInView] = useState(true);
  const reduced = useReducedMotionPref();
  // Autoplay walks the skills one by one; a hover takes over and plays only that node.
  const sel: Sel = hover ?? (reduced ? null : { kind: "skill", id: heroSkills[auto % heroSkills.length] });
  const autoplaying = !hover && !reduced;
  const [pts, setPts] = useState<{ s: Record<string, Pt>; p: Record<string, Pt>; w: number; h: number }>({ s: {}, p: {}, w: 1, h: 1 });

  const measure = useCallback(() => {
    const box = wrap.current?.getBoundingClientRect();
    if (!box) return;
    const at = (el: HTMLElement, edge: "bottom" | "top") => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: (edge === "bottom" ? r.bottom : r.top) - box.top };
    };
    const s: Record<string, Pt> = {};
    const p: Record<string, Pt> = {};
    skillRefs.current.forEach((el, k) => (s[k] = at(el, "bottom")));
    projRefs.current.forEach((el, k) => (p[k] = at(el, "top")));
    setPts({ s, p, w: box.width, h: box.height });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure]);
  useEffect(() => {
    const ro = new ResizeObserver(measure);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    if (wrap.current) {
      ro.observe(wrap.current);
      io.observe(wrap.current);
    }
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [measure]);

  useInterval(() => setAuto((a) => a + 1), autoplaying && inView ? 2200 : null);

  const links: [Skill, Proj][] =
    sel?.kind === "skill"
      ? heroLinks[sel.id].map((p) => [sel.id, p])
      : sel?.kind === "project"
        ? heroSkills.filter((s) => heroLinks[s].includes(sel.id)).map((s) => [s, sel.id])
        : [];
  const litS = new Set(links.map(([s]) => s));
  const litP = new Set(links.map(([, p]) => p));

  const pick = (next: Sel) => {
    setHover(next);
    if (next) sfx("tick");
  };
  // Forward = skill → systems. Reverse = system → skills (signals flow back up the bus).
  const reverse = sel?.kind === "project";

  const skillState = (s: Skill) => (sel?.kind === "skill" && sel.id === s ? "focus" : litS.has(s) ? "lit" : sel ? "dim" : "idle");
  const projState = (p: Proj) => (sel?.kind === "project" && sel.id === p ? "focus" : litP.has(p) ? "lit" : sel ? "dim" : "idle");

  return (
    <div className="pointer-events-auto relative mt-9 max-w-[720px]" onPointerLeave={() => pick(null)}>
      <div className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-muted">
        <span className="h-px w-6 bg-line-strong" aria-hidden />
        SYSTEM GRAPH · {autoplaying ? "AUTO-SCAN" : reverse ? "REVERSE TRACE" : "FORWARD TRACE"}
        <AnimatePresence>
          {sel && (
            <motion.span key={sel.id} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className={reverse ? "text-cobalt" : "text-signal"}>
              {sel.id} {reverse ? "←" : "→"} {links.length} {reverse ? "SKILLS" : "SYSTEMS"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div ref={wrap} className="relative">
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${pts.w} ${pts.h}`} aria-hidden>
          {links.map(([s, p], i) => {
            const a = pts.s[s];
            const b = pts.p[p];
            if (!a || !b) return null;
            const my = (a.y + b.y) / 2;
            const d = reverse ? `M${b.x},${b.y} C${b.x},${my} ${a.x},${my} ${a.x},${a.y}` : `M${a.x},${a.y} C${a.x},${my} ${b.x},${my} ${b.x},${b.y}`;
            return (
              <g key={`${sel?.kind}-${sel?.id}-${s}-${p}`}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke={reverse ? "var(--cobalt)" : "var(--signal)"}
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.9 }}
                  transition={{ duration: 0.45, delay: i * 0.05, ease: "easeOut" }}
                />
                <circle r="2.5" fill={reverse ? "var(--cobalt)" : "var(--signal)"}>
                  <animateMotion dur={`${1.1 + i * 0.1}s`} repeatCount="indefinite" path={d} />
                </circle>
              </g>
            );
          })}
        </svg>

        <ul className="relative flex flex-wrap gap-1.5" aria-label="Skills">
          {heroSkills.map((s) => {
            const st = skillState(s);
            return (
              <li key={s}>
                <button
                  ref={(el) => void (el ? skillRefs.current.set(s, el) : skillRefs.current.delete(s))}
                  onPointerEnter={() => pick({ kind: "skill", id: s })}
                  onFocus={() => pick({ kind: "skill", id: s })}
                  onClick={() => pick({ kind: "skill", id: s })}
                  aria-pressed={st === "focus"}
                  className={`rounded-lg border px-2.5 py-1.5 font-mono text-[10.5px] tracking-[0.12em] transition-all duration-200 ${
                    st === "focus"
                      ? "border-ink bg-ink text-white"
                      : st === "lit"
                        ? "border-cobalt bg-cobalt text-white"
                        : st === "dim"
                          ? "border-line bg-card/70 text-muted opacity-60"
                          : "border-line bg-card/90 text-ink-2 hover:border-ink"
                  }`}
                >
                  {s}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="h-12 sm:h-14" aria-hidden />

        <ul className="relative flex flex-wrap gap-1.5" aria-label="Systems — open a case study">
          {heroProjects.map((p) => {
            const st = projState(p);
            return (
              <li key={p}>
                <Link
                  href={`/work/${projectSlugByName[p]}`}
                  ref={(el) => void (el ? projRefs.current.set(p, el) : projRefs.current.delete(p))}
                  onPointerEnter={() => pick({ kind: "project", id: p })}
                  onFocus={() => pick({ kind: "project", id: p })}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 font-display text-[11px] font-semibold tracking-wider transition-all duration-200 ${
                    st === "focus"
                      ? "border-ink bg-ink text-white"
                      : st === "lit"
                        ? "border-signal bg-signal text-white shadow-[0_8px_20px_-8px_var(--signal)]"
                        : st === "dim"
                          ? "border-line bg-card/70 text-muted opacity-60"
                          : "border-line bg-card/90 text-ink hover:border-ink"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${st === "lit" || st === "focus" ? "bg-white" : "bg-signal"}`} aria-hidden />
                  {p}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
