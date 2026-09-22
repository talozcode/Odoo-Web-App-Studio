import type { Metadata } from "next";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";
import type { GuideMeta } from "@/config/guides";

const OG_IMAGE = { url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630, alt: `${BRAND_NAME}: small web apps connected to your Odoo` };

type PageMetadataInput = {
  /** Title without the brand suffix; it is appended here. */
  title: string;
  description: string;
  /** Path from the site root, e.g. "/odoo-warehouse-app". "" for the homepage. */
  path: string;
  type?: "website" | "article";
  /** Optional shorter title for the social card; defaults to `title`. */
  ogTitle?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

/**
 * One place for every page's head metadata. Next merges metadata shallowly,
 * so a page that sets `openGraph` without `images` loses the site image and
 * a page without `twitter` inherits the homepage's tags; building the whole
 * block here keeps every page correct.
 */
export function pageMetadata(input: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${input.path}`;
  const fullTitle = `${input.title} | ${BRAND_NAME}`;
  const ogTitle = input.ogTitle ?? input.title;
  return {
    title: fullTitle,
    description: input.description,
    alternates: { canonical: url },
    ...(input.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: ogTitle,
      description: input.description,
      url,
      siteName: BRAND_NAME,
      type: input.type ?? "website",
      locale: "en_US",
      images: [OG_IMAGE],
      ...(input.type === "article"
        ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime ?? input.publishedTime, authors: [`${SITE_URL}/about#founder`] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: input.description,
      images: [OG_IMAGE.url],
    },
  };
}

export function guideMetadata(meta: GuideMeta): Metadata {
  return pageMetadata({
    title: meta.seoTitle ?? meta.title,
    ogTitle: meta.title,
    description: meta.description,
    path: `/guides/${meta.slug}`,
    type: "article",
    publishedTime: meta.datePublished,
    modifiedTime: meta.dateModified,
  });
}
