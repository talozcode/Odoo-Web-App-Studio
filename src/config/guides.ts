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
  /** Topic group, used to section the guides index. */
  topic: GuideTopic;
};

export type GuideTopic = "api" | "cost" | "build" | "apps" | "adoption";

/** Display order and labels for the guides index. */
export const GUIDE_TOPICS: { id: GuideTopic; label: string; blurb: string }[] = [
  { id: "api", label: "Connecting to Odoo", blurb: "How Odoo's API works, which one your version has, and what it means for an integration." },
  { id: "cost", label: "Cost and hiring", blurb: "What things actually cost, and who to hire for which kind of work." },
  { id: "build", label: "Build, customize or configure", blurb: "When a change belongs inside Odoo, and when it belongs in an app next to it." },
  { id: "apps", label: "Apps and portals", blurb: "The specific builds people ask for most: picking, portals, dashboards, approvals." },
  { id: "adoption", label: "When Odoo is the problem", blurb: "Signals that a team needs a simpler interface rather than more training." },
];

export const GUIDES: GuideMeta[] = [
  {
    slug: "odoo-api-errors",
    topic: "api",
    title: "Odoo API errors: what each one actually means",
    seoTitle: "Odoo API Errors: Access Denied, 401, AccessError",
    description:
      "Access Denied, Invalid apikey, AccessError, 403, 404 and 422 from Odoo's external API, what each one is really telling you, and how to tell an authentication problem from a permissions problem before you change any code.",
    datePublished: "2026-09-23",
  },
  {
    slug: "odoo-api-examples-python-javascript",
    topic: "api",
    title: "Odoo API examples: what a call looks like, and what takes the time",
    seoTitle: "Odoo API Examples: Python, JavaScript, curl",
    description:
      "What an Odoo API call looks like in JSON-2, JSON-RPC and XML-RPC, which transport your version needs, and why the calls are the easy part: access rights, write-back safety, speed and staying working are the real project.",
    datePublished: "2026-09-22",
  },
  {
    slug: "odoo-19-json-2-api",
    topic: "api",
    title: "Odoo 19's JSON-2 API: what changed, and what to do about XML-RPC",
    seoTitle: "Odoo 19 JSON-2 API: What Changed",
    description:
      "Odoo 19 added an HTTP JSON API at /json/2/<model>/<method> with bearer API keys, and scheduled XML-RPC and JSON-RPC for removal in Odoo 22. The request shape, the plan gate, key rotation, the one-call-one-transaction rule and a migration table.",
    datePublished: "2026-09-22",
  },
  {
    slug: "odoo-api-key-setup",
    topic: "api",
    title: "Odoo API keys: how to create, scope and rotate them",
    seoTitle: "Odoo API Key: Create, Scope and Rotate",
    description:
      "Where to generate an Odoo API key, how it is sent on JSON-2 versus XML-RPC, the three-month limit in Odoo 19, which user should hold it, and the six reasons a key usually fails.",
    datePublished: "2026-09-22",
  },
  {
    slug: "odoo-customization-vs-custom-apps",
    topic: "build",
    title: "Odoo customization vs a custom web app: what's the difference?",
    seoTitle: "Odoo Customization vs Custom Web App",
    description:
      "How in-Odoo customization (views, studio, custom modules) differs from building a separate web app against Odoo's API, and how to tell which one a given problem actually needs.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-api-integration-explained",
    topic: "api",
    title: "How Odoo's API actually works (JSON-2, JSON-RPC, XML-RPC and the ORM)",
    seoTitle: "Odoo API Integration: XML-RPC, JSON-RPC, JSON-2",
    description:
      "A practical explanation of Odoo's external API: JSON-2 on Odoo 19, JSON-RPC and XML-RPC before it, API-key authentication, and the ORM methods (search_read, create, write) a custom app calls.",
    datePublished: "2026-09-18",
    dateModified: "2026-09-22",
  },
  {
    slug: "what-happens-when-odoo-upgrades",
    topic: "build",
    title: "What happens to a custom app when Odoo upgrades?",
    seoTitle: "Odoo Upgrades and Custom Apps: What Breaks",
    description:
      "Why a separate web app is affected differently by an Odoo version upgrade than in-Odoo customizations are, and what actually needs to be checked when Odoo moves versions.",
    datePublished: "2026-09-18",
    dateModified: "2026-09-22",
  },
  {
    slug: "how-much-does-a-custom-odoo-app-cost",
    topic: "cost",
    title: "How much does a custom Odoo app cost?",
    seoTitle: "Custom Odoo App Cost: Real Prices",
    description:
      "A grounded look at what drives the price of a small Odoo-connected app, with real ranges instead of vague 'contact us for pricing.'",
    datePublished: "2026-09-18",
  },
  {
    slug: "signs-your-team-needs-a-simpler-odoo-interface",
    topic: "adoption",
    title: "Signs your team needs a simpler interface than Odoo's backend",
    seoTitle: "Odoo Too Complicated? Signs You Need a Simpler UI",
    description:
      "Practical signals, from workarounds on paper to reluctant adoption, that indicate a workflow would benefit from a focused front end instead of more Odoo training.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-write-back-vs-read-only-integrations",
    topic: "api",
    title: "Read-only vs write-back Odoo integrations: which do you need?",
    seoTitle: "Read-Only vs Write-Back Odoo Integrations",
    description:
      "The difference between an app that only displays Odoo data and one that creates or updates records in Odoo, and why that distinction changes scope, risk and cost.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-rest-api-explained",
    topic: "api",
    title: "Odoo REST API: what exists in Odoo 19, and what came before",
    seoTitle: "Odoo REST API: JSON-2, JSON-RPC and XML-RPC",
    description:
      "Odoo 19 has an HTTP JSON API (JSON-2) with bearer API keys; older versions only have XML-RPC and JSON-RPC, deprecated for removal in Odoo 22. What each looks like and which to use.",
    datePublished: "2026-09-18",
    dateModified: "2026-09-22",
  },
  {
    slug: "odoo-barcode-app-buy-or-build",
    topic: "apps",
    title: "Odoo barcode app: use Odoo's, or build a custom one?",
    seoTitle: "Odoo Barcode App: Use Odoo's or Build Custom",
    description:
      "Odoo's own Barcode app is genuinely capable. An honest look at when it's enough and when a narrower custom picking app makes more sense.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-customer-self-service-portal",
    topic: "apps",
    title: "How to give customers a self-service portal without rebuilding Odoo's frontend",
    seoTitle: "Odoo Customer Portal: Built-in vs Custom",
    description:
      "The difference between Odoo's built-in customer portal and a fully custom-branded ordering portal, and how to tell which one a given business actually needs.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-developer-vs-web-app-studio",
    topic: "cost",
    title: "Hiring an Odoo developer vs a web app studio: what's the difference?",
    seoTitle: "Hire an Odoo Developer or a Web App Studio?",
    description:
      "An honest, even-handed comparison of when an Odoo developer or implementation partner is the right call, and when a narrow web app studio is the better fit instead.",
    datePublished: "2026-09-18",
  },
  {
    slug: "odoo-studio-limitations",
    topic: "build",
    title: "Odoo Studio can't do this: where the no-code builder hits a wall",
    seoTitle: "Odoo Studio Limitations: What It Can't Do",
    description:
      "What Odoo Studio is genuinely good at, where its no-code approach hits real limits, and when a workflow needs a different kind of interface entirely.",
    datePublished: "2026-09-19",
  },
  {
    slug: "odoo-implementation-partner-cost",
    topic: "cost",
    title: "Odoo implementation partner cost, and when you don't need one",
    seoTitle: "Odoo Implementation Partner Cost",
    description:
      "Honest, hedged ranges for what a full Odoo implementation typically costs, and how to tell whether your actual problem needs one or just a single connected app.",
    datePublished: "2026-09-19",
  },
  {
    slug: "why-is-my-odoo-dashboard-slow",
    topic: "apps",
    title: "Why your Odoo dashboard is slow, and when a standalone one fixes it",
    seoTitle: "Why Your Odoo Dashboard Is Slow",
    description:
      "The real technical reason cross-module Odoo dashboards and reports can be slow, and how a standalone read-only dashboard app sidesteps that specific problem.",
    datePublished: "2026-09-19",
  },
  {
    slug: "odoo-purchase-approval-mobile-app",
    topic: "apps",
    title: "Purchase approvals stuck in Odoo's backend? A simple mobile approve or reject app",
    seoTitle: "Odoo Purchase Approval App for Mobile",
    description:
      "Why purchase order approvals bottleneck when managers are away from a desktop, and how a minimal mobile approve/reject screen writes decisions straight back to Odoo.",
    datePublished: "2026-09-19",
  },
  {
    slug: "odoo-api-multi-company-filtering",
    topic: "api",
    title: "Why your Odoo API call returns data from the wrong company",
    seoTitle: "Odoo API Multi-Company Filtering",
    description:
      "A recurring multi-company Odoo API gotcha: queries can return records across every company a user can access unless the request explicitly scopes company context.",
    datePublished: "2026-09-19",
  },
  {
    slug: "why-sales-reps-dont-use-odoo-mobile",
    topic: "adoption",
    title: "Reps won't use Odoo on their phones? Build the three screens they actually need",
    seoTitle: "Odoo Mobile Sales App: Why Reps Don't Use Odoo",
    description:
      "Why desktop-first CRM/Sales interfaces see low adoption from field reps on phones, and why a narrow 3-screen order flow written back to Odoo works better.",
    datePublished: "2026-09-19",
  },
];

export function guideBySlug(slug: string): GuideMeta | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
