"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { workProjects, type Project } from "@/data/projects";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useApp } from "@/components/system/AppProvider";
import { MiniPreview } from "./MiniPreview";

const FILTERS = [
  { id: "all", label: "ALL SYSTEMS", match: () => true },
  { id: "gov", label: "GOVERNMENT", match: (p: Project) => p.domain.includes("Government") },
  { id: "ai", label: "AI", match: (p: Project) => p.skills.includes("Gemini") },
  { id: "health", label: "HEALTHCARE", match: (p: Project) => p.domain.includes("Healthcare") },
  { id: "auth", label: "AUTH / SECURITY", match: (p: Project) => p.skills.some((s) => ["OAuth", "RBAC", "SSO", "Security"].includes(s)) },
  { id: "int", label: "INTEGRATIONS", match: (p: Project) => p.skills.some((s) => ["APIs", "Webhooks"].includes(s)) },
];

// Elliptical constellation around the core, in % of the stage.
const POS: [number, number][] = [
  [22, 22],
  [50, 12],
  [78, 22],
  [84, 55],
  [72, 86],
  [44, 89],
  [18, 78],
  [15, 50],
];

type Launch = { x: number; y: number; color: string; slug: string } | null;

function GalaxyNode({
  p,
  pos,
  index,
  dim,
  mx,
  my,
  size,
  onLaunch,
  active,
  setActive,
}: {
  p: Project;
  pos: [number, number];
  index: number;
  dim: boolean;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  size: MotionValue<{ w: number; h: number }>;
  onLaunch: (e: React.MouseEvent | React.KeyboardEvent, p: Project) => void;
  active: boolean;
  setActive: (s: string | null) => void;
}) {
  // Magnetic proximity: nodes swell and lean toward the cursor as it approaches.
  const proximity = useTransform(() => {
    const { w, h } = size.get();
    const dx = mx.get() - (pos[0] / 100) * w;
    const dy = my.get() - (pos[1] / 100) * h;
    return Math.max(0, 1 - Math.hypot(dx, dy) / 280);
  });
  const scale = useSpring(useTransform(proximity, (v) => 1 + v * 0.14), { stiffness: 260, damping: 20 });
  const tx = useSpring(
    useTransform(() => {
      const { w } = size.get();
      return (mx.get() - (pos[0] / 100) * w) * proximity.get() * 0.08;
    }),
    { stiffness: 200, damping: 20 },
  );
  const ty = useSpring(
    useTransform(() => {
      const { h } = size.get();
      return (my.get() - (pos[1] / 100) * h) * proximity.get() * 0.08;
    }),
    { stiffness: 200, damping: 20 },
  );
  const ring = useTransform(proximity, (v) => 0.15 + v * 0.85);

  return (
    <motion.div
      className="absolute"
      style={{ left: `${pos[0]}%`, top: `${pos[1]}%`, x: tx, y: ty, zIndex: active ? 30 : 10 }}
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 140, damping: 16 }}
    >
      <motion.div style={{ scale }} className="-translate-x-1/2 -translate-y-1/2">
        <motion.button
          onClick={(e) => onLaunch(e, p)}
          onPointerEnter={() => setActive(p.slug)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(p.slug)}
          onBlur={() => setActive(null)}
          aria-label={`${p.fullName}. ${p.domain.join(", ")}. Open case study.`}
          animate={{ opacity: dim ? 0.28 : 1, filter: dim ? "grayscale(1)" : "grayscale(0)" }}
          className="group relative block text-left"
        >
          {/* Orbit ring */}
          <motion.span style={{ opacity: ring, borderColor: p.accent }} className="pointer-events-none absolute -inset-3 rounded-[28px] border border-dashed" aria-hidden />
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="panel relative overflow-hidden !rounded-[22px] !bg-card"
            style={{ width: active ? 280 : 168 }}
          >
            <div className="h-1 w-full" style={{ background: p.accent }} />
            <div className="p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-[15px] font-bold tracking-wide">{p.name}</span>
                <span className="h-2 w-2 rounded-full pulse-dot" style={{ background: p.accent }} aria-hidden />
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-[9.5px] tracking-wider text-muted">
                {p.domain.slice(0, active ? 4 : 2).map((d) => (
                  <span key={d}>{d.toUpperCase()}</span>
                ))}
              </div>
              <AnimatePresence initial={false}>
                {active && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mt-3 h-[96px] overflow-hidden rounded-xl border border-line bg-paper bp-grid-fine">
                      <MiniPreview slug={p.slug} color={p.accent} />
                    </div>
                    <p className="mt-3 text-[12.5px] leading-snug text-ink-2">{p.tagline}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {p.technologies.slice(0, 5).map((t) => (
                        <span key={t.name} className="rounded-md bg-paper-2 px-1.5 py-0.5 font-mono text-[9.5px] text-ink-2">
                          {t.name}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 font-mono text-[10px] tracking-wider" style={{ color: p.accent }}>
                      OPEN CASE STUDY →
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export function ProjectGalaxy() {
  const router = useRouter();
  const { sfx } = useApp();
  const stage = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const size = useMotionValue({ w: 1, h: 1 });
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<string | null>(null);
  const [launch, setLaunch] = useState<Launch>(null);

  const match = useMemo(() => FILTERS.find((f) => f.id === filter)!.match, [filter]);

  const onMove = (e: React.PointerEvent) => {
    const r = stage.current!.getBoundingClientRect();
    size.set({ w: r.width, h: r.height });
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const onLaunch = (e: React.MouseEvent | React.KeyboardEvent, p: Project) => {
    sfx("select");
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(`/work/${p.slug}`);
      return;
    }
    setLaunch({ x: r.left + r.width / 2, y: r.top + r.height / 2, color: p.accent, slug: p.slug });
    router.prefetch(`/work/${p.slug}`);
  };

  // Lines between projects sharing ≥3 skills
  const links = useMemo(() => {
    const out: [number, number][] = [];
    workProjects.forEach((a, i) =>
      workProjects.forEach((b, j) => {
        if (j <= i) return;
        const shared = a.skills.filter((s) => b.skills.includes(s)).length;
        if (shared >= 3) out.push([i, j]);
      }),
    );
    return out;
  }, []);

  return (
    <Section id="work" debug="ProjectGalaxy · MagneticNodes" labelledBy="work-title" className="overflow-hidden">
      <SectionHeader
        index="02"
        kicker="MY WORK · PROJECT GALAXY"
        title={
          <span id="work-title">
            Systems I&apos;ve <span className="text-signal">engineered.</span>
          </span>
        }
        intro="Each node is a real system from my work at BlueVector AI. Move closer — they react. Open one to see its architecture, data flow and the interface people actually use."
      />

      <div role="toolbar" aria-label="Filter projects" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFilter(f.id);
              sfx("tick");
            }}
            aria-pressed={filter === f.id}
            className={`chip transition-colors ${filter === f.id ? "!border-ink !bg-ink !text-white" : "hover:bg-paper-2"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Desktop galaxy */}
      <div
        ref={stage}
        onPointerMove={onMove}
        onPointerLeave={() => {
          mx.set(-9999);
          my.set(-9999);
        }}
        className="crop relative hidden h-[780px] rounded-[32px] border border-line bg-card/40 xl:block"
      >
        <div className="bp-dots absolute inset-0 rounded-[32px] opacity-60 mask-fade" aria-hidden />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {[34, 44].map((r) => (
            <ellipse key={r} cx="50" cy="51" rx={r} ry={r * 0.86} fill="none" stroke="var(--ink)" strokeOpacity="0.07" strokeDasharray="0.6 1.2" vectorEffect="non-scaling-stroke" />
          ))}
          {links.map(([i, j]) => (
            <line key={`${i}-${j}`} x1={POS[i][0]} y1={POS[i][1]} x2={POS[j][0]} y2={POS[j][1]} stroke="var(--ink)" strokeOpacity="0.06" vectorEffect="non-scaling-stroke" />
          ))}
          {workProjects.map((p, i) => {
            const on = active === p.slug;
            const d = `M50,51 L${POS[i][0]},${POS[i][1]}`;
            return (
              <g key={p.slug}>
                <path d={d} stroke={on ? p.accent : "var(--ink)"} strokeOpacity={on ? 0.9 : 0.12} strokeWidth={on ? 2 : 1} vectorEffect="non-scaling-stroke" className={on ? "flow-line" : ""} fill="none" />
                {match(p) && (
                  <circle r="0.45" fill={p.accent}>
                    <animateMotion dur={`${3 + i * 0.4}s`} repeatCount="indefinite" path={d} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Core */}
        <div className="absolute top-[51%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line-strong"
            aria-hidden
          />
          <div className="grid h-40 w-40 place-items-center rounded-full bg-ink text-white shadow-[0_30px_80px_-20px_rgba(17,17,20,0.5)]">
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] text-white/50">CORE</div>
              <div className="font-display text-[15px] leading-tight font-bold">
                BUILDING
                <br />
                SYSTEMS
              </div>
              <div className="mt-1 font-mono text-[9px] text-signal">{workProjects.filter(match).length} ONLINE</div>
            </div>
          </div>
        </div>

        {workProjects.map((p, i) => (
          <GalaxyNode
            key={p.slug}
            p={p}
            pos={POS[i]}
            index={i}
            dim={!match(p)}
            mx={mx}
            my={my}
            size={size}
            onLaunch={onLaunch}
            active={active === p.slug}
            setActive={setActive}
          />
        ))}

        <div className="absolute right-5 bottom-4 font-mono text-[10px] text-muted">CLIENT WORK · VISUALS ARE ILLUSTRATIVE</div>
      </div>

      {/* Mobile / tablet: vertical system list */}
      <ul className="grid gap-3 md:grid-cols-2 xl:hidden">
        {workProjects.map((p) => (
          <motion.li key={p.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} animate={{ opacity: match(p) ? 1 : 0.35 }}>
            <button onClick={(e) => onLaunch(e, p)} className="panel block w-full overflow-hidden !rounded-2xl text-left">
              <div className="h-1" style={{ background: p.accent }} />
              <div className="flex gap-4 p-4">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-line bg-paper">
                  <MiniPreview slug={p.slug} color={p.accent} />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-base font-bold">{p.name}</div>
                  <div className="mt-0.5 font-mono text-[9.5px] tracking-wider text-muted">{p.domain.join(" · ").toUpperCase()}</div>
                  <p className="mt-1.5 text-[13px] leading-snug text-ink-2">{p.tagline}</p>
                </div>
              </div>
            </button>
          </motion.li>
        ))}
      </ul>

      {/* Cinematic launch transition */}
      <AnimatePresence>
        {launch && (
          <motion.div
            className="pointer-events-none fixed z-[70] rounded-full"
            style={{ left: launch.x, top: launch.y, background: launch.color, width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
            initial={{ scale: 0 }}
            animate={{ scale: 90 }}
            transition={{ duration: 0.65, ease: [0.7, 0, 0.3, 1] }}
            onAnimationComplete={() => {
              router.push(`/work/${launch.slug}`);
              setTimeout(() => setLaunch(null), 600);
            }}
            aria-hidden
          />
        )}
      </AnimatePresence>
    </Section>
  );
}
