import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, workProjects } from "@/data/projects";
import { CaseStudy } from "@/components/case/CaseStudy";
import Odys from "@/components/case/viz/odys";
import Gulp from "@/components/case/viz/gulp";
import Egle from "@/components/case/viz/egle";
import Mopbb from "@/components/case/viz/mopbb";
import Lurie from "@/components/case/viz/lurie";
import Medicaid from "@/components/case/viz/medicaid";
import Asana from "@/components/case/viz/asana";
import AiAssistant from "@/components/case/viz/ai-assistant";

// Only the visualization for the requested project is rendered (and shipped) per page.
const VIZ = { odys: Odys, gulp: Gulp, egle: Egle, mopbb: Mopbb, lurie: Lurie, medicaid: Medicaid, asana: Asana, "ai-assistant": AiAssistant } as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return workProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: `${p.name} — ${p.domain.slice(0, 2).join(" · ")}`, description: `${p.tagline} ${p.description}` };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || p.category !== "work") notFound();
  const Viz = VIZ[slug as keyof typeof VIZ];
  return (
    <CaseStudy
      p={p}
      viz={{
        system: <Viz part="system" p={p} />,
        flow: <Viz part="flow" p={p} />,
        human: <Viz part="human" p={p} />,
        signature: <Viz part="signature" p={p} />,
      }}
    />
  );
}
