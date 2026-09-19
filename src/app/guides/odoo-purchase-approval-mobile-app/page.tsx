import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "odoo-purchase-approval-mobile-app";
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
        { href: "/custom-odoo-web-app", label: "Custom Odoo web apps" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
        { href: "/guides/how-much-does-a-custom-odoo-app-cost", label: "How much does a custom Odoo app cost?" },
      ]}
    >
      <GuideSection heading="Why do purchase order approvals actually get stuck?">
        <p>
          Not because Odoo&apos;s approval flow is broken; it works. The
          bottleneck is usually access: the person who needs to approve is
          traveling, between meetings, or otherwise away from a desktop, and
          opening the full Odoo backend on a phone to find one purchase
          order among everything else in the interface is enough friction
          that approvals sit unactioned for longer than they should. It&apos;s a
          well-documented, ordinary operational pain point, not a sign
          anything is misconfigured.
        </p>
      </GuideSection>

      <GuideSection heading="How does Odoo's own purchase approval flow actually work?">
        <p>
          A purchase order moves through a sequence of states, generally
          draft, then sent to the vendor, then to approve, then confirmed as
          an actual purchase. Depending on how purchasing is configured,
          approval authority can be tied to approval limits, meaning orders
          above a certain amount require a manager&apos;s sign-off before they
          can move forward, while smaller orders may not need that extra
          step. The mechanism is real and already enforces this correctly;
          the only friction is the interface it has to be done through.
        </p>
      </GuideSection>

      <GuideSection heading="What would a minimal mobile approval screen actually show?">
        <p>
          Only what a manager needs to decide, and nothing else: the vendor,
          the total amount, the line items being purchased, and ideally a
          short reason or note field if the requester attached one. Two
          large, unambiguous actions, approve and reject, sized for a thumb
          on a phone screen. No navigation menu, no unrelated Odoo modules
          visible, no need to understand where else in Odoo this order
          lives.
        </p>
      </GuideSection>

      <GuideSection heading="Does an approval made in the app actually count as a real Odoo approval?">
        <p>
          Yes, if it&apos;s built correctly: the app should write the decision
          straight back to the real <code>purchase.order</code> record
          through Odoo&apos;s API, calling the same underlying approval action
          Odoo&apos;s own backend button would trigger, rather than some
          separate tracking mechanism that then has to be manually
          reconciled with Odoo later. Done that way, there&apos;s exactly one
          source of truth: Odoo&apos;s own record, just reachable through a
          faster interface for that one specific action.
        </p>
      </GuideSection>

      <GuideSection heading="Is this a read-only or a write-back build?">
        <p>
          Write-back, and worth treating with the same care as any other
          write-back integration: the app is creating a real state change on
          a real financial record, so it needs to handle what happens if the
          write fails partway, and it needs the approve/reject action tied
          to a properly authenticated user, not a shared login, so the
          record of who approved what stays accurate. See the read-only
          vs. write-back guide, linked below, for what that care actually
          involves in practice.
        </p>
      </GuideSection>

      <GuideSection heading="Does this replace Odoo's purchasing workflow?">
        <p>
          No, it sits on top of it. Nothing about the underlying
          draft-to-purchase flow, approval limits, or vendor management
          changes; the app is a narrow, faster front door for one specific
          action (approve or reject) that a manager currently has to open
          the full Odoo backend to perform. Everything else about how
          purchasing works in Odoo stays exactly as it is.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
