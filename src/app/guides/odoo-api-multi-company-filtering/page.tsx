import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "odoo-api-multi-company-filtering";
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
        { href: "/guides/odoo-api-integration-explained", label: "How Odoo's API actually works" },
        { href: "/guides/odoo-rest-api-explained", label: "Odoo REST API: what it can and can't do" },
        { href: "/odoo-api-development", label: "Odoo API development" },
      ]}
    >
      <GuideSection heading="What's the actual gotcha here?">
        <p>
          A recurring one, documented across plenty of Odoo community forum
          threads: when you call Odoo&apos;s external API (XML-RPC or
          JSON-RPC) as a user who has access to multiple companies, a query
          can quietly return records from every company that user is allowed
          to see, not just the one company your integration meant to query.
          It doesn&apos;t throw an error or warn you; the call just succeeds and
          hands back more data than intended.
        </p>
      </GuideSection>

      <GuideSection heading="Why does this happen at all?">
        <p>
          Because company scoping in Odoo isn&apos;t automatically inferred
          from &quot;which company does this record belong to&quot; on every read; it&apos;s
          governed by context. A multi-company user&apos;s session context
          determines which companies&apos; records are visible to them at all,
          and unless a request explicitly narrows that further, an API call
          runs with the same broad visibility that user would have anywhere
          else in Odoo. It&apos;s consistent with how Odoo&apos;s access rules work
          generally, but it&apos;s easy to overlook if you&apos;re assuming an API
          call for &quot;this company&apos;s sales orders&quot; is automatically scoped
          that way by default.
        </p>
      </GuideSection>

      <GuideSection heading="How do you actually scope a request to one company?">
        <p>
          Two real, complementary mechanisms. One is passing the{" "}
          <code>allowed_company_ids</code> context key on the call, which
          constrains which companies&apos; records the request can see for that
          specific call. The other is adding an explicit domain filter on
          the <code>company_id</code> field of the model you&apos;re querying,
          so the query itself states which company&apos;s records it wants
          rather than relying on ambient context. Using an explicit domain
          filter on <code>company_id</code> is generally the more defensive
          of the two, since it makes the intended scope part of the query
          itself rather than something set elsewhere and easy to forget.
        </p>
      </GuideSection>

      <GuideSection heading="Why is this easy to miss in a one-off script?">
        <p>
          Because it often works perfectly fine in testing. If the user
          credentials used during development only have access to one
          company, or the test data doesn&apos;t have overlapping records across
          companies, an unscoped query returns exactly what you expect, and
          the missing company filter never surfaces as a bug until the
          integration runs against a real multi-company account or a
          second company is added to the setup later.
        </p>
      </GuideSection>

      <GuideSection heading="What's the actual risk if it's missed?">
        <p>
          Data leaking across company boundaries inside your own
          integration: a dashboard showing figures blended across companies
          that should have stayed separate, a report meant for one entity
          quietly including another&apos;s orders or invoices, or a write-back
          action operating against the wrong company&apos;s records entirely.
          For a multi-company business, that&apos;s not a cosmetic bug; it can
          mean genuinely incorrect numbers being acted on.
        </p>
      </GuideSection>

      <GuideSection heading="Why does this matter for a properly built app versus a quick script?">
        <p>
          Because it&apos;s exactly the kind of small, easy-to-skip detail that
          a one-off integration script written quickly is likely to miss,
          and that a properly scoped, tested app is built to get right from
          the start. If your Odoo setup involves more than one company at
          all, this is worth confirming explicitly for every model any
          integration touches, rather than assuming the default behavior
          already does the right thing.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
