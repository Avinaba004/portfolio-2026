"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import type { Project } from "@/data/projects";
import { ArchDiagram, Block, MockWindow, Pipeline, StateMachine } from "../primitives";

const LANES = ["DRAFT", "SUBMITTED", "RFI", "APPROVED", "DENIED"] as const;
type Lane = (typeof LANES)[number];
type App = { id: string; lane: Lane; seed: number };

const CRITERIA = ["Criterion 1", "Criterion 2", "Criterion 3", "Criterion 4", "Criterion 5"];
const scoresFor = (seed: number) => CRITERIA.map((_, i) => 4 + ((seed * (i + 3) * 7) % 6) + ((seed + i) % 2) * 0.5);

function CommandCenter({ accent }: { accent: string }) {
  const [apps, setApps] = useState<App[]>([
    { id: "APP-001", lane: "SUBMITTED", seed: 3 },
    { id: "APP-002", lane: "RFI", seed: 7 },
    { id: "APP-003", lane: "DRAFT", seed: 5 },
    { id: "APP-004", lane: "APPROVED", seed: 9 },
  ]);
  const [sel, setSel] = useState<string | null>("APP-001");
  const [scored, setScored] = useState<Record<string, boolean>>({});
  const next = apps.length + 1;

  const move = (id: string, lane: Lane) => setApps((a) => a.map((x) => (x.id === id ? { ...x, lane } : x)));
  const app = apps.find((a) => a.id === sel);
  const scores = app ? scoresFor(app.seed) : [];
  const total = scores.reduce((s, v) => s + v * 0.2, 0);

  return (
    <LayoutGroup>
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Agency portal */}
        <MockWindow title="agency-portal" accent={accent} badge="AGENCY">
          <div className="space-y-3 p-4">
            <div className="label">MY APPLICATIONS</div>
            {apps
              .filter((a) => a.lane === "DRAFT" || a.lane === "RFI")
              .map((a) => (
                <motion.div layoutId={`card-${a.id}`} key={a.id} className="flex items-center justify-between rounded-xl border border-line p-3">
                  <div>
                    <div className="font-mono text-[12px] font-semibold">{a.id}</div>
                    <div className={`font-mono text-[10px] ${a.lane === "RFI" ? "text-amber" : "text-muted"}`}>{a.lane === "RFI" ? "INFO REQUESTED" : "DRAFT"}</div>
                  </div>
                  <button onClick={() => move(a.id, "SUBMITTED")} className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-white" style={{ background: accent }}>
                    {a.lane === "RFI" ? "Respond & resubmit" : "Submit"}
                  </button>
                </motion.div>
              ))}
            <button
              onClick={() => setApps((a) => [...a, { id: `APP-${String(next).padStart(3, "0")}`, lane: "DRAFT", seed: next * 3 + 1 }])}
              className="w-full rounded-xl border border-dashed border-line-strong py-2.5 font-mono text-[11px] text-muted hover:text-ink"
            >
              + NEW APPLICATION
            </button>
          </div>
        </MockWindow>

        {/* Analyst command center */}
        <MockWindow title="budget-analyst / command-center" accent={accent} badge="ANALYST">
          <div className="thin-scroll overflow-x-auto border-b border-line">
          <div className="grid min-w-[520px] grid-cols-5 gap-1.5 p-3">
            {LANES.map((l) => (
              <div key={l} className="min-h-[120px] rounded-lg bg-paper-2/60 p-1.5">
                <div className={`mb-1.5 text-center font-mono text-[8.5px] tracking-wider ${l === "APPROVED" ? "text-mint" : l === "DENIED" ? "text-rose" : l === "RFI" ? "text-amber" : "text-muted"}`}>{l}</div>
                <div className="space-y-1">
                  {apps
                    .filter((a) => a.lane === l)
                    .map((a) => (
                      <motion.button
                        layoutId={l === "DRAFT" || l === "RFI" ? undefined : `card-${a.id}`}
                        key={a.id}
                        onClick={() => setSel(a.id)}
                        className={`block w-full rounded-md border px-1 py-1 font-mono text-[9px] ${sel === a.id ? "border-ink bg-ink text-white" : "border-line bg-card"}`}
                      >
                        {a.id}
                      </motion.button>
                    ))}
                </div>
              </div>
            ))}
          </div>
          </div>

          <AnimatePresence mode="wait">
            {app && (
              <motion.div key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm font-semibold">{app.id}</div>
                  {!scored[app.id] && app.lane === "SUBMITTED" && (
                    <button onClick={() => setScored((s) => ({ ...s, [app.id]: true }))} className="rounded-lg bg-violet px-3 py-1.5 text-[11px] font-medium text-white">
                      ✦ Generate AI-assisted score
                    </button>
                  )}
                </div>
                {scored[app.id] || app.lane === "APPROVED" || app.lane === "DENIED" ? (
                  <>
                    <div className="mt-3 space-y-1.5">
                      {CRITERIA.map((c, i) => (
                        <div key={c} className="grid grid-cols-[78px_30px_1fr_30px] items-center gap-2 font-mono text-[10px] sm:grid-cols-[90px_36px_1fr_34px]">
                          <span>{c.toUpperCase()}</span>
                          <span className="text-muted">20%</span>
                          <span className="h-2 overflow-hidden rounded bg-paper-2">
                            <motion.span className="block h-full rounded bg-violet" initial={{ width: 0 }} animate={{ width: `${scores[i] * 10}%` }} transition={{ delay: i * 0.12, type: "spring", stiffness: 70, damping: 15 }} />
                          </span>
                          <span className="text-right">{scores[i].toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-violet/10 px-3 py-2">
                      <span className="font-mono text-[10px] text-violet">STRUCTURED SCORE (SUGGESTION)</span>
                      <span className="font-display text-lg font-bold text-violet">{total.toFixed(1)} / 10</span>
                    </div>
                    {app.lane === "SUBMITTED" || app.lane === "RFI" ? (
                      <div className="mt-3">
                        <div className="mb-1.5 font-mono text-[10px] text-muted">REVIEWER DECISION — made by the analyst</div>
                        <div className="flex flex-wrap gap-1.5">
                          <button onClick={() => move(app.id, "APPROVED")} className="rounded-lg bg-mint px-3 py-1.5 text-[11px] font-medium text-white">
                            Approve
                          </button>
                          <button onClick={() => move(app.id, "RFI")} className="rounded-lg bg-amber px-3 py-1.5 text-[11px] font-medium text-white">
                            Request info (RFI)
                          </button>
                          <button onClick={() => move(app.id, "DENIED")} className="rounded-lg bg-rose px-3 py-1.5 text-[11px] font-medium text-white">
                            Deny
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={`mt-3 font-mono text-[11px] ${app.lane === "APPROVED" ? "text-mint" : "text-rose"}`}>Decision recorded by reviewer: {app.lane}</div>
                    )}
                  </>
                ) : (
                  <p className="mt-3 text-[12px] text-muted">{app.lane === "SUBMITTED" ? "Generate a structured score to support the review." : app.lane === "DRAFT" ? "Still being drafted by the agency." : "Waiting on the agency's response."}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </MockWindow>
      </div>
      <p className="mt-3 font-mono text-[10px] text-muted">Illustrative applications and scores. AI produces decision support; people make every decision.</p>
    </LayoutGroup>
  );
}

const ROLES = [
  { id: "draft", label: "DRAFT", role: "Agency", actions: ["Prepare application", "Attach documents"] },
  { id: "submitted", label: "SUBMITTED", role: "Agency → Budget analyst", actions: ["Queue for analyst review", "Trigger AI-assisted scoring"] },
  { id: "rfi", label: "RFI", role: "Budget analyst ↔ Agency", actions: ["Request more information", "Agency responds and resubmits"], tone: "warn" as const },
  { id: "approved", label: "APPROVED", role: "Budget analyst", actions: ["Human decision recorded"], tone: "ok" as const },
  { id: "denied", label: "DENIED", role: "Budget analyst", actions: ["Human decision recorded"], tone: "bad" as const },
];

export default function Mopbb({ part, p }: { part: string; p: Project }) {
  if (part === "system") return <ArchDiagram layers={p.architecture} accent={p.accent} ring={["RBAC", "Role dashboards", "Decision log", "Gemini"]} />;
  if (part === "flow") return <Pipeline steps={["AI", "Structured score", "Reviewer", "Decision"]} accent={p.accent} interval={1300} />;
  if (part === "human") return <StateMachine states={ROLES} accent={p.accent} edges={[["draft", "submitted"], ["submitted", "rfi"], ["submitted", "approved"], ["submitted", "denied"], ["rfi", "submitted"]]} />;
  return (
    <Block k="A" title="Government command center" intro="Submit an application as the agency, then switch to the analyst. Generate an AI-assisted score, then make the decision yourself.">
      <CommandCenter accent={p.accent} />
    </Block>
  );
}
