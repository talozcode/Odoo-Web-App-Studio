import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-write-back-vs-read-only-integrations";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/odoo-api-development", label: "Odoo API development" },
        { href: "/odoo-dashboard", label: "Odoo dashboard (read-only example)" },
        { href: "/guides/how-much-does-a-custom-odoo-app-cost", label: "How much does a custom Odoo app cost?" },
      ]}
    >
      <GuideSection heading="What's the actual difference between the two?">
        <p>
          A read-only integration only ever queries Odoo, using calls like
          <code>search</code>, <code>search_read</code>, and
          <code>read_group</code>, and never calls anything that creates,
          updates, or deletes a record. A
          write-back integration does one or more of those things: it might
          create a new <code>sale.order</code>, update a field on an
          existing record with <code>write</code>, or call a business
          method that changes a record&apos;s state, like confirming a purchase
          order or validating a stock transfer.
        </p>
      </GuideSection>

      <GuideSection heading="Why does this distinction change the risk profile so much?">
        <p>
          A bug in a read-only integration produces a wrong number on a
          screen somewhere (annoying, and worth fixing), but it never
          touches Odoo&apos;s actual data, so it&apos;s fully recoverable by just
          fixing the query. A bug in a write-back integration can create a
          malformed sales order, wrongly confirm a stock move that shouldn&apos;t
          have gone through, or write incorrect values directly into records
          that accounting, other staff, and other automations then rely on
          as if they were entered correctly by a person. That&apos;s a
          meaningfully higher bar, and it&apos;s why write-back work is scoped
          and built more carefully.
        </p>
      </GuideSection>

      <GuideSection heading="What does building a write-back integration responsibly actually require?">
        <p>
          Validating input before it&apos;s sent to Odoo, rather than letting
          Odoo&apos;s own error be the first check. Calling the correct
          higher-level business method (for example, the same action Odoo&apos;s
          &quot;Validate&quot; button triggers on a stock transfer) instead of writing
          raw state fields directly, so Odoo&apos;s own business logic and side
          effects still run as intended. Handling partial failures
          explicitly: what happens if an order has five lines and the
          fourth one fails Odoo&apos;s own validation? And keeping a clear,
          reviewable record of what the integration actually created or
          changed, so a problem can be traced back to a specific call
          instead of guessed at.
        </p>
      </GuideSection>

      <GuideSection heading="Does using write-back mean giving up on read-only safety everywhere?">
        <p>
          No. Most real apps are a mix of both, applied per action rather
          than per app. A mobile sales app, for instance, reads stock levels
          and pricing (read-only) and then writes a new order on submit
          (write-back). The two patterns coexist inside one app; what
          matters is being deliberate about which specific action is which,
          rather than treating &quot;the app&quot; as a single monolithic risk level.
        </p>
      </GuideSection>

      <GuideSection heading="How does this affect cost and timeline?">
        <p>
          Write-back work generally costs more than an equivalent read-only
          feature, because of the extra validation, error-handling, and
          testing it needs to be done responsibly, not because the API
          call itself is harder to make. See the guide on custom Odoo app
          cost, linked below, for how this plays into overall pricing.
        </p>
      </GuideSection>

      <GuideSection heading="How do you decide which one a given project actually needs?">
        <p>
          Ask, for each specific screen or action: does this need to change
          something in Odoo, or only show something? If it&apos;s purely
          informational (a dashboard, a report, a status lookup), it&apos;s
          read-only. If someone needs to submit, confirm, approve, or record
          something that should end up as a real Odoo record, it&apos;s
          write-back. Most projects turn out to need a specific, identifiable
          mix of the two rather than being purely one or the other.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
