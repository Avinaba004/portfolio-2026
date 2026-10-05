import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, workProjects } from "@/data/projects";
import { CaseStudy } from "@/components/case/CaseStudy";

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
  return <CaseStudy p={p} />;
}
