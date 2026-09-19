import type { Metadata } from "next";
import { UseCasePageTemplate } from "@/components/seo/use-case-page";
import { CustomWorkflowPreview } from "@/components/demo-apps/custom-workflow-preview";
import { EXAMPLE_APPS } from "@/config/examples";
import { serviceSchema } from "@/lib/schema";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "custom-odoo-web-app";
const CANONICAL_URL = `${SITE_URL}/${SLUG}`;
const APP = EXAMPLE_APPS.find((a) => a.id === "custom-workflow")!;

export const metadata: Metadata = {
  title: `Custom Odoo Web App for Your Specific Workflow | ${BRAND_NAME}`,
  description:
    "A small, focused web app built around the one Odoo-connected workflow that doesn't fit warehouse, sales, dashboard, or portal templates. Pricing and scope inside.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Custom Odoo Web App for Your Specific Workflow",
    description:
      "A small, focused web app built around the one Odoo-connected workflow that doesn't fit a template.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const FAQS = [
  {
    question: "What if I'm not sure exactly what I want yet?",
    answer:
      "That's normal, and it's the starting point of most custom-workflow projects. Describing the problem (what's slow, what's manual, what people currently work around with a spreadsheet or a notebook) is usually enough to start scoping the actual screen and the actual Odoo model behind it.",
  },
  {
    question: "Can it read and write to Odoo?",
    answer:
      "Yes, either or both, depending on the workflow. An approval screen typically writes a decision back (approve/reject); a lookup tool might only read. Which one applies is usually obvious once the workflow itself is defined.",
  },
  {
    question: "What's explicitly out of scope for a 'custom workflow' app?",
    answer:
      "Rebuilding functionality Odoo already does well: a second inventory system, a parallel accounting ledger, a general-purpose form builder. If a request starts looking like it wants to become its own small ERP module, the honest answer is usually that it belongs inside Odoo itself (as configuration, or a proper Odoo module), not as an external app.",
  },
  {
    question: "Can a small custom app grow into something bigger later?",
    answer:
      "Often, yes. A lot of the other five example apps on this site started conceptually as \"just one screen for one workflow.\" If a custom app's scope keeps growing, that's a sign to revisit which category it actually belongs in (warehouse, sales, dashboard, portal) rather than to keep bolting features onto a one-screen tool.",
  },
];

export default function CustomOdooWebAppPage() {
  return (
    <UseCasePageTemplate
      breadcrumbLabel="Custom Odoo Web App"
      eyebrow="Custom Workflow"
      h1="A custom web app for your specific Odoo workflow"
      intro="Not every workflow fits neatly into warehouse picking, sales ordering, a dashboard, or a portal. Expense approvals, delivery driver confirmations, a quality inspection checklist, a one-off data cleanup tool: these are all real, common requests, and they usually share the same shape: one clear input, one clear action, one clear result."
      demo={<CustomWorkflowPreview />}
      demoCaption="Interactive demo: a sample expense approval screen."
      canonicalUrl={CANONICAL_URL}
      priceFrom={APP.priceFrom}
      priceNote="Starting price for a single-screen workflow touching one Odoo model. This is intentionally the lowest starting price of the six examples, since scope here is naturally the smallest. It grows from there based on what the workflow actually needs."
      extraJsonLd={[serviceSchema(APP, CANONICAL_URL)]}
      faqs={FAQS}
      sections={[
        {
          heading: "How a custom workflow app is scoped",
          body: (
            <p>
              The first step is identifying which Odoo model (or models) the
              workflow actually touches: it might be a standard one like{" "}
              <code>hr.expense</code>, or a custom field added to an existing
              model like <code>stock.picking</code>. From there, the goal is
              defining one clear loop: what triggers the screen, what
              decision or data entry happens on it, and what changes in
              Odoo as a result. Once that loop is agreed, the build is
              usually the smallest of the six example categories: there&apos;s
              deliberately no navigation, no settings, no second screen
              unless the workflow genuinely needs one.
            </p>
          ),
        },
        {
          heading: "What tends to work well as a custom app",
          body: (
            <>
              <p>
                Approval screens, single-purpose data entry, and
                notification-driven small actions are the strongest fit:
                anywhere a specific person needs to do one specific thing
                against Odoo data, faster or on a device Odoo&apos;s own
                interface isn&apos;t well suited to.
              </p>
              <p>
                What doesn&apos;t fit is reproducing broad ERP functionality.
                Odoo already does everything a business generally needs:
                accounting, inventory, sales, purchasing, manufacturing,
                master data. The apps worth building sit around that core,
                not inside it.
              </p>
            </>
          ),
        },
        {
          heading: "Typical scope and timeline",
          body: (
            <p>
              Because the scope here is by definition one focused workflow,
              this is usually the fastest of the six categories to build a
              first working version of, and the starting price reflects
              that. If a &quot;custom workflow&quot; conversation reveals
              something closer to a full portal or dashboard, that&apos;s
              flagged honestly rather than quoted as if it were a one-screen
              build.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: "/guides/odoo-customization-vs-custom-apps", label: "Odoo customization vs. custom apps" },
        { href: "/guides/signs-your-team-needs-a-simpler-odoo-interface", label: "Signs your team needs a simpler interface" },
        { href: "/guides/how-much-does-a-custom-odoo-app-cost", label: "How much does a custom Odoo app cost?" },
      ]}
    />
  );
}
