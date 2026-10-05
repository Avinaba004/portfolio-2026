/**
 * Project configuration. Every claim maps to the CV (Oct 2026, v5) or the
 * portfolio brief. Client work is shown through illustrative visualizations —
 * no client data, screenshots or production metrics beyond those stated.
 */

export type Tech = { name: string; usedFor: string[] };
export type Challenge = { problem: string; approach: string };
export type Metric = { value: string; label: string };

export type Project = {
  slug: string;
  name: string;
  fullName: string;
  category: "work" | "lab";
  domain: string[];
  org?: string;
  period?: string;
  role: string;
  accent: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  built: string[];
  technologies: Tech[];
  /** Layered architecture, top (user) to bottom (data). */
  architecture: string[];
  /** Ordered workflow / data flow. */
  workflow: string[];
  challenges: Challenge[];
  outcomes: string[];
  metrics: Metric[];
  views: { system: string; flow: string; human: string };
  /** Key tags used by hero graph, galaxy and Ask Avinaba. */
  skills: string[];
  /** Honesty note shown on the case study. */
  note?: string;
  links?: { label: string; href: string }[];
};

const ILLUSTRATIVE =
  "Client project. Visuals are illustrative reconstructions of the architecture and workflow — no client data, screens or records are shown.";

export const workProjects: Project[] = [
  {
    slug: "odys",
    name: "ODYS",
    fullName: "Ohio Department of Youth Services — Grants Platform",
    category: "work",
    domain: ["Government", "Full-Stack", "Cloud", "Workflows"],
    org: "BlueVector AI",
    period: "Apr 2026 – Present",
    role: "Cloud Developer & Consultant · Full-stack engineer",
    accent: "#2F4BFF",
    tagline: "A government operating system for grants across Ohio's 88 counties.",
    description:
      "Enterprise government grants platform rebuilt from a legacy platform into a full-stack application with domain-driven data models, configuration-driven forms, workflow engines, RBAC and enterprise SSO.",
    problem:
      "Grant processes spanning courts, grants, fiscal periods and allocations across 88 Ohio counties lived in a legacy platform. The new system had to model those domains, many user roles and compliance steps — and adapt forms and workflows without rewriting code.",
    solution:
      "A full-stack rebuild on React, Next.js, TypeScript, Python and PostgreSQL with REST APIs and domain-driven data models; configuration-driven dynamic forms (schema versioning, conditional logic, validation); workflow engines for review, approvals, compliance, document generation, notifications and audit trails; SSO and RBAC; deployed on GCP Cloud Run across Dev, UAT and Prod.",
    built: [
      "Rebuilt a legacy platform into a full-stack enterprise application",
      "Domain-driven data models for courts, grants, fiscal periods and allocations across 88 Ohio counties",
      "Configuration-driven dynamic forms with schema versioning, conditional logic and validation",
      "Workflow engines for grant review, approvals, compliance, document generation, notifications and audit trails",
      "SSO with OAuth 2.0, OIDC, SAML, Firebase Authentication and Google Identity Platform, with session management",
      "Deployment on GCP Cloud Run across Dev / UAT / Prod",
    ],
    technologies: [
      { name: "React", usedFor: ["Portal UI", "Dynamic form renderer"] },
      { name: "Next.js", usedFor: ["App framework", "Routing and server boundary"] },
      { name: "TypeScript", usedFor: ["Typed form and workflow configuration"] },
      { name: "Python", usedFor: ["Backend services", "Business logic", "API layer"] },
      { name: "PostgreSQL", usedFor: ["Domain models: courts, grants, fiscal periods, allocations", "Roles and configuration"] },
      { name: "OAuth 2.0 / OIDC / SAML", usedFor: ["Enterprise single sign-on"] },
      { name: "Firebase Auth / Google Identity", usedFor: ["Identity provider integration", "Session management"] },
      { name: "RBAC", usedFor: ["Role-specific permissions on every workflow action"] },
      { name: "Cloud Run", usedFor: ["Containerized deployment across Dev / UAT / Prod"] },
    ],
    architecture: ["React", "Next.js", "API Layer", "Python", "PostgreSQL"],
    workflow: ["Draft", "Submitted", "Under Review", "Approved"],
    challenges: [
      { problem: "Legacy platform", approach: "Re-modeled the domain (courts, grants, fiscal periods, allocations) and rebuilt it as a full-stack application with REST APIs." },
      { problem: "Forms that change per grant", approach: "Configuration-driven dynamic forms with schema versioning, conditional logic and validation." },
      { problem: "Accountability", approach: "Workflow engines with notifications and audit trails." },
      { problem: "Many roles, many permissions", approach: "RBAC enforced across workflow states and actions." },
      { problem: "Enterprise identity", approach: "SSO via OAuth 2.0, OIDC and SAML with Firebase Auth / Google Identity Platform and session management." },
    ],
    outcomes: [
      "Legacy platform rebuilt into a full-stack enterprise application",
      "Forms and workflows driven by configuration instead of code changes",
      "Deployed on GCP Cloud Run across Dev, UAT and Prod environments",
    ],
    metrics: [
      { value: "88", label: "Ohio counties modeled" },
      { value: "3", label: "Environments · Dev / UAT / Prod" },
    ],
    views: {
      system: "Next.js → Python → PostgreSQL, with SSO and RBAC around every layer.",
      flow: "Application → Review → Approval, driven by a versioned workflow engine.",
      human: "County, court and admin portals with role-specific actions.",
    },
    skills: ["React", "Next.js", "TypeScript", "Python", "PostgreSQL", "SQL", "OAuth", "RBAC", "SSO", "GCP", "Cloud Run", "Workflows", "APIs"],
    note: ILLUSTRATIVE,
  },
  {
    slug: "gulp",
    name: "GULP",
    fullName: "Gulp — Professional Licensing & Regulatory Platform",
    category: "work",
    domain: ["Licensing", "GenAI", "Full-Stack", "Workflows"],
    org: "BlueVector AI",
    period: "Apr 2026 – Present",
    role: "Cloud Developer & Consultant · Full-stack & GenAI engineer",
    accent: "#FF4D17",
    tagline: "Turn a regulator's website into a working license configuration with Gemini.",
    description:
      "Config-driven professional licensing platform with dynamic forms, compliance workflows and RBAC — plus a Gemini LLM pipeline that converts unstructured web content into structured JSON license configurations.",
    problem:
      "Setting up licensing configurations meant reading regulatory websites and manually translating requirements into forms and rules — slow, repetitive work.",
    solution:
      "A Gemini-powered extraction pipeline: fetch website content, parse it, have Gemini structure it, validate it as JSON and feed it into the config-driven licensing platform, where it renders as dynamic license forms.",
    built: [
      "Config-driven licensing platform with dynamic forms and compliance workflows",
      "RBAC",
      "OAuth 2.0 — authorization code flow, access and refresh tokens",
      "Gemini LLM pipeline converting unstructured web content into structured JSON configurations",
      "PostgreSQL (JSONB) configuration storage, pgvector, Pub/Sub, Docker",
    ],
    technologies: [
      { name: "Gemini", usedFor: ["Extracting licensing data from web content", "Structuring it as JSON"] },
      { name: "Next.js", usedFor: ["Licensing platform UI"] },
      { name: "PostgreSQL / JSONB", usedFor: ["Storing flexible license configurations"] },
      { name: "pgvector", usedFor: ["Vector storage alongside relational data"] },
      { name: "Pub/Sub", usedFor: ["Event processing between services"] },
      { name: "RBAC", usedFor: ["Permissions across licensing workflows"] },
      { name: "OAuth 2.0", usedFor: ["Authorization code flow", "Access / refresh tokens"] },
      { name: "Docker", usedFor: ["Containerized services"] },
      { name: "Dynamic Forms", usedFor: ["Rendering license applications from configuration"] },
    ],
    architecture: ["Website", "Fetch + Parse", "Gemini", "JSON", "PostgreSQL (JSONB)", "License Form"],
    workflow: ["Fetching Content", "Parsing", "Gemini", "Structuring", "JSON", "License Configuration"],
    challenges: [
      { problem: "Raw, unstructured LLM output", approach: "Structured the Gemini response into validated JSON before it reaches configuration." },
      { problem: "Every license is different", approach: "JSONB-backed configuration rendered as dynamic forms." },
      { problem: "Asynchronous processing", approach: "Pub/Sub for event processing between components." },
    ],
    outcomes: [
      "70% reduction in processing time for creating license configurations",
      "Processing brought down to 15–20 seconds end to end",
    ],
    metrics: [
      { value: "70%", label: "Processing time reduction" },
      { value: "15–20s", label: "End-to-end extraction" },
    ],
    views: {
      system: "Next.js → API → Gemini → PostgreSQL (JSONB) with Pub/Sub events.",
      flow: "Website → Gemini → JSON → License configuration → Generated form.",
      human: "A licensing admin pastes a URL and reviews a generated license form.",
    },
    skills: ["Gemini", "AI", "Next.js", "React", "Python", "PostgreSQL", "SQL", "pgvector", "Pub/Sub", "Docker", "RBAC", "OAuth", "Workflows", "GCP", "APIs"],
    note: ILLUSTRATIVE,
  },
  {
    slug: "egle",
    name: "EGLE",
    fullName: "EGLE — State of Michigan AI Document Review Platform",
    category: "work",
    domain: ["Government", "Document AI", "Review Workflows"],
    org: "BlueVector AI",
    period: "Apr 2026 – Present",
    role: "Cloud Developer & Consultant · AI & full-stack engineer",
    accent: "#0E9F6E",
    tagline: "Documents in. Structured, reviewable data out — with a human in the loop.",
    description:
      "AI document extraction and review platform for the State of Michigan (EGLE): Gemini / Vertex AI extracts structured data from submissions using configurable prompts and extraction profiles, then reviewers validate it — human-in-the-loop.",
    problem:
      "Reviewers had to read submitted documents and manually pull out addresses, organizations, locations and application details before they could review them.",
    solution:
      "An AI document pipeline: upload → Gemini extraction driven by configurable prompts and extraction profiles → structured data in SQL → reviewer interface for human validation.",
    built: [
      "AI document extraction with Gemini",
      "Configurable extraction profiles and AI prompt configurations",
      "Structured storage of submissions and detected locations",
      "Review workflow and role-based reviewer dashboards",
    ],
    technologies: [
      { name: "Gemini / Vertex AI", usedFor: ["Document field extraction"] },
      { name: "Python", usedFor: ["Extraction pipeline", "Backend logic"] },
      { name: "SQL", usedFor: ["Submissions, extraction profiles, detected locations, prompt configs"] },
      { name: "React", usedFor: ["Reviewer interface"] },
      { name: "RBAC", usedFor: ["Role-based dashboards"] },
    ],
    architecture: ["Upload", "Python Pipeline", "Gemini", "SQL Database", "Reviewer UI"],
    workflow: ["Document", "Upload", "AI Extraction", "Gemini", "Structured Data", "Database", "Review", "Human Validation"],
    challenges: [
      { problem: "AI output must be trustworthy", approach: "Human validation step — reviewers confirm extracted data." },
      { problem: "Different documents, different fields", approach: "Extraction profiles and prompt configs stored in the database." },
    ],
    outcomes: ["Extraction, storage and human review connected in one workflow"],
    metrics: [],
    views: {
      system: "Upload → Python → Gemini → SQL → Reviewer UI.",
      flow: "Document → AI extraction → structured JSON → database → human validation.",
      human: "A reviewer compares the document against extracted fields and validates.",
    },
    skills: ["Gemini", "AI", "Python", "SQL", "React", "RBAC", "Workflows", "Document AI"],
    note: ILLUSTRATIVE,
  },
  {
    slug: "mopbb",
    name: "MOPBB",
    fullName: "MOPBB — State of Missouri Decision & Scoring Platform",
    category: "work",
    domain: ["Government", "Decision Support", "AI-assisted Scoring"],
    org: "BlueVector AI",
    period: "Apr 2026 – Present",
    role: "Cloud Developer & Consultant · AI & full-stack engineer",
    accent: "#7A5CFF",
    tagline: "AI-assisted scoring. Human decisions.",
    description:
      "AI scoring / rubric engine with workflow states and role-based dashboards for the State of Missouri (MOPBB): submissions move through Draft, Submitted, RFI, Approved and Denied, with AI-assisted scoring as decision support.",
    problem:
      "Budget analysts review many agency applications against weighted criteria — a heavy, repetitive evaluation workload.",
    solution:
      "An agency portal and an analyst command center connected by a workflow (Draft → Submitted → RFI → Approved / Denied), with Gemini producing structured, criterion-based scores that analysts review before deciding.",
    built: [
      "AI scoring / rubric engine",
      "Review workflows with RFI loop",
      "Role-based dashboards for agencies and analysts",
      "AI-assisted structured scoring with Gemini",
    ],
    technologies: [
      { name: "Gemini", usedFor: ["Producing structured, criterion-based score suggestions"] },
      { name: "Python", usedFor: ["Scoring engine", "Workflow logic"] },
      { name: "SQL", usedFor: ["Applications, scores, decisions"] },
      { name: "React", usedFor: ["Agency portal", "Analyst dashboards"] },
    ],
    architecture: ["Agency Portal", "Workflow Engine", "Scoring Engine + Gemini", "SQL", "Analyst Command Center"],
    workflow: ["Draft", "Submitted", "RFI", "Approved", "Denied"],
    challenges: [
      { problem: "AI must not make the decision", approach: "AI produces a structured score; a reviewer makes the decision." },
      { problem: "Back-and-forth with agencies", approach: "An explicit RFI state in the workflow." },
    ],
    outcomes: ["Decision-support workflow where AI scoring informs — never replaces — the reviewer"],
    metrics: [],
    views: {
      system: "Portal → workflow engine → scoring engine (Gemini) → SQL → command center.",
      flow: "AI → structured score → reviewer → decision.",
      human: "Agencies submit; budget analysts review scores and decide.",
    },
    skills: ["Gemini", "AI", "Python", "SQL", "React", "Workflows", "RBAC"],
    note: ILLUSTRATIVE + " AI scoring is decision support; final decisions are made by people.",
  },
  {
    slug: "lurie",
    name: "LURIE",
    fullName: "Lurie — Telehealth Project (Phase 1 & 2)",
    category: "work",
    domain: ["Healthcare", "APIs", "Data"],
    org: "BlueVector AI",
    period: "Apr 2026 – Present",
    role: "Cloud Developer & Consultant · Integration & data engineer",
    accent: "#E8336D",
    tagline: "Wearable health data, migrated from Fitbit to Google Health APIs.",
    description:
      "Telehealth project (Lurie, Phase 1 & 2): wearable data flows through OAuth 2.0 and Google Health APIs into pipelines with minute-wise sync, NoSQL time-series storage and threshold alerts, surfaced in React dashboards with RBAC.",
    problem:
      "Fitbit integrations had to move to Google Health APIs — different auth flows, different response schemas, gaps in data, and large datasets.",
    solution:
      "Migrated the integrations with OAuth 2.0, a schema transformation layer into a normalized internal model and error handling — then built minute-wise sync pipelines, NoSQL time-series storage, threshold alerts and RBAC-protected React dashboards.",
    built: [
      "Fitbit → Google Health API migration with OAuth 2.0",
      "10+ health metrics retrieved (e.g. heart rate, SpO₂)",
      "Schema transformation into a normalized model, with error handling",
      "Data pipelines with minute-wise sync and NoSQL time-series storage",
      "Threshold alerts and React dashboards with RBAC",
    ],
    technologies: [
      { name: "Python", usedFor: ["Integration services", "Normalization", "Aggregation"] },
      { name: "OAuth 2.0", usedFor: ["Authorizing access to health data APIs"] },
      { name: "Google Health API", usedFor: ["Source of wearable health data after migration"] },
      { name: "Fitbit API", usedFor: ["Legacy source being migrated"] },
      { name: "NoSQL time-series", usedFor: ["Storing minute-wise normalized metrics"] },
      { name: "React", usedFor: ["Health dashboards with RBAC", "Threshold alerts"] },
    ],
    architecture: ["Fitbit / Device", "OAuth 2.0", "Google Health API", "Python", "Normalization", "Time-series Storage", "React Dashboard"],
    workflow: ["Fitbit Response", "Schema Mapping", "Google Health Response", "Normalized Internal Model"],
    challenges: [
      { problem: "401 UNAUTHENTICATED", approach: "OAuth debugging — configuration, tokens and API validation." },
      { problem: "Schema mismatch", approach: "Transformation layer mapping both schemas to one internal model." },
      { problem: "Missing data", approach: "Fallback handling." },
      { problem: "Large dataset", approach: "Granular retrieval." },
    ],
    outcomes: ["Fitbit integrations migrated to Google Health APIs with a normalized internal data model", "Minute-wise sync with threshold alerts feeding RBAC-protected dashboards"],
    metrics: [
      { value: "10+", label: "Health metrics retrieved" },
      { value: "1 min", label: "Sync granularity" },
    ],
    views: {
      system: "APIs → Python → time-series database.",
      flow: "Fitbit → Google Health → normalization → dashboard.",
      human: "A healthcare dashboard showing metrics, trends and thresholds.",
    },
    skills: ["Python", "OAuth", "APIs", "React", "RBAC", "NoSQL", "Google Health", "Data"],
    note: "Client project. All health values shown are fictional and illustrative — not real patient data and not anyone's personal metrics.",
  },
  {
    slug: "medicaid",
    name: "MEDICAID",
    fullName: "Medicaid Project — Level-of-Care Rule Engine",
    category: "work",
    domain: ["Healthcare", "Rules Engine", "Testing"],
    org: "BlueVector AI",
    period: "Apr 2026 – Present",
    role: "Cloud Developer & Consultant · Front-end & rules engineer",
    accent: "#F2A900",
    tagline: "Deterministic rules. The right version, every time.",
    description:
      "A versioned Medicaid Level-of-Care rule engine and reusable React form components, tested with Playwright.",
    problem:
      "Business rules change over time, and each application must be evaluated with the correct ruleset version — deterministically and testably.",
    solution:
      "A versioned, deterministic rule engine that selects the correct ruleset, reusable React form components, and Playwright end-to-end tests.",
    built: ["Versioned Level-of-Care rule engine", "Reusable React form components", "Playwright test automation"],
    technologies: [
      { name: "React", usedFor: ["Reusable form components"] },
      { name: "Rule engine", usedFor: ["Deterministic, versioned business logic"] },
      { name: "Playwright", usedFor: ["End-to-end test automation"] },
    ],
    architecture: ["React Forms", "Ruleset Selector", "Rule Engine", "Result", "Playwright Tests"],
    workflow: ["Application", "Select Ruleset Version", "Rule 01", "Rule 02", "Rule 03", "Rule 04", "Result"],
    challenges: [
      { problem: "Rules change over time", approach: "Versioned rulesets — the correct version is selected per application." },
      { problem: "Regressions", approach: "Playwright test automation." },
    ],
    outcomes: ["Deterministic, versioned business logic with automated tests"],
    metrics: [],
    views: {
      system: "React forms → versioned rule engine → result.",
      flow: "Application → ruleset selection → rules execute → result.",
      human: "Caseworker-style forms built from reusable components.",
    },
    skills: ["React", "Workflows", "Playwright", "Rules"],
    note: ILLUSTRATIVE + " Rules are deterministic business logic — not AI decisions.",
  },
  {
    slug: "asana",
    name: "ASANA",
    fullName: "Asana Integrations — Event-Driven Sync",
    category: "work",
    domain: ["Integrations", "Automation", "Event-Driven"],
    org: "BlueVector AI",
    period: "Apr 2026 – Present",
    role: "Cloud Developer & Consultant · Integration engineer",
    accent: "#F06A6A",
    tagline: "An event happens in Asana. Everything downstream knows.",
    description:
      "Asana integrations in Python using REST APIs, webhooks and event-driven sync for tasks, time tracking and status automation.",
    problem: "Task changes in Asana needed to be reflected in the application for synchronization and time tracking.",
    solution: "Webhook-driven, event-based integration: Asana events hit an API endpoint, are processed by the backend, persisted, and reflected in the application.",
    built: ["Asana REST API integration in Python", "Webhooks", "Event-driven sync", "Task synchronization", "Time tracking", "Status automation"],
    technologies: [
      { name: "Python", usedFor: ["Integration services"] },
      { name: "REST APIs", usedFor: ["Reading and writing Asana data"] },
      { name: "Webhooks", usedFor: ["Receiving Asana events in real time"] },
      { name: "Event-driven workflows", usedFor: ["Sync, status and time-tracking automation"] },
    ],
    architecture: ["Asana Event", "Webhook", "API", "Backend", "Database", "Application"],
    workflow: ["Asana Event", "Webhook", "API", "Backend", "Database", "Application"],
    challenges: [{ problem: "Keeping two systems in sync", approach: "Event-driven updates via webhooks instead of manual entry." }],
    outcomes: ["Task synchronization and time tracking driven by Asana events"],
    metrics: [],
    views: {
      system: "Webhook → API → backend → database.",
      flow: "Task completed → webhook → sync → status → automation.",
      human: "Tasks and time entries stay current without manual updates.",
    },
    skills: ["Python", "APIs", "Webhooks", "Automation", "Workflows"],
    note: ILLUSTRATIVE,
  },
  {
    slug: "ai-assistant",
    name: "AI ASSISTANT",
    fullName: "Secure AI Assistant — RAG with Protected Keys",
    category: "work",
    domain: ["GenAI", "Security", "Architecture"],
    org: "BlueVector AI",
    period: "Apr 2026 – Present",
    role: "Cloud Developer & Consultant · Architect",
    accent: "#00A3C4",
    tagline: "The browser never sees the key.",
    description:
      "Architected a secure enterprise AI assistant with RAG knowledge retrieval, role-aware access, a Next.js proxy, Nginx, auth guards and API key security.",
    problem: "An AI assistant must call Gemini and reach internal knowledge without exposing API keys or data to unauthenticated users.",
    solution: "Requests go browser → Next.js server (auth guard) → backend → Gemini, behind Nginx, with retrieval only for authenticated users. Keys live on the server only.",
    built: ["Next.js proxy", "Nginx", "RAG knowledge retrieval", "Role-aware access", "Auth guards", "API key security"],
    technologies: [
      { name: "Next.js", usedFor: ["Server-side proxy holding the API key"] },
      { name: "Nginx", usedFor: ["Reverse proxy in front of services"] },
      { name: "Gemini", usedFor: ["LLM responses"] },
      { name: "RAG", usedFor: ["Grounding answers in authenticated knowledge"] },
      { name: "Auth guard", usedFor: ["Only authenticated users reach retrieval and the model"] },
    ],
    architecture: ["User", "Next.js", "Auth Guard", "Backend", "Gemini", "Knowledge / Data"],
    workflow: ["User", "Next.js", "Auth Guard", "Backend", "Gemini", "Knowledge / Data"],
    challenges: [{ problem: "API key exposure", approach: "Keys never ship to the browser — all calls go through the server proxy." }],
    outcomes: ["Secure assistant architecture with server-held keys and authenticated retrieval"],
    metrics: [],
    views: {
      system: "Nginx → Next.js proxy → backend → Gemini + knowledge.",
      flow: "Browser → server → Gemini (accepted) vs browser → Gemini key (blocked).",
      human: "An authenticated user chats with an assistant grounded in internal knowledge.",
    },
    skills: ["Gemini", "AI", "Next.js", "RAG", "Security", "Nginx", "OAuth"],
    note: "Client project. Diagrams are illustrative of the architecture and security model.",
  },
];

export const labProjects: Project[] = [
  {
    slug: "skywatch",
    name: "SKYWATCH",
    fullName: "SkyWatch Live — Real-Time Flight Tracker",
    category: "lab",
    domain: ["Real-time", "Maps", "APIs"],
    role: "Personal project",
    accent: "#2F4BFF",
    tagline: "Live aircraft positions from the OpenSky Network on an interactive map.",
    description: "A real-time flight tracker with a FastAPI backend processing OpenSky API data and an interactive live aircraft map.",
    problem: "Visualize live air traffic from a public API.",
    solution: "Next.js + React front end, FastAPI + Python back end, polling the OpenSky Network API.",
    built: ["Interactive map", "Live aircraft positions", "FastAPI backend"],
    technologies: [
      { name: "Next.js / React", usedFor: ["Map UI"] },
      { name: "FastAPI / Python", usedFor: ["Backend API"] },
      { name: "OpenSky Network API", usedFor: ["Live aircraft state vectors"] },
    ],
    architecture: ["OpenSky API", "FastAPI", "Next.js", "Map"],
    workflow: ["Poll", "Parse", "Render"],
    challenges: [],
    outcomes: [],
    metrics: [],
    views: { system: "", flow: "", human: "" },
    skills: ["Next.js", "React", "FastAPI", "Python", "APIs"],
  },
  {
    slug: "stories",
    name: "STORIES",
    fullName: "Stories — AI Work Management Platform",
    category: "lab",
    domain: ["Multi-tenant", "Real-time", "SaaS"],
    role: "Personal project",
    accent: "#7A5CFF",
    tagline: "Multi-tenant project & time management with real-time collaboration.",
    description:
      "A multi-tenant work management platform with Kanban, Gantt and Timeline views, dependencies, critical path, OKRs and timesheets.",
    problem: "",
    solution: "",
    built: [
      "Kanban, Gantt and Timeline views",
      "Task dependencies, critical path, OKRs, timesheets",
      "Real-time collaboration with WebSockets and Redis Pub/Sub",
      "Celery background jobs and an automation engine",
      "RBAC and SSO (SAML/OIDC)",
    ],
    technologies: [
      { name: "Next.js / TypeScript", usedFor: ["Front end"] },
      { name: "FastAPI / Python", usedFor: ["API"] },
      { name: "PostgreSQL", usedFor: ["Data"] },
      { name: "Redis / WebSockets", usedFor: ["Real-time collaboration"] },
      { name: "Celery", usedFor: ["Background jobs"] },
      { name: "Docker", usedFor: ["Local orchestration"] },
    ],
    architecture: [],
    workflow: [],
    challenges: [],
    outcomes: [],
    metrics: [],
    views: { system: "", flow: "", human: "" },
    skills: ["Next.js", "TypeScript", "FastAPI", "Python", "PostgreSQL", "Redis", "WebSockets", "Docker", "RBAC", "SSO"],
  },
  {
    slug: "exptrack",
    name: "EXPTRACK",
    fullName: "ExpTrack — AI Personal Finance Manager",
    category: "lab",
    domain: ["Finance", "OCR", "GenAI"],
    role: "Personal project",
    accent: "#0E9F6E",
    tagline: "Receipts in. Budgets, insights and an AI advisor out.",
    description:
      "A full-stack expense manager with Server Actions, Clerk auth, Arcjet rate limiting, receipt OCR and Inngest background jobs — plus a Gemini AI chatbot and investment advisor built on user transactions, financial health metrics and cached market data APIs.",
    problem: "",
    solution: "",
    built: ["Expense tracking with Server Actions", "Receipt OCR", "Inngest background jobs", "Clerk auth + Arcjet rate limiting", "Gemini AI chatbot and investment advisor"],
    technologies: [
      { name: "Next.js", usedFor: ["App + Server Actions"] },
      { name: "Tailwind / shadcn/ui", usedFor: ["UI"] },
      { name: "Supabase (PostgreSQL) / Prisma", usedFor: ["Data"] },
      { name: "Clerk", usedFor: ["Auth"] },
      { name: "Arcjet", usedFor: ["Rate limiting"] },
      { name: "Inngest", usedFor: ["Background jobs"] },
      { name: "Gemini API", usedFor: ["Chatbot & investment advisor"] },
    ],
    architecture: [],
    workflow: ["Receipt OCR", "Inngest job", "Database", "Budget", "Gemini insights"],
    challenges: [],
    outcomes: [],
    metrics: [],
    views: { system: "", flow: "", human: "" },
    skills: ["Next.js", "PostgreSQL", "Supabase", "Prisma", "Clerk", "Inngest", "Arcjet", "Gemini", "AI"],
  },
  {
    slug: "query",
    name: "QUERY",
    fullName: "Query — Q&A Platform",
    category: "lab",
    domain: ["MERN", "Auth", "CRUD"],
    role: "Personal project",
    accent: "#FF4D17",
    tagline: "A full-stack MERN Q&A platform.",
    description: "A full-stack MERN Q&A platform with Firebase Auth, protected routes, REST APIs and question/answer CRUD.",
    problem: "",
    solution: "",
    built: ["Authentication with Firebase", "Protected routes", "Question / answer CRUD"],
    technologies: [
      { name: "React", usedFor: ["UI"] },
      { name: "Node.js / Express.js", usedFor: ["REST API"] },
      { name: "MongoDB", usedFor: ["Data"] },
      { name: "Firebase Authentication", usedFor: ["Auth"] },
    ],
    architecture: [],
    workflow: [],
    challenges: [],
    outcomes: [],
    metrics: [],
    views: { system: "", flow: "", human: "" },
    skills: ["React", "Node.js", "Express.js", "MongoDB", "Firebase", "APIs"],
    links: [{ label: "GitHub", href: "https://github.com/Avinaba004/Query_new" }],
  },
];

export const miniProjects = [
  { name: "PokeDex", href: "https://poke-dex-avi.vercel.app/", blurb: "Live project" },
  { name: "Signature Maker", href: "https://signaturemakeravi.vercel.app/", blurb: "Live project" },
];

export const allProjects = [...workProjects, ...labProjects];

export const getProject = (slug: string) => allProjects.find((p) => p.slug === slug);
