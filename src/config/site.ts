import { ENTRY_PRICE_LABEL } from "./pricing";

export const SITE_URL = "https://odoowebapps.com";

export const SEO = {
  /** Title tag without the brand; the brand suffix is added by pageMetadata. */
  title: "Custom Web Apps Connected to Your Odoo",
  ogTitle: "Odoo doesn't have to feel like Odoo",
  // The entry price comes from the pricing config so the meta description
  // can never drift from what the pricing section shows.
  description: `Small custom web apps for your existing Odoo: picking, sales, dashboards and portals over the Odoo API, from ${ENTRY_PRICE_LABEL}. Nothing installed inside Odoo.`,
};

// Root-relative ("/#examples" rather than "#examples") so these links work
// correctly from every page on the site, not only from the homepage they
// scroll within. SiteHeader and SiteFooter are shared across all routes.
export const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Demos", href: "/#demos" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Guides", href: "/guides" },
] as const;

export const CONTACT_SECTION_ID = "contact";
export const CONTACT_NAV_LABEL = "Tell us what you want to simplify";

export const CONTACT_EMAIL = "talbkk11@gmail.com";

export const PROBLEM_CHIPS = [
  "Warehouse picking",
  "Stock counting",
  "Sales ordering",
  "Purchase approvals",
  "Customer portal",
  "Supplier portal",
  "Delivery workflow",
  "Production",
  "Reporting",
  "Something else",
] as const;

export const FOOTER_LINKS = [
  { label: "Live demos", href: "/#demos" },
  { label: "What we build", href: "/#work" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: `/#${CONTACT_SECTION_ID}` },
] as const;

export const FOOTER_RESOURCE_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;
