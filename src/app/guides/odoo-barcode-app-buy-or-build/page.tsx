import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "odoo-barcode-app-buy-or-build";
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
        { href: "/odoo-warehouse-app", label: "Odoo warehouse app" },
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
