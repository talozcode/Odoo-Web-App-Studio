import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-api-integration-explained";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/odoo-api-development", label: "Odoo API development" },
        { href: "/guides/odoo-rest-api-explained", label: "Odoo REST API: what it can (and can't) do" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
        { href: "/guides/what-happens-when-odoo-upgrades", label: "What happens to a custom app when Odoo upgrades?" },
        { href: "/guides/odoo-api-errors", label: "What each Odoo API error means" },
      ]}
    >
      <GuideSection heading="What protocols does Odoo's API actually use?">
        <p>
          Three, depending on the version. Odoo 16, 17 and 18 expose the
          external API over two RPC protocols, XML-RPC (at{" "}
          <code>/xmlrpc/2/object</code>) and JSON-RPC (at{" "}
          <code>/jsonrpc</code>). They are not two feature sets; both are
          transports for calling the same ORM methods through one generic
          dispatcher, <code>execute_kw</code>. Odoo 19 adds a third, JSON-2:
          a plain HTTP API where you <code>POST</code> a JSON body to{" "}
          <code>/json/2/&lt;model&gt;/&lt;method&gt;</code>. The RPC
          endpoints still work on 19 but are deprecated and scheduled for
          removal in Odoo 22 (fall 2028). New integrations on Odoo 19 should
          use JSON-2; on older versions, JSON-RPC is the easier of the two
          to debug.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-[13px] leading-6 text-[var(--foreground)]">{`# Odoo 19, JSON-2
POST /json/2/sale.order/search_read
Authorization: bearer <api key>
Content-Type: application/json
{"domain": [["state", "=", "sale"]], "fields": ["name", "amount_total"], "limit": 5}

# Odoo 16 to 18 (and still 19), JSON-RPC
POST /jsonrpc
{"jsonrpc": "2.0", "method": "call", "params": {"service": "object", "method": "execute_kw",
 "args": ["<db>", <uid>, "<api key>", "sale.order", "search_read",
          [[["state", "=", "sale"]]], {"fields": ["name", "amount_total"], "limit": 5}]}}`}</pre>
      </GuideSection>

      <GuideSection heading="How does authentication work?">
        <p>
          With JSON-2 the API key goes in an{" "}
          <code>Authorization: bearer</code> header on every request; there
          is no login step and no user id to pass. The key is created from
          the user&apos;s Preferences under Account Security, and Odoo 19 caps
          its lifetime at three months, so a production integration needs a
          rotation routine (keys can also be generated programmatically
          through <code>res.users.apikeys/generate</code>). With the RPC
          protocols a client first calls <code>authenticate</code> with the
          database name, login and either a password or an API key, gets a
          user id back, and passes the database, user id and key on every
          call after that. In both cases the API key is the safer choice
          over a password: it can be revoked on its own and scoped to RPC
          use only. On Odoo Online, note that the external API is only
          available on the Custom plan.
        </p>
      </GuideSection>

      <GuideSection heading="What can you actually call once authenticated?">
        <p>
          Nearly everything the ORM itself supports, through a single
          generic dispatch method (commonly called <code>execute_kw</code>)
          that takes a model name, a method name, and its arguments.
          Standard CRUD methods are always available:{" "}
          <code>search</code>, <code>search_read</code>, <code>read</code>,{" "}
          <code>create</code>, <code>write</code>, <code>unlink</code>, and
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
          There&apos;s no separate, more permissive &quot;API mode,&quot; which is also
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
          forever. See the guide on Odoo upgrades linked below.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
