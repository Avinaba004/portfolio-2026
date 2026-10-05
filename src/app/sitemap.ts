import type { MetadataRoute } from "next";
import { workProjects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/resume`, priority: 0.9 },
    ...workProjects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, priority: 0.8 })),
  ];
}
