import Link from "next/link";
import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { ComparisonTable } from "@/components/seo/code-block";
import { EXAMPLE_APPS } from "@/config/examples";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-barcode-app-buy-or-build";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

const warehousePrice = `$${EXAMPLE_APPS.find((a) => a.id === "warehouse-picking")!.priceFrom.toLocaleString("en-US")}`;

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/odoo-warehouse-app", label: "Odoo warehouse app" },
        { href: "/guides/odoo-stock-quantity-fields", label: "Odoo stock quantities: on hand vs forecasted vs free" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
        { href: "/guides/how-much-does-a-custom-odoo-app-cost", label: "How much does a custom Odoo app cost?" },
      ]}
    >
      <GuideSection heading="What does Odoo's own Barcode app actually do?">
        <p>
          Odoo ships a dedicated Barcode app that covers a genuinely wide
          range of warehouse operations out of the box: receiving, delivery
          picking, internal transfers, inventory adjustments, manufacturing
          consumption, and more, all driven by scanning barcodes on a phone
          or handheld scanner. It&apos;s a real, actively maintained part of
          Odoo Inventory and Manufacturing, not an afterthought: for a
          meaningful share of warehouses, it&apos;s simply enough on its own.
        </p>
      </GuideSection>

      <GuideSection heading="Odoo Barcode, OCA or a custom app: a side-by-side">
        <p>
          Three realistic options, plus the packaged third-party apps that
          sit between them. The honest summary: if you are on Enterprise and
          your flows are standard, Odoo&apos;s own Barcode app is the right
          answer and the rest of this guide is about the cases where it is
          not. Note the first row: Barcode is an Enterprise app (Odoo lists
          it under Inventory on its{" "}
          <a
            href="https://www.odoo.com/page/editions"
            className="font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline"
            rel="noopener"
          >
            editions page
          </a>
          ), so on Community the realistic choices are an OCA module, a paid
          third-party app, or a custom one.
        </p>
        <ComparisonTable
          caption="Picking on a phone or scanner, four ways"
          headers={["", "Odoo Barcode", "OCA modules", "Packaged third-party app", "Custom app"]}
          rows={[
            ["Availability", "Enterprise only", "Community and Enterprise, free", "Community and Enterprise, paid", "Any edition, any version"],
            ["Cost shape", "Included in Enterprise", "Free, plus the work to install and maintain", "Per user per month, usually", `One-off, from ${warehousePrice} here`],
            ["Covers", "Receipts, deliveries, internal transfers, inventory counts, batch and cluster picking", "Varies by module, usually narrower", "Broad, vendor decides the roadmap", "Exactly the flows you ask for, nothing else"],
            ["Fits an unusual rule", "Only if it is a setting", "Only if someone wrote the module", "Only if the vendor supports it", "Yes, that is the reason to build"],
            ["Where it runs", "Inside Odoo", "Inside Odoo", "Vendor app, connected to Odoo", "Beside Odoo, over the API"],
            ["Upgrade exposure", "Odoo maintains it", "Module must be ported per version", "Vendor handles it", "API fields only; no code inside Odoo"],
          ]}
        />
      </GuideSection>

      <GuideSection heading="So when is Odoo's Barcode app the right call?">
        <p>
          When the warehouse needs several of those different operation
          types, when staff are already reasonably comfortable navigating a
          menu to pick the right operation before scanning, and when there&apos;s
          no strong reason to avoid installing another Odoo app or giving
          users Odoo-side access. In that situation, building a custom
          picking app instead would mean re-implementing functionality Odoo
          already provides for free, correctly, and kept in sync with the
          rest of Inventory automatically.
        </p>
      </GuideSection>

      <GuideSection heading="When does a narrower custom app make more sense instead?">
        <p>
          A few specific, recurring situations: when a warehouse only ever
          does one operation type (usually delivery order picking) and
          having the rest of the Barcode app&apos;s menu present at all is
          unnecessary friction for a role that should see exactly one
          screen; when the hardware is unusual (an older or
          industry-specific scanner, a kiosk, a device where Odoo&apos;s own
          Barcode app&apos;s interaction pattern doesn&apos;t map cleanly onto
          the device&apos;s input method); or when the people doing the
          scanning shouldn&apos;t have any Odoo backend access at all, not
          even the scoped Barcode app view, for account-management or
          licensing reasons. See the warehouse app guide, linked below, for
          what that narrower build actually looks like.
        </p>
              <p>
          A concrete example: the{" "}
          <Link href="/work#barcode-picking" className="font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline">
            barcode picking app we run in production
          </Link>{" "}
          for a multi-site food group exists for one reason Odoo&apos;s
          Barcode app did not cover for them: checking lot expiry as each
          line is picked, so short-dated stock is caught on the floor rather
          than by the customer. Everything else it does, Odoo Barcode also
          does; that one rule justified the build.
        </p>
</GuideSection>

      <GuideSection heading="Is a custom app actually simpler, or just different?">
        <p>
          Done well, genuinely simpler for that one flow: a purpose-built
          screen can show exactly the order being picked and one big scan
          target, with wording matched to how the team already talks about
          the job, and nothing else visible. But it&apos;s worth being honest
          that this is a narrower tool by design: it does one job, not the
          full range Odoo&apos;s Barcode app covers. If a warehouse&apos;s needs
          grow to include multiple operation types later, that&apos;s either
          additional scope on the custom app or a reason to reconsider
          Odoo&apos;s own tool.
        </p>
      </GuideSection>

      <GuideSection heading="Do both approaches use the same underlying Odoo data?">
        <p>
          Yes. This isn&apos;t an either/or on the data model. Both Odoo&apos;s
          Barcode app and a custom picking app operate on the same{" "}
          <code>stock.picking</code> and <code>stock.move.line</code>{" "}
          records, and validating a transfer through either one triggers the
          same underlying business logic (stock updates, reservations,
          backorder handling). The choice is purely about which interface
          sits in front of that same correct data, not about which one is
          &quot;more accurate.&quot;
        </p>
      </GuideSection>

      <GuideSection heading="How do you decide, practically?">
        <p>
          Start by listing the actual operation types the warehouse performs
          day to day. If it&apos;s more than one or two, or if staff are
          comfortable Odoo users already, try Odoo&apos;s own Barcode app
          first, since it costs nothing extra to enable and might already solve
          the problem. If, after using it, the friction is specifically
          &quot;this does more than I need and I only ever do one thing,&quot;
          or the hardware genuinely doesn&apos;t fit, that&apos;s the point
          where a narrower custom app starts paying for itself.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
