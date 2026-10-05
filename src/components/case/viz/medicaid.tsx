"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { ArchDiagram, Block, MockWindow, Pipeline } from "../primitives";

/* Fictional, simplified rules — they illustrate versioning and determinism, not real program policy. */
type App = { date: "2024" | "2025" | "2026"; household: number; incomeBand: number; docs: boolean };
const VERSIONS = {
  v1: { from: "2024", incomeMax: 3, householdMax: 6, needsDocs: false },
  v2: { from: "2025", incomeMax: 4, householdMax: 8, needsDocs: false },
  v3: { from: "2026", incomeMax: 4, householdMax: 8, needsDocs: true },
} as const;
type V = keyof typeof VERSIONS;
const pick = (d: App["date"]): V => (d === "2024" ? "v1" : d === "2025" ? "v2" : "v3");

const rulesFor = (v: V, a: App) => {
  const r = VERSIONS[v];
  return [
    { id: "RULE 01", label: "Required fields present", pass: a.household > 0 },
    { id: "RULE 02", label: `Household size ≤ ${r.householdMax}`, pass: a.household <= r.householdMax },
    { id: "RULE 03", label: `Income band ≤ ${r.incomeMax}`, pass: a.incomeBand <= r.incomeMax },
    { id: "RULE 04", label: r.needsDocs ? "Supporting documents attached" : "Documents optional in this version", pass: r.needsDocs ? a.docs : true },
  ];
};

function RulesEngine({ accent }: { accent: string }) {
  const [app, setApp] = useState<App>({ date: "2026", household: 4, incomeBand: 3, docs: false });
  const [override, setOverride] = useState<V | null>(null);
  const v = override ?? pick(app.date);
  const rules = rulesFor(v, app);
  const [ran, setRan] = useState(0);
  const [shown, setShown] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    queueMicrotask(() => setShown(0));
    timers.current = rules.map((_, i) => window.setTimeout(() => setShown(i + 1), 350 * (i + 1)));
    return () => timers.current.forEach(clearTimeout);
    // re-run when inputs change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ran, v, app.household, app.incomeBand, app.docs]);

  const passed = rules.filter((r) => r.pass).length;
  const done = shown >= rules.length;

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <MockWindow title="application-form (reusable React components)" accent={accent} badge="FICTIONAL RULES">
        <div className="space-y-4 p-5 text-sm">
          <label className="flex items-center justify-between gap-3">
            <span>Application date</span>
            <select value={app.date} onChange={(e) => setApp((a) => ({ ...a, date: e.target.value as App["date"] }))} className="rounded-lg border border-line bg-paper px-2 py-1 font-mono text-[12px]">
              {["2024", "2025", "2026"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center justify-between gap-3">
            <span>Household size · {app.household}</span>
            <input type="range" min={1} max={10} value={app.household} onChange={(e) => setApp((a) => ({ ...a, household: +e.target.value }))} style={{ accentColor: accent }} />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span>Income band · {app.incomeBand}</span>
            <input type="range" min={1} max={6} value={app.incomeBand} onChange={(e) => setApp((a) => ({ ...a, incomeBand: +e.target.value }))} style={{ accentColor: accent }} />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span>Supporting documents attached</span>
            <input type="checkbox" checked={app.docs} onChange={(e) => setApp((a) => ({ ...a, docs: e.target.checked }))} className="h-4 w-4" style={{ accentColor: accent }} />
          </label>
          <button onClick={() => setRan((r) => r + 1)} className="w-full rounded-xl py-2.5 font-medium text-white" style={{ background: accent }}>
            Evaluate application
          </button>
        </div>
      </MockWindow>

      <div className="space-y-4">
        <div className="panel-flat p-5">
          <div className="flex items-center justify-between">
            <span className="label">RULESET VERSION</span>
            <span className="font-mono text-[10px] text-muted">{override ? "manual override" : `auto-selected for ${app.date}`}</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(Object.keys(VERSIONS) as V[]).map((k) => (
              <button
                key={k}
                onClick={() => setOverride(override === k ? null : k)}
                aria-pressed={v === k}
                className="relative rounded-xl border px-3 py-3 text-left transition-colors"
                style={{ borderColor: v === k ? accent : "var(--line)", background: v === k ? `color-mix(in srgb, ${accent} 12%, transparent)` : undefined }}
              >
                {v === k && <motion.span layoutId="ruleset-active" className="absolute inset-0 rounded-xl border-2" style={{ borderColor: accent }} />}
                <div className="font-display text-base font-bold">RULESET {k}</div>
                <div className="font-mono text-[10px] text-muted">from {VERSIONS[k].from}</div>
              </button>
            ))}
          </div>
        </div>

        <ol className="space-y-2" aria-live="polite">
          {rules.map((r, i) => {
            const vis = i < shown;
            return (
              <motion.li key={r.id + v} animate={{ opacity: vis ? 1 : 0.35 }} className="flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3">
                <span className="font-mono text-[11px] font-semibold">{r.id}</span>
                <span className="flex-1 text-[13px]">{r.label}</span>
                <AnimatePresence>
                  {vis && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className={`grid h-6 w-6 place-items-center rounded-full text-[11px] text-white ${r.pass ? "bg-mint" : "bg-rose"}`}>
                      {r.pass ? "✓" : "✕"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ol>
        <motion.div animate={{ opacity: done ? 1 : 0.4 }} className={`rounded-xl px-4 py-3 font-mono text-[12px] ${passed === rules.length ? "bg-mint/10 text-mint" : "bg-rose/10 text-rose"}`}>
          {done ? (passed === rules.length ? `✓ ${passed}/${rules.length} rules passed → proceeds in workflow` : `✕ ${passed}/${rules.length} rules passed → returned for correction`) : "evaluating…"}
          <div className="mt-1 text-[10px] text-muted">Deterministic: same input + same ruleset version → same result. No AI decision.</div>
        </motion.div>
      </div>
    </div>
  );
}

const TESTS = [
  "renders application form components",
  "selects ruleset v1 for 2024 applications",
  "selects ruleset v3 for 2026 applications",
  "fails RULE 04 when documents are missing (v3)",
  "advances workflow when all rules pass",
];

function PlaywrightRun({ accent }: { accent: string }) {
  const [n, setN] = useState(-1);
  const run = () => {
    setN(0);
    TESTS.forEach((_, i) => setTimeout(() => setN(i + 1), 380 * (i + 1)));
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-ink bg-[#121216] font-mono text-[12px] text-white/80">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="text-white/50">$ npx playwright test</span>
        <button onClick={run} className="rounded-md px-3 py-1 text-[11px] text-white" style={{ background: accent }}>
          ▶ Run
        </button>
      </div>
      <ul className="space-y-1 p-4">
        {TESTS.map((t, i) => (
          <li key={t} className={i < n ? "text-white" : "text-white/30"}>
            <span className={i < n ? "text-[#7ee0b5]" : ""}>{i < n ? "✓" : "·"}</span> {t}
          </li>
        ))}
        {n >= TESTS.length && <li className="pt-2 text-[#7ee0b5]">{TESTS.length} passed</li>}
      </ul>
      <div className="border-t border-white/10 px-4 py-2 text-[10px] text-white/40">Illustrative test names — the real suite automated end-to-end checks on the Medicaid platform.</div>
    </div>
  );
}

export default function Medicaid({ part, p }: { part: string; p: Project }) {
  if (part === "system") return <ArchDiagram layers={p.architecture} accent={p.accent} ring={["Versioned rulesets", "Reusable components", "Workflow", "Playwright"]} />;
  if (part === "flow") return <Pipeline steps={["Application", "Select ruleset", "Rules execute", "Result"]} accent={p.accent} />;
  if (part === "human") return <PlaywrightRun accent={p.accent} />;
  return (
    <Block k="A" title="A visual rules engine" intro="Change the application or the date. The engine picks the correct ruleset version and executes every rule deterministically.">
      <RulesEngine accent={p.accent} />
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 font-display text-sm font-bold sm:text-base">
        {["REACT FORMS", "+", "VERSIONED RULES", "+", "WORKFLOW", "+", "PLAYWRIGHT TESTS"].map((t, i) => (
          <span key={i} className={t === "+" ? "text-signal" : "rounded-xl border border-line bg-card px-3 py-2"}>
            {t}
          </span>
        ))}
      </div>
    </Block>
  );
}
