import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { UseCasePageTemplate } from "@/components/seo/use-case-page";
import { ExamplePreview } from "@/components/demo-apps/example-preview";
import { capabilityServiceSchema } from "@/lib/schema";
import { SITE_URL } from "@/config/site";

// Demo data is re-fetched from the demo Odoo at most every 45 seconds.
export const revalidate = 45;

const SLUG = "odoo-api-development";
const CANONICAL_URL = `${SITE_URL}/${SLUG}`;
const SERVICE_NAME = "Odoo API Development";
const SERVICE_DESCRIPTION =
  "Custom integration work connecting external apps, portals and services to Odoo's external API (JSON-2 on Odoo 19, JSON-RPC and XML-RPC before it) and ORM.";

export const metadata: Metadata = pageMetadata({
  title: "Odoo API Development & Integration",
  description:
    "How Odoo's external API works (JSON-2 on Odoo 19, JSON-RPC and XML-RPC before it) and what it takes to build a reliable read-only or read-write integration against it.",
  path: `/${SLUG}`,
});

const FAQS = [
  {
    question: "Do you need admin access to our Odoo?",
    answer:
      "No. An integration should run under a dedicated API user with only the access rights it actually needs, the same way you'd scope any other integration. Standard Odoo access rights and record rules apply to API calls exactly as they do to a logged-in user, so scoping that user correctly is part of doing the integration properly.",
  },
  {
    question: "JSON-2, JSON-RPC or XML-RPC: which one should the integration use?",
    answer:
      "On Odoo 19 or later, JSON-2: it is the supported HTTP API, and Odoo has scheduled the XML-RPC and JSON-RPC endpoints for removal in Odoo 22 (fall 2028). On Odoo 16 to 18, JSON-RPC, since JSON tooling is universal and it is easier to debug than XML-RPC. All three expose the same ORM methods, so we keep the transport in one layer and the model and method calls unchanged.",
  },
  {
    question: "Does this work with Odoo Online, Odoo.sh, and self-hosted/on-premise?",
    answer:
      "The external API is the same across all three hosting options: what differs is how you obtain and manage API credentials and, on self-hosted instances, whether the server is reachable from wherever the integration runs. Both are confirmed early in scoping.",
  },
  {
    question: "Does the integration survive Odoo version upgrades?",
    answer:
      "The API surface (search, read, create, write, and calling specific model methods) has been stable across recent Odoo versions, but individual field names or method behavior on specific models can change between major versions. A well-built integration isolates those touchpoints so an upgrade means checking a short, known list of things rather than an unpredictable one. See the guide on Odoo upgrades linked below.",
  },
];

export default function OdooApiDevelopmentPage() {
  return (
    <UseCasePageTemplate
      breadcrumbLabel="Odoo API Development"
      h1="Odoo API development: the connection layer itself"
      intro="Every app on this site (the picking app, the sales app, the dashboard, both portals) is really the same underlying capability applied to a different screen: a reliable connection between an external app and Odoo's data. Sometimes that connection is the whole project, without a bespoke front end wrapped around it: syncing an e-commerce platform's orders into Odoo, or letting an internal tool read live stock levels."
      demo={
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <ExamplePreview appId="management-dashboard" withReadout />
          <ExamplePreview appId="custom-workflow" />
        </div>
      }
      demoCaption="Same connection, two directions: reading data out (top) and writing decisions back (bottom)."
      canonicalUrl={CANONICAL_URL}
      extraJsonLd={[
        capabilityServiceSchema({
          name: SERVICE_NAME,
          description: SERVICE_DESCRIPTION,
          url: CANONICAL_URL,
        }),
      ]}
      faqs={FAQS}
      sections={[
        {
          heading: "What Odoo actually exposes",
          body: (
            <>
              <p>
                Odoo exposes its ORM to external clients over JSON-2 (an
                HTTP JSON API, new in Odoo 19) and, on every version from 16
                up, over XML-RPC and JSON-RPC. All three let an authenticated
                external client call the same core methods Odoo&apos;s own web
                client calls internally: <code>search_read</code> and{" "}
                <code>read_group</code> to query records, <code>create</code>{" "}
                and <code>write</code> to add or update them, and{" "}
                <code>unlink</code> to delete them, plus the ability to call
                specific business methods on a model, like confirming a sales
                order or validating a stock transfer, instead of trying to
                fake that behavior by writing raw field values.
              </p>
              <p>
                Authentication is an API key generated for a dedicated
                integration user (a bearer header with JSON-2; a login step
                that returns a user id with the RPC protocols). Every call is
                then subject to that
                user&apos;s normal Odoo access rights and record rules;
                the API doesn&apos;t bypass Odoo&apos;s permission model, it
                operates inside it.
              </p>
            </>
          ),
        },
        {
          heading: "Two integration patterns: read-only vs. write-back",
          body: (
            <p>
              A read-only integration pulls data out of Odoo to display or
              export elsewhere (a dashboard, a report, a sync to another
              system&apos;s copy of the catalog). It&apos;s inherently lower-risk:
              there&apos;s no way to corrupt Odoo data through a query. A
              write-back integration creates or updates real records (a new
              sales order, a confirmed purchase order, an updated stock
              count) and needs real care: input validation before the
              write, clear handling of what happens if a call partially
              fails, and calling the correct workflow method rather than
              writing raw state fields and hoping Odoo&apos;s own business logic
              doesn&apos;t get bypassed in the process. The guide on read-only
              vs. write-back integrations linked below goes into this in
              more depth.
            </p>
          ),
        },
        {
          heading: "Common integration points",
          body: (
            <p>
              The recurring patterns: syncing e-commerce or marketplace
              orders into <code>sale.order</code>; pushing web form or chat
              leads into <code>crm.lead</code>; connecting a mobile or field
              app to stock or purchase workflows; syncing product and stock
              data with a separate warehouse or point-of-sale system; and
              using Odoo&apos;s own Automated Actions to trigger outbound
              calls to another service when something changes inside Odoo.
              Most integration requests are a variation on one of these.
            </p>
          ),
        },
        {
          heading: "What we actually deliver",
          body: (
            <p>
              Not a generic connector or a one-size-fits-all SDK: the
              specific integration for the specific workflow, including
              error handling and clear behavior when something goes wrong
              (a call fails, a required field is missing, Odoo rejects the
              write), and a plain description of exactly which Odoo models
              and fields the integration touches. Pricing depends entirely
              on which models and workflows are involved; see the general
              pricing guide below or the pricing section on the homepage for
              a starting sense of range.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: "/guides/odoo-api-multi-company-filtering", label: "Odoo API multi-company filtering" },
        { href: "/guides/odoo-rest-api-explained", label: "Odoo REST API: JSON-2, JSON-RPC and XML-RPC" },
        { href: "/guides/odoo-api-integration-explained", label: "How Odoo's API actually works" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
        { href: "/guides/what-happens-when-odoo-upgrades", label: "What happens to a custom app when Odoo upgrades?" },
        { href: "/guides/how-much-does-a-custom-odoo-app-cost", label: "How much does a custom Odoo app cost?" },
      ]}
    />
  );
}
