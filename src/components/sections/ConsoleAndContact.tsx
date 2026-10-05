"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { profile } from "@/data/profile";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Terminal } from "@/components/console/Terminal";
import { AskAvinaba } from "@/components/console/AskAvinaba";
import { useApp } from "@/components/system/AppProvider";

export function ConsoleSection() {
  return (
    <Section id="console" debug="Console · Terminal · AskAvinaba" labelledBy="console-h">
      <SectionHeader
        index="09"
        kicker="INTERFACES"
        title={
          <span id="console-h">
            Talk to the <span className="text-violet">system.</span>
          </span>
        }
        intro="A working terminal and a local knowledge assistant. Both answer strictly from my verified portfolio data."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <AskAvinaba />
        <Terminal />
      </div>
    </Section>
  );
}

export function Contact() {
  const { sfx, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      sfx("success");
      showToast("EMAIL COPIED TO CLIPBOARD");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" data-debug="Contact" tabIndex={-1} aria-labelledby="contact-h" className="relative overflow-hidden px-5 pt-24 pb-32 outline-none sm:px-10 sm:pt-32 lg:px-[8%]">
      <div className="bp-grid mask-fade absolute inset-0 opacity-60" aria-hidden />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[120px]" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="font-mono text-xs text-signal">10</span>
          <span className="h-px w-10 bg-line-strong" aria-hidden />
          <span className="label">CONTACT</span>
        </div>
        <motion.h2
          id="contact-h"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          className="font-display text-[clamp(2.6rem,9vw,8.5rem)] leading-[0.9] font-extrabold tracking-[-0.045em]"
        >
          LET&apos;S BUILD
          <br />
          <span className="text-grad">SYSTEMS.</span>
        </motion.h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink-2">Full-stack, AI, cloud and integration work — from the first requirement to real users.</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={copy} className="group flex max-w-full items-center gap-3 rounded-2xl bg-ink px-5 py-4 text-white shadow-[var(--shadow-lg)] transition-transform hover:-translate-y-1 sm:px-6">
            <span className="truncate font-mono text-sm sm:text-base">{profile.email}</span>
            <span className="rounded-lg bg-white/10 px-2 py-1 font-mono text-[10px] tracking-wider">{copied ? "COPIED ✓" : "COPY"}</span>
          </button>
          <a href={`mailto:${profile.email}`} className="rounded-2xl border border-line bg-card px-6 py-4 text-sm font-medium hover:bg-paper-2">
            Send email ↗
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {[
            ["LINKEDIN", profile.links.linkedin],
            ["GITHUB", profile.links.github],
            ["RESUME PDF", profile.links.resume],
          ].map(([l, h]) => (
            <a key={l} href={h} target={h.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="chip !px-4 !py-2.5 hover:!border-ink">
              {l} ↗
            </a>
          ))}
        </div>
      </div>

      <footer className="relative mx-auto mt-28 flex max-w-[1400px] flex-col items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[10.5px] text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} {profile.name} · {profile.location}</span>
        <span>Built with Next.js · React Three Fiber · Motion · Hosted on Vercel</span>
        <span className="hidden sm:inline">
          <kbd className="chip !py-0.5">⌘K</kbd> to navigate
        </span>
      </footer>
    </section>
  );
}
