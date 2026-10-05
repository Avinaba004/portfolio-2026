/**
 * Relationship data powering the hero graph, stack graph, experience matrix,
 * incidents, workflow and timeline. Derived from the resume + portfolio brief.
 */

/* ---------------- Hero system graph ---------------- */

export const heroSkills = ["REACT", "NEXT.JS", "PYTHON", "POSTGRESQL", "GCP", "GEMINI", "OAUTH", "APIs", "WORKFLOWS", "AI"] as const;
export const heroProjects = ["ODYS", "GULP", "EGLE", "MOPBB", "LURIE", "AI ASSISTANT", "MEDICAID", "ASANA"] as const;

export const heroLinks: Record<(typeof heroSkills)[number], (typeof heroProjects)[number][]> = {
  REACT: ["ODYS", "GULP", "EGLE", "MOPBB", "LURIE", "MEDICAID"],
  "NEXT.JS": ["ODYS", "GULP", "AI ASSISTANT"],
  PYTHON: ["ODYS", "GULP", "EGLE", "MOPBB", "LURIE", "ASANA"],
  POSTGRESQL: ["ODYS", "GULP"],
  GCP: ["ODYS", "GULP"],
  GEMINI: ["EGLE", "MOPBB", "GULP", "AI ASSISTANT"],
  OAUTH: ["ODYS", "GULP", "LURIE"],
  APIs: ["ODYS", "LURIE", "ASANA", "GULP"],
  WORKFLOWS: ["ODYS", "GULP", "MOPBB", "MEDICAID", "ASANA"],
  AI: ["GULP", "EGLE", "MOPBB", "AI ASSISTANT"],
};

export const projectSlugByName: Record<string, string> = {
  ODYS: "odys",
  GULP: "gulp",
  EGLE: "egle",
  MOPBB: "mopbb",
  LURIE: "lurie",
  MEDICAID: "medicaid",
  ASANA: "asana",
  "AI ASSISTANT": "ai-assistant",
};

/* ---------------- Stack dependency graph ---------------- */

export type StackNode = {
  id: string;
  label: string;
  x: number; // 0..100 (percent of graph width)
  y: number; // 0..100
  kind: "tech" | "concept";
  usedIn: string[];
  purpose: string[];
};

export const stackNodes: StackNode[] = [
  { id: "gemini", label: "GEMINI", x: 50, y: 6, kind: "tech", usedIn: ["GULP", "EGLE", "MOPBB", "AI ASSISTANT", "EXPTRACK"], purpose: ["Web data extraction to JSON", "Document field extraction", "Structured, criterion-based scoring", "RAG assistant responses"] },
  { id: "react", label: "REACT", x: 14, y: 30, kind: "tech", usedIn: ["ODYS", "GULP", "EGLE", "MOPBB", "LURIE", "MEDICAID", "QUERY"], purpose: ["Portals and dashboards", "Dynamic form renderers", "Reusable form components", "Reviewer interfaces"] },
  { id: "next", label: "NEXT.JS", x: 50, y: 30, kind: "tech", usedIn: ["ODYS", "GULP", "AI ASSISTANT", "SKYWATCH", "STORIES", "EXPTRACK"], purpose: ["Full-stack app framework", "Secure server-side API proxy", "Routing and rendering"] },
  { id: "python", label: "PYTHON", x: 86, y: 30, kind: "tech", usedIn: ["ODYS", "EGLE", "LURIE", "MOPBB", "GULP", "ASANA"], purpose: ["Backend logic", "AI pipelines", "Healthcare APIs", "Data processing", "Integrations"] },
  { id: "ui", label: "UI", x: 14, y: 52, kind: "concept", usedIn: ["ODYS", "EGLE", "MOPBB", "LURIE"], purpose: ["Role-based dashboards", "Review interfaces", "Responsive design"] },
  { id: "apis", label: "APIs", x: 50, y: 52, kind: "concept", usedIn: ["ODYS", "LURIE", "ASANA", "GULP"], purpose: ["REST APIs", "Webhooks", "Google Health / Fitbit", "Asana integration"] },
  { id: "backend", label: "BACKEND", x: 86, y: 52, kind: "concept", usedIn: ["ODYS", "GULP", "EGLE", "MOPBB", "LURIE"], purpose: ["Services and business logic", "Event processing with Pub/Sub", "FastAPI services"] },
  { id: "forms", label: "FORMS", x: 14, y: 74, kind: "concept", usedIn: ["ODYS", "GULP", "MEDICAID"], purpose: ["Configuration-driven dynamic forms", "Versioning and validation", "Reusable React form components"] },
  { id: "workflows", label: "WORKFLOWS", x: 50, y: 74, kind: "concept", usedIn: ["ODYS", "GULP", "MOPBB", "MEDICAID", "ASANA"], purpose: ["Versioned workflow engines", "Decision / scoring workflows", "Event-driven automation", "Rule engines"] },
  { id: "sql", label: "SQL", x: 86, y: 74, kind: "tech", usedIn: ["ODYS", "GULP", "EGLE", "MOPBB"], purpose: ["Data modeling", "Schema design", "Submissions and configuration storage"] },
  { id: "postgres", label: "POSTGRESQL", x: 70, y: 90, kind: "tech", usedIn: ["ODYS", "GULP", "STORIES", "EXPTRACK"], purpose: ["Relational data model", "JSONB configuration", "pgvector"] },
  { id: "gcp", label: "GCP", x: 92, y: 96, kind: "tech", usedIn: ["ODYS", "GULP"], purpose: ["Cloud Run deployments (Dev / UAT / Prod)", "Pub/Sub", "Firebase / Google Identity Platform"] },
  { id: "oauth", label: "OAUTH", x: 30, y: 92, kind: "tech", usedIn: ["ODYS", "GULP", "LURIE"], purpose: ["SSO with OIDC / SAML", "Authorization code flow, access / refresh tokens", "Google Health API access"] },
];

export const stackEdges: [string, string][] = [
  ["gemini", "next"],
  ["gemini", "python"],
  ["react", "next"],
  ["next", "python"],
  ["react", "ui"],
  ["next", "apis"],
  ["python", "backend"],
  ["ui", "forms"],
  ["apis", "workflows"],
  ["backend", "sql"],
  ["forms", "workflows"],
  ["workflows", "sql"],
  ["sql", "postgres"],
  ["postgres", "gcp"],
  ["apis", "oauth"],
  ["forms", "oauth"],
];

/* ---------------- Experience matrix ---------------- */

export const matrixProjects = ["ODYS", "GULP", "EGLE", "MOPBB", "LURIE"] as const;
export const matrix: { tech: string; on: boolean[] }[] = [
  { tech: "React", on: [true, true, true, true, true] },
  { tech: "Python", on: [true, true, true, true, true] },
  { tech: "SQL", on: [true, true, true, true, false] },
  { tech: "Gemini", on: [false, true, true, true, false] },
  { tech: "OAuth", on: [true, true, false, false, true] },
  { tech: "GCP", on: [true, true, false, false, false] },
];

/* ---------------- Things that broke ---------------- */

export type Incident = {
  id: string;
  code: string;
  title: string;
  project: string;
  steps: string[];
  tech: string[];
  x: number;
  y: number;
};

export const incidents: Incident[] = [
  { id: "401", code: "HTTP 401", title: "401 UNAUTHENTICATED", project: "LURIE", steps: ["OAuth configuration", "Token debugging", "API validation", "Successful request"], tech: ["OAuth 2.0", "Google Health API", "Python"], x: 12, y: 18 },
  { id: "loop", code: "AUTH", title: "SESSION REDIRECT LOOP", project: "ODYS", steps: ["Redirects traced across the SSO flow", "Session handling inspected", "Session management corrected", "Stable sign-in"], tech: ["SSO", "OIDC / SAML", "Session Management"], x: 56, y: 8 },
  { id: "schema", code: "DATA", title: "SCHEMA MISMATCH", project: "LURIE", steps: ["Fitbit and Google Health responses compared", "Field-level schema mapping", "Transformation layer", "One normalized internal model"], tech: ["Python", "Data Mapping", "Schema Transformation"], x: 72, y: 44 },
  { id: "missing", code: "DATA", title: "MISSING HEALTH DATA", project: "LURIE", steps: ["Gaps identified in API responses", "Expected vs actual data compared", "Fallback handling", "Dashboard stays consistent"], tech: ["Python", "Error Handling"], x: 30, y: 56 },
  { id: "raw", code: "LLM", title: "AI RAW RESPONSE", project: "GULP / EGLE", steps: ["Unstructured model output", "Structured output definition", "JSON parsing & validation", "Usable configuration / data"], tech: ["Gemini", "Prompt Engineering", "JSON"], x: 4, y: 74 },
  { id: "large", code: "API", title: "LARGE API DATASET", project: "LURIE", steps: ["Oversized retrievals", "Request scope analyzed", "Granular retrieval", "Manageable, reliable responses"], tech: ["APIs", "Python"], x: 60, y: 76 },
];

/* ---------------- How I actually work ---------------- */

export const workStages: { stage: string; example: string; detail: string }[] = [
  { stage: "CLIENT REQUIREMENT", example: "ODYS government workflows", detail: "Gathered client requirements for US state government applications." },
  { stage: "UNDERSTAND", example: "Counties · courts · grants", detail: "Map who the users are, what they submit, and who approves it." },
  { stage: "MODEL", example: "Data modeling & schema design", detail: "Relational models in PostgreSQL; JSONB where configuration must flex." },
  { stage: "DESIGN", example: "Config-driven architecture", detail: "Forms, workflows and rules as versioned configuration, not hard-coded screens." },
  { stage: "BUILD", example: "React / Next.js / Python", detail: "Full-stack implementation from UI to API to database." },
  { stage: "INTEGRATE", example: "Google Health / OAuth / Asana APIs", detail: "Third-party APIs, webhooks, SSO providers and Gemini." },
  { stage: "TEST", example: "Playwright", detail: "End-to-end testing on the Medicaid Level-of-Care rule engine." },
  { stage: "DEBUG", example: "OAuth / schema / session / API issues", detail: "401s, redirect loops, schema mismatches, missing data." },
  { stage: "DEMO", example: "US state government clients", detail: "Delivered POCs and demos of government applications." },
  { stage: "ITERATE", example: "Deployment & production support", detail: "Ship through Dev → UAT → Prod on GCP Cloud Run, then support it in production." },
];

/* ---------------- Career timeline ---------------- */

export const timeline: { when: string; title: string; org: string; body: string; kind: "edu" | "work" | "cert" | "now" }[] = [
  { when: "Oct 2022", title: "B.Tech — Computer Science & Engineering", org: "Future Institute of Engineering and Management", body: "CGPA 9.08 / 10 · Rank 1 in college. Core Committee, GDG FIEM & FIEM Cultural Club. Oct 2022 – Jul 2026.", kind: "edu" },
  { when: "During B.Tech", title: "Engineering Projects", org: "Personal", body: "Query (MERN), SkyWatch Live, AI Personal Finance Manager, Stories.", kind: "edu" },
  { when: "Nov 2025", title: "Associate Cloud Consultant", org: "BlueVector AI", body: "Internship, converted to full-time. Apps, dashboards and workflows with React, Python, SQL and REST APIs; POCs and demos for US state clients. Nov 2025 – Mar 2026.", kind: "work" },
  { when: "Apr 2026", title: "Cloud Developer & Consultant", org: "BlueVector AI", body: "Full time. ODYS grants platform, licensing & enterprise AI assistant, Michigan (EGLE) & Missouri (MOPBB) AI platforms, healthcare and integrations — owning the full SDLC with clients.", kind: "work" },
  { when: "Now", title: "Enterprise · AI · Cloud · Full-Stack", org: "Building systems", body: "GCP Associate Cloud Engineer certified.", kind: "now" },
];

/* ---------------- What I build pipeline ---------------- */

export const buildPipeline = [
  "MESSY REQUIREMENTS",
  "SYSTEM DESIGN",
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "AUTHENTICATION",
  "AI / AUTOMATION",
  "CLOUD",
  "REAL USERS",
];
