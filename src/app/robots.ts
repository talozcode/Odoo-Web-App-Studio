import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /og-preview only exists as the render source for the social card
    // screenshot; it is noindex and has no business being crawled.
    rules: { userAgent: "*", allow: "/", disallow: "/og-preview" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
