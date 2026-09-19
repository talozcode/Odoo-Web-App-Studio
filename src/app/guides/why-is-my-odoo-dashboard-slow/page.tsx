import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "why-is-my-odoo-dashboard-slow";
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

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/odoo-dashboard", label: "Odoo management dashboard" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
        { href: "/guides/how-much-does-a-custom-odoo-app-cost", label: "How much does a custom Odoo app cost?" },
      ]}
    >
      <GuideSection heading="What's actually going on when an Odoo dashboard feels slow?">
        <p>
          Odoo&apos;s database is built and tuned for transactional work: create
          one sales order, update one stock quant, save one invoice, quickly
          and reliably, over and over. A dashboard or KPI report asks a very
          different kind of question: not &quot;give me this one record,&quot; but
          &quot;aggregate a large number of records, possibly across several
          modules, into a summary number.&quot; Those are genuinely different
          workloads, and a database optimized for the first doesn&apos;t
          automatically handle the second at the same speed, especially as
          the amount of data grows.
        </p>
      </GuideSection>

      <GuideSection heading="Why does it get worse specifically with cross-module reports?">
        <p>
          Because pulling one number that depends on Sales, Inventory, and
          Accounting all agreeing (say, real margin per order) usually means
          joining and aggregating across several of Odoo&apos;s underlying
          tables at once, computed live, inside the same transactional
          database that&apos;s also handling everyone&apos;s day-to-day record
          creation. A report view built to do that inside Odoo&apos;s own UI
          reruns that aggregation live, on demand, which is exactly the kind
          of query that gets slower as the number of underlying records
          grows.
        </p>
      </GuideSection>

      <GuideSection heading="Is this an Odoo problem specifically, or would any system have it?">
        <p>
          It&apos;s a general database pattern, not a flaw unique to Odoo:
          transactional databases everywhere face this same tension between
          fast individual writes and fast broad aggregation. Odoo isn&apos;t
          doing anything wrong by prioritizing the former; it&apos;s simply that
          a live, ad hoc, cross-module report is a heavier kind of query
          than the system was primarily built to make fast.
        </p>
      </GuideSection>

      <GuideSection heading="How does a standalone dashboard app sidestep this?">
        <p>
          By not asking Odoo to do that heavy aggregation live, on every
          page load, inside its own transactional UI. A standalone read-only
          dashboard can instead fetch only the specific aggregated numbers it
          actually needs, on a schedule (say, refreshed every few minutes or
          hourly rather than recalculated on every view) or through a
          lightweight caching layer that holds the last computed result.
          The dashboard itself then just displays fast-to-read cached
          numbers, rather than triggering the expensive cross-module query
          every time someone opens it.
        </p>
      </GuideSection>

      <GuideSection heading="Does this fix Odoo's performance in general?">
        <p>
          No, and it&apos;s worth being precise about the boundary. This
          approach addresses reporting and dashboard slowness specifically:
          the pattern of heavy, cross-module aggregation being requested
          live. It does nothing for general Odoo slowness caused by other
          things entirely, like undersized server resources, an
          overloaded database instance, or an unrelated performance issue
          elsewhere in the system. If day-to-day Odoo itself (creating an
          order, opening a normal form) feels slow, that&apos;s a different
          problem with a different fix, not something a standalone dashboard
          addresses.
        </p>
      </GuideSection>

      <GuideSection heading="How do you tell if this is actually your situation?">
        <p>
          If normal day-to-day Odoo use feels fine, but a specific report or
          dashboard view is the slow part, especially one that pulls from
          multiple modules or a large date range, that matches this pattern
          well. If everything in Odoo feels sluggish, including simple
          single-record actions, that points to a different root cause (server
          sizing, database load, network) that a standalone dashboard won&apos;t
          fix on its own, even though it might still be worth building for
          the reporting slice of the problem.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
