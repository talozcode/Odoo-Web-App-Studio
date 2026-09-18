import { BRAND_NAME } from "./brand";

export const SITE_URL = "https://odoo-web-app-studio.vercel.app";

export const SEO = {
  title: `Simple Web Apps for Odoo | ${BRAND_NAME}`,
  description:
    "Fast, focused web apps connected to your existing Odoo. Simplify warehouse, sales, reporting, customer, supplier and operational workflows without replacing your ERP.",
};

export const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Examples", href: "#examples" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export const CONTACT_SECTION_ID = "contact";
export const CONTACT_NAV_LABEL = "Tell us your problem";

export const CONTACT_EMAIL = "hello@example.com";

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
  { label: "What we build", href: "#examples" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: `#${CONTACT_SECTION_ID}` },
] as const;
