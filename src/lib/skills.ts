import { allProjects, type Project } from "@/data/projects";

/**
 * Explicit CV-skill → project evidence. `#slug` pins a project directly (used where the CV
 * states the link in prose); other entries must equal a project skill / technology name.
 * Anything not listed falls back to a strict whole-name match.
 */
const EVIDENCE: Record<string, string[]> = {
  python: ["python", "fastapi / python"],
  sql: ["sql"],
  "google cloud platform (gcp)": ["gcp"],
  "google gemini api": ["gemini", "gemini / vertex ai", "gemini api"],
  "generative ai (genai)": ["gemini", "gemini / vertex ai", "gemini api"],
  llms: ["gemini", "gemini / vertex ai", "gemini api"],
  "rest apis": ["apis", "rest apis"],
  "api integration": ["apis", "rest apis", "google health api", "opensky network api"],
  "openid connect (oidc)": ["oauth 2.0 / oidc / saml", "#stories"],
  saml: ["oauth 2.0 / oidc / saml", "#stories"],
  sso: ["sso"],
  "oauth 2.0": ["oauth", "oauth 2.0"],
  "firebase authentication": ["firebase auth / google identity", "firebase authentication"],
  "google identity platform": ["firebase auth / google identity"],
  firebase: ["firebase auth / google identity", "firebase authentication"],
  "event-driven architecture": ["webhooks", "pub/sub"],
  "config-driven architecture": ["#odys", "#gulp", "#egle"],
  "legacy modernization": ["#odys"],
  "data modeling": ["#odys"],
  "multi-tenancy": ["#stories"],
  "document ai": ["#egle"],
  "information extraction": ["#egle", "#gulp"],
  "prompt engineering": ["#egle"],
  "system design": ["#ai-assistant", "#odys"],
  "background jobs": ["celery", "inngest"],
  "api security": ["#ai-assistant"],
  "tailwind css": ["tailwind / shadcn/ui"],
  "shadcn/ui": ["tailwind / shadcn/ui"],
  "node.js": ["node.js / express.js"],
  "express.js": ["node.js / express.js"],
  fastapi: ["fastapi", "fastapi / python"],
  redis: ["redis", "redis / websockets"],
  websockets: ["websockets", "redis / websockets"],
  postgresql: ["postgresql", "postgresql / jsonb", "supabase (postgresql) / prisma"],
  jsonb: ["postgresql / jsonb"],
  prisma: ["prisma", "supabase (postgresql) / prisma"],
  "next.js": ["next.js", "next.js / react", "next.js / typescript"],
  react: ["react", "next.js / react"],
  typescript: ["typescript", "next.js / typescript"],
};

/** Projects that verifiably used a given CV skill. */
export function projectsUsing(skill: string): Project[] {
  const key = skill.toLowerCase();
  const ev = EVIDENCE[key] ?? [key];
  return allProjects.filter((p) => {
    const hay = new Set([...p.skills, ...p.technologies.map((t) => t.name)].map((x) => x.toLowerCase()));
    return ev.some((e) => (e.startsWith("#") ? p.slug === e.slice(1) : hay.has(e)));
  });
}
