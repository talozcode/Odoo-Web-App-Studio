import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";
import { PRICING_TIERS } from "@/config/pricing";
import { EXAMPLE_APPS } from "@/config/examples";

const SLUG = "how-much-does-a-custom-odoo-app-cost";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export default function Guide() {
  const tinyTier = PRICING_TIERS.find((t) => t.id === "tiny")!;
  const appTier = PRICING_TIERS.find((t) => t.id === "app")!;
  const warehousePrice = formatPrice(
    EXAMPLE_APPS.find((a) => a.id === "warehouse-picking")!.priceFrom
  );
  const portalPrice = formatPrice(
    EXAMPLE_APPS.find((a) => a.id === "customer-ordering-portal")!.priceFrom
  );

  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/#pricing", label: "Pricing" },
        { href: "/guides/odoo-customization-vs-custom-apps", label: "Odoo customization vs. custom apps" },
        { href: "/custom-odoo-web-app", label: "Custom Odoo web apps" },
      ]}
    >
      <GuideSection heading="Why is 'it depends' actually the honest answer?">
        <p>
          Because the cost of a custom Odoo-connected app is driven almost
          entirely by how many distinct concerns it has to get right:
          authentication, how many Odoo models it reads or writes, whether
          it needs to handle edge cases like partial stock or backorders,
          how many user roles see different things. Two apps that sound
          similar in one sentence (&quot;a portal for our customers&quot;) can differ
          in cost by a wide margin depending on those specifics. That said,
          vague &quot;contact us for pricing&quot; isn&apos;t useful either, so here are
          real numbers.
        </p>
      </GuideSection>

      <GuideSection heading="What does a small, single-screen app typically cost?">
        <p>
          The smallest tier ({tinyTier.name}) is priced {tinyTier.price.toLowerCase()},
          for something like {tinyTier.examples.join(", ").toLowerCase()}.
          These are one-screen, one-workflow builds: a single Odoo model,
          a single clear action, no user roles to manage.
        </p>
      </GuideSection>

      <GuideSection heading="What does a full multi-screen app typically cost?">
        <p>
          A polished, multi-screen application built around one workflow
          (the kind of build behind most of the example apps on this site)
          typically falls in the {appTier.price} range. Where a specific
          build lands in that range depends on how many screens it needs,
          how many Odoo models it touches, and whether it only reads data
          or also writes back to Odoo (write-back integrations generally
          cost more, since they need more careful validation and error
          handling; see the guide on that distinction linked below). As a
          concrete anchor: a warehouse picking app starts at{" "}
          {warehousePrice}, while a customer ordering portal (which has to
          handle authentication, a per-customer catalog, and checkout)
          starts at {portalPrice}.
        </p>
      </GuideSection>

      <GuideSection heading="What pushes a project into 'let's talk' territory?">
        <p>
          Anything that stops being one focused workflow: multiple
          integrated apps, a system with several distinct user roles each
          seeing different data, or a workflow that turns out to need
          changes inside Odoo itself (a custom module) in addition to the
          external app. These are quoted individually rather than against a
          fixed tier, because at that scope the cost genuinely depends on
          specifics that a landing page can&apos;t responsibly generalize.
        </p>
      </GuideSection>

      <GuideSection heading="What's the single biggest cost driver most people underestimate?">
        <p>
          Whether the app needs to write back to Odoo, and how carefully.
          A read-only dashboard just displays numbers. If a query is
          slightly wrong, the fix is trivial and nothing in Odoo is at
          risk. An app that creates sales orders, confirms purchase orders,
          or updates stock has to handle what happens when a write fails
          partway through, when the data submitted doesn&apos;t actually satisfy
          Odoo&apos;s own validation, and when two people try to act on the same
          record at once. That extra care is real engineering time, and
          it&apos;s usually the difference between the low end and the high end
          of a given app&apos;s estimate.
        </p>
      </GuideSection>

      <GuideSection heading="How is a final number actually reached?">
        <p>
          Through a short scoping conversation about the actual workflow:
          which Odoo models it touches, how many screens, read-only or
          write-back, how many user roles. That&apos;s a more useful process
          than a generic quote calculator, since two projects with the same
          one-line description can have meaningfully different scope once
          the details are on the table.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
