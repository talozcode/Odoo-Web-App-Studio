import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { UseCasePageTemplate } from "@/components/seo/use-case-page";
import { ExamplePreview } from "@/components/demo-apps/example-preview";
import { EXAMPLE_APPS } from "@/config/examples";
import { serviceSchema } from "@/lib/schema";
import { SITE_URL } from "@/config/site";

// Demo data is re-fetched from the demo Odoo at most every 45 seconds.
export const revalidate = 45;

const SLUG = "odoo-sales-app";
const CANONICAL_URL = `${SITE_URL}/${SLUG}`;
const APP = EXAMPLE_APPS.find((a) => a.id === "sales-app")!;

export const metadata: Metadata = pageMetadata({
  title: "Odoo Sales App: Mobile Ordering for Reps",
  description:
    "A simple mobile ordering app for field sales reps, connected directly to Odoo Sales. Pick a customer, add products, submit: no backoffice screens. Pricing inside.",
  path: `/${SLUG}`,
});

const FAQS = [
  {
    question: "Can reps see live stock and each customer's pricing?",
    answer:
      "Yes, the app reads current stock levels and can apply the customer's assigned pricelist the same way Odoo's own Sales app would, since it's calling the same pricing and stock logic through the API rather than reimplementing it.",
  },
  {
    question: "Does it work with no signal in the field?",
    answer:
      "The core version is online-first: a rep needs a connection to submit an order. If reps regularly work in areas with no signal at all, that's worth raising during scoping. A limited offline queue (save locally, submit when back online) is possible, but it adds real complexity around handling stock and price changes between when the order was drafted and when it's actually submitted.",
  },
  {
    question: "Does the order go straight to a confirmed sales order?",
    answer:
      "That's a scoping decision, not a technical constraint. Some teams want orders to land as confirmed sale.order records immediately; others want them created as quotations for a back-office review before confirmation. Both are the same underlying API call with a different final state.",
  },
  {
    question: "Can it show a rep their own order history or targets?",
    answer:
      "It can, if that data already exists in Odoo (past sale.order records for that salesperson, for instance). Anything beyond what's stored in Odoo, like a bespoke commission calculation, would need to be defined explicitly as its own small feature.",
  },
];

export default function OdooSalesAppPage() {
  return (
    <UseCasePageTemplate
      breadcrumbLabel="Odoo Sales App"
      h1="A mobile ordering app for your Odoo sales reps"
      intro="Odoo's Sales app is built for back-office order management: quotations, terms, discounts, approval flows. A rep standing in a customer's shop with a phone doesn't need any of that. They need to pick a customer, add what they're buying, and submit, in under a minute."
      demo={<ExamplePreview appId="sales-app" withReadout />}
      demoCaption="Interactive demo: walk through a sample order."
      canonicalUrl={CANONICAL_URL}
      priceFrom={APP.priceFrom}
      priceNote="Starting price for customer selection, a product list with live pricing, and order submission into Odoo. Offline queuing, custom approval steps, or commission views are scoped separately."
      extraJsonLd={[serviceSchema(APP, CANONICAL_URL)]}
      faqs={FAQS}
      sections={[
        {
          heading: "How it connects to Odoo Sales",
          body: (
            <>
              <p>
                The app looks up customers as Odoo <code>res.partner</code>{" "}
                records (usually scoped to that rep&apos;s assigned accounts),
                lists sellable <code>product.product</code> records with
                whatever pricelist applies to the selected customer, and on
                submit creates a <code>sale.order</code> with its order
                lines through the same API path Odoo&apos;s own interface
                uses internally.
              </p>
              <p>
                Because it&apos;s reading pricing and stock from Odoo rather
                than a cached copy, a rep sees the same numbers a back-office
                user would see at that moment, with no separate price list to
                keep in sync by hand.
              </p>
            </>
          ),
        },
        {
          heading: "What changes for the sales team",
          body: (
            <>
              <p>
                Orders get entered once, by the person who took them, at the
                point they were taken, not scribbled on paper and
                re-typed into Odoo later that evening. That removes a
                transcription step where quantities and product names
                commonly get mixed up.
              </p>
              <p>
                It also means stock and order data in Odoo reflects reality
                closer to real time, which matters for anything downstream
                that depends on it: replenishment planning, delivery
                scheduling, or a manager checking today&apos;s numbers.
              </p>
            </>
          ),
        },
        {
          heading: "Typical scope and timeline",
          body: (
            <p>
              A first version covering customer selection, a product catalog
              with pricing, and order submission is the shape the starting
              price below reflects. Multiple price lists per customer,
              custom discount rules, photo attachments, or an offline mode
              each add real scope and are quoted once the actual sales
              process is understood. This is a case where a short call
              about how the team currently sells is genuinely more useful
              than a longer landing page.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: "/odoo-dashboard", label: "Odoo management dashboard" },
        { href: "/guides/why-sales-reps-dont-use-odoo-mobile", label: "Why sales reps don't use Odoo on their phones" },
        { href: "/guides/odoo-api-integration-explained", label: "How Odoo's API actually works" },
        { href: "/guides/how-much-does-a-custom-odoo-app-cost", label: "How much does a custom Odoo app cost?" },
      ]}
    />
  );
}
