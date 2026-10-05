"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Project } from "@/data/projects";
import { ArchDiagram, Block, MockWindow, Pipeline } from "../primitives";

function Node({ label, sub, tone = "var(--ink)", lit }: { label: string; sub?: string; tone?: string; lit?: boolean }) {
  return (
    <motion.div animate={{ borderColor: lit ? tone : "var(--line)", scale: lit ? 1.04 : 1 }} className="rounded-2xl border-2 bg-card px-4 py-3 text-center shadow-[var(--shadow-sm)]">
      <div className="font-display text-[13px] font-bold tracking-wider">{label}</div>
      {sub && <div className="mt-0.5 font-mono text-[10px] text-muted">{sub}</div>}
    </motion.div>
  );
}

function Arrow({ go, color, blocked }: { go: boolean; color: string; blocked?: boolean }) {
  return (
    <div className="relative mx-auto h-10 w-px bg-line" aria-hidden>
      {go && <motion.span className="absolute -left-[4px] h-2 w-2 rounded-full" style={{ background: color }} initial={{ top: 0 }} animate={{ top: blocked ? "45%" : "100%" }} transition={{ duration: 0.5 }} />}
    </div>
  );
}

function SecurityDemo({ accent }: { accent: string }) {
  const [bad, setBad] = useState(0);
  const [good, setGood] = useState(0);
  const runBad = () => {
    setBad(1);
    setTimeout(() => setBad(2), 600);
  };
  const runGood = () => {
    setGood(1);
    setTimeout(() => setGood(2), 550);
    setTimeout(() => setGood(3), 1100);
  };
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* BAD */}
      <div className="relative overflow-hidden rounded-[24px] border-2 border-rose/40 bg-rose/[0.04] p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold tracking-widest text-rose">BAD ARCHITECTURE</span>
          <button onClick={runBad} className="rounded-lg bg-rose px-3 py-1.5 text-[11px] font-medium text-white">
            ▶ Send request
          </button>
        </div>
        <div className="mt-6">
          <Node label="BROWSER" sub="key shipped in JS bundle" tone="var(--rose)" lit={bad > 0} />
          <Arrow go={bad > 0} color="var(--rose)" blocked />
          <Node label="GEMINI API" sub="GEMINI_API_KEY=AIza•••• exposed" tone="var(--rose)" />
        </div>
        <AnimatePresence>
          {bad === 2 && (
            <motion.div initial={{ scale: 2.2, opacity: 0, rotate: -18 }} animate={{ scale: 1, opacity: 1, rotate: -10 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center bg-card/60 backdrop-blur-[2px]">
              <div className="rounded-xl border-4 border-rose px-5 py-2 text-center font-display text-2xl font-extrabold text-rose">
                BLOCKED
                <div className="font-mono text-[10px] font-normal">API key must never reach the client</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECURE */}
      <div className="relative overflow-hidden rounded-[24px] border-2 border-mint/40 bg-mint/[0.04] p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold tracking-widest text-mint">SECURE ARCHITECTURE</span>
          <button onClick={runGood} className="rounded-lg bg-mint px-3 py-1.5 text-[11px] font-medium text-white">
            ▶ Send request
          </button>
        </div>
        <div className="mt-6">
          <Node label="BROWSER" sub="session cookie only — no key" tone="var(--mint)" lit={good > 0} />
          <Arrow go={good > 0} color="var(--mint)" />
          <Node label="NEXT.JS SERVER" sub="auth guard · key in server env" tone={accent} lit={good > 1} />
          <Arrow go={good > 1} color="var(--mint)" />
          <Node label="GEMINI" sub="called server-to-server" tone="var(--mint)" lit={good > 2} />
        </div>
        <AnimatePresence>
          {good === 3 && (
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 rounded-xl bg-mint px-4 py-2 text-center font-mono text-[12px] text-white">
              ✓ ACCEPTED · response streamed back to the browser
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChatMock({ accent }: { accent: string }) {
  const [signedIn, setSignedIn] = useState(false);
  const [res, setRes] = useState<null | "401" | "ok">(null);
  return (
    <MockWindow title="assistant / chat" accent={accent} badge="ILLUSTRATIVE">
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-muted">{signedIn ? "● authenticated session" : "○ not signed in"}</span>
          <button
            onClick={() => {
              setSignedIn((s) => !s);
              setRes(null);
            }}
            className="chip"
          >
            {signedIn ? "SIGN OUT" : "SIGN IN"}
          </button>
        </div>
        <div className="rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-[13px] text-white">Summarise our internal onboarding guide.</div>
        <button onClick={() => setRes(signedIn ? "ok" : "401")} className="rounded-lg px-4 py-2 text-[12px] font-medium text-white" style={{ background: accent }}>
          Send
        </button>
        <AnimatePresence mode="wait">
          {res === "401" && (
            <motion.div key="401" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl bg-rose/10 px-4 py-2.5 font-mono text-[12px] text-rose">
              401 · Auth guard rejected the request before it reached retrieval or Gemini.
            </motion.div>
          )}
          {res === "ok" && (
            <motion.div key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl rounded-tl-md bg-paper-2 px-4 py-2.5 text-[13px]">
              Answer grounded in authenticated knowledge (RAG)…
              <div className="mt-1 font-mono text-[10px] text-muted">sources retrieved for this user only</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MockWindow>
  );
}

export default function AiAssistant({ part, p }: { part: string; p: Project }) {
  if (part === "system") return <ArchDiagram layers={p.architecture} accent={p.accent} ring={["Nginx", "Server-held API key", "RAG", "Session auth"]} notes={{ "Auth Guard": "Rejects unauthenticated requests", Backend: "Retrieval + prompt assembly", Gemini: "LLM responses" }} />;
  if (part === "flow") return <Pipeline steps={p.workflow} accent={p.accent} />;
  if (part === "human") return <ChatMock accent={p.accent} />;
  return (
    <Block k="A" title="Why API keys live on the server" intro="Send a request through each architecture. One leaks the key and gets blocked. The other never lets the browser see it.">
      <SecurityDemo accent={p.accent} />
    </Block>
  );
}
