import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "odoo-rest-api-explained";
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
        { href: "/odoo-api-development", label: "Odoo API development" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
      ]}
    >
      <GuideSection heading="Does Odoo actually have a REST API?">
        <p>
          Not a native one, no. This is one of the most common points
          of confusion for anyone starting to evaluate an Odoo integration.
          Odoo&apos;s built-in external API is exposed over two RPC
          protocols, XML-RPC and JSON-RPC, both of which call the same
          underlying ORM methods. Neither of those is REST in the
          architectural sense: there&apos;s no set of resource URLs like{" "}
          <code>/api/sale.order/42</code> that you <code>GET</code>,{" "}
          <code>PUT</code>, or <code>DELETE</code> against with plain HTTP
          verbs and status codes. If you&apos;ve found documentation or a
          module claiming Odoo has REST endpoints, it&apos;s either
          describing JSON-RPC loosely as &quot;REST-like,&quot; or it&apos;s a
          third-party or self-hosted addition, not something Odoo ships by
          default.
        </p>
      </GuideSection>

      <GuideSection heading="What does Odoo actually expose instead?">
        <p>
          A single generic dispatch method, commonly reached as{" "}
          <code>execute_kw</code>, that takes a model name, a method name,
          and arguments, and runs it against Odoo&apos;s ORM as the
          authenticated user. Standard CRUD (<code>search</code>,{" "}
          <code>search_read</code>, <code>create</code>, <code>write</code>,{" "}
          <code>unlink</code>) is always available this way, and so is any
          other public method on that model, including business actions
          like confirming a sales order. See the guide on how Odoo&apos;s API
          actually works, linked below, for the full mechanics of
          authentication and calling it.
        </p>
      </GuideSection>

      <GuideSection heading="Why does Odoo do it this way instead of shipping REST?">
        <p>
          XML-RPC and JSON-RPC both predate Odoo&apos;s current form and map
          naturally onto exposing an ORM&apos;s methods directly: a single
          endpoint that can call anything the ORM supports, rather than
          hand-defining a REST resource and set of verbs for every one of
          the hundreds of models Odoo ships. It&apos;s a pragmatic choice for
          an ORM-centric framework, even though it means Odoo doesn&apos;t look
          like a typical modern REST or GraphQL API out of the box.
        </p>
      </GuideSection>

      <GuideSection heading="Does this actually stop you from integrating with Odoo?">
        <p>
          No. Every client language with an HTTP or XML-RPC library can call
          Odoo&apos;s existing RPC API: Python, JavaScript/Node, PHP, and
          plenty of others have mature libraries for exactly this. The
          practical effect of &quot;no native REST&quot; isn&apos;t that
          integration is blocked, it&apos;s that the calling code has to
          think in terms of model names and method calls (
          <code>execute_kw(&quot;sale.order&quot;, &quot;search_read&quot;, ...)</code>
          ) rather than REST-style URLs and verbs, a different shape of
          code, not a harder problem.
        </p>
      </GuideSection>

      <GuideSection heading="When does a thin REST layer in front of Odoo make sense?">
        <p>
          It&apos;s a genuinely common and reasonable pattern: build a small
          server that exposes a handful of proper REST (or GraphQL) endpoints
          your own frontend or a third-party system can call, and have that
          server translate each request into the equivalent Odoo RPC calls
          behind the scenes. This makes sense when the consuming client
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
          layer in between: calling Odoo&apos;s RPC API directly from that
          app&apos;s own backend is simpler and has one fewer moving part to
          maintain. The extra REST layer earns its cost specifically when
          something outside your control needs a conventional REST contract,
          not as a default architectural step for every Odoo integration.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
