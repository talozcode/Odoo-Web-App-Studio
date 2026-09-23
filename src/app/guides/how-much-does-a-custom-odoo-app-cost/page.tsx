import type { Metadata } from "next";
import Link from "next/link";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { ComparisonTable } from "@/components/seo/code-block";
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

const LINK =
  "font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline";

const price = (id: string) => EXAMPLE_APPS.find((a) => a.id === id)!.priceFrom;

export default function Guide() {
  const tinyTier = PRICING_TIERS.find((t) => t.id === "tiny")!;
  const appTier = PRICING_TIERS.find((t) => t.id === "app")!;
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/#pricing", label: "Pricing" },
        { href: "/guides/odoo-customization-vs-custom-apps", label: "Odoo customization vs. custom apps" },
        { href: "/custom-odoo-web-app", label: "Custom Odoo web apps" },
        { href: "/guides/odoo-implementation-partner-cost", label: "Odoo implementation partner cost" },
      ]}
    >
      <GuideSection heading="What does a custom Odoo app cost? The short answer">
        <p>
          On this site, {tinyTier.price.toLowerCase()} for a single focused
          screen and typically {appTier.price} for a polished multi-screen
          app built around one workflow. Those are real starting prices for
          apps that sit next to Odoo and talk to it through its API, not
          ranges invented for a pricing page. Bigger systems are quoted
          individually. The table below is the whole price list.
        </p>
        <ComparisonTable
          caption="Starting prices by app type"
          headers={["App", "From", "What that covers"]}
          rows={[
            [
              "Custom single workflow",
              formatPrice(price("custom-workflow")),
              "One screen, one Odoo model, one clear action. An approval, a simple report, a small data entry tool",
            ],
            [
              "Management dashboard",
              formatPrice(price("management-dashboard")),
              "Read-only KPIs and charts from live Odoo data. No writes, so the least risk and the least validation work",
            ],
            [
              "Warehouse picking app",
              formatPrice(price("warehouse-picking")),
              "Mobile picking against stock.picking, writing quantities back. One warehouse, one operation type",
            ],
            [
              "Sales ordering app",
              formatPrice(price("sales-app")),
              "Customer, products, submit. Creates and confirms real sale orders from a phone",
            ],
            [
              "Supplier portal",
              formatPrice(price("supplier-portal")),
              "External users, purchase orders, confirmations written back to Odoo",
            ],
            [
              "Customer ordering portal",
              formatPrice(price("customer-ordering-portal")),
              "Authentication, a per-customer catalogue and prices, checkout into Odoo Sales",
            ],
            [
              "Bigger idea",
              "Quoted",
              "Several apps, several user roles, or work inside Odoo as well as outside it",
            ],
          ]}
        />
      </GuideSection>

      <GuideSection heading="How does that compare to an Odoo module or an implementation?">
        <p>
          These are three different things that get quoted very differently,
          and mixing them up is why cost research on Odoo is confusing. A
          licence is what you pay Odoo. An implementation is configuring
          Odoo for your business. A custom module changes Odoo from the
          inside. A connected app leaves Odoo alone and adds one screen next
          to it.
        </p>
        <ComparisonTable
          caption="What you are actually buying"
          headers={["", "Typically priced as", "Who does it", "What it changes"]}
          rows={[
            ["Odoo licence", "Per user per month, from Odoo", "Odoo", "Nothing; it is the subscription"],
            ["Implementation", "Day rate or fixed project, usually five figures", "Partner or integrator", "Your Odoo configuration and data"],
            ["Custom module", "Day rate, per module", "Odoo developer or partner", "Code inside your Odoo database"],
            ["Connected app", `Fixed price per app, ${tinyTier.price.toLowerCase()} to ${appTier.price.split("-")[1]} here`, "A studio like this one", "Nothing inside Odoo; one app beside it"],
          ]}
        />
        <p>
          Quotes you see elsewhere are often hourly. At the rates Odoo
          freelancers and partners commonly charge, a fixed price of{" "}
          {formatPrice(price("warehouse-picking"))} for a picking app is a
          small number of days of work, which is exactly what it is. The
          reason it can be a fixed number at all is the narrow scope: one
          workflow, one or two Odoo models, no reimplementation.
        </p>
      </GuideSection>

      <GuideSection heading="What actually moves the price within a tier?">
        <ComparisonTable
          caption="Cost drivers, in rough order of impact"
          headers={["Driver", "Cheaper", "More expensive"]}
          rows={[
            ["Reads or writes", "Read-only display", "Creates and confirms records in Odoo"],
            ["Screens", "One screen", "A flow across several screens"],
            ["Odoo models", "One model", "Several models with relations between them"],
            ["Users", "Internal staff on one company", "External users, several roles, multi-company"],
            ["Edge cases", "Happy path only", "Partial stock, backorders, lots and expiry, concurrent edits"],
            ["Data quality", "Clean, consistent Odoo data", "Configuration that has to be fixed first"],
          ]}
        />
        <p>
          The one people underestimate is the first row. A read-only
          dashboard that is slightly wrong is a trivial fix and nothing in
          Odoo is at risk. An app that creates sales orders or updates stock
          has to handle a write failing partway, data that does not satisfy
          Odoo&apos;s own validation, and two people acting on the same
          record at once. That care is the difference between the low and
          high end of any estimate; see{" "}
          <Link href="/guides/odoo-write-back-vs-read-only-integrations" className={LINK}>
            read-only vs write-back integrations
          </Link>
          .
        </p>
      </GuideSection>

      <GuideSection heading="Why is 'it depends' the usual answer everywhere else?">
        <p>
          Because most Odoo work quoted online is implementation work, where
          the scope genuinely is open-ended: how many modules, how much data
          migration, how many people to train. That is a real reason for a
          range. It stops being a good reason when the question is much
          smaller, as it is here: one workflow, one screen or two, a handful
          of Odoo models. At that size the honest answer is a number, which
          is why the table above exists.
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
