/**
 * ASK AVINABA — a deterministic, local knowledge engine.
 * Answers are composed only from verified entries + project data.
 * No model, no network, no invention: unknown questions get an honest "not in my data".
 */
import { workProjects, labProjects, allProjects, type Project } from "@/data/projects";
import { certifications, education, experience, profile, skillGroups } from "@/data/profile";

export type Answer = { text: string; sources: string[]; related?: string[] };

type Entry = { id: string; keys: string[]; answer: () => Answer };

const list = (items: string[]) => items.map((i) => `• ${i}`).join("\n");

const projectsWith = (pred: (p: Project) => boolean) => allProjects.filter(pred);

const hasSkill = (p: Project, ...skills: string[]) =>
  p.skills.some((s) => skills.some((k) => s.toLowerCase() === k.toLowerCase()));

const entries: Entry[] = [
  {
    id: "bluevector",
    keys: ["bluevector", "blue vector", "company", "job", "work at", "employer", "current role", "consultant", "work experience", "worked at"],
    answer: () => ({
      text:
        `Avinaba works at BlueVector AI.\n\n` +
        experience
          .map((e) => `${e.role} (${e.type}) · ${e.start} – ${e.end}\n` + list(e.groups.flatMap((g) => (g.title ? [`${g.title}: ${g.points[0]}`] : g.points))))
          .join("\n\n"),
      sources: ["CV · Professional Experience"],
      related: ["odys", "gulp", "egle", "mopbb", "lurie"],
    }),
  },
  {
    id: "ai",
    keys: ["ai", "gemini", "vertex", "llm", "genai", "generative", "machine learning", "ml", "rag", "artificial"],
    answer: () => {
      const ps = projectsWith((p) => hasSkill(p, "Gemini", "AI"));
      return {
        text:
          `Projects involving AI:\n` +
          list(ps.map((p) => `${p.name} — ${p.tagline}`)) +
          `\n\nAI is used as extraction, structuring and decision support — final government decisions stay with human reviewers. He also completed Machine Learning Training (Internshala, 85%).`,
        sources: ["CV · Professional Licensing Platform & GenAI", "CV · Document AI, Healthcare & Automation"],
        related: ps.map((p) => p.slug),
      };
    },
  },
  {
    id: "auth",
    keys: ["auth", "authentication", "oauth", "sso", "saml", "oidc", "identity", "login", "security", "rbac", "jwt", "csrf"],
    answer: () => ({
      text:
        `Authentication & security technologies:\n` +
        list(["OAuth 2.0 (authorization code, access/refresh tokens)", "OpenID Connect (OIDC)", "SAML", "SSO", "Firebase Authentication", "Google Identity Platform", "JWT", "RBAC", "API Security"]) +
        `\n\nWhere: SSO and RBAC with OAuth 2.0 / OIDC / SAML on the ODYS grants platform; OAuth 2.0 authorization code flow on the Gulp licensing platform; OAuth 2.0 for Google Health APIs on the telehealth project; role-aware access, auth guards and server-held API keys on the enterprise AI assistant; RBAC and SSO (SAML/OIDC) in Stories.`,
      sources: ["CV · Technical Skills", "CV · Enterprise Government Grants Platform"],
      related: ["odys", "lurie", "gulp", "ai-assistant"],
    }),
  },
  {
    id: "google-health",
    keys: ["google health", "fitbit", "health", "healthcare", "telehealth", "lurie", "wearable", "lurie", "medicaid"],
    answer: () => ({
      text:
        `On the Lurie telehealth project (Phase 1 & 2) he migrated Fitbit integrations to Google Health APIs with OAuth 2.0, schema transformation and error handling, retrieving 10+ health metrics (e.g. heart rate, SpO₂). He also built data pipelines with minute-wise sync, NoSQL time-series storage, threshold alerts and React dashboards with RBAC.\n\nOn the Medicaid project he built a versioned Level-of-Care rule engine and reusable React form components, tested with Playwright.`,
      sources: ["CV · Document AI, Healthcare & Automation"],
      related: ["lurie", "medicaid"],
    }),
  },
  {
    id: "strongest-fullstack",
    keys: ["strongest", "best project", "biggest", "flagship", "most impressive", "full-stack project", "fullstack project", "main project"],
    answer: () => ({
      text:
        `The most complete full-stack project is ODYS (Ohio Department of Youth Services) — a legacy platform rebuilt into a full-stack enterprise application with React, Next.js, TypeScript, Python, PostgreSQL and REST APIs; domain-driven data models for courts, grants, fiscal periods and allocations across 88 Ohio counties; configuration-driven forms; workflow engines with audit trails; SSO and RBAC; deployed on GCP Cloud Run (Dev/UAT/Prod).\n\nFor GenAI impact, look at Gulp: a Gemini pipeline that cut processing time by 70% (to 15–20s).`,
      sources: ["CV · Enterprise Government Grants Platform", "CV · Professional Licensing Platform & GenAI"],
      related: ["odys", "gulp"],
    }),
  },
  {
    id: "cloud",
    keys: ["cloud", "gcp", "google cloud", "cloud run", "deploy", "devops", "docker", "pub/sub", "pubsub", "firebase", "nginx", "infrastructure"],
    answer: () => ({
      text:
        `Cloud experience:\n` +
        list([
          "GCP Associate Cloud Engineer certified (Google Cloud)",
          "Deployed the ODYS grants platform on GCP Cloud Run across Dev / UAT / Prod",
          "Owned deployment and production support with US government and healthcare clients",
          "Pub/Sub and Docker on the Gulp licensing platform",
          "Firebase Authentication and Google Identity Platform for SSO",
          "Nginx reverse proxy for the secure AI assistant",
          "Title: Cloud Developer & Consultant at BlueVector AI (Apr 2026 – Present)",
        ]),
      sources: ["CV · Certifications", "CV · Professional Experience", "CV · Cloud & DevOps"],
      related: ["odys", "gulp", "ai-assistant"],
    }),
  },
  {
    id: "gulp",
    keys: ["gulp", "licensing", "license", "70%", "extraction pipeline", "processing time"],
    answer: () => ({
      text:
        `Gulp is a config-driven professional licensing platform with dynamic forms, compliance workflows and RBAC, built on PostgreSQL (JSONB), pgvector, Pub/Sub, Docker and OAuth 2.0 (authorization code, access/refresh tokens). He built a Gemini LLM pipeline that converts unstructured web content into structured JSON configurations — cutting processing time by 70%, to 15–20 seconds.`,
      sources: ["CV · Professional Licensing Platform & GenAI", "Portfolio brief"],
      related: ["gulp"],
    }),
  },
  {
    id: "education",
    keys: ["education", "degree", "college", "university", "btech", "b.tech", "cgpa", "gpa", "study", "graduate"],
    answer: () => ({
      text: `${education.degree}, ${education.school} (${education.start} – ${education.end}). CGPA ${education.cgpa} (${education.rank}).\n${list(education.extra)}`,
      sources: ["CV · Education"],
    }),
  },
  {
    id: "certs",
    keys: ["certification", "certifications", "certified", "certificate", "internshala", "associate cloud engineer", "ace"],
    answer: () => ({
      text: `Certifications:\n` + list(certifications.map((c) => `${c.name} — ${c.issuer}${c.note ? ` (${c.note})` : ""}`)),
      sources: ["CV · Certifications"],
    }),
  },
  {
    id: "contact",
    keys: ["contact", "email", "hire", "reach", "linkedin", "github", "mail"],
    answer: () => ({
      text: `Email: ${profile.email}\nLinkedIn: ${profile.links.linkedin}\nGitHub: ${profile.links.github}\nLocation: ${profile.location}`,
      sources: ["CV · Header"],
    }),
  },
  {
    id: "skills",
    keys: ["skills", "stack", "technologies", "tech stack", "languages", "frameworks", "tools"],
    answer: () => ({
      text: `Core stack: Python, JavaScript, TypeScript, React, Next.js, Node.js, SQL / PostgreSQL and Google Cloud Platform — with REST APIs, OAuth 2.0 / SSO / RBAC, microservices, workflow automation and LLM integration (Gemini, RAG). Open the STACK section to see where each one was used.`,
      sources: ["CV · Summary", "CV · Technical Skills"],
    }),
  },
  {
    id: "fde",
    keys: ["forward deployed", "fde", "client", "clients", "customer", "demo", "requirements", "stakeholder"],
    answer: () => ({
      text:
        `He works directly with clients and owned the full SDLC with US government and healthcare clients: requirements, POCs, demos, testing, debugging, deployment and production support.`,
      sources: ["CV · Associate Cloud Consultant", "CV · Summary"],
      related: ["odys", "mopbb"],
    }),
  },
  {
    id: "personal",
    keys: ["personal", "side project", "side projects", "lab", "hobby", "skywatch", "stories", "query", "exptrack", "finance", "flight"],
    answer: () => ({
      text: `Personal projects:\n` + list(labProjects.map((p) => `${p.name} — ${p.tagline}`)) + `\n• PokeDex and Signature Maker — small live projects`,
      sources: ["CV · Projects"],
      related: labProjects.map((p) => p.slug),
    }),
  },
  {
    id: "location",
    keys: ["where", "location", "based", "city", "live", "india", "relocate"],
    answer: () => ({ text: `${profile.location}.`, sources: ["Portfolio brief"] }),
  },
  {
    id: "who",
    keys: ["who", "about", "summary", "introduce", "tell me about", "who is"],
    answer: () => ({
      text: `${profile.name} — ${profile.title}. ${profile.summary}`,
      sources: ["CV · Summary"],
    }),
  },
];

const normalize = (s: string) => s.toLowerCase().replace(/[?!.,]/g, " ").replace(/\s+/g, " ").trim();

function projectMatch(q: string): Project | undefined {
  return allProjects.find((p) => {
    const n = p.name.toLowerCase();
    return q.includes(n) || q.includes(p.slug.replace("-", " "));
  });
}

/** Every technology name that appears in verified data, as lowercase tokens. */
const KNOWN_TECH = new Set(
  [...skillGroups.flatMap((g) => g.items), ...allProjects.flatMap((p) => [...p.skills, ...p.technologies.map((t) => t.name)])]
    .flatMap((s) => s.toLowerCase().split(/[\s/(),·]+/))
    .filter(Boolean),
);
const GENERIC = new Set(["a", "an", "the", "any", "it", "that", "this", "what", "which", "cloud", "ai", "apis", "api", "data", "auth", "authentication", "frontend", "backend", "databases", "security", "testing"]);

export function ask(question: string): Answer {
  const q = ` ${normalize(question)} `;
  if (q.trim().length < 2) return { text: "Ask me anything about Avinaba's work, stack, projects or experience.", sources: [] };

  // "Does he know / use / have experience with X?" — only confirm technologies that are in verified data.
  const tech = q.match(/(?:know|knows|use|used|uses|experience with|experience in|worked with|work with|familiar with)\s+([a-z0-9.+#-]+)/)?.[1];
  if (tech && !GENERIC.has(tech) && KNOWN_TECH.has(tech)) {
    const used = allProjects.filter((p) => [...p.skills, ...p.technologies.map((t) => t.name)].some((n) => n.toLowerCase().split(/[\s/(),·]+/).includes(tech)));
    const group = skillGroups.find((g) => g.items.some((i) => i.toLowerCase().split(/[\s/(),·]+/).includes(tech)));
    return {
      text: `Yes — ${tech} is in his verified ${group ? group.label : "skill"} stack.` + (used.length ? `\n\nUsed in:\n${list(used.map((p) => `${p.name} — ${p.tagline}`))}` : ""),
      sources: ["CV · Technical Skills"],
      related: used.map((p) => p.slug),
    };
  }
  if (tech && !GENERIC.has(tech) && !KNOWN_TECH.has(tech)) {
    return {
      text: `${tech} isn't in Avinaba's verified portfolio data, so I can't confirm it. His verified core stack: Python, TypeScript, React, Next.js, Node.js, FastAPI, PostgreSQL, GCP (Cloud Run, Pub/Sub), Docker, Gemini, OAuth 2.0 / OIDC / SAML.`,
      sources: ["CV · Technical Skills"],
    };
  }

  let best: { e: Entry; score: number } | null = null;
  for (const e of entries) {
    let score = 0;
    for (const k of e.keys) {
      const key = ` ${k} `;
      if (q.includes(key)) score += k.includes(" ") ? 3 : 2;
      else if (k.length > 3 && q.includes(k)) score += 1;
    }
    if (score > (best?.score ?? 0)) best = { e, score };
  }

  // Specific project questions beat generic topics (e.g. "what is EGLE?")
  const p = projectMatch(q);
  const richEntry = best && ((p?.slug === "gulp" && best.e.id === "gulp") || (p?.slug === "lurie" && best.e.id === "google-health"));
  if (p && !richEntry) {
    return {
      text:
        `${p.fullName}\n${p.description}\n\nWhat was built:\n${list(p.built)}` +
        (p.metrics.length ? `\n\nMetrics: ${p.metrics.map((m) => `${m.value} ${m.label}`).join(" · ")}` : "") +
        (p.note ? `\n\nNote: ${p.note}` : ""),
      sources: [p.category === "work" ? "CV · Professional Experience" : "CV · Projects"],
      related: [p.slug],
    };
  }

  if (best && best.score >= 2) return best.e.answer();

  return {
    text: "That isn't in my verified data, so I won't guess. Try asking about his projects, AI work, authentication, cloud, Google Health, BlueVector, education or certifications.",
    sources: [],
  };
}

export const suggestedQuestions = [
  "What did Avinaba build at BlueVector?",
  "What projects involve AI?",
  "What authentication technologies has he worked with?",
  "What did he do with Google Health?",
  "What is his strongest full-stack project?",
  "What is his cloud experience?",
];

export const workCount = workProjects.length;
