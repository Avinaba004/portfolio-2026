"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Project } from "@/data/projects";
import { ArchDiagram, Block, MockWindow, Pipeline } from "../primitives";
import { useReducedMotionPref } from "@/lib/hooks";

/* ---------- Illustrative data generator (deterministic, fictional) ---------- */
const METRICS = {
  hr: { label: "HEART RATE", unit: "BPM", base: 72, amp: 8, threshold: 100, lo: 55, hi: 105, dec: 0 },
  spo2: { label: "SpO₂", unit: "%", base: 97, amp: 1.2, threshold: 92, lo: 90, hi: 100, dec: 0 },
  steps: { label: "STEPS", unit: "/interval", base: 420, amp: 300, threshold: 0, lo: 0, hi: 900, dec: 0 },
} as const;
type MetricKey = keyof typeof METRICS;
const RANGES = { "1 MIN": 60, "1 HR": 60, "1 DAY": 48, "1 WEEK": 56 } as const;
type RangeKey = keyof typeof RANGES;

function series(m: MetricKey, r: RangeKey) {
  const cfg = METRICS[m];
  const n = RANGES[r];
  const seed = m.length * 13 + r.length * 7;
  return Array.from({ length: n }, (_, i) => {
    const wave = Math.sin((i + seed) * (r === "1 DAY" ? 0.26 : r === "1 WEEK" ? 0.45 : 0.35)) * cfg.amp * 0.6;
    const noise = (Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453) % 1;
    const v = cfg.base + wave + noise * cfg.amp * 0.5;
    return Math.max(cfg.lo, Math.min(cfg.hi, v));
  });
}

function Dashboard({ accent }: { accent: string }) {
  const [m, setM] = useState<MetricKey>("hr");
  const [r, setR] = useState<RangeKey>("1 HR");
  const data = useMemo(() => series(m, r), [m, r]);
  const cfg = METRICS[m];
  const W = 600;
  const H = 200;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  const lo = cfg.lo;
  const hi = cfg.hi;
  const x = (i: number) => (i / (data.length - 1)) * W;
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H;
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const half = Math.floor(data.length / 2);
  const trend = data.slice(half).reduce((a, b) => a + b, 0) / (data.length - half) - data.slice(0, half).reduce((a, b) => a + b, 0) / half;
  const trendLabel = Math.abs(trend) < cfg.amp * 0.1 ? "→ STABLE" : trend > 0 ? "↗ RISING" : "↘ FALLING";
  const fmt = (v: number) => (cfg.dec ? v.toFixed(cfg.dec) : Math.round(v).toString());

  return (
    <MockWindow title="telehealth-dashboard / participant" accent={accent} badge="ILLUSTRATIVE DATA">
      <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
        {/* Participant */}
        <div className="border-b border-line p-5 lg:border-r lg:border-b-0">
          <div className="relative mx-auto grid h-24 w-24 place-items-center">
            <motion.span className="absolute inset-0 rounded-full" style={{ background: accent }} animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0, 0.25] }} transition={{ duration: 60 / 72, repeat: Infinity }} />
            <span className="relative grid h-20 w-20 place-items-center rounded-full bg-paper-2">
              <svg viewBox="0 0 40 40" className="h-11 w-11" aria-hidden>
                <circle cx="20" cy="14" r="7" fill="var(--ink)" opacity=".75" />
                <path d="M7 36c1-8 6-12 13-12s12 4 13 12" fill="var(--ink)" opacity=".75" />
              </svg>
            </span>
          </div>
          <div className="mt-3 text-center">
            <div className="font-display text-sm font-bold">Demo Participant</div>
            <div className="font-mono text-[10px] text-muted">VIRTUAL DEVICE · FICTIONAL</div>
          </div>
          <div className="mt-5 space-y-1.5">
            {(Object.keys(METRICS) as MetricKey[]).map((k) => {
              const d = series(k, r);
              return (
                <button
                  key={k}
                  onClick={() => setM(k)}
                  aria-pressed={m === k}
                  className="flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition-colors"
                  style={{ borderColor: m === k ? accent : "var(--line)", background: m === k ? `color-mix(in srgb, ${accent} 8%, transparent)` : undefined }}
                >
                  <span className="font-mono text-[10px] tracking-wider">{METRICS[k].label}</span>
                  <span className="font-display text-sm font-bold">
                    {Math.round(d[d.length - 1])}
                    <span className="ml-0.5 font-mono text-[9px] font-normal text-muted">{METRICS[k].unit}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart */}
        <div className="p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="label">{cfg.label}</div>
              <div className="font-display text-4xl font-extrabold" style={{ color: accent }}>
                {fmt(data[data.length - 1])}
                <span className="ml-1 font-mono text-sm font-normal text-muted">{cfg.unit}</span>
              </div>
              <div className="font-mono text-[11px] text-ink-2">TREND {trendLabel}</div>
            </div>
            <div role="radiogroup" aria-label="Time range" className="flex overflow-hidden rounded-lg border border-line">
              {(Object.keys(RANGES) as RangeKey[]).map((k) => (
                <button key={k} role="radio" aria-checked={r === k} onClick={() => setR(k)} className="px-2.5 py-1.5 font-mono text-[10px]" style={{ background: r === k ? "var(--ink)" : undefined, color: r === k ? "#fff" : undefined }}>
                  {k}
                </button>
              ))}
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H + 10}`} className="mt-4 h-[200px] w-full overflow-visible" preserveAspectRatio="none" role="img" aria-label={`${cfg.label} chart over ${r}, illustrative values`}>
            <defs>
              <linearGradient id="lurie-grad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={accent} stopOpacity="0.28" />
                <stop offset="1" stopColor={accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="var(--line)" vectorEffect="non-scaling-stroke" />
            ))}
            {cfg.threshold > 0 && (
              <g>
                <line x1="0" x2={W} y1={y(cfg.threshold)} y2={y(cfg.threshold)} stroke="var(--rose)" strokeDasharray="6 5" vectorEffect="non-scaling-stroke" />
                <text x={W - 4} y={y(cfg.threshold) - 5} textAnchor="end" fontSize="11" fill="var(--rose)" fontFamily="monospace">
                  THRESHOLD {cfg.threshold}
                </text>
              </g>
            )}
            <motion.path d={area} fill="url(#lurie-grad)" initial={false} animate={{ d: area }} transition={{ type: "spring", stiffness: 70, damping: 18 }} />
            <motion.path d={line} fill="none" stroke={accent} strokeWidth="2.5" vectorEffect="non-scaling-stroke" initial={false} animate={{ d: line }} transition={{ type: "spring", stiffness: 70, damping: 18 }} />
          </svg>

          <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              ["AVERAGE", fmt(avg)],
              ["MIN", fmt(min)],
              ["MAX", fmt(max)],
              ["TREND", trendLabel],
              ["THRESHOLD", cfg.threshold ? `${cfg.threshold}` : "—"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-paper-2/70 px-3 py-2">
                <dt className="font-mono text-[9px] tracking-wider text-muted">{k}</dt>
                <dd className="font-display text-base font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="border-t border-line bg-amber/10 px-4 py-2 font-mono text-[10px] text-ink-2">⚠ Illustrative project visualization. Fictional values, not real patient data and not anyone&apos;s personal metrics.</div>
    </MockWindow>
  );
}

function Aggregation({ accent }: { accent: string }) {
  const reduced = useReducedMotionPref();
  const stages = [
    { label: "RAW DATA", n: 24 },
    { label: "NORMALIZATION", n: 12 },
    { label: "AGGREGATION", n: 5 },
    { label: "INSIGHT", n: 1 },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
      <div className="min-w-0 space-y-3">
        {stages.map((s, si) => (
          <div key={s.label}>
            <div className="mb-1.5 flex justify-between font-mono text-[10px] tracking-wider">
              <span>{s.label}</span>
              <span className="text-muted">{si === 3 ? "1 insight" : `${s.n}× points`}</span>
            </div>
            <div className="flex min-h-8 flex-wrap items-center justify-center gap-1 rounded-xl bg-paper-2/60 px-2 py-2">
              {Array.from({ length: s.n }).map((_, i) => (
                <motion.span
                  key={i}
                  className={si === 3 ? "rounded-md px-3 py-1 font-mono text-[10px] text-white" : "h-2.5 w-2.5 rounded-full"}
                  style={{ background: accent, opacity: si === 3 ? 1 : 0.35 + si * 0.2 }}
                  initial={{ y: -14, opacity: 0 }}
                  whileInView={{ y: 0, opacity: si === 3 ? 1 : 0.35 + si * 0.2 }}
                  viewport={{ once: true }}
                  transition={{ delay: si * 0.5 + i * 0.02, type: "spring", stiffness: 260, damping: 16 }}
                >
                  {si === 3 ? "AVG · MIN · MAX · TREND" : null}
                </motion.span>
              ))}
            </div>
            {si < 3 && (
              <div className="py-0.5 text-center font-mono text-[10px] tracking-[0.5em] text-muted" aria-hidden>
                {"↓".repeat(stages[si + 1].n > 4 ? 4 : 2)}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="panel-flat p-6">
        <div className="label">FITBIT → GOOGLE HEALTH MIGRATION</div>
        <div className="mt-4 space-y-2 font-mono text-[11px]">
          {[
            ["FITBIT RESPONSE", "legacy shape", "var(--muted)"],
            ["SCHEMA MAPPING", "field-by-field transformation", accent],
            ["GOOGLE HEALTH RESPONSE", "new shape", "var(--muted)"],
            ["NORMALIZED INTERNAL MODEL", "one model for the dashboard", "var(--ink)"],
          ].map(([a, b, c], i) => (
            <div key={a}>
              <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="flex items-center justify-between rounded-lg border px-3 py-2.5" style={{ borderColor: c }}>
                <span className="font-semibold" style={{ color: c === "var(--muted)" ? "var(--ink)" : c }}>
                  {a}
                </span>
                <span className="text-muted">{b}</span>
              </motion.div>
              {i < 3 && (
                <div className="flex justify-center py-0.5 text-muted" aria-hidden>
                  {reduced ? "↓" : <motion.span animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}>↓</motion.span>}
                </div>
              )}
            </div>
          ))}
        </div>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-ink p-3 font-mono text-[10.5px] leading-relaxed text-white/80 thin-scroll">
          {`// normalized internal model (simplified)
{ metric: "heart_rate", ts: "…", value: 72,
  unit: "bpm", source: "google_health" }`}
        </pre>
      </div>
    </div>
  );
}

const CHALLENGES = [
  { err: "401 UNAUTHENTICATED", fix: "OAuth debugging", detail: "Checked the OAuth configuration, debugged tokens and validated the API calls until requests succeeded." },
  { err: "SCHEMA MISMATCH", fix: "Transformation layer", detail: "Mapped both response shapes into one normalized internal model." },
  { err: "MISSING DATA", fix: "Fallback handling", detail: "Handled gaps so the dashboard stays consistent when data is absent." },
  { err: "LARGE DATASET", fix: "Granular retrieval", detail: "Retrieved data in smaller, granular requests instead of one oversized pull." },
];

function Challenges({ accent }: { accent: string }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {CHALLENGES.map((c, i) => {
        const on = open.has(i);
        return (
          <motion.button
            key={c.err}
            layout
            onClick={() => setOpen((s) => (s.has(i) ? new Set([...s].filter((x) => x !== i)) : new Set(s).add(i)))}
            aria-expanded={on}
            className="overflow-hidden rounded-2xl border bg-card text-left shadow-[var(--shadow-sm)]"
            style={{ borderColor: on ? "var(--mint)" : "var(--line)" }}
          >
            <div className={`px-4 py-2 font-mono text-[11px] font-semibold text-white ${on ? "bg-mint" : "bg-rose"}`}>{on ? "✓ RESOLVED" : `✕ ${c.err}`}</div>
            <div className="p-4">
              <div className="font-mono text-[11px] text-muted">{c.err}</div>
              <div className="my-1 text-muted" aria-hidden>
                ↓
              </div>
              <div className="font-display text-lg font-bold" style={{ color: on ? accent : undefined }}>
                {c.fix}
              </div>
              <AnimatePresence>
                {on && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 text-[13px] text-ink-2">
                    {c.detail}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function Lurie({ part, p }: { part: string; p: Project }) {
  if (part === "system") return <ArchDiagram layers={p.architecture} accent={p.accent} notes={{ "OAuth 2.0": "Authorizes access to the health data APIs", Python: "Integration services", Normalization: "Schema transformation into one internal model", "Time-series Storage": "NoSQL time-series metrics" }} />;
  if (part === "flow") return <Pipeline steps={["Fitbit", "Google Health", "Normalization", "Dashboard"]} accent={p.accent} />;
  if (part === "human") return <Dashboard accent={p.accent} />;
  return (
    <>
      <Block k="A" title="From raw signal to insight" intro="Raw readings are normalized, aggregated and turned into the numbers a dashboard shows — average, min, max, trend, threshold.">
        <Aggregation accent={p.accent} />
      </Block>
      <Block k="B" title="Engineering challenges" intro="Click each failure to see how it was resolved.">
        <Challenges accent={p.accent} />
      </Block>
    </>
  );
}
