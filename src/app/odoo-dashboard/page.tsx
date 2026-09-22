import type { Metadata } from "next";
import { UseCasePageTemplate } from "@/components/seo/use-case-page";
import { DashboardDemo } from "@/components/demo-apps/dashboard-demo";
import { EXAMPLE_APPS } from "@/config/examples";
import { serviceSchema } from "@/lib/schema";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "odoo-dashboard";
const CANONICAL_URL = `${SITE_URL}/${SLUG}`;
const APP = EXAMPLE_APPS.find((a) => a.id === "management-dashboard")!;

export const metadata: Metadata = {
  title: `Odoo Management Dashboard: The Numbers That Matter | ${BRAND_NAME}`,
  description:
    "A focused management dashboard pulling live sales, margin, inventory and purchasing numbers from Odoo. Read-only, no risk to your data. Pricing and scope inside.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Odoo Management Dashboard: The Numbers That Matter",
    description:
      "A focused management dashboard pulling live sales, margin, inventory and purchasing numbers from Odoo.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const FAQS = [
  {
    question: "Does this need write access to Odoo?",
    answer:
      "No. A management dashboard is a read-only integration: it queries Odoo for data and displays it, and never creates or changes records. That makes it lower-risk to build and easier to reason about than an app that writes back.",
  },
  {
    question: "How often does the data refresh?",
    answer:
      "That's a scoping choice. Some dashboards query Odoo live on every page load; others refresh on a schedule (every few minutes, or hourly) to keep load on the Odoo server predictable. For most \"check it a few times a day\" dashboards, a short refresh interval is indistinguishable from live.",
  },
  {
    question: "Can I put this on a shared screen or TV in the office?",
    answer:
      "Yes, a dashboard built this way is just a web page, so it can run full-screen on a browser on any TV or tablet, auto-refreshing on its own schedule with no one needing to touch it.",
  },
  {
    question: "What if I want to add another metric later?",
    answer:
      "Adding a metric that's already a standard Odoo field or report is usually a small, contained change, since the dashboard already has the data-fetching plumbing in place. A metric that requires new custom logic or a new Odoo field is scoped like any other addition.",
  },
];

export default function OdooDashboardPage() {
  return (
    <UseCasePageTemplate
      breadcrumbLabel="Odoo Dashboard"
      h1="A dashboard with the numbers you actually check"
      intro="Odoo's reporting tools (pivot tables, generic dashboards, spreadsheet exports) can answer almost any question, which is exactly why they're not built to answer one question fast. A focused dashboard skips the navigation and filters and shows the handful of numbers a specific manager actually looks at every day."
      demo={<DashboardDemo />}
      demoCaption="Interactive demo: a sample weekly management view."
      canonicalUrl={CANONICAL_URL}
      priceFrom={APP.priceFrom}
      priceNote="Starting price for a single-screen dashboard covering a handful of metrics from one or two Odoo modules. More metrics, multiple views, or role-based access are scoped separately."
      extraJsonLd={[serviceSchema(APP, CANONICAL_URL)]}
      faqs={FAQS}
      sections={[
        {
          heading: "How it pulls data from Odoo",
          body: (
            <>
              <p>
                A dashboard like this reads from the same models Odoo&apos;s
                own reporting uses: sales analysis (<code>sale.report</code>
                ), on-hand stock (<code>stock.quant</code>), open purchase
                orders (<code>purchase.order</code>), invoiced revenue (
                <code>account.move</code>), using Odoo&apos;s search and
                aggregation methods (<code>search_read</code>,{" "}
                <code>read_group</code>) rather than duplicating that data
                anywhere.
              </p>
              <p>
                The aggregation and layout (this week&apos;s sales next to
                margin next to open POs) happens in the dashboard itself,
                so the numbers can be arranged exactly the way a specific
                manager thinks about the business, instead of however
                Odoo&apos;s generic dashboard widgets happen to group them.
              </p>
            </>
          ),
        },
        {
          heading: "What changes for management",
          body: (
            <p>
              Instead of opening three different Odoo apps and applying
              filters to answer &quot;how&apos;s this week going,&quot; the
              answer is one glance. That matters most for numbers checked
              daily or multiple times a day: the small friction of
              navigating Odoo&apos;s full interface adds up, and often means
              the check happens less often than it should.
            </p>
          ),
        },
        {
          heading: "Typical scope and timeline",
          body: (
            <p>
              A first version (four to six KPIs, one refresh cadence, one
              audience) is what the starting price below reflects. Dashboards
              with role-based views (a warehouse manager sees different
              numbers than a sales manager), drill-down into underlying
              records, or metrics that require custom calculation logic
              beyond what Odoo already computes are scoped based on which of
              those apply.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: "/odoo-sales-app", label: "Feed it from a mobile sales app" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
        { href: "/guides/odoo-api-integration-explained", label: "How Odoo's API actually works" },
      ]}
    />
  );
}
