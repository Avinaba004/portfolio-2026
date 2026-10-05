"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Project } from "@/data/projects";
import { ArchDiagram, Block, MockWindow, Pipeline, StateMachine } from "../primitives";

/* Stylised Ohio outline (not to scale) and 88 county nodes placed inside it. */
const OHIO: [number, number][] = [
  [20, 22], [92, 22], [118, 12], [146, 20], [176, 8], [180, 92], [172, 118], [160, 140], [140, 158], [122, 174], [100, 168], [80, 182], [60, 172], [40, 180], [22, 168],
];
const inside = (x: number, y: number) => {
  let c = false;
  for (let i = 0, j = OHIO.length - 1; i < OHIO.length; j = i++) {
    const [xi, yi] = OHIO[i];
    const [xj, yj] = OHIO[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const COUNTIES = (() => {
  const pts: [number, number][] = [];
  for (let y = 26; y < 180; y += 14.5) for (let x = 26; x < 180; x += 14.5) if (inside(x, y)) pts.push([x + ((y * 7) % 5) - 2, y + ((x * 3) % 5) - 2]);
  const out: [number, number][] = [];
  for (let i = 0; i < 88; i++) out.push(pts[Math.floor((i * pts.length) / 88)]);
  return out;
})();

function OhioMap({ accent }: { accent: string }) {
  const [built, setBuilt] = useState(0);
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
      <motion.div className="relative mx-auto aspect-square w-full max-w-[460px]" onViewportEnter={() => setBuilt(1)} viewport={{ once: true, margin: "-100px" }}>
        <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label="Stylised map of Ohio with 88 county nodes">
          <motion.path
            d={`M${OHIO.map((p) => p.join(",")).join(" L")} Z`}
            fill={accent}
            fillOpacity="0.05"
            stroke={accent}
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={built ? { pathLength: 1 } : {}}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
          {COUNTIES.map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="2.6"
              fill={accent}
              initial={{ scale: 0, opacity: 0 }}
              animate={built ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.018, type: "spring", stiffness: 300, damping: 14 }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
          ))}
          {built > 0 &&
            COUNTIES.filter((_, i) => i % 9 === 0).map(([x, y], i) => (
              <motion.line key={i} x1={x} y1={y} x2="100" y2="96" stroke={accent} strokeOpacity="0.25" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.6 + i * 0.05 }} />
            ))}
          {built > 0 && (
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring" }} style={{ transformOrigin: "100px 96px" }}>
              <rect x="80" y="88" width="40" height="16" rx="5" fill="var(--ink)" />
              <text x="100" y="99" textAnchor="middle" fontSize="7" fill="#fff" fontFamily="monospace">
                STATE
              </text>
            </motion.g>
          )}
        </svg>
        <div className="absolute top-2 left-2 font-mono text-[10px] text-muted">STYLISED · NOT TO SCALE</div>
      </motion.div>
      <div>
        <div className="font-display text-[clamp(3rem,8vw,6rem)] leading-none font-extrabold" style={{ color: accent }}>
          88
        </div>
        <div className="font-display text-xl font-bold tracking-wider">OHIO COUNTIES</div>
        <p className="mt-3 max-w-md text-ink-2">Counties, courts and state staff all touch the same grant lifecycle. The system models every one of those relationships.</p>
        <div className="mt-6">
          <Pipeline steps={["Counties", "Courts", "Users", "Grants", "Applications", "Compliance"]} accent={accent} interval={900} />
        </div>
      </div>
    </div>
  );
}

const WF = [
  { id: "draft", label: "DRAFT", role: "Applicant (county / court user)", actions: ["Fill configuration-driven form", "Save progress", "Validate required sections"] },
  { id: "submitted", label: "SUBMITTED", role: "Applicant → state reviewer queue", actions: ["Lock submission version", "Route to the reviewer role", "Notify the reviewers"] },
  { id: "review", label: "UNDER REVIEW", role: "State reviewer", actions: ["Review sections", "Request changes", "Recommend a decision"], tone: "warn" as const },
  { id: "approved", label: "APPROVED", role: "Authorised approver", actions: ["Approve", "Record the decision", "Move to the compliance stage"], tone: "ok" as const },
];

function PortalMock({ accent }: { accent: string }) {
  const roles = {
    County: { nav: ["My Applications", "New Application", "Documents"], cards: ["Draft · Application", "Submitted · Application"] },
    Court: { nav: ["Court Programs", "Applications", "Reports"], cards: ["Under Review · Application", "Draft · Application"] },
    Admin: { nav: ["All Applications", "Form Builder", "Workflow Config", "Users & Roles"], cards: ["Review queue", "Form versions", "Role permissions"] },
  } as const;
  const [role, setRole] = useState<keyof typeof roles>("County");
  return (
    <MockWindow title="grants-portal / dashboard" accent={accent} badge="ILLUSTRATIVE">
      <div className="flex flex-wrap gap-1 border-b border-line px-3 py-2">
        <span className="mr-2 self-center font-mono text-[10px] text-muted">VIEW AS</span>
        {(Object.keys(roles) as (keyof typeof roles)[]).map((r) => (
          <button key={r} onClick={() => setRole(r)} aria-pressed={role === r} className={`rounded-md px-2.5 py-1 font-mono text-[11px] ${role === r ? "text-white" : "text-ink-2 hover:bg-paper-2"}`} style={{ background: role === r ? accent : undefined }}>
            {r.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="grid min-h-[260px] grid-cols-1 sm:grid-cols-[150px_1fr]">
        <AnimatePresence mode="wait">
          <motion.ul key={role} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex gap-1 overflow-x-auto border-b border-line p-3 sm:block sm:space-y-1 sm:border-r sm:border-b-0">
            {roles[role].nav.map((n, i) => (
              <li key={n} className={`shrink-0 rounded-md px-2 py-1.5 text-[12px] whitespace-nowrap ${i === 0 ? "bg-paper-2 font-medium" : "text-ink-2"}`}>
                {n}
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
        <div className="space-y-2 p-4">
          <AnimatePresence mode="popLayout">
            {roles[role].cards.map((c, i) => (
              <motion.div key={role + c} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-line p-3">
                <div className="text-[13px] font-medium">{c}</div>
                <div className="mt-2 h-1.5 w-2/3 rounded bg-paper-2" />
                <div className="mt-1 h-1.5 w-1/3 rounded bg-paper-2" />
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="pt-2 font-mono text-[10px] text-muted">RBAC · menu and actions are resolved from the signed-in role</div>
        </div>
      </div>
    </MockWindow>
  );
}

function DynamicForm({ accent }: { accent: string }) {
  const [cfg, setCfg] = useState({ version: "v1", budgetTable: false, partnerSection: true, attachments: 1 });
  const fields: { id: string; label: string; type: string }[] = [
    { id: "org", label: "Organisation name", type: "text" },
    { id: "contact", label: "Primary contact", type: "text" },
    ...(cfg.version === "v2" ? [{ id: "outcomes", label: "Program outcomes", type: "textarea" }] : []),
    ...(cfg.partnerSection ? [{ id: "partners", label: "Partner organisations", type: "repeater" }] : []),
    ...(cfg.budgetTable ? [{ id: "budget", label: "Budget breakdown", type: "table" }] : []),
    ...Array.from({ length: cfg.attachments }, (_, i) => ({ id: `att${i}`, label: `Attachment ${i + 1}`, type: "file" })),
  ];
  const json = JSON.stringify({ form: "grant_application", version: cfg.version, sections: { partners: cfg.partnerSection, budget: cfg.budgetTable }, attachments: cfg.attachments }, null, 2);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="panel-flat p-5">
          <div className="label mb-3">CONFIGURATION · CHANGE ME</div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Form version</span>
              <div className="flex overflow-hidden rounded-lg border border-line">
                {["v1", "v2"].map((v) => (
                  <button key={v} onClick={() => setCfg((c) => ({ ...c, version: v }))} aria-pressed={cfg.version === v} className="px-3 py-1 font-mono text-[11px]" style={{ background: cfg.version === v ? accent : undefined, color: cfg.version === v ? "#fff" : undefined }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            {(
              [
                ["partnerSection", "Partner section"],
                ["budgetTable", "Budget table"],
              ] as const
            ).map(([k, l]) => (
              <label key={k} className="flex cursor-pointer items-center justify-between">
                <span>{l}</span>
                <input type="checkbox" checked={cfg[k]} onChange={(e) => setCfg((c) => ({ ...c, [k]: e.target.checked }))} className="h-4 w-4" style={{ accentColor: accent }} />
              </label>
            ))}
            <label className="flex items-center justify-between">
              <span>Attachments</span>
              <input type="range" min={0} max={3} value={cfg.attachments} onChange={(e) => setCfg((c) => ({ ...c, attachments: +e.target.value }))} style={{ accentColor: accent }} aria-valuetext={`${cfg.attachments} attachments`} />
            </label>
          </div>
        </div>
        <pre className="overflow-x-auto rounded-2xl bg-ink p-4 font-mono text-[11px] leading-relaxed text-white/80 thin-scroll">{json}</pre>
      </div>
      <MockWindow title={`grant_application · ${cfg.version}`} accent={accent} badge="RENDERED FROM CONFIG">
        <motion.div layout className="space-y-3 p-5">
          <AnimatePresence initial={false}>
            {fields.map((f) => (
              <motion.div key={f.id} layout initial={{ opacity: 0, height: 0, scale: 0.96 }} animate={{ opacity: 1, height: "auto", scale: 1 }} exit={{ opacity: 0, height: 0 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
                <div className="mb-1 text-[11.5px] font-medium text-ink-2">{f.label}</div>
                {f.type === "textarea" ? (
                  <div className="h-14 rounded-lg border border-line bg-paper" />
                ) : f.type === "table" ? (
                  <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={`h-6 ${i < 3 ? "bg-paper-2" : "bg-paper"}`} />
                    ))}
                  </div>
                ) : f.type === "repeater" ? (
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 rounded-lg border border-line bg-paper" />
                    <span className="grid h-8 w-8 place-items-center rounded-lg border border-dashed border-line-strong text-muted">+</span>
                  </div>
                ) : f.type === "file" ? (
                  <div className="grid h-9 place-items-center rounded-lg border border-dashed border-line-strong font-mono text-[10px] text-muted">DROP FILE</div>
                ) : (
                  <div className="h-8 rounded-lg border border-line bg-paper" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="pt-1">
            <span className="inline-block rounded-lg px-4 py-2 text-[12px] font-medium text-white" style={{ background: accent }}>
              Submit
            </span>
          </div>
        </motion.div>
      </MockWindow>
    </div>
  );
}

export default function Odys({ part, p }: { part: string; p: Project }) {
  if (part === "system")
    return (
      <ArchDiagram
        layers={p.architecture}
        accent={p.accent}
        ring={["RBAC", "SSO", "OAuth 2.0", "OIDC", "SAML", "Firebase Auth", "Google Identity", "Cloud Run"]}
        notes={{ React: "Portal UI + dynamic form renderer", "Next.js": "App framework & server boundary", "API Layer": "REST APIs", Python: "Business logic & workflow engine", PostgreSQL: "Data model, configuration & roles" }}
      />
    );
  if (part === "flow") return <StateMachine states={WF} accent={p.accent} />;
  if (part === "human") return <PortalMock accent={p.accent} />;
  return (
    <>
      <Block k="A" title="A government operating system">
        <OhioMap accent={p.accent} />
      </Block>
      <Block k="B" title="Configuration-driven architecture" intro="Change the configuration. The form rebuilds itself — no code change, versioned and validated. This is the idea behind the platform's dynamic forms.">
        <DynamicForm accent={p.accent} />
      </Block>
    </>
  );
}
