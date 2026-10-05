/**
 * Verified profile data. Source of truth: Avinaba's CV (Oct 2026, v5) and
 * the portfolio brief. Do not add claims here that are not in those sources.
 */

export const profile = {
  firstName: "Avinaba",
  lastName: "Ghosh",
  name: "Avinaba Ghosh",
  title: "Software Engineer",
  disciplines: ["Full-Stack", "AI", "Cloud", "Enterprise"],
  headline:
    "Building full-stack enterprise systems, AI-powered workflows, cloud applications, and real-world integrations.",
  statement:
    "I build software for complex real-world workflows — from government and healthcare platforms to AI-powered systems, licensing platforms, integrations, and cloud applications.",
  summary:
    "Full-Stack Software Engineer with 1+ year of experience building enterprise and government platforms, cloud applications and GenAI solutions directly with clients.",
  location: "India",
  email: "ghoshjeet04@gmail.com",
  links: {
    github: "https://github.com/Avinaba004",
    linkedin: "https://www.linkedin.com/in/avinaba-ghosh-06489b268/",
    resume: "/resume/Avinaba_Ghosh_Resume.pdf",
  },
} as const;

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  type: string;
  start: string;
  end: string;
  groups: { title?: string; points: string[] }[];
};

export const experience: ExperienceItem[] = [
  {
    id: "cloud-consultant",
    role: "Cloud Developer & Consultant",
    company: "BlueVector AI",
    type: "Full Time",
    start: "Apr 2026",
    end: "Present",
    groups: [
      {
        title: "Ohio Department of Youth Services (ODYS) – Government Grants Platform",
        points: [
          "Rebuilt a legacy platform into a full-stack enterprise application using React, Next.js, TypeScript, Python, PostgreSQL and REST APIs, with domain-driven data models for courts, grants, fiscal periods and allocations across 88 Ohio counties.",
          "Built configuration-driven dynamic forms (schema versioning, conditional logic, validation) and workflow engines for grant review, approvals, compliance, document generation, notifications and audit trails.",
          "Implemented SSO and RBAC with OAuth 2.0, OIDC, SAML, Firebase Authentication and Google Identity Platform; deployed on GCP Cloud Run (Dev/UAT/Prod).",
        ],
      },
      {
        title: "Professional Licensing Platform & Enterprise AI Assistant",
        points: [
          "Developed a config-driven licensing platform with dynamic forms, compliance workflows and RBAC using PostgreSQL (JSONB), pgvector, Pub/Sub, Docker and OAuth 2.0 (authorization code, access/refresh tokens).",
          "Built a Gemini LLM pipeline converting unstructured web content into structured JSON configurations, cutting processing time by 70% (to 15–20s).",
          "Architected a secure AI assistant with RAG knowledge retrieval, role-aware access, Next.js proxy, Nginx, auth guards and API key security.",
        ],
      },
      {
        title: "AI Document & Decision Platforms – State of Michigan (EGLE) & Missouri (MOPBB)",
        points: [
          "Built AI document extraction and review platforms using Gemini/Vertex AI, Python, SQL and React, with configurable prompts, extraction profiles and human-in-the-loop validation.",
          "Developed AI scoring/rubric engines and role-based dashboards with workflow states (Draft, Submitted, RFI, Approved, Denied).",
        ],
      },
      {
        title: "Healthcare – Lurie (Phase 1 & Phase 2) Telehealth Project & Medicaid Project",
        points: [
          "Migrated Fitbit integrations to Google Health APIs with OAuth 2.0, schema transformation and error handling, retrieving 10+ health metrics (heart rate, SpO₂).",
          "Built data pipelines with minute-wise sync, NoSQL time-series storage, threshold alerts and React dashboards with RBAC.",
          "Built a versioned Medicaid Level-of-Care rule engine and reusable React form components, tested with Playwright.",
        ],
      },
      {
        title: "Integrations & Client Delivery",
        points: [
          "Built Asana integrations in Python using REST APIs, webhooks and event-driven sync for tasks, time tracking and status automation.",
          "Owned the full SDLC with US government and healthcare clients: requirements, POCs, demos, testing, debugging, deployment and production support.",
        ],
      },
    ],
  },
  {
    id: "associate-cloud-consultant",
    role: "Associate Cloud Consultant",
    company: "BlueVector AI",
    type: "Internship – Converted to Full-Time",
    start: "Nov 2025",
    end: "Mar 2026",
    groups: [
      {
        points: [
          "Built applications, dashboards and workflows using React, Python, SQL and REST APIs; gathered client requirements and delivered POCs and demos for US state clients.",
        ],
      },
    ],
  },
];

export const education = {
  degree: "B.Tech in Computer Science and Engineering",
  school: "Future Institute of Engineering and Management",
  start: "Oct 2022",
  end: "Jul 2026",
  cgpa: "9.08/10",
  rank: "Rank 1 in college",
  extra: [
    "Core Committee: GDG FIEM & FIEM Cultural Club — organised cultural and tech events",
    "Higher Secondary: 93.33% (2022)",
    "ICSE: 91% (2020)",
  ],
};

export const certifications = [
  {
    name: "Associate Cloud Engineer",
    issuer: "Google Cloud",
    url: "https://www.credly.com/badges/a28345aa-307f-4cea-b125-39064ea8d264/public_url",
    note: "GCP certified",
  },
  {
    name: "Machine Learning Training",
    issuer: "Internshala",
    url: "https://trainings.internshala.com/s/v/3431231/dfab97ac",
    note: "Scored 85%",
  },
];

export const skillGroups: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Python", "JavaScript", "TypeScript", "SQL", "Java", "C", "HTML5", "CSS3"] },
  { label: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "shadcn/ui", "Radix UI", "TanStack Query", "React Hook Form", "Zod", "Recharts", "Responsive Design"] },
  { label: "Backend", items: ["Node.js", "Express.js", "FastAPI", "Pydantic", "REST APIs", "API Integration", "Webhooks", "WebSockets", "Celery", "Background Jobs"] },
  { label: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "pgvector", "JSONB", "SQLAlchemy", "Alembic", "Prisma", "Data Modeling", "Data Migration"] },
  { label: "Cloud & DevOps", items: ["Google Cloud Platform (GCP)", "Cloud Run", "Firebase", "Pub/Sub", "Docker", "Docker Compose", "Nginx", "MinIO/S3", "Git", "GitHub"] },
  { label: "Auth & Security", items: ["OAuth 2.0", "OpenID Connect (OIDC)", "SAML", "SSO", "Firebase Authentication", "Google Identity Platform", "JWT", "RBAC", "API Security"] },
  { label: "AI / GenAI", items: ["Generative AI (GenAI)", "LLMs", "Google Gemini API", "RAG", "Prompt Engineering", "Document AI", "Information Extraction"] },
  { label: "Architecture", items: ["System Design", "Microservices", "Multi-Tenancy", "Event-Driven Architecture", "Config-Driven Architecture", "Legacy Modernization"] },
  { label: "Testing & Tools", items: ["Playwright", "Pytest", "Vitest", "React Testing Library", "Dialogflow", "SendGrid", "Agile/Scrum", "SDLC", "DSA", "OOP", "DBMS"] },
];

export const principles = [
  ["SYSTEMS", "FEATURES"],
  ["CLARITY", "COMPLEXITY"],
  ["AUTOMATION", "REPETITION"],
  ["DATA", "ASSUMPTIONS"],
  ["SECURITY", "SHORTCUTS"],
  ["REAL USERS", "PERFECT DEMOS"],
] as const;
