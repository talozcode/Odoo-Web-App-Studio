import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "odoo-customer-self-service-portal";
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
        { href: "/odoo-customer-portal", label: "Odoo customer ordering portal" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
        { href: "/guides/odoo-customization-vs-custom-apps", label: "Odoo customization vs. custom apps" },
      ]}
    >
      <GuideSection heading="What does Odoo's built-in customer portal actually offer?">
        <p>
          Odoo already ships a customer portal as part of its Sales and
          Invoicing apps: once enabled, a customer with a portal login can
          view their own quotations, sales orders, invoices, and support
          tickets through a web page tied to their <code>res.partner</code>{" "}
          record. It&apos;s a real, working feature that requires no
          integration work at all: it&apos;s part of Odoo itself.
        </p>
      </GuideSection>

      <GuideSection heading="What are its actual limits?">
        <p>
          It&apos;s built to expose a bit of everything a customer relationship
          might involve (quotes, invoices, tickets) rather than to make
          one specific action, like reordering the same few products, as
          fast as possible. It also looks and behaves like Odoo, which is
          fine for a customer who occasionally checks an invoice, but adds
          friction for a customer who wants to place a fast repeat order
          and doesn&apos;t want to learn Odoo&apos;s portal navigation to do it.
          Branding options are limited to what Odoo&apos;s website theming
          supports, not a fully custom design.
        </p>
      </GuideSection>

      <GuideSection heading="What does a fully custom-branded portal add instead?">
        <p>
          A separate front end, built and hosted independently, connected
          to Odoo through its API rather than running inside Odoo&apos;s own
          portal framework, that can look exactly like the rest of a
          business&apos;s branding, and can be narrowed to exactly one flow:
          a returning wholesale customer sees their usual products with
          their own pricing and places an order in under a minute, with
          nothing else on screen to navigate past. See the customer
          ordering portal use case, linked below, for what that build
          actually looks like in practice.
        </p>
      </GuideSection>

      <GuideSection heading="Does 'custom portal' mean rebuilding what Odoo already does?">
        <p>
          No, and this is the key distinction the question in this guide&apos;s
          title is getting at: the commercial rules (pricing, what a given
          customer is allowed to buy, order history) already live correctly
          in Odoo, and a custom portal doesn&apos;t duplicate that logic. It
          authenticates the customer, reads what applies to their specific
          account through Odoo&apos;s API, and on checkout creates a real{" "}
          <code>sale.order</code> the same way any other order in Odoo would
          be created. It&apos;s a different front door onto the same data and
          rules, not a second system to keep in sync.
        </p>
      </GuideSection>

      <GuideSection heading="When does Odoo's built-in portal remain the right call?">
        <p>
          When customers only occasionally need to check a quote, invoice,
          or order status, genuinely self-service in the lightweight
          sense, and there&apos;s no strong reordering or branding
          requirement, Odoo&apos;s own portal already does the job with zero
          extra build cost. It&apos;s worth honestly starting there rather
          than assuming a custom portal is always the better answer.
        </p>
      </GuideSection>

      <GuideSection heading="How do you decide between the two?">
        <p>
          Ask what the customer is actually trying to do most often. If it&apos;s
          checking on something (an invoice, a quote, a ticket), Odoo&apos;s
          built-in portal is usually enough. If it&apos;s a specific, frequent,
          repeatable action (reordering the same products, submitting a
          standard request) that a customer would ideally do in under a
          minute without learning Odoo&apos;s navigation, a narrower
          custom-branded portal built around that one flow tends to be worth
          the extra build cost.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
