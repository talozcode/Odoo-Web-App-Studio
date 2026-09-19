import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { PRICING_TIERS } from "@/config/pricing";
import { EXAMPLE_APPS } from "@/config/examples";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "odoo-implementation-partner-cost";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = {
  title: `${meta.title} | ${BRAND_NAME}`,
  description: meta.description,
  alternates: { canonical: `${SITE_URL}/guides/${SLUG}` },
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: `${SITE_URL}/guides/${SLUG}`,
    type: "article",
  },
};

function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export default function Guide() {
  const tinyTier = PRICING_TIERS.find((t) => t.id === "tiny")!;
  const appTier = PRICING_TIERS.find((t) => t.id === "app")!;
  const workflowPrice = formatPrice(
    EXAMPLE_APPS.find((a) => a.id === "custom-workflow")!.priceFrom
  );

  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/guides/odoo-developer-vs-web-app-studio", label: "Odoo developer vs. web app studio" },
        { href: "/guides/how-much-does-a-custom-odoo-app-cost", label: "How much does a custom Odoo app cost?" },
        { href: "/#pricing", label: "Pricing" },
      ]}
    >
      <GuideSection heading="What does a full Odoo implementation partner actually cost?">
        <p>
          Honestly, it varies enormously, and anyone quoting one precise
          number without knowing your scope is guessing. A small,
          single-module deployment for a small business can start in the
          low thousands of dollars. A larger rollout spanning multiple
          modules (Sales, Inventory, Accounting, Manufacturing) across a
          multi-location or multi-company business, with data migration,
          staff training, and ongoing support, can run well into five or
          six figures. The range is wide because &quot;implementation&quot; covers
          fundamentally different amounts of work depending on how many
          modules are involved and how much of the business it touches.
        </p>
      </GuideSection>

      <GuideSection heading="What is a full implementation actually doing, that justifies that cost?">
        <p>
          A real, substantial job: configuring Odoo&apos;s modules to match how
          the business actually operates, migrating existing data in,
          setting up the chart of accounts and multi-company structure if
          relevant, training staff across departments, and being available
          to fix configuration issues as the business starts relying on the
          new system day to day. That&apos;s a genuinely different scope of work
          than building one small app, and it&apos;s a legitimate, different job
          done by people who specialize in it.
        </p>
      </GuideSection>

      <GuideSection heading="When does a full implementation engagement make sense?">
        <p>
          When Odoo itself needs to be set up, configured, or substantially
          reworked across multiple modules: a new deployment from scratch, a
          business restructuring how several departments use Odoo together,
          or a migration where the underlying data model and processes are
          changing, not just one screen. If the actual need touches how
          Sales, Inventory, and Accounting all work together, that&apos;s
          implementation-partner territory, and trying to solve it with a
          single small app would be the wrong tool.
        </p>
      </GuideSection>

      <GuideSection heading="When is a full re-implementation the wrong tool instead?">
        <p>
          When the Odoo setup underneath already works, and the actual pain
          point is narrow: one workflow, one screen, one specific need that
          isn&apos;t being served well by Odoo&apos;s existing interface. Re-opening
          a full implementation engagement to fix one workflow is overkill
          in both cost and disruption; it re-touches parts of a working
          system that didn&apos;t need to change, for the sake of the one part
          that did.
        </p>
      </GuideSection>

      <GuideSection heading="What does the right-sized fix look like instead?">
        <p>
          A small connected app built for that one workflow, on top of the
          Odoo setup you already have. On this site specifically, that
          starts at {tinyTier.price} for a single focused workflow (an
          approval screen, a simple report, a small data entry tool), or
          typically {appTier.price} for a fuller, polished multi-screen app
          built around one workflow. As a concrete anchor, the smallest
          &quot;tell us the workflow you wish were easier&quot; build starts at{" "}
          {workflowPrice}. None of that replaces or competes with a real
          implementation; it&apos;s simply a different, smaller-scoped fix for a
          different, smaller-scoped problem.
        </p>
      </GuideSection>

      <GuideSection heading="How do you actually tell which one you need?">
        <p>
          Ask whether the problem is &quot;Odoo isn&apos;t set up right for us&quot; or
          &quot;Odoo is set up fine, but this one thing is painful.&quot; The first
          question points to an implementation partner: the underlying
          configuration itself needs work. The second points to a small
          connected app: the foundation is sound, and only the interface for
          one specific workflow needs to change. Most businesses that
          already have a working Odoo instance and one recurring point of
          friction fall into the second category, even though it can feel,
          from the inside, like it might need a bigger project than it
          actually does.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
