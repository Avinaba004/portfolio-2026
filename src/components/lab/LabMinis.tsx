"use client";

import { AnimatePresence, LayoutGroup, motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { useApp } from "@/components/system/AppProvider";
import { useInterval, useReducedMotionPref } from "@/lib/hooks";

/* ======================= EXPTRACK ======================= */

const CATS = [
  { id: "food", label: "Food", color: "var(--signal)", budget: 6000 },
  { id: "travel", label: "Travel", color: "var(--cobalt)", budget: 4000 },
  { id: "bills", label: "Bills", color: "var(--violet)", budget: 5000 },
  { id: "shop", label: "Shopping", color: "var(--mint)", budget: 3000 },
];

type Tx = { id: number; merchant: string; cat: string; amount: number; source: "OCR" | "MANUAL" };

const SEED: Tx[] = [
  { id: 1, merchant: "Grocery store", cat: "food", amount: 1840, source: "MANUAL" },
  { id: 2, merchant: "Metro card top-up", cat: "travel", amount: 500, source: "MANUAL" },
  { id: 3, merchant: "Electricity bill", cat: "bills", amount: 2310, source: "MANUAL" },
  { id: 4, merchant: "Bookstore", cat: "shop", amount: 899, source: "OCR" },
];

const INCOMING: Omit<Tx, "id">[] = [
  { merchant: "Café receipt", cat: "food", amount: 420, source: "OCR" },
  { merchant: "Cab ride", cat: "travel", amount: 310, source: "MANUAL" },
  { merchant: "Internet bill", cat: "bills", amount: 999, source: "MANUAL" },
  { merchant: "Sneakers", cat: "shop", amount: 1450, source: "OCR" },
  { merchant: "Dinner", cat: "food", amount: 1280, source: "OCR" },
];

const PIPE = ["RECEIPT OCR", "INNGEST JOB", "DATABASE", "BUDGET", "GEMINI INSIGHT"];

export function ExpTrack() {
  const { sfx } = useApp();
  const [txs, setTxs] = useState(SEED);
  const [stage, setStage] = useState(-1);
  const [n, setN] = useState(0);

  const spent = (cat: string) => txs.filter((t) => t.cat === cat).reduce((a, t) => a + t.amount, 0);
  const total = txs.reduce((a, t) => a + t.amount, 0);

  const ingest = () => {
    if (stage >= 0) return;
    sfx("open");
    const next = INCOMING[n % INCOMING.length];
    PIPE.forEach((_, i) => setTimeout(() => setStage(i), i * 380));
    setTimeout(() => {
      setTxs((t) => [{ ...next, id: Date.now() }, ...t].slice(0, 7));
      sfx("success");
    }, 2 * 380);
    setTimeout(() => setStage(-1), PIPE.length * 380 + 500);
    setN((v) => v + 1);
  };

  // donut
  const R = 34;
  const C = 2 * Math.PI * R;
  const top = CATS.map((c) => ({ ...c, v: spent(c.id) })).sort((a, b) => b.v - a.v)[0];

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-1 overflow-x-auto font-mono text-[9px] tracking-wider thin-scroll" aria-label="Expense pipeline">
        {PIPE.map((p, i) => (
          <div key={p} className="flex items-center gap-1">
            <span className={`rounded-md border px-2 py-1 whitespace-nowrap transition-colors ${stage >= i ? "border-mint bg-mint text-white" : "border-line text-muted"}`}>{p}</span>
            {i < PIPE.length - 1 && <span className={stage > i ? "text-mint" : "text-line-strong"}>→</span>}
          </div>
        ))}
      </div>

      <div className="grid flex-1 gap-4 @sm:grid-cols-[120px_1fr]">
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 90 90" className="h-28 w-28 -rotate-90" aria-label={`Spending by category, total ₹${total.toLocaleString("en-IN")}`}>
            <circle cx="45" cy="45" r={R} fill="none" stroke="var(--paper-2)" strokeWidth="12" />
            {CATS.map((c, i) => {
              const v = spent(c.id) / total;
              const before = CATS.slice(0, i).reduce((a, x) => a + spent(x.id) / total, 0);
              return <motion.circle key={c.id} cx="45" cy="45" r={R} fill="none" stroke={c.color} strokeWidth="12" animate={{ strokeDasharray: `${v * C} ${C}`, strokeDashoffset: -before * C }} />;
            })}
          </svg>
          <div className="mt-1 font-display text-lg font-bold">₹{total.toLocaleString("en-IN")}</div>
          <div className="font-mono text-[9px] text-muted">THIS MONTH</div>
        </div>
        <div className="space-y-2.5">
          {CATS.map((c) => {
            const pct = Math.min(1, spent(c.id) / c.budget);
            return (
              <div key={c.id}>
                <div className="flex justify-between font-mono text-[10px]">
                  <span>{c.label.toUpperCase()}</span>
                  <span className={pct > 0.8 ? "text-signal" : "text-muted"}>
                    ₹{spent(c.id).toLocaleString("en-IN")} / {c.budget.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper-2">
                  <motion.div className="h-full rounded-full" style={{ background: c.color }} animate={{ width: `${pct * 100}%` }} transition={{ type: "spring", stiffness: 80, damping: 16 }} />
                </div>
              </div>
            );
          })}
          <div className="rounded-lg bg-paper-2 px-3 py-2 text-[11px] text-ink-2">
            <span className="font-mono text-[9px] text-violet">AI ADVISOR · </span>
            {top.label} is your largest category this month.
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-1" aria-live="polite">
        <AnimatePresence initial={false}>
          {txs.slice(0, 4).map((t) => (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0, x: -20, backgroundColor: "rgba(14,159,110,0.15)" }}
              animate={{ opacity: 1, x: 0, backgroundColor: "rgba(0,0,0,0)" }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 text-[12px]"
            >
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: CATS.find((c) => c.id === t.cat)!.color }} />
                {t.merchant}
                <span className="rounded bg-paper-2 px-1 font-mono text-[8.5px] text-muted">{t.source}</span>
              </span>
              <span className="font-mono">₹{t.amount.toLocaleString("en-IN")}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <button onClick={ingest} disabled={stage >= 0} className="mt-4 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-50">
        {stage >= 0 ? "Extracting…" : "⤓ Drop a receipt"}
      </button>
    </div>
  );
}

/* ======================= QUERY ======================= */

type Q = { id: number; title: string; votes: number; answers: string[] };

const SEED_Q: Q[] = [
  { id: 1, title: "How do protected routes work with Firebase Auth?", votes: 12, answers: ["Check the auth state before rendering the route, and verify the ID token on the API."] },
  { id: 2, title: "When should I use MongoDB over SQL?", votes: 7, answers: [] },
  { id: 3, title: "What's the cleanest way to structure Express routes?", votes: 5, answers: ["Group by resource: routes → controllers → services."] },
];

export function QueryMini() {
  const { sfx } = useApp();
  const [qs, setQs] = useState(SEED_Q);
  const [open, setOpen] = useState<number | null>(1);
  const [draft, setDraft] = useState("");
  const [answer, setAnswer] = useState("");
  const [authed, setAuthed] = useState(false);

  const sorted = [...qs].sort((a, b) => b.votes - a.votes);

  const vote = (id: number, d: number) => {
    sfx("tick");
    setQs((q) => q.map((x) => (x.id === id ? { ...x, votes: x.votes + d } : x)));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted">{authed ? "● SIGNED IN (DEMO)" : "○ GUEST · READ ONLY"}</span>
        <button onClick={() => setAuthed((a) => !a)} className="chip !py-1">
          {authed ? "SIGN OUT" : "SIGN IN"}
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!authed || !draft.trim()) return;
          const id = Date.now();
          setQs((q) => [...q, { id, title: draft.trim(), votes: 0, answers: [] }]);
          setDraft("");
          setOpen(id);
          sfx("success");
        }}
        className="flex gap-2"
      >
        <label htmlFor="q-ask" className="sr-only">
          Ask a question
        </label>
        <input
          id="q-ask"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={!authed}
          placeholder={authed ? "Ask a question…" : "Sign in to ask (protected route)"}
          className="min-w-0 flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink disabled:opacity-60"
        />
        <button disabled={!authed} className="rounded-lg bg-signal px-3 text-sm font-medium text-white disabled:opacity-40">
          Ask
        </button>
      </form>
      <ul className="thin-scroll mt-3 max-h-[300px] flex-1 space-y-1.5 overflow-y-auto">
        {sorted.map((q) => (
          <motion.li layout key={q.id} className="rounded-xl border border-line bg-card">
            <div className="flex items-start gap-2 p-2.5">
              <div className="flex flex-col items-center font-mono text-[11px]">
                <button onClick={() => vote(q.id, 1)} aria-label="Upvote" className="px-1 text-muted hover:text-signal">
                  ▲
                </button>
                <span className="font-semibold">{q.votes}</span>
                <button onClick={() => vote(q.id, -1)} aria-label="Downvote" className="px-1 text-muted hover:text-ink">
                  ▼
                </button>
              </div>
              <button onClick={() => setOpen(open === q.id ? null : q.id)} className="flex-1 text-left text-[13px] leading-snug font-medium" aria-expanded={open === q.id}>
                {q.title}
                <span className="mt-1 block font-mono text-[9.5px] text-muted">{q.answers.length} ANSWER{q.answers.length === 1 ? "" : "S"}</span>
              </button>
            </div>
            <AnimatePresence>
              {open === q.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="space-y-1.5 border-t border-line px-3 py-2.5">
                    {q.answers.map((a, i) => (
                      <p key={i} className="rounded-lg bg-paper-2 px-2.5 py-1.5 text-[12px] text-ink-2">
                        {a}
                      </p>
                    ))}
                    {authed && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!answer.trim()) return;
                          setQs((all) => all.map((x) => (x.id === q.id ? { ...x, answers: [...x.answers, answer.trim()] } : x)));
                          setAnswer("");
                        }}
                        className="flex gap-1.5"
                      >
                        <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Write an answer…" aria-label="Write an answer" className="min-w-0 flex-1 rounded-md border border-line bg-paper px-2 py-1 text-[12px] outline-none" />
                        <button className="rounded-md bg-ink px-2 text-[11px] text-white">Post</button>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ======================= STORIES ======================= */

const COLS = ["TODO", "IN PROGRESS", "DONE"] as const;
type Card = { id: string; t: string; col: number; who: string };
const PEOPLE = [
  { id: "A", color: "var(--signal)" },
  { id: "B", color: "var(--cobalt)" },
  { id: "C", color: "var(--mint)" },
];

export function StoriesMini() {
  const reduced = useReducedMotionPref();
  const [cards, setCards] = useState<Card[]>([
    { id: "1", t: "Gantt dependencies", col: 0, who: "A" },
    { id: "2", t: "Timesheet export", col: 0, who: "B" },
    { id: "3", t: "OKR progress", col: 1, who: "C" },
    { id: "4", t: "SSO (SAML/OIDC)", col: 1, who: "A" },
    { id: "5", t: "Critical path", col: 2, who: "B" },
  ]);
  const [event, setEvent] = useState("ws: connected");
  const boardRef = useRef<HTMLDivElement>(null);
  const nearView = useInView(boardRef);

  // Simulated collaborator moving cards → "real-time" broadcast
  useInterval(
    () => {
      const movable = cards.filter((c) => c.col < 2);
      if (!movable.length) {
        setEvent("celery: board reset job");
        setCards(cards.map((c, i) => ({ ...c, col: i % 2 })));
        return;
      }
      const pick = movable[Math.floor(Math.random() * movable.length)];
      setEvent(`ws ← user ${pick.who} moved "${pick.t}"`);
      setCards(cards.map((c) => (c.id === pick.id ? { ...c, col: c.col + 1 } : c)));
    },
    reduced || !nearView ? null : 2200,
  );

  return (
    <div ref={boardRef} className="flex h-full flex-col">
      <LayoutGroup id="stories">
      <div className="grid flex-1 grid-cols-3 gap-2">
        {COLS.map((col, ci) => (
          <div key={col} className="rounded-xl bg-paper-2/70 p-2">
            <div className="mb-2 flex justify-between font-mono text-[9px] tracking-wider text-muted">
              <span>{col}</span>
              <span>{cards.filter((c) => c.col === ci).length}</span>
            </div>
            <ul className="space-y-1.5">
              {cards
                .filter((c) => c.col === ci)
                .map((c) => (
                  <motion.li layout layoutId={`story-${c.id}`} key={c.id} className=" rounded-lg border border-line bg-card p-2 text-[11px] leading-tight shadow-[var(--shadow-sm)]">
                    {c.t}
                    <span className="mt-1.5 flex items-center gap-1">
                      <span className="grid h-4 w-4 place-items-center rounded-full font-mono text-[8px] text-white" style={{ background: PEOPLE.find((p) => p.id === c.who)!.color }}>
                        {c.who}
                      </span>
                    </span>
                  </motion.li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      </LayoutGroup>
      <div className="mt-3 truncate rounded-lg bg-ink px-3 py-2 font-mono text-[10px] text-white/80" aria-live="polite">
        <span className="text-mint">●</span> {event}
      </div>
    </div>
  );
}
