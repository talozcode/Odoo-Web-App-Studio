import type { Metadata } from "next";
import { UseCasePageTemplate } from "@/components/seo/use-case-page";
import { WarehousePickingDemo } from "@/components/demo-apps/warehouse-picking-demo";
import { EXAMPLE_APPS } from "@/config/examples";
import { serviceSchema } from "@/lib/schema";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "odoo-warehouse-app";
const CANONICAL_URL = `${SITE_URL}/${SLUG}`;
const APP = EXAMPLE_APPS.find((a) => a.id === "warehouse-picking")!;

export const metadata: Metadata = {
  title: `Odoo Warehouse App: Mobile Picking Interface | ${BRAND_NAME}`,
  description:
    "A focused, mobile-first picking app connected to Odoo Inventory. Scan, confirm and validate transfers without navigating Odoo's full backend. Pricing and scope inside.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Odoo Warehouse App: Mobile Picking Interface",
    description:
      "A focused, mobile-first picking app connected to Odoo Inventory.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const FAQS = [
  {
    question: "Does this replace Odoo's own Barcode app?",
    answer:
      "Not necessarily. Odoo's Barcode app is genuinely good and handles a wide range of warehouse operations. A dedicated picking app makes sense when a warehouse only needs one or two of those flows (usually delivery order picking) and wants a screen with zero extra taps, zero unrelated menus, and wording matched to how the team actually talks about the job.",
  },
  {
    question: "Can it handle lots and serial numbers?",
    answer:
      "Yes, if the products it's picking are tracked by lot or serial number in Odoo. That requirement changes the scope a little, since the interface needs a step to select or scan the correct lot/serial before a line can be marked picked, so it's worth mentioning up front during scoping.",
  },
  {
    question: "Does it work with a low-connectivity or Wi-Fi-only warehouse?",
    answer:
      "The app itself is a normal web app, so it needs a network connection to read pending pickings and write confirmations back to Odoo. For warehouses with patchy Wi-Fi, the practical fix is usually better AP placement rather than building offline sync, since offline-first inventory apps introduce real conflict-resolution risk (two people picking the same line while offline). We'll flag this honestly if it comes up during scoping rather than quietly building something fragile.",
  },
  {
    question: "What happens with partially picked or backordered lines?",
    answer:
      "Odoo's own backorder logic (splitting a transfer when not everything was available) still applies — the app calls the same underlying validation Odoo uses, it just presents the decision in a simpler screen instead of Odoo's transfer form.",
  },
];

export default function OdooWarehouseAppPage() {
  return (
    <UseCasePageTemplate
      breadcrumbLabel="Odoo Warehouse App"
      eyebrow="Warehouse & Inventory"
      h1="A faster picking app for your Odoo warehouse"
      intro="Odoo Inventory already tracks every stock move correctly. What's usually slow isn't the data model — it's asking a picker to work through general-purpose warehouse screens built for every operation Odoo supports, when their actual job is one thing: pick this order, confirm each line, done."
      demo={<WarehousePickingDemo />}
      demoCaption="Interactive demo — try picking a line yourself."
      canonicalUrl={CANONICAL_URL}
      priceFrom={APP.priceFrom}
      priceNote="Starting price for a single-warehouse, single-operation-type picking flow (typically delivery orders). Lot/serial capture, multi-step routes, or multi-warehouse support are scoped separately."
      extraJsonLd={[serviceSchema(APP, CANONICAL_URL)]}
      faqs={FAQS}
      sections={[
        {
          heading: "How a picking app connects to Odoo Inventory",
          body: (
            <>
              <p>
                Under the hood, a warehouse pick is a <code>stock.picking</code>{" "}
                record made up of one or more <code>stock.move.line</code>{" "}
                lines — each one a product, a quantity to move, and a source
                and destination location. A picking app reads the pickings
                assigned to a user or a warehouse (usually filtered to
                &quot;ready&quot; transfers) through Odoo&apos;s API, shows
                them as a simple order list, and lets the picker scan a
                barcode to jump straight to the matching line.
              </p>
              <p>
                Confirming a line updates the quantity done on that move
                line; validating the whole transfer calls the same
                underlying action Odoo&apos;s own interface uses, so stock
                quantities, reservations, and any downstream automation
                (like triggering the next step in a delivery route) all
                behave exactly as they would from Odoo itself. The app is a
                different front door — not a different set of rules.
              </p>
            </>
          ),
        },
        {
          heading: "What changes for the warehouse team",
          body: (
            <>
              <p>
                The practical difference is what&apos;s on screen. Instead of
                a desktop-oriented list view with columns for fields the
                picker never uses, they see the order they&apos;re working
                on, the lines still outstanding, and a big scan target.
                Buttons are sized for a phone or handheld scanner held in one
                hand, not a mouse.
              </p>
              <p>
                Training time drops correspondingly — there&apos;s
                effectively one screen to learn, and it mirrors the physical
                task (walk the aisle, scan the item, confirm the count)
                rather than a data-entry form.
              </p>
            </>
          ),
        },
        {
          heading: "Typical scope and timeline",
          body: (
            <>
              <p>
                A focused first version — one warehouse, one operation type,
                scan-to-confirm with no lot/serial tracking — is the kind of
                build the starting price below reflects. Adding lot/serial
                capture, backorder handling for partial picks, or supporting
                multiple warehouses with different flows each add scope, and
                are quoted after a short conversation about what the
                warehouse actually does day to day.
              </p>
              <p>
                As a rough sense of pace: a first working version of a
                single-flow picking app is realistically a matter of weeks,
                not months, once the relevant Odoo models and access are
                confirmed — but any specific timeline should come from an
                actual scoping conversation, not a number on a landing page.
              </p>
            </>
          ),
        },
      ]}
      relatedLinks={[
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
        { href: "/guides/how-much-does-a-custom-odoo-app-cost", label: "How much does a custom Odoo app cost?" },
        { href: "/odoo-api-development", label: "How Odoo API development works" },
      ]}
    />
  );
}
