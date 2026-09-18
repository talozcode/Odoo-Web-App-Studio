/**
 * schema.org / JSON-LD builders.
 *
 * Every function here returns a plain object shaped to a specific
 * schema.org type. They deliberately take the site's existing config
 * objects (EXAMPLE_APPS, FAQ_ITEMS, ...) as input instead of re-typing any
 * copy, so the structured data can never drift from what's actually printed
 * on the page.
 */
import { BRAND_NAME, BRAND_TAGLINE } from "@/config/brand";
import { SITE_URL, SEO } from "@/config/site";
import type { ExampleApp } from "@/config/examples";
import type { FaqItem } from "@/config/faq";

const LOGO_URL = `${SITE_URL}/brand/odoowebapps-logo-horizontal-transparent.png`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    description: BRAND_TAGLINE,
    slogan: BRAND_TAGLINE,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: SITE_URL,
    description: SEO.description,
  };
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * A Service schema for one of the six example apps. `url` should point at
 * that example's dedicated landing page when one exists.
 */
export function serviceSchema(app: ExampleApp, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: app.name,
    name: `${app.name} for Odoo`,
    description: app.description,
    url,
    provider: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: app.priceFrom,
      description: `Starting price for a ${app.name.toLowerCase()} build`,
      url,
    },
  };
}

/**
 * A generic Service schema for a capability page that isn't tied to one of
 * the six example apps (currently just Odoo API development).
 */
export function capabilityServiceSchema(params: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: params.name,
    name: params.name,
    description: params.description,
    url: params.url,
    provider: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
    areaServed: "Worldwide",
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * TechArticle schema for a guide. Attributed to the brand, never to a
 * fictional named author, since no real named author/credentials exist.
 */
export function articleSchema(params: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: params.title,
    description: params.description,
    url: params.url,
    datePublished: params.datePublished,
    dateModified: params.datePublished,
    author: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": params.url,
    },
  };
}
