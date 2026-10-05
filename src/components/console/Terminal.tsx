"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { allProjects, workProjects, labProjects } from "@/data/projects";
import { certifications, education, experience, profile, skillGroups } from "@/data/profile";
import { ask } from "@/lib/knowledge";
import { useApp } from "@/components/system/AppProvider";
import { scrollToSection } from "@/lib/navigate";

type Line = { kind: "in" | "out" | "err" | "sys"; text: string };

const COMMANDS = ["help", "whoami", "skills", "projects", "experience", "stack", "education", "certs", "contact", "resume", "open", "ask", "ls", "cat", "clear", "history", "date", "echo", "sudo"];

const FILES: Record<string, () => string> = {
  "about.txt": () => `${profile.name}\n${profile.title}\n\n${profile.summary}`,
  "contact.txt": () => `email     ${profile.email}\nlinkedin  ${profile.links.linkedin}\ngithub    ${profile.links.github}`,
  "principles.md": () => "SYSTEMS > FEATURES\nCLARITY > COMPLEXITY\nAUTOMATION > REPETITION\nDATA > ASSUMPTIONS\nSECURITY > SHORTCUTS\nREAL USERS > PERFECT DEMOS",
};

const pad = (s: string, n: number) => s + " ".repeat(Math.max(1, n - s.length));

export function Terminal() {
  const router = useRouter();
  const { firePulse, sfx } = useApp();
  const [lines, setLines] = useState<Line[]>([
    { kind: "sys", text: "AG-OS terminal · type `help` to list commands · Tab to autocomplete · ↑↓ history" },
  ]);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  const run = (raw: string): Line[] => {
    const cmd = raw.trim();
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(" ");
    const out = (text: string): Line[] => [{ kind: "out", text }];
    switch (name?.toLowerCase()) {
      case "":
        return [];
      case "help":
        return out(
          [
            ["whoami", "who is this"],
            ["projects", "list systems"],
            ["open <name>", "open a case study (e.g. open odys)"],
            ["experience", "work history"],
            ["skills", "technical skills"],
            ["stack", "skills grouped by layer"],
            ["education", "degree"],
            ["certs", "certifications"],
            ["ask <question>", "query the knowledge base"],
            ["contact", "how to reach me"],
            ["resume", "open resume mode"],
            ["ls / cat <file>", "browse files"],
            ["clear · history · date · echo", "utilities"],
          ]
            .map(([a, b]) => `  ${pad(a, 32)}${b}`)
            .join("\n"),
        );
      case "whoami":
        return out(`${profile.name}\n${profile.title}\nFull-Stack / AI / Cloud\n${profile.location}`);
      case "projects":
        return out(
          "WORK\n" +
            workProjects.map((p) => `  ${pad(p.slug, 14)}${p.fullName}`).join("\n") +
            "\n\nLAB\n" +
            labProjects.map((p) => `  ${pad(p.slug, 14)}${p.fullName}`).join("\n") +
            "\n\nrun `open <name>` to explore",
        );
      case "skills":
        return out(
          ["react", "nextjs", "typescript", "javascript", "python", "fastapi", "nodejs", "sql", "postgresql", "mongodb", "redis", "gcp", "cloud-run", "pubsub", "docker", "gemini", "rag", "oauth2", "oidc", "saml", "sso", "rbac", "rest", "webhooks", "websockets", "playwright"].join("\n"),
        );
      case "stack":
        return out(skillGroups.map((g) => `${pad(g.label.toUpperCase(), 18)}${g.items.join(", ")}`).join("\n"));
      case "experience":
        return out(experience.map((e) => `${e.role} · ${e.company}\n  ${e.start} – ${e.end} · ${e.type}\n` + e.groups.map((g) => `  ${g.title ?? "Responsibilities"}`).join("\n")).join("\n\n"));
      case "education":
        return out(`${education.degree}\n${education.school}\n${education.start} – ${education.end} · CGPA ${education.cgpa}`);
      case "certs":
      case "certifications":
        return out(certifications.map((c) => `✓ ${c.name} — ${c.issuer} (${c.note})`).join("\n"));
      case "contact":
        return out(FILES["contact.txt"]());
      case "resume":
        setTimeout(() => router.push("/resume"), 400);
        return [{ kind: "sys", text: "opening resume mode…" }];
      case "open": {
        const q = arg.toLowerCase().replace(/\s+/g, "-");
        const p = allProjects.find((x) => x.slug === q || x.name.toLowerCase() === arg.toLowerCase());
        if (!p) return [{ kind: "err", text: `open: unknown project '${arg}'. try \`projects\`` }];
        if (p.category === "work") {
          setTimeout(() => router.push(`/work/${p.slug}`), 400);
          return [{ kind: "sys", text: `launching ${p.name}…` }];
        }
        setTimeout(() => scrollToSection(`lab-${p.slug}`), 300);
        return [{ kind: "sys", text: `scrolling to lab experiment ${p.name}…` }];
      }
      case "ask": {
        if (!arg) return [{ kind: "err", text: "usage: ask <question>" }];
        const a = ask(arg);
        return out(a.text + (a.sources.length ? `\n\n— sources: ${a.sources.join("; ")}` : ""));
      }
      case "ls":
        return out(Object.keys(FILES).join("   ") + "   projects/");
      case "cat": {
        const f = FILES[arg];
        return f ? out(f()) : [{ kind: "err", text: `cat: ${arg || "<file>"}: no such file` }];
      }
      case "date":
        return out(new Date().toString());
      case "echo":
        return out(arg);
      case "history":
        return out(hist.map((h, i) => `${pad(String(i + 1), 4)}${h}`).join("\n") || "(empty)");
      case "sudo":
        if (arg.toLowerCase() === "portfolio") {
          firePulse();
          return [
            { kind: "sys", text: "[sudo] password for visitor: ********" },
            { kind: "out", text: "ACCESS GRANTED · rendering root system schematic…" },
          ];
        }
        return [{ kind: "err", text: "visitor is not in the sudoers file. This incident will be reported. (hint: sudo portfolio)" }];
      case "rm":
        return [{ kind: "err", text: "rm: nice try. Systems > shortcuts." }];
      case "exit":
        return [{ kind: "sys", text: "there is no exit. only more systems." }];
      default:
        return [{ kind: "err", text: `command not found: ${name}. type \`help\`` }];
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input;
    if (cmd.trim().toLowerCase() === "clear") {
      setLines([]);
    } else {
      const res = run(cmd);
      setLines((l) => [...l, { kind: "in", text: cmd }, ...res]);
      sfx(res.some((r) => r.kind === "err") ? "error" : "tick");
    }
    if (cmd.trim()) setHist((h) => [...h, cmd]);
    setHi(-1);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!hist.length) return;
      const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1);
      setHi(n);
      setInput(hist[n]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hi < 0) return;
      const n = hi + 1;
      if (n >= hist.length) {
        setHi(-1);
        setInput("");
      } else {
        setHi(n);
        setInput(hist[n]);
      }
    } else if (e.key === "Tab") {
      const [first, ...rest] = input.split(" ");
      let pool: string[] = [];
      let prefix = "";
      if (rest.length === 0) {
        pool = COMMANDS;
        prefix = first;
      } else if (first === "open") {
        pool = allProjects.map((p) => p.slug);
        prefix = rest.join(" ");
      } else if (first === "cat") {
        pool = Object.keys(FILES);
        prefix = rest.join(" ");
      }
      const m = pool.filter((c) => c.startsWith(prefix.toLowerCase()));
      if (m.length && input) {
        e.preventDefault();
        if (m.length === 1) setInput(rest.length ? `${first} ${m[0]}` : `${m[0]} `);
        else setLines((l) => [...l, { kind: "in", text: input }, { kind: "out", text: m.join("   ") }]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="flex h-[460px] flex-col overflow-hidden rounded-[24px] sm:h-[520px] border border-ink bg-[#121216] text-[#e8e6e1] shadow-[var(--shadow-lg)]" onClick={() => inputRef.current?.focus()}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-white/50">visitor@avinaba.sys: ~</span>
      </div>
      <div ref={scroller} className="thin-scroll flex-1 overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed" role="log" aria-live="polite" aria-label="Terminal output">
        {lines.map((l, i) => (
          <pre
            key={i}
            className={`break-words whitespace-pre-wrap ${l.kind === "in" ? "text-white" : l.kind === "err" ? "text-[#ff7b72]" : l.kind === "sys" ? "text-[#7ee0b5]" : "text-white/75"}`}
          >
            {l.kind === "in" ? (
              <>
                <span className="text-signal">❯</span> {l.text}
              </>
            ) : (
              l.text
            )}
          </pre>
        ))}
        <form onSubmit={submit} className="flex items-center gap-2">
          <span className="text-signal" aria-hidden>
            ❯
          </span>
          <label htmlFor="term-input" className="sr-only">
            Terminal command
          </label>
          <input
            id="term-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-white caret-signal outline-none"
            placeholder={lines.length < 2 ? "try: whoami" : ""}
          />
        </form>
      </div>
      <div className="flex gap-1.5 overflow-x-auto border-t border-white/10 px-3 py-2 thin-scroll">
        {["whoami", "projects", "skills", "experience", "open gulp", "sudo portfolio"].map((c) => (
          <button
            key={c}
            onClick={(e) => {
              e.stopPropagation();
              const res = run(c);
              setLines((l) => [...l, { kind: "in", text: c }, ...res]);
              setHist((h) => [...h, c]);
            }}
            className="shrink-0 rounded-md border border-white/15 px-2 py-1 font-mono text-[10.5px] text-white/70 hover:bg-white/10 hover:text-white"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
