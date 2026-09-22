/**
 * Index of the guides/resources content hub. Each guide's full body lives in
 * its own route (src/app/guides/<slug>/page.tsx) since it's long-form prose,
 * not templated data, but the title/description/date/slug used by the
 * /guides index page, the sitemap, and cross-links all come from here so
 * they can't drift out of sync with what each article actually says.
 */
export type GuideMeta = {
  slug: string;
  /** Editorial title, used as the H1 and social title. */
  title: string;
  /** Short, query-bearing title for the title tag (under 60 chars). Defaults to title. */
  seoTitle?: string;
  description: string;
  datePublished: string; // ISO date, YYYY-MM-DD
  /** Set when the article is substantively revised. */
  dateModified?: string;
};

export const GUIDES: GuideMeta[] = [
  {
    slug: "odoo-api-examples-python-javascript",
    title: "Odoo API Examples: Python, JavaScript and curl That Actually Run",
    seoTitle: "Odoo API Examples: Python, JavaScript, curl",
    description:
      "Working Odoo API calls in Python, Node and curl for JSON-2, JSON-RPC and XML-RPC: authenticate, search_read, create, write and confirm an order, with the domain syntax and the mistakes that break integrations in production.",
    datePublished: "2026-09-22",
  },
  {
    slug: "odoo-19-json-2-api",
    title: "Odoo 19's JSON-2 API: What Changed and What to Do About XML-RPC",
    seoTitle: "Odoo 19 JSON-2 API: What Changed",
    description:
      "Odoo 19 added an HTTP JSON API at /json/2/<model>/<method> with bearer API keys, and scheduled XML-RPC and JSON-RPC for removal in Odoo 22. The request shape, the plan gate, key rotation, the one-call-one-transaction rule and a migration table.",
    datePublished: "2026-09-22",
  },
  {
    slug: "odoo-api-key-setup",
    title: "Odoo API Keys: How to Create, Scope and Rotate Them",
    seoTitle: "Odoo API Key: Create, Scope and Rotate",
    description:
      "Where to generate an Odoo API key, how it is sent on JSON-2 versus XML-RPC, the three-month limit in Odoo 19, which user should hold it, and the six reasons a key usually fails.",
    datePublished: "2026-09-22",
  },
  {
    slug: "odoo-customization-vs-custom-apps",
    title: "Odoo Customization vs. a Custom Web App: What's the Difference?",
    seoTitle: "Odoo Customization vs Custom Web App",
    description:
      "How in-Odoo customization (views, studio, custom modules) differs from building a separate web app against Odoo's API, and how to tell which one a given problem actually needs.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-api-integration-explained",
    title: "How Odoo's API Actually Works (JSON-2, JSON-RPC, XML-RPC and the ORM)",
    seoTitle: "Odoo API Integration: XML-RPC, JSON-RPC, JSON-2",
    description:
      "A practical explanation of Odoo's external API: JSON-2 on Odoo 19, JSON-RPC and XML-RPC before it, API-key authentication, and the ORM methods (search_read, create, write) a custom app calls.",
    datePublished: "2026-09-18",
    dateModified: "2026-09-22",
  },
  {
    slug: "what-happens-when-odoo-upgrades",
    title: "What Happens to a Custom App When Odoo Upgrades?",
    seoTitle: "Odoo Upgrades and Custom Apps: What Breaks",
    description:
      "Why a separate web app is affected differently by an Odoo version upgrade than in-Odoo customizations are, and what actually needs to be checked when Odoo moves versions.",
    datePublished: "2026-09-18",
    dateModified: "2026-09-22",
  },
  {
    slug: "how-much-does-a-custom-odoo-app-cost",
    title: "How Much Does a Custom Odoo App Cost?",
    seoTitle: "Custom Odoo App Cost: Real Prices",
    description:
      "A grounded look at what drives the price of a small Odoo-connected app, with real ranges instead of vague 'contact us for pricing.'",
    datePublished: "2026-09-18",
  },
  {
    slug: "signs-your-team-needs-a-simpler-odoo-interface",
    title: "Signs Your Team Needs a Simpler Interface Than Odoo's Backend",
    seoTitle: "Odoo Too Complicated? Signs You Need a Simpler UI",
    description:
      "Practical signals, from workarounds on paper to reluctant adoption, that indicate a workflow would benefit from a focused front end instead of more Odoo training.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-write-back-vs-read-only-integrations",
    title: "Read-Only vs. Write-Back Odoo Integrations: Which Do You Need?",
    seoTitle: "Read-Only vs Write-Back Odoo Integrations",
    description:
      "The difference between an app that only displays Odoo data and one that creates or updates records in Odoo, and why that distinction changes scope, risk and cost.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-rest-api-explained",
    title: "Odoo REST API: What Exists in Odoo 19 (and What Came Before)",
    seoTitle: "Odoo REST API: JSON-2, JSON-RPC and XML-RPC",
    description:
      "Odoo 19 has an HTTP JSON API (JSON-2) with bearer API keys; older versions only have XML-RPC and JSON-RPC, deprecated for removal in Odoo 22. What each looks like and which to use.",
    datePublished: "2026-09-18",
    dateModified: "2026-09-22",
  },
  {
    slug: "odoo-barcode-app-buy-or-build",
    title: "Odoo Barcode App: Use Odoo's, or Build a Custom One?",
    seoTitle: "Odoo Barcode App: Use Odoo's or Build Custom",
    description:
      "Odoo's own Barcode app is genuinely capable. An honest look at when it's enough and when a narrower custom picking app makes more sense.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-customer-self-service-portal",
    title: "How to Give Customers a Self-Service Portal Without Rebuilding Odoo's Frontend",
    seoTitle: "Odoo Customer Portal: Built-in vs Custom",
    description:
      "The difference between Odoo's built-in customer portal and a fully custom-branded ordering portal, and how to tell which one a given business actually needs.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-developer-vs-web-app-studio",
    title: "Hiring an Odoo Developer vs. a Web App Studio: What's the Difference?",
    seoTitle: "Hire an Odoo Developer or a Web App Studio?",
    description:
      "An honest, even-handed comparison of when an Odoo developer or implementation partner is the right call, and when a narrow web app studio is the better fit instead.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-studio-limitations",
    title: "Odoo Studio Can't Do This: Where the No-Code Builder Hits a Wall",
    seoTitle: "Odoo Studio Limitations: What It Can't Do",
    description:
      "What Odoo Studio is genuinely good at, where its no-code approach hits real limits, and when a workflow needs a different kind of interface entirely.",
    datePublished: "2026-09-19",
  },
  {
    slug: "odoo-implementation-partner-cost",
    title: "Odoo Implementation Partner Cost (And When You Don't Need One)",
    seoTitle: "Odoo Implementation Partner Cost",
    description:
      "Honest, hedged ranges for what a full Odoo implementation typically costs, and how to tell whether your actual problem needs one or just a single connected app.",
    datePublished: "2026-09-19",
  },
  {
    slug: "why-is-my-odoo-dashboard-slow",
    title: "Why Your Odoo Dashboard Is Slow (and When a Standalone One Fixes It)",
    seoTitle: "Why Your Odoo Dashboard Is Slow",
    description:
      "The real technical reason cross-module Odoo dashboards and reports can be slow, and how a standalone read-only dashboard app sidesteps that specific problem.",
    datePublished: "2026-09-19",
  },
  {
    slug: "odoo-purchase-approval-mobile-app",
    title: "Purchase Approvals Stuck in Odoo's Backend? A Simple Mobile Approve/Reject App",
    seoTitle: "Odoo Purchase Approval App for Mobile",
    description:
      "Why purchase order approvals bottleneck when managers are away from a desktop, and how a minimal mobile approve/reject screen writes decisions straight back to Odoo.",
    datePublished: "2026-09-19",
  },
  {
    slug: "odoo-api-multi-company-filtering",
    title: "Why Your Odoo API Call Returns Data From the Wrong Company (and How to Scope It Correctly)",
    seoTitle: "Odoo API Multi-Company Filtering",
    description:
      "A recurring multi-company Odoo API gotcha: queries can return records across every company a user can access unless the request explicitly scopes company context.",
    datePublished: "2026-09-19",
  },
  {
    slug: "why-sales-reps-dont-use-odoo-mobile",
    title: "Reps Won't Use Odoo on Their Phones? Build the 3 Screens They Actually Need",
    seoTitle: "Odoo Mobile Sales App: Why Reps Don't Use Odoo",
    description:
      "Why desktop-first CRM/Sales interfaces see low adoption from field reps on phones, and why a narrow 3-screen order flow written back to Odoo works better.",
    datePublished: "2026-09-19",
  },
];

export function guideBySlug(slug: string): GuideMeta | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
