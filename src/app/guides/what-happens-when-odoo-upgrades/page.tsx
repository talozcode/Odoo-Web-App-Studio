import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "what-happens-when-odoo-upgrades";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/guides/odoo-api-integration-explained", label: "How Odoo's API actually works" },
        { href: "/guides/odoo-customization-vs-custom-apps", label: "Odoo customization vs. custom apps" },
        { href: "/odoo-api-development", label: "Odoo API development" },
      ]}
    >
      <GuideSection heading="Why do Odoo upgrades worry people in the first place?">
        <p>
          Odoo ships a new major version roughly once a year, and upgrading
          a live database, especially one with custom modules installed
          inside it, is a genuinely well-known risk area. Custom modules
          need to be migrated to whatever changed in the new version&apos;s
          module API and ORM conventions before they&apos;ll even install, view
          XML can reference fields that moved or were renamed, and any
          custom Python code that inherited a standard model needs to be
          checked against whatever changed in that model upstream.
        </p>
      </GuideSection>

      <GuideSection heading="How is a separate custom app affected differently?">
        <p>
          A custom app that lives outside Odoo and talks to it only through
          the external API isn&apos;t part of the Odoo upgrade process at all:
          there&apos;s no module to migrate, no view XML to update, nothing that
          needs to be reinstalled. It keeps running exactly as it did
          before, continuing to call the same API methods against the newly
          upgraded database. The only way it breaks is if the upgrade
          changed something about the specific fields or methods that app
          actually calls, which is a much smaller and more predictable
          surface than &quot;everything installed inside Odoo.&quot;
        </p>
      </GuideSection>

      <GuideSection heading="What could specifically break in a custom app after an upgrade?">
        <p>
          In practice, it&apos;s usually one of a short list: a field the app
          reads or writes was renamed or removed on the Odoo side; a model
          gained a new required field, so a <code>create</code> call that
          didn&apos;t set it starts failing; a business method the app calls
          changed its expected arguments; or an access right or security
          group configuration changed in a way that now blocks the API
          user from something it used to be able to do. None of these are
          exotic. They&apos;re the same kind of change that could affect any
          integration against any evolving system.
        </p>
        <p>
          One version-specific item is worth planning for now: Odoo 19
          introduced a new HTTP API, JSON-2, and marked the older XML-RPC and
          JSON-RPC endpoints deprecated, with removal scheduled for Odoo 22
          (fall 2028). An app built on JSON-RPC keeps working through Odoo
          19, 20 and 21, but its transport layer needs swapping before an
          upgrade to 22. The model and method names stay the same, so in a
          well-structured app that swap is confined to one file.
        </p>
      </GuideSection>

      <GuideSection heading="What's a practical checklist after an Odoo upgrade?">
        <p>
          Before an upgrade reaches the production Odoo database: run the
          custom app&apos;s actual API calls against a staging copy of the
          upgraded instance first, not production directly. Check Odoo&apos;s
          own release notes for the specific modules the app depends on
          (Sales, Inventory, Purchase, whichever apply). Confirm the
          dedicated API user&apos;s access rights and any assigned security
          groups still exist and mean the same thing. And re-verify the
          field types and shapes for the specific models the app touches,
          since even a subtle type change (a field that used to be a plain
          string becoming a selection field, for instance) can cause silent
          data issues rather than an obvious error.
        </p>
      </GuideSection>

      <GuideSection heading="How much of this risk is avoidable by how the app is built?">
        <p>
          A meaningful amount. An integration built to fail loudly and
          specifically (a clear error naming the field or method that
          didn&apos;t behave as expected) is far easier to fix after an upgrade
          than one that fails silently or produces subtly wrong data. So is
          one that keeps every Odoo-specific field name and model reference
          in a small, identifiable part of the codebase rather than
          scattered everywhere. That turns &quot;check if this upgrade broke
          anything&quot; into reviewing a short, known list instead of an
          open-ended search.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
