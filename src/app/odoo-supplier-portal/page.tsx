import type { Metadata } from "next";
import { UseCasePageTemplate } from "@/components/seo/use-case-page";
import { ExamplePreview } from "@/components/demo-apps/example-preview";
import { EXAMPLE_APPS } from "@/config/examples";
import { serviceSchema } from "@/lib/schema";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

// Demo data is re-fetched from the demo Odoo at most every 45 seconds.
export const revalidate = 45;

const SLUG = "odoo-supplier-portal";
const CANONICAL_URL = `${SITE_URL}/${SLUG}`;
const APP = EXAMPLE_APPS.find((a) => a.id === "supplier-portal")!;

export const metadata: Metadata = {
  title: `Odoo Supplier Portal for Purchase Orders | ${BRAND_NAME}`,
  description:
    "Let suppliers confirm and update purchase orders without logging into Odoo directly. A focused portal built on Odoo Purchase. Pricing and scope inside.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Odoo Supplier Portal for Purchase Orders",
    description:
      "Let suppliers confirm and update purchase orders without logging into Odoo directly.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const FAQS = [
  {
    question: "Can a supplier see other suppliers' orders?",
    answer:
      "No. Each supplier's login is scoped to their own purchase orders only, the same way Odoo's own access rules would restrict a portal user to their own records.",
  },
  {
    question: "Can suppliers update expected delivery dates themselves?",
    answer:
      "Yes, if that's part of the scope: the portal can let a supplier propose or confirm a delivery date, which writes back to the relevant field on the purchase order lines so your team sees it without chasing an email reply.",
  },
  {
    question: "Does this replace RFQ or price negotiation in Odoo?",
    answer:
      "No. This portal is for the confirm-and-fulfil stage after a purchase order already exists, not for quote requests, supplier price comparison, or negotiation, which stay inside Odoo's Purchase app or your existing process.",
  },
  {
    question: "What about suppliers who aren't comfortable with a screen or scanner?",
    answer:
      "A supplier portal only helps if suppliers will actually use it. For a supplier base that's more comfortable with a phone call or a printed PO, it's worth being honest that the portal will only reduce email/WhatsApp traffic from the suppliers who adopt it, which is exactly the kind of thing worth discussing before committing to scope.",
  },
];

export default function OdooSupplierPortalPage() {
  return (
    <UseCasePageTemplate
      breadcrumbLabel="Odoo Supplier Portal"
      h1="A supplier portal built on your Odoo purchase orders"
      intro="Giving external suppliers direct access to Odoo is usually the wrong move: it's unfamiliar to them, and it exposes far more than they need. Most purchase order back-and-forth (confirm this, we can't do that quantity, it'll ship Friday) can instead happen through a narrow portal that shows a supplier exactly their own open orders and nothing else."
      demo={<ExamplePreview appId="supplier-portal" />}
      demoCaption="Interactive demo: a sample purchase order list."
      canonicalUrl={CANONICAL_URL}
      priceFrom={APP.priceFrom}
      priceNote="Starting price for a per-supplier login, a list of that supplier's open purchase orders, and confirm/update actions. Multi-user supplier accounts or document uploads (packing lists, certificates) are scoped separately."
      extraJsonLd={[serviceSchema(APP, CANONICAL_URL)]}
      faqs={FAQS}
      sections={[
        {
          heading: "How it connects to Odoo Purchase",
          body: (
            <>
              <p>
                The portal reads <code>purchase.order</code> and{" "}
                <code>purchase.order.line</code> records filtered to the
                logged-in supplier&apos;s <code>res.partner</code> record,
                showing open orders and what&apos;s expected on each line.
                When a supplier confirms an order or updates a date, that
                action calls the same underlying methods Odoo&apos;s own
                Purchase app uses (like confirming a PO), so the order&apos;s
                state in Odoo stays accurate without anyone on your team
                re-entering what the supplier said over email.
              </p>
            </>
          ),
        },
        {
          heading: "What changes for procurement",
          body: (
            <p>
              Purchase order status becomes something your team can trust at
              a glance instead of something scattered across an inbox: a
              confirmed order in Odoo means the supplier actually confirmed
              it, not that someone remembered to update the record after a
              phone call. That matters most for businesses juggling more
              than a handful of active suppliers at once.
            </p>
          ),
        },
        {
          heading: "Typical scope and timeline",
          body: (
            <p>
              A first version (one login per supplier, their open orders,
              confirm and date-update actions) is what the starting price
              below reflects. Letting suppliers attach documents, handle
              partial shipments, or manage multiple contacts per supplier
              company are each additional scope, quoted once the actual
              purchasing process is understood.
            </p>
          ),
        },
      ]}
      relatedLinks={[
        { href: "/odoo-customer-portal", label: "The customer-side equivalent" },
        { href: "/odoo-warehouse-app", label: "Pair it with a warehouse receiving flow" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
      ]}
    />
  );
}
