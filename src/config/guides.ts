/**
 * Index of the guides/resources content hub. Each guide's full body lives in
 * its own route (src/app/guides/<slug>/page.tsx) since it's long-form prose,
 * not templated data, but the title/description/date/slug used by the
 * /guides index page, the sitemap, and cross-links all come from here so
 * they can't drift out of sync with what each article actually says.
 */
export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  datePublished: string; // ISO date, YYYY-MM-DD
};

export const GUIDES: GuideMeta[] = [
  {
    slug: "odoo-customization-vs-custom-apps",
    title: "Odoo Customization vs. a Custom Web App: What's the Difference?",
    description:
      "How in-Odoo customization (views, studio, custom modules) differs from building a separate web app against Odoo's API, and how to tell which one a given problem actually needs.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-api-integration-explained",
    title: "How Odoo's API Actually Works (XML-RPC, JSON-RPC and the ORM)",
    description:
      "A practical explanation of Odoo's external API surface, authentication, and the ORM methods (search_read, create, write) that a custom app calls under the hood.",
    datePublished: "2026-09-18",
  },
  {
    slug: "what-happens-when-odoo-upgrades",
    title: "What Happens to a Custom App When Odoo Upgrades?",
    description:
      "Why a separate web app is affected differently by an Odoo version upgrade than in-Odoo customizations are, and what actually needs to be checked when Odoo moves versions.",
    datePublished: "2026-09-18",
  },
  {
    slug: "how-much-does-a-custom-odoo-app-cost",
    title: "How Much Does a Custom Odoo App Cost?",
    description:
      "A grounded look at what drives the price of a small Odoo-connected app, with real ranges instead of vague 'contact us for pricing.'",
    datePublished: "2026-09-18",
  },
  {
    slug: "signs-your-team-needs-a-simpler-odoo-interface",
    title: "Signs Your Team Needs a Simpler Interface Than Odoo's Backend",
    description:
      "Practical signals, from workarounds on paper to reluctant adoption, that indicate a workflow would benefit from a focused front end instead of more Odoo training.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-write-back-vs-read-only-integrations",
    title: "Read-Only vs. Write-Back Odoo Integrations: Which Do You Need?",
    description:
      "The difference between an app that only displays Odoo data and one that creates or updates records in Odoo, and why that distinction changes scope, risk and cost.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-rest-api-explained",
    title: "Odoo REST API: What It Can (and Can't) Do",
    description:
      "Odoo doesn't actually have a native REST API: it exposes XML-RPC and JSON-RPC over its ORM. What that means in practice, and when a thin REST layer in front of it makes sense.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-barcode-app-buy-or-build",
    title: "Odoo Barcode App: Use Odoo's, or Build a Custom One?",
    description:
      "Odoo's own Barcode app is genuinely capable. An honest look at when it's enough and when a narrower custom picking app makes more sense.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-customer-self-service-portal",
    title: "How to Give Customers a Self-Service Portal Without Rebuilding Odoo's Frontend",
    description:
      "The difference between Odoo's built-in customer portal and a fully custom-branded ordering portal, and how to tell which one a given business actually needs.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-developer-vs-web-app-studio",
    title: "Hiring an Odoo Developer vs. a Web App Studio: What's the Difference?",
    description:
      "An honest, even-handed comparison of when an Odoo developer or implementation partner is the right call, and when a narrow web app studio is the better fit instead.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-studio-limitations",
    title: "Odoo Studio Can't Do This: Where the No-Code Builder Hits a Wall",
    description:
      "What Odoo Studio is genuinely good at, where its no-code approach hits real limits, and when a workflow needs a different kind of interface entirely.",
    datePublished: "2026-09-19",
  },
  {
    slug: "odoo-implementation-partner-cost",
    title: "Odoo Implementation Partner Cost (And When You Don't Need One)",
    description:
      "Honest, hedged ranges for what a full Odoo implementation typically costs, and how to tell whether your actual problem needs one or just a single connected app.",
    datePublished: "2026-09-19",
  },
  {
    slug: "why-is-my-odoo-dashboard-slow",
    title: "Why Your Odoo Dashboard Is Slow (and When a Standalone One Fixes It)",
    description:
      "The real technical reason cross-module Odoo dashboards and reports can be slow, and how a standalone read-only dashboard app sidesteps that specific problem.",
    datePublished: "2026-09-19",
  },
  {
    slug: "odoo-purchase-approval-mobile-app",
    title: "Purchase Approvals Stuck in Odoo's Backend? A Simple Mobile Approve/Reject App",
    description:
      "Why purchase order approvals bottleneck when managers are away from a desktop, and how a minimal mobile approve/reject screen writes decisions straight back to Odoo.",
    datePublished: "2026-09-19",
  },
  {
    slug: "odoo-api-multi-company-filtering",
    title: "Why Your Odoo API Call Returns Data From the Wrong Company (and How to Scope It Correctly)",
    description:
      "A recurring multi-company Odoo API gotcha: queries can return records across every company a user can access unless the request explicitly scopes company context.",
    datePublished: "2026-09-19",
  },
  {
    slug: "why-sales-reps-dont-use-odoo-mobile",
    title: "Reps Won't Use Odoo on Their Phones? Build the 3 Screens They Actually Need",
    description:
      "Why desktop-first CRM/Sales interfaces see low adoption from field reps on phones, and why a narrow 3-screen order flow written back to Odoo works better.",
    datePublished: "2026-09-19",
  },
];

export function guideBySlug(slug: string): GuideMeta | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
