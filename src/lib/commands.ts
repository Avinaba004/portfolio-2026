import { profile } from "@/data/profile";

export type Command = {
  id: string;
  label: string;
  group: "Projects" | "Navigate" | "Links" | "System";
  hint?: string;
  keywords?: string;
  run:
    | { type: "route"; href: string }
    | { type: "section"; id: string }
    | { type: "external"; href: string }
    | { type: "action"; name: "debug" | "sound" };
};

export const sections = [
  { id: "system", label: "SYSTEM" },
  { id: "build", label: "BUILD" },
  { id: "work", label: "WORK" },
  { id: "incidents", label: "DEBUG" },
  { id: "stack", label: "STACK" },
  { id: "process", label: "PROCESS" },
  { id: "career", label: "CAREER" },
  { id: "lab", label: "LAB" },
  { id: "console", label: "CONSOLE" },
  { id: "contact", label: "CONTACT" },
] as const;

const project = (name: string, slug: string, hint: string): Command => ({
  id: `open-${slug}`,
  label: `Open ${name}`,
  group: "Projects",
  hint,
  keywords: slug,
  run: { type: "route", href: `/work/${slug}` },
});

export const commands: Command[] = [
  project("ODYS", "odys", "Government grants OS"),
  project("Gulp", "gulp", "Licensing + Gemini"),
  project("EGLE", "egle", "AI document review"),
  project("MOPBB", "mopbb", "Decision workflows"),
  project("Lurie", "lurie", "Telehealth data"),
  project("Medicaid", "medicaid", "Rule engine"),
  project("Asana", "asana", "Webhooks"),
  project("AI Assistant", "ai-assistant", "Secure RAG"),
  { id: "open-skywatch", label: "Open SkyWatch", group: "Projects", hint: "Lab · live flights", run: { type: "section", id: "lab-skywatch" } },
  { id: "open-exptrack", label: "Open ExpTrack", group: "Projects", hint: "Lab · finance", run: { type: "section", id: "lab-exptrack" } },
  { id: "open-query", label: "Open Query", group: "Projects", hint: "Lab · Q&A", run: { type: "section", id: "lab-query" } },
  { id: "view-arch", label: "View Architecture", group: "Navigate", hint: "Project galaxy", keywords: "work galaxy systems", run: { type: "section", id: "work" } },
  { id: "view-skills", label: "View Skills", group: "Navigate", hint: "Stack graph", keywords: "stack technologies", run: { type: "section", id: "stack" } },
  { id: "view-broke", label: "View Things That Broke", group: "Navigate", hint: "Debugging room", keywords: "incidents bugs", run: { type: "section", id: "incidents" } },
  { id: "view-career", label: "View Career Timeline", group: "Navigate", keywords: "experience timeline", run: { type: "section", id: "career" } },
  { id: "ask", label: "Ask Avinaba", group: "Navigate", hint: "Knowledge assistant", keywords: "question chat terminal", run: { type: "section", id: "console" } },
  { id: "resume", label: "View Resume", group: "Navigate", hint: "Resume mode", keywords: "cv pdf", run: { type: "route", href: "/resume" } },
  { id: "contact", label: "Contact Avinaba", group: "Navigate", keywords: "email hire", run: { type: "section", id: "contact" } },
  { id: "github", label: "Open GitHub", group: "Links", hint: "github.com/Avinaba004", run: { type: "external", href: profile.links.github } },
  { id: "linkedin", label: "Open LinkedIn", group: "Links", run: { type: "external", href: profile.links.linkedin } },
  { id: "email", label: "Send Email", group: "Links", hint: profile.email, run: { type: "external", href: `mailto:${profile.email}` } },
  { id: "debug", label: "Toggle Debug Mode", group: "System", hint: "Show architecture layer", run: { type: "action", name: "debug" } },
  { id: "sound", label: "Toggle Sound", group: "System", run: { type: "action", name: "sound" } },
];

export function fuzzyScore(query: string, text: string) {
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  const t = text.toLowerCase();
  if (t.includes(q)) return 100 - t.indexOf(q);
  let qi = 0;
  let score = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      score += 1;
      qi++;
    }
  }
  return qi === q.length ? score : 0;
}
