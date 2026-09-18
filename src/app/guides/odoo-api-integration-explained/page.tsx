import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "odoo-api-integration-explained";
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
        { href: "/odoo-api-development", label: "Odoo API development" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
        { href: "/guides/what-happens-when-odoo-upgrades", label: "What happens to a custom app when Odoo upgrades?" },
      ]}
    >
      <GuideSection heading="What protocols does Odoo's API actually use?">
        <p>
          Odoo exposes its external API over two RPC protocols: XML-RPC and
          JSON-RPC. They&apos;re not two different feature sets — both are
          transport-layer options for calling the exact same underlying
          methods on Odoo&apos;s ORM. Which one a given integration uses is
          mostly a matter of what&apos;s convenient in the calling language;
          most modern client libraries default to JSON-RPC simply because
          JSON tooling is more universally available than XML-RPC tooling.
        </p>
      </GuideSection>

      <GuideSection heading="How does authentication work?">
        <p>
          A client authenticates with a database name, a login, and either
          a password or an API key generated from that user&apos;s own Odoo
          preferences (the API-key option, available on modern Odoo
          versions, is the safer choice for integrations since it can be
          revoked independently of the user&apos;s login password). A successful
          authentication returns a user id, which is then passed alongside
          the database name on every subsequent call.
        </p>
      </GuideSection>

      <GuideSection heading="What can you actually call once authenticated?">
        <p>
          Nearly everything the ORM itself supports, through a single
          generic dispatch method (commonly called <code>execute_kw</code>)
          that takes a model name, a method name, and its arguments.
          Standard CRUD methods are always available —{" "}
          <code>search</code>, <code>search_read</code>, <code>read</code>,{" "}
          <code>create</code>, <code>write</code>, <code>unlink</code> — and
          so is any other public method defined on that model, including
          business-logic methods like confirming a sales order or
          validating a stock transfer, which matters because those methods
          run the same side effects (state changes, related record updates)
          that clicking the equivalent button in Odoo&apos;s own interface would
          trigger.
        </p>
      </GuideSection>

      <GuideSection heading="What does a typical call actually look like?">
        <p>
          Reading data is usually done with <code>search_read</code>, which
          takes a domain (a list of filter conditions, like{" "}
          <code>[[&quot;state&quot;, &quot;=&quot;, &quot;sale&quot;]]</code>)
          and a list of fields to return, combining what would otherwise be
          a separate search-then-read round trip into one call. Aggregated
          numbers (totals, counts grouped by a field) generally go through{" "}
          <code>read_group</code> instead of pulling every record back and
          summing client-side. Writing data is a <code>create</code> or{" "}
          <code>write</code> call with a dictionary of field values, or a
          call to a specific method when the change needs to trigger Odoo&apos;s
          own business logic rather than just set a field.
        </p>
      </GuideSection>

      <GuideSection heading="Does the API respect Odoo's normal permissions?">
        <p>
          Yes, entirely. Every call runs as the authenticated user, subject
          to that user&apos;s model-level access rights and row-level record
          rules exactly as if they were logged into the Odoo web client.
          There&apos;s no separate, more permissive &quot;API mode&quot; — which is also
          why the right way to scope an integration is a dedicated API user
          with only the access it needs, not the main admin account.
        </p>
      </GuideSection>

      <GuideSection heading="What are the practical gotchas worth knowing up front?">
        <p>
          A few things trip up integrations that weren&apos;t built with Odoo&apos;s
          specifics in mind: many2one fields come back as a two-item list (
          <code>[id, display_name]</code>) rather than a plain id; all
          datetimes are stored and returned in UTC regardless of the
          user&apos;s timezone, so conversion is the caller&apos;s job; and calling{" "}
          <code>search</code> in a loop followed by individual{" "}
          <code>read</code> calls per record (&quot;N+1&quot; calls) is a common,
          avoidable performance mistake when <code>search_read</code> would
          do it in one round trip. Field names and available methods can
          also shift slightly between major Odoo versions, which is worth
          knowing before assuming an integration will need zero maintenance
          forever — see the guide on Odoo upgrades linked below.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
