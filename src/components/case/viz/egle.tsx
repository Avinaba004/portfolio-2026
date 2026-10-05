"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { ArchDiagram, Block, MockWindow, Pipeline } from "../primitives";

const STEPS = ["Document", "Upload", "AI extraction", "Gemini / Vertex AI", "Structured data", "Database", "Review", "Human validation"];

const REGIONS = [
  { key: "organization", label: "ORGANIZATION", value: "Example Environmental Services", color: "var(--cobalt)", y: 22, h: 9 },
  { key: "address", label: "ADDRESS", value: "100 Example Ave, Springfield", color: "var(--signal)", y: 34, h: 9 },
  { key: "location", label: "LOCATION", value: "Site parcel · Example County", color: "var(--mint)", y: 50, h: 12 },
  { key: "application", label: "APPLICATION INFO", value: "Permit application · section 2", color: "var(--violet)", y: 67, h: 16 },
];

const TABLES = [
  { name: "egle_submissions", cols: ["id", "document_ref", "status", "submitted_at"], x: 0, y: 0 },
  { name: "egle_extraction_profiles", cols: ["id", "document_type", "fields"], x: 1, y: 0 },
  { name: "detected_locations", cols: ["id", "submission_id", "address", "location"], x: 0, y: 1 },
  { name: "egle_ai_prompt_configs", cols: ["id", "profile_id", "prompt", "version"], x: 1, y: 1 },
];

function DocPipeline({ accent }: { accent: string }) {
  const [step, setStep] = useState(-1);
  const timers = useRef<number[]>([]);
  const run = () => {
    timers.current.forEach(clearTimeout);
    setStep(0);
    timers.current = STEPS.map((_, i) => window.setTimeout(() => setStep(i + 1), 800 * (i + 1)));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const scanning = step >= 2 && step < 4;
  const highlighted = step >= 3;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={run} disabled={step >= 0 && step < STEPS.length} className="rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)] disabled:opacity-60" style={{ background: accent }}>
          {step < 0 ? "⤒ Upload document" : step < STEPS.length ? "Processing…" : "Run again"}
        </button>
        <span className="font-mono text-[10px] text-muted">FICTIONAL SAMPLE DOCUMENT</span>
      </div>
      <Pipeline steps={STEPS} accent={accent} active={Math.min(step, STEPS.length - 1)} />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        {/* The document */}
        <motion.div animate={{ y: step === 1 ? -10 : 0, rotate: step === 1 ? -1 : 0 }} className="relative mx-auto aspect-[3/4] w-full max-w-[380px] overflow-hidden rounded-xl border border-line bg-white shadow-[var(--shadow-lg)]">
          <div className="absolute inset-0 p-[8%]">
            <div className="h-[4%] w-1/2 rounded bg-ink/80" />
            <div className="mt-[3%] h-[2%] w-1/3 rounded bg-ink/20" />
            {[24, 36, 52, 69].map((y, i) => (
              <div key={y} className="absolute right-[8%] left-[8%] space-y-[6px]" style={{ top: `${y}%` }}>
                <div className="h-[6px] rounded bg-ink/15" style={{ width: `${70 - i * 8}%` }} />
                <div className="h-[6px] rounded bg-ink/10" style={{ width: `${55 + i * 6}%` }} />
                {i > 1 && <div className="h-[6px] w-[40%] rounded bg-ink/10" />}
              </div>
            ))}
          </div>
          {highlighted &&
            REGIONS.map((r, i) => (
              <motion.div
                key={r.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                className="absolute right-[5%] left-[5%] rounded-md border-2"
                style={{ top: `${r.y}%`, height: `${r.h}%`, borderColor: r.color, background: `color-mix(in srgb, ${r.color} 10%, transparent)` }}
              >
                <span className="absolute -top-2.5 left-2 rounded px-1.5 font-mono text-[8.5px] text-white" style={{ background: r.color }}>
                  {r.label}
                </span>
              </motion.div>
            ))}
          {scanning && (
            <motion.div className="absolute inset-x-0 h-12" style={{ background: `linear-gradient(to bottom, transparent, color-mix(in srgb, ${accent} 35%, transparent), transparent)` }} animate={{ top: ["-10%", "100%"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
          )}
          {step >= 7 && (
            <motion.div initial={{ scale: 2, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: -8 }} className="absolute right-[8%] bottom-[6%] rounded-lg border-2 border-mint px-3 py-1 font-display text-sm font-bold text-mint">
              VALIDATED
            </motion.div>
          )}
        </motion.div>

        <div className="space-y-4">
          <MockWindow title="structured output" accent={accent} badge="JSON">
            <pre className="min-h-[150px] overflow-x-auto p-4 font-mono text-[11.5px] leading-relaxed thin-scroll">
              {step >= 4 ? (
                <>
                  {"{\n"}
                  {REGIONS.map((r, i) => (
                    <motion.span key={r.key} className="block" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                      {"  "}
                      <span style={{ color: r.color }}>&quot;{r.key}&quot;</span>: &quot;{r.value}&quot;{i < REGIONS.length - 1 ? "," : ""}
                    </motion.span>
                  ))}
                  {"}"}
                </>
              ) : (
                <span className="text-muted">{step >= 2 ? "// extracting fields…" : "// waiting for document"}</span>
              )}
            </pre>
          </MockWindow>

          {/* Backend objects */}
          <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TABLES.map((t, i) => (
              <motion.div
                key={t.name}
                initial={false}
                animate={{ opacity: step >= 5 ? 1 : 0.3, y: step >= 5 ? 0 : 6, borderColor: step >= 5 ? accent : "var(--line)" }}
                transition={{ delay: step >= 5 ? i * 0.12 : 0 }}
                className="overflow-hidden rounded-xl border bg-card"
              >
                <div className="px-3 py-1.5 font-mono text-[10.5px] font-semibold text-white" style={{ background: step >= 5 ? accent : "var(--muted)" }}>
                  {t.name}
                </div>
                <ul className="px-3 py-2 font-mono text-[10px] text-ink-2">
                  {t.cols.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <p className="font-mono text-[10px] text-muted">Backend objects shown by table name; columns are simplified for illustration.</p>
        </div>
      </div>
    </div>
  );
}

function Reviewer({ accent }: { accent: string }) {
  const [state, setState] = useState<Record<string, "pending" | "ok" | "edit">>({});
  const done = REGIONS.every((r) => state[r.key] === "ok");
  return (
    <MockWindow title="review-workspace / submission" accent={accent} badge="ILLUSTRATIVE">
      <div className="grid gap-0 md:grid-cols-2">
        <div className="border-b border-line bg-paper p-5 md:border-r md:border-b-0">
          <div className="label mb-3">SOURCE DOCUMENT</div>
          <div className="space-y-2">
            {REGIONS.map((r) => (
              <div key={r.key} className="rounded-md border-l-4 bg-card px-3 py-2 text-[12px]" style={{ borderColor: r.color }}>
                <span className="font-mono text-[9px] text-muted">{r.label}</span>
                <div>{r.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5">
          <div className="label mb-3">AI-EXTRACTED FIELDS · VALIDATE</div>
          <ul className="space-y-2">
            {REGIONS.map((r) => {
              const s = state[r.key] ?? "pending";
              return (
                <li key={r.key} className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2">
                  <span className="min-w-0 truncate text-[12px]">{r.value}</span>
                  <span className="flex shrink-0 gap-1">
                    <button onClick={() => setState((x) => ({ ...x, [r.key]: "ok" }))} aria-label={`Confirm ${r.label}`} className={`rounded-md px-2 py-1 font-mono text-[10px] ${s === "ok" ? "bg-mint text-white" : "border border-line"}`}>
                      ✓
                    </button>
                    <button onClick={() => setState((x) => ({ ...x, [r.key]: "edit" }))} aria-label={`Flag ${r.label} for correction`} className={`rounded-md px-2 py-1 font-mono text-[10px] ${s === "edit" ? "bg-amber text-white" : "border border-line"}`}>
                      ✎
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
          <AnimatePresence>
            {done && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-lg bg-mint/10 px-3 py-2 font-mono text-[11px] text-mint">
                ✓ Submission validated by reviewer
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MockWindow>
  );
}

export default function Egle({ part, p }: { part: string; p: Project }) {
  if (part === "system")
    return <ArchDiagram layers={p.architecture} accent={p.accent} ring={["Extraction profiles", "Prompt configs", "RBAC", "Review workflow"]} notes={{ Gemini: "Extracts configured fields from documents", "SQL Database": "Submissions, profiles, locations, prompt configs" }} />;
  if (part === "flow") return <Pipeline steps={["Document", "AI extraction", "Structured JSON", "Database", "Human validation"]} accent={p.accent} />;
  if (part === "human") return <Reviewer accent={p.accent} />;
  return (
    <Block k="A" title="AI + database + human review" intro="Upload the sample document. Gemini finds the fields, structures them, stores them — and a person makes the final call.">
      <DocPipeline accent={p.accent} />
    </Block>
  );
}
