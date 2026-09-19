import type { Metadata } from "next";
import { UseCasePageTemplate } from "@/components/seo/use-case-page";
import { CustomerPortalPreview } from "@/components/demo-apps/customer-portal-preview";
import { EXAMPLE_APPS } from "@/config/examples";
import { serviceSchema } from "@/lib/schema";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "odoo-customer-portal";
const CANONICAL_URL = `${SITE_URL}/${SLUG}`;
const APP = EXAMPLE_APPS.find((a) => a.id === "customer-ordering-portal")!;

export const metadata: Metadata = {
  title: `Odoo Customer Ordering Portal | ${BRAND_NAME}`,
  description:
    "A branded customer ordering portal connected directly to Odoo Sales, built for fast reordering instead of Odoo's general-purpose portal. Pricing and scope inside.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Odoo Customer Ordering Portal",
    description:
      "A branded customer ordering portal connected directly to Odoo Sales.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const FAQS = [
  {
    question: "Do customers need Odoo user logins?",
    answer:
      "No, not in the sense of full Odoo backend accounts. Customers authenticate into the portal itself, and the portal maps their login to the right res.partner record behind the scenes when it talks to Odoo. What that login looks like (email + password, a magic link, an existing account system) is a scoping decision.",
  },
  {
    question: "Can different customers see different products or prices?",
    answer:
      "Yes, this is one of the more common reasons businesses want a dedicated portal rather than Odoo's built-in one. The portal can respect each customer's assigned pricelist and, if configured, show only the subset of products relevant to that account.",
  },
  {
    question: "Can it show order history and invoices?",
    answer:
      "Yes, since past sale.order and account.move records for that customer already exist in Odoo. The portal reads and displays them rather than recreating that data anywhere else.",
  },
  {
    question: "Can it integrate with a payment gateway?",
    answer:
      "It can, but that's treated as its own explicit piece of scope rather than an assumed default, since it involves a third-party payment provider and its own compliance considerations (PCI scope, refund handling) on top of the Odoo integration itself.",
  },
];

export default function OdooCustomerPortalPage() {
  return (
    <UseCasePageTemplate
      breadcrumbLabel="Odoo Customer Portal"
      eyebrow="Customer-Facing"
      h1="A branded ordering portal your customers actually reorder from"
      intro="Odoo ships with a customer portal, and it works, but it looks and behaves like Odoo, and it's built to expose a bit of everything (quotes, invoices, tickets) rather than to make repeat ordering effortless for one specific type of customer. A dedicated portal can be branded to your business and narrowed to exactly the reordering flow your customers actually use."
      demo={<CustomerPortalPreview />}
      demoCaption="Interactive demo: a sample reorder screen."
      canonicalUrl={CANONICAL_URL}
      priceFrom={APP.priceFrom}
      priceNote="Starting price for customer login, a per-customer product catalog with pricing, and order submission into Odoo Sales. Payment integration, multi-language catalogs, or approval workflows are scoped separately."
      extraJsonLd={[serviceSchema(APP, CANONICAL_URL)]}
      faqs={FAQS}
      sections={[
        {
          heading: "How it connects to Odoo",
          body: (
            <>
              <p>
                A customer&apos;s portal login is tied to their{" "}
                <code>res.partner</code> record in Odoo. Once authenticated,
                the portal reads the products and pricing that apply to that
                specific customer (respecting whatever pricelist, minimum
                order quantities, or hidden-product rules are already set up
                in Odoo) and, on checkout, creates a <code>sale.order</code>{" "}
                the same way any other order in Odoo would be created.
              </p>
              <p>
                Because the underlying commercial rules (pricing, what a
                given customer is allowed to buy) already live in Odoo, the
                portal doesn&apos;t duplicate that logic; it just presents it
                through a simpler, faster interface than navigating Odoo
                directly.
              </p>
            </>
          ),
        },
        {
          heading: "What changes for the business and its customers",
          body: (
            <>
              <p>
                For wholesale, B2B, or repeat-order businesses, this usually
                replaces a mix of phone calls, emails, and WhatsApp messages
                for standard reorders. Customers who order the same handful
                of products regularly can do it themselves in under a
                minute, and the order lands in Odoo with no manual entry by
                staff.
              </p>
              <p>
                For the business, that&apos;s fewer orders keyed in by hand (and
                fewer transcription errors), and an accurate picture in Odoo
                of demand as it happens rather than as it&apos;s later
                typed in.
              </p>
            </>
          ),
        },
        {
          heading: "Typical scope and timeline",
          body: (
            <p>
              This is naturally one of the larger of the six example builds,
              since it touches three separate concerns (authentication, a
              per-customer catalog, and checkout) each of which needs to be
              right. A first version covering those three, for one type of
              customer with one set of ordering rules, is what the starting
              price below reflects; multiple customer tiers, payment
              collection, or approval steps before an order is confirmed
              each add scope.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: "/odoo-supplier-portal", label: "The supplier-side equivalent" },
        { href: "/guides/odoo-customer-self-service-portal", label: "Odoo's built-in portal vs. a custom self-service portal" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
        { href: "/guides/how-much-does-a-custom-odoo-app-cost", label: "How much does a custom Odoo app cost?" },
      ]}
    />
  );
}
