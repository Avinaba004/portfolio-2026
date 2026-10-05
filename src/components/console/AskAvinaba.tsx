"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ask, suggestedQuestions, type Answer } from "@/lib/knowledge";
import { getProject } from "@/data/projects";
import { useApp } from "@/components/system/AppProvider";

type Msg = { role: "user" | "bot"; text: string; a?: Answer };

function Avatar() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink" aria-hidden>
      <svg viewBox="0 0 32 32" className="h-6 w-6">
        <rect x="6" y="9" width="20" height="15" rx="7" fill="#f7f4ee" />
        <rect x="9" y="12.5" width="14" height="7" rx="3.5" fill="#16161a" />
        <rect x="11.5" y="14.5" width="2.4" height="3" rx="1.2" fill="#7ff3ff" />
        <rect x="18" y="14.5" width="2.4" height="3" rx="1.2" fill="#7ff3ff" />
        <line x1="16" y1="9" x2="16" y2="5.5" stroke="#f7f4ee" strokeWidth="1.4" />
        <circle cx="16" cy="5" r="1.6" fill="#ff4d17" />
      </svg>
    </span>
  );
}

/** Streams text out character by character for a "thinking" feel (instant under reduced motion). */
function Typed({ text, onDone }: { text: string; onDone?: () => void }) {
  const [n, setN] = useState(0);
  const done = useRef(onDone);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setN(text.length));
      done.current?.();
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += Math.max(2, Math.round(text.length / 90));
      setN(Math.min(i, text.length));
      if (i >= text.length) {
        clearInterval(id);
        done.current?.();
      }
    }, 16);
    return () => clearInterval(id);
  }, [text]);
  return <>{text.slice(0, n)}</>;
}

export function AskAvinaba() {
  const { sfx } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hi — I'm AG-01. I answer questions about Avinaba using only his verified portfolio data. No guessing." },
  ]);
  const [q, setQ] = useState("");
  const [thinking, setThinking] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, thinking]);

  const send = (text: string) => {
    if (!text.trim() || thinking) return;
    sfx("select");
    setMsgs((m) => [...m, { role: "user", text }]);
    setQ("");
    setThinking(true);
    setTimeout(() => {
      const a = ask(text);
      setThinking(false);
      setMsgs((m) => [...m, { role: "bot", text: a.text, a }]);
    }, 450);
  };

  return (
    <div className="panel flex h-[480px] flex-col overflow-hidden sm:h-[520px] !rounded-[24px] !bg-card">
      <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
        <Avatar />
        <div>
          <div className="font-display text-sm font-bold tracking-wide">ASK AVINABA</div>
          <div className="font-mono text-[10px] text-muted">local knowledge base · verified data only · no LLM</div>
        </div>
      </div>

      <div ref={scroller} className="thin-scroll flex-1 space-y-3 overflow-y-auto px-5 py-4" role="log" aria-live="polite" aria-label="Conversation">
        {msgs.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "bot" && <Avatar />}
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-line ${m.role === "user" ? "rounded-br-md bg-ink text-white" : "rounded-tl-md bg-paper-2 text-ink"}`}>
              {m.role === "bot" && i === msgs.length - 1 && i > 0 ? <Typed text={m.text} /> : m.text}
              {m.a && (m.a.sources.length > 0 || m.a.related?.length) && (
                <div className="mt-3 border-t border-line pt-2">
                  {m.a.sources.length > 0 && <div className="font-mono text-[9.5px] text-muted">SOURCE · {m.a.sources.join(" · ")}</div>}
                  {m.a.related && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.a.related.slice(0, 5).map((slug) => {
                        const p = getProject(slug);
                        if (!p) return null;
                        return p.category === "work" ? (
                          <Link key={slug} href={`/work/${slug}`} className="rounded-md bg-ink px-2 py-0.5 font-mono text-[10px] text-white">
                            {p.name} ↗
                          </Link>
                        ) : (
                          <a key={slug} href={`#lab-${slug}`} className="rounded-md border border-line bg-card px-2 py-0.5 font-mono text-[10px]">
                            {p.name}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <AnimatePresence>
          {thinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2.5">
              <Avatar />
              <div className="flex gap-1 rounded-2xl bg-paper-2 px-4 py-3">
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-muted" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: d * 0.12 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-1.5 overflow-x-auto px-4 pb-2 thin-scroll">
        {suggestedQuestions.map((s) => (
          <button key={s} onClick={() => send(s)} className="shrink-0 rounded-full border border-line bg-paper px-3 py-1.5 text-[11.5px] text-ink-2 hover:border-ink hover:text-ink">
            {s}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(q);
        }}
        className="flex gap-2 border-t border-line p-3"
      >
        <label htmlFor="ask-input" className="sr-only">
          Ask a question about Avinaba
        </label>
        <input
          id="ask-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about projects, AI, auth, cloud…"
          className="min-w-0 flex-1 rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-ink"
        />
        <button disabled={thinking || !q.trim()} className="rounded-xl bg-signal px-4 text-sm font-semibold text-white transition-opacity disabled:opacity-40">
          Ask
        </button>
      </form>
    </div>
  );
}
