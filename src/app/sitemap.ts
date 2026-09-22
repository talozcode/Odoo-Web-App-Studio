import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { USE_CASE_PAGES } from "@/config/use-case-pages";
import { GUIDES } from "@/config/guides";

// Real dates, not the build time: a sitemap that says everything changed
// today on every deploy tells crawlers nothing. Bump these when the page
// content changes.
const STATIC_UPDATED: Record<string, string> = {
  "": "2026-09-22",
  "/work": "2026-09-22",
  "/guides": "2026-09-22",
  "/about": "2026-09-22",
  "/privacy": "2026-09-22",
  "/terms": "2026-09-22",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/work", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/guides", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.2 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.2 },
  ].map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(STATIC_UPDATED[path]),
    changeFrequency,
    priority,
  }));

  const useCaseRoutes: MetadataRoute.Sitemap = USE_CASE_PAGES.map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified: new Date(page.updated),
  }));

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.dateModified ?? guide.datePublished),
  }));

  return [...staticRoutes, ...useCaseRoutes, ...guideRoutes];
}
