import type { Metadata } from "next";
import Link from "next/link";
import { certifications, education, experience, profile, skillGroups } from "@/data/profile";
import { labProjects, workProjects } from "@/data/projects";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description: `${profile.name} — ${profile.title}. Experience, projects, skills, education and certifications.`,
};

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 border-b border-ink pb-1.5 font-display text-sm font-bold tracking-[0.18em]">{children}</h2>;
}

export default function ResumePage() {
  return (
    <main id="main" className="min-h-screen px-4 pt-28 pb-20 print:p-0">
      <div className="no-print mx-auto mb-6 flex max-w-[860px] flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl border border-line bg-card p-1 font-mono text-[11px]">
          <Link href="/" className="rounded-lg px-3 py-1.5 text-ink-2 hover:bg-paper-2">
            VISUAL MODE
          </Link>
          <span className="rounded-lg bg-ink px-3 py-1.5 text-white" aria-current="page">
            RESUME MODE
          </span>
        </div>
        <div className="flex gap-2">
          <PrintButton />
          <a href={profile.links.resume} download className="rounded-xl bg-signal px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-md)]">
            ⤓ Download PDF
          </a>
        </div>
      </div>

      <article className="mx-auto max-w-[860px] rounded-[20px] border border-line bg-white p-8 shadow-[var(--shadow-lg)] sm:p-12 print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header className="border-b border-line pb-6">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{profile.name.toUpperCase()}</h1>
          <p className="mt-2 font-medium">Software Engineer · Full-Stack Developer · Forward Deployed Engineer</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] text-ink-2">
            <span>{profile.location}</span>
            <a href={`mailto:${profile.email}`} className="underline-offset-2 hover:underline">
              {profile.email}
            </a>
            <a href={profile.links.linkedin} className="underline-offset-2 hover:underline">
              LinkedIn
            </a>
            <a href={profile.links.github} className="underline-offset-2 hover:underline">
              GitHub
            </a>
          </p>
        </header>

        <section className="mt-7">
          <H>SUMMARY</H>
          <p className="text-[14.5px] leading-relaxed text-ink-2">
            {profile.summary} Skilled in Python, JavaScript, TypeScript, React, Next.js, Node.js, SQL and Google Cloud Platform, with hands-on experience in REST APIs, authentication (OAuth 2.0, SSO, RBAC), microservices, workflow automation and LLM integration. GCP Associate Cloud Engineer certified.
          </p>
        </section>

        <section className="mt-7">
          <H>PROFESSIONAL EXPERIENCE</H>
          <div className="space-y-6">
            {experience.map((e) => (
              <div key={e.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-bold">
                    {e.role} — {e.company} <span className="font-normal text-muted">({e.type})</span>
                  </h3>
                  <span className="font-mono text-[12px] text-ink-2">
                    {e.start} – {e.end}
                  </span>
                </div>
                {e.groups.map((g, i) => (
                  <div key={i} className="mt-2">
                    {g.title && <div className="text-[13.5px] font-semibold italic">{g.title}</div>}
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-[13.5px] leading-relaxed text-ink-2">
                      {g.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <H>CASE STUDIES (INTERACTIVE)</H>
          <ul className="grid gap-1.5 text-[13.5px] sm:grid-cols-2">
            {workProjects.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className="font-semibold underline-offset-2 hover:underline">
                  {p.name}
                </Link>{" "}
                <span className="text-ink-2">— {p.fullName.split("—").pop()?.trim()}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-7">
          <H>PERSONAL PROJECTS</H>
          <div className="space-y-3">
            {labProjects.map((p) => (
              <div key={p.slug}>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-[14.5px] font-bold">{p.fullName}</h3>
                  <span className="font-mono text-[11.5px] text-muted">{p.technologies.map((t) => t.name).join(", ")}</span>
                </div>
                <p className="mt-0.5 text-[13.5px] text-ink-2">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <H>TECHNICAL SKILLS</H>
          <dl className="space-y-1.5 text-[13.5px]">
            {skillGroups.map((g) => (
              <div key={g.label} className="grid gap-1 sm:grid-cols-[150px_1fr]">
                <dt className="font-semibold">{g.label}</dt>
                <dd className="text-ink-2">{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-7 grid gap-7 sm:grid-cols-2">
          <div>
            <H>EDUCATION</H>
            <div className="text-[14px] font-bold">{education.degree}</div>
            <div className="text-[13.5px] text-ink-2">{education.school}</div>
            <div className="mt-1 font-mono text-[12px] text-ink-2">
              {education.start} – {education.end} · CGPA {education.cgpa} ({education.rank})
            </div>
            <ul className="mt-2 text-[13px] text-ink-2">
              {education.extra.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <H>CERTIFICATIONS</H>
            <ul className="space-y-2 text-[14px]">
              {certifications.map((c) => (
                <li key={c.name}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-bold underline-offset-2 hover:underline">
                    {c.name}
                  </a>
                  <div className="text-[13px] text-ink-2">
                    {c.issuer} · {c.note}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
}
