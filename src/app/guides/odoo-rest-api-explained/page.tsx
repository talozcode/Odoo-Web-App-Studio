import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-rest-api-explained";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/guides/odoo-api-integration-explained", label: "How Odoo's API actually works" },
        { href: "/odoo-api-development", label: "Odoo API development" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
        { href: "/guides/odoo-api-errors", label: "What each Odoo API error means" },
      ]}
    >
      <GuideSection heading="Does Odoo actually have a REST API?">
        <p>
          Since Odoo 19, yes: a plain HTTP JSON API that Odoo calls JSON-2.
          You <code>POST</code> a JSON body to{" "}
          <code>/json/2/&lt;model&gt;/&lt;method&gt;</code> with an{" "}
          <code>Authorization: bearer &lt;api key&gt;</code> header and get
          the method&apos;s return value back as JSON, with normal HTTP status
          codes for errors. Before Odoo 19 the answer was no: the external
          API was only exposed over two RPC protocols, XML-RPC and JSON-RPC,
          which call the same ORM methods through a single generic{" "}
          <code>execute_kw</code> dispatcher. Those RPC endpoints still work
          on Odoo 19 but are officially deprecated, with removal scheduled
          for Odoo 22 in fall 2028.
        </p>
        <p>
          Two things people miss when they read &quot;REST&quot;: JSON-2 is
          still organised around model methods, not resource URLs (there is
          no <code>GET /api/sale.order/42</code>; you call{" "}
          <code>/json/2/sale.order/read</code> with an id list), and on Odoo
          Online the external API, JSON-2 included, is only available on the
          Custom plan, not on One App Free or Standard. Self-hosted and
          Odoo.sh databases are not limited that way.
        </p>
      </GuideSection>

      <GuideSection heading="What does a JSON-2 call look like?">
        <p>
          One request per method call. The URL names the model and method,
          the body carries the arguments as named JSON fields, and{" "}
          <code>ids</code> carries the records to act on (empty or omitted
          for model-level methods such as <code>search_read</code>). Odoo&apos;s
          own example searches partners:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-[13px] leading-6 text-[var(--foreground)]">{`POST /json/2/res.partner/search_read
Host: mycompany.example.com
Authorization: bearer <api key>
Content-Type: application/json

{
  "domain": [["is_company", "=", true], ["name", "ilike", "%deco%"]],
  "fields": ["name"]
}

HTTP/1.1 200 OK
[{ "id": 25, "name": "Deco Addict" }]`}</pre>
        <p>
          The API key comes from the user&apos;s Preferences under Account
          Security. Odoo 19 caps every key at three months, so a production
          integration needs a rotation routine; keys can also be generated
          and revoked programmatically through{" "}
          <code>res.users.apikeys/generate</code> once the{" "}
          <code>base.enable_programmatic_api_keys</code> parameter is on.
          Each JSON-2 call runs in its own database transaction, so a
          multi-step operation (create an order, then confirm it) is two
          transactions; when that matters, call one method that does the
          whole job, such as <code>sale.order/action_confirm</code>.
        </p>
      </GuideSection>

      <GuideSection heading="What did Odoo expose before JSON-2?">
        <p>
          A single generic dispatch method, <code>execute_kw</code>, reached
          over XML-RPC at <code>/xmlrpc/2/object</code> or over JSON-RPC at{" "}
          <code>/jsonrpc</code>. It takes a database name, user id, password
          or API key, model name, method name and arguments, and runs the
          method against Odoo&apos;s ORM as that user. Standard CRUD (
          <code>search</code>, <code>search_read</code>, <code>create</code>,{" "}
          <code>write</code>, <code>unlink</code>) and business actions like
          confirming a sales order are all reached the same way. Odoo 16, 17
          and 18 only have this interface, which is why every integration
          library and most tutorials still speak RPC. See the guide on how
          Odoo&apos;s API actually works, linked below, for authentication and
          the calling mechanics.
        </p>
      </GuideSection>

      <GuideSection heading="Which one should a new integration use?">
        <p>
          On Odoo 19 or later, JSON-2: it is the supported path, the request
          shape is simpler, and the RPC endpoints have an end date. On Odoo
          16 to 18, JSON-RPC (it is the same JSON transport most HTTP clients
          already handle, and easier to debug than XML-RPC). If an
          integration has to span versions, keep the model and method names
          in one place and swap only the transport layer; the ORM methods
          you call are identical on both.
        </p>
      </GuideSection>

      <GuideSection heading="Does any of this stop you from integrating with Odoo?">
        <p>
          No. Every language with an HTTP library can call JSON-2, and every
          language with an XML-RPC or HTTP library can call the older RPC
          endpoints. The practical effect of Odoo&apos;s design is that
          calling code thinks in model names and method calls (
          <code>sale.order/search_read</code>) rather than REST-style
          resource URLs and verbs: a different shape of code, not a harder
          problem.
        </p>
      </GuideSection>

      <GuideSection heading="When does a thin REST layer in front of Odoo make sense?">
        <p>
          It&apos;s a genuinely common and reasonable pattern: build a small
          server that exposes a handful of resource-style REST (or GraphQL)
          endpoints your own frontend or a third-party system can call, and
          have that server translate each request into the equivalent Odoo
          JSON-2 or RPC calls behind the scenes. This makes sense when the consuming client
          expects conventional REST (a mobile app framework, a no-code tool,
          a partner system you don&apos;t control), when you want to expose
          only a narrow, deliberately scoped slice of Odoo&apos;s data instead
          of the full ORM surface to that client, or when you want a layer
          that can cache, rate-limit, or reshape Odoo&apos;s data before it
          reaches the outside world.
        </p>
      </GuideSection>

      <GuideSection heading="When is it not worth building that layer?">
        <p>
          If the thing calling Odoo is a web app or backend you&apos;re
          building yourself, there&apos;s usually no reason to invent a REST
          layer in between: calling Odoo&apos;s API directly from that
          app&apos;s own backend is simpler and has one fewer moving part to
          maintain. The extra REST layer earns its cost specifically when
          something outside your control needs a conventional REST contract,
          not as a default architectural step for every Odoo integration.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
