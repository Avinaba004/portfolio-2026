"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { Block, Counter, MockWindow, Pipeline } from "../primitives";

const STAGES = ["Fetching content", "Parsing", "Gemini", "Structuring", "JSON", "License configuration"];

const PAGE = [
  { t: "Example Board of Professional Licensing", key: null },
  { t: "Applicants for the Example Professional License must:", key: null },
  { t: "• hold a qualifying degree", key: "education" },
  { t: "• pass the required examination", key: "exam" },
  { t: "• submit two references and a background check", key: "documents" },
  { t: "Licenses renew every 2 years.", key: "renewal" },
  { t: "Application fee applies at submission.", key: "fees" },
];

const JSON_OUT = {
  license_type: "Example Professional License",
  requirements: { education: "qualifying degree", exam: true },
  documents: ["references (2)", "background check"],
  renewal_period_years: 2,
  fees: { application: true },
};

const FORM_FIELDS = ["Applicant details", "Education · qualifying degree", "Examination result", "Reference 1", "Reference 2", "Background check upload", "Application fee"];

function Extractor({ accent }: { accent: string }) {
  const [url, setUrl] = useState("https://board.example.gov/professional-license");
  const [stage, setStage] = useState(-1);
  const timers = useRef<number[]>([]);
  const running = stage >= 0 && stage < STAGES.length;

  const start = () => {
    timers.current.forEach(clearTimeout);
    setStage(0);
    timers.current = STAGES.map((_, i) => window.setTimeout(() => setStage(i + 1), 700 * (i + 1)));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const highlight = stage >= 2;
  const showJson = stage >= 4;
  const showForm = stage >= 6;

  return (
    <div className="space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start();
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="gulp-url" className="sr-only">
          Website URL to extract
        </label>
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-card px-4 py-3 shadow-[var(--shadow-sm)]">
          <span className="font-mono text-[10px] text-muted">WEBSITE</span>
          <input id="gulp-url" value={url} onChange={(e) => setUrl(e.target.value)} className="min-w-0 flex-1 bg-transparent font-mono text-[13px] outline-none" />
        </div>
        <button disabled={running} className="rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)] disabled:opacity-60" style={{ background: accent }}>
          {running ? "Extracting…" : stage >= STAGES.length ? "Run again" : "Extract with Gemini →"}
        </button>
      </form>

      <Pipeline steps={STAGES} accent={accent} active={Math.max(-1, Math.min(stage, STAGES.length - 1))} />

      <div className="grid gap-4 lg:grid-cols-3">
        <MockWindow title={url.replace(/^https?:\/\//, "")} accent={accent} badge="SOURCE · MOCK PAGE">
          <div className="relative space-y-1.5 p-4 text-[12.5px] leading-snug">
            {stage === 0 && <motion.div className="absolute inset-x-0 top-0 h-0.5" style={{ background: accent }} animate={{ width: ["0%", "100%"] }} transition={{ duration: 0.7 }} />}
            {PAGE.map((l, i) => (
              <motion.p
                key={i}
                animate={{
                  backgroundColor: highlight && l.key ? `color-mix(in srgb, ${accent} 16%, transparent)` : "rgba(0,0,0,0)",
                  opacity: stage >= 1 || stage < 0 ? 1 : 0.4,
                }}
                className={`rounded px-1 ${i === 0 ? "font-semibold" : ""}`}
              >
                {l.t}
                {highlight && l.key && <span className="ml-1 font-mono text-[9px]" style={{ color: accent }}>← {l.key}</span>}
              </motion.p>
            ))}
          </div>
        </MockWindow>

        <MockWindow title="gemini → structured output" accent={accent} badge="JSON">
          <div className="min-h-[220px] p-4">
            <AnimatePresence>
              {stage >= 2 && stage < 4 && (
                <motion.div key="think" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid h-[200px] place-items-center">
                  <div className="text-center">
                    <motion.div className="mx-auto h-10 w-10 rounded-xl" style={{ background: accent }} animate={{ rotate: [0, 90, 180, 270, 360], borderRadius: ["30%", "50%", "30%"] }} transition={{ repeat: Infinity, duration: 1.6 }} />
                    <div className="mt-3 font-mono text-[10px] text-muted">{stage === 2 ? "GEMINI EXTRACTING" : "STRUCTURING → SCHEMA"}</div>
                  </div>
                </motion.div>
              )}
              {showJson && (
                <motion.pre key="json" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto font-mono text-[11px] leading-relaxed thin-scroll">
                  {JSON.stringify(JSON_OUT, null, 2)
                    .split("\n")
                    .map((ln, i) => (
                      <motion.span key={i} className="block" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                        {ln.split(/(".*?")/).map((part, k) =>
                          part.startsWith('"') ? (
                            <span key={k} style={{ color: part.endsWith('":') || ln.includes(`${part}:`) ? "var(--ink)" : accent }}>
                              {part}
                            </span>
                          ) : (
                            <span key={k} className="text-muted">
                              {part}
                            </span>
                          ),
                        )}
                      </motion.span>
                    ))}
                </motion.pre>
              )}
              {stage < 2 && <div className="grid h-[200px] place-items-center font-mono text-[10px] text-muted">{stage < 0 ? "WAITING FOR A URL" : "FETCHING · PARSING"}</div>}
            </AnimatePresence>
          </div>
        </MockWindow>

        <MockWindow title="license-configuration / generated form" accent={accent} badge="DYNAMIC FORM">
          <div className="min-h-[220px] space-y-2 p-4">
            {showForm ? (
              FORM_FIELDS.map((f, i) => (
                <motion.div key={f} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <div className="text-[11px] text-ink-2">{f}</div>
                  <div className="mt-0.5 h-6 rounded-md border border-line bg-paper" />
                </motion.div>
              ))
            ) : (
              <div className="grid h-[200px] place-items-center font-mono text-[10px] text-muted">FORM APPEARS FROM JSON</div>
            )}
          </div>
        </MockWindow>
      </div>
      <p className="font-mono text-[10px] text-muted">Mock source page and output, for illustration. The real pipeline works on regulators&apos; websites.</p>
    </div>
  );
}

function Metrics({ accent }: { accent: string }) {
  const [go, setGo] = useState(false);
  return (
    <motion.div onViewportEnter={() => setGo(true)} viewport={{ once: true }} className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
      <div className="grid grid-cols-2 gap-4">
        <div className="panel-flat p-6">
          <div className="font-display text-4xl font-extrabold sm:text-5xl" style={{ color: accent }}>
            {go ? <Counter to={70} /> : 0}%
          </div>
          <div className="mt-2 label">PROCESSING TIME REDUCTION</div>
        </div>
        <div className="panel-flat p-6">
          <div className="font-display text-4xl font-extrabold sm:text-5xl">15–20s</div>
          <div className="mt-2 label">END-TO-END EXTRACTION</div>
        </div>
      </div>
      <div className="panel-flat space-y-5 p-6">
        {[
          ["BEFORE", 100, "var(--ink)"],
          ["AFTER", 30, accent],
        ].map(([l, w, c]) => (
          <div key={String(l)}>
            <div className="mb-1.5 flex justify-between font-mono text-[11px]">
              <span>{l}</span>
              <span className="text-muted">{l === "BEFORE" ? "manual configuration" : "Gemini-assisted"}</span>
            </div>
            <div className="h-7 overflow-hidden rounded-lg bg-paper-2">
              <motion.div className="h-full rounded-lg" style={{ background: String(c) }} initial={{ width: 0 }} animate={go ? { width: `${w}%` } : {}} transition={{ duration: 1.2, delay: l === "AFTER" ? 0.4 : 0, ease: [0.2, 0.8, 0.2, 1] }} />
            </div>
          </div>
        ))}
        <p className="font-mono text-[10px] text-muted">Relative processing time · 70% reduction (to 15–20s)</p>
      </div>
    </motion.div>
  );
}

const TECH_MAP: [string, string][] = [
  ["Gemini", "Extraction"],
  ["PostgreSQL / JSONB", "Configuration"],
  ["pgvector", "Vector storage"],
  ["RBAC", "Permissions"],
  ["Pub/Sub", "Event processing"],
  ["OAuth 2.0", "Authentication"],
  ["Dynamic Forms", "License applications"],
  ["Workflow", "Automation"],
  ["Docker", "Containers"],
  ["Next.js", "Platform UI"],
];

function TechToArch({ accent }: { accent: string }) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {TECH_MAP.map(([t, r], i) => (
        <motion.div
          key={t}
          onPointerEnter={() => setHover(i)}
          onPointerLeave={() => setHover(null)}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
          className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-line bg-card px-4 py-3"
        >
          <span className="w-full shrink-0 font-display text-[12.5px] font-bold sm:w-36">{t}</span>
          <span className="relative h-px flex-1 bg-line">
            <motion.span className="absolute -top-[3px] h-[7px] w-[7px] rounded-full" style={{ background: accent }} animate={{ left: hover === i ? ["0%", "100%"] : "0%" }} transition={{ duration: 0.6, repeat: hover === i ? Infinity : 0 }} />
          </span>
          <span className="shrink-0 text-right font-mono text-[11px] text-ink-2 sm:w-32">{r}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ReviewMock({ accent }: { accent: string }) {
  const [ok, setOk] = useState<Record<string, boolean>>({});
  const keys = Object.keys(JSON_OUT);
  const all = keys.every((k) => ok[k]);
  return (
    <MockWindow title="licensing-admin / review extracted configuration" accent={accent} badge="ILLUSTRATIVE">
      <ul className="divide-y divide-line">
        {keys.map((k) => (
          <li key={k} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="font-mono text-[11px] text-muted">{k}</div>
              <div className="truncate text-[13px]">{JSON.stringify(JSON_OUT[k as keyof typeof JSON_OUT])}</div>
            </div>
            <button
              onClick={() => setOk((o) => ({ ...o, [k]: !o[k] }))}
              aria-pressed={!!ok[k]}
              className="shrink-0 rounded-lg border px-3 py-1 font-mono text-[10px]"
              style={{ borderColor: ok[k] ? "var(--mint)" : "var(--line)", background: ok[k] ? "var(--mint)" : undefined, color: ok[k] ? "#fff" : undefined }}
            >
              {ok[k] ? "ACCEPTED ✓" : "ACCEPT"}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <span className="font-mono text-[10px] text-muted">An admin reviews before publishing · RBAC-protected</span>
        <span className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-white transition-opacity" style={{ background: accent, opacity: all ? 1 : 0.35 }}>
          Publish configuration
        </span>
      </div>
    </MockWindow>
  );
}

export default function Gulp({ part, p }: { part: string; p: Project }) {
  if (part === "system") return <TechToArch accent={p.accent} />;
  if (part === "flow") return <Pipeline steps={["Website", "Gemini", "JSON", "PostgreSQL (JSONB)", "License form"]} accent={p.accent} />;
  if (part === "human") return <ReviewMock accent={p.accent} />;
  return (
    <>
      <Block k="A" title="Website → Gemini → license" intro="Enter a URL and run the pipeline. Watch unstructured text turn into JSON, and JSON turn into a working license form.">
        <Extractor accent={p.accent} />
      </Block>
      <Block k="B" title="Impact">
        <Metrics accent={p.accent} />
      </Block>
    </>
  );
}
