import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "odoo-customization-vs-custom-apps";
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
        { href: "/odoo-api-development", label: "Odoo API development" },
        { href: "/guides/how-much-does-a-custom-odoo-app-cost", label: "How much does a custom Odoo app cost?" },
        { href: "/#pricing", label: "Pricing" },
      ]}
    >
      <GuideSection heading="What counts as 'Odoo customization'?">
        <p>
          Customization means changing Odoo from the inside: adding fields
          and adjusting layouts through Odoo Studio, writing a custom Odoo
          module (Python models, XML views, security rules) that installs
          alongside standard apps, or modifying business logic by
          inheriting existing models. The result runs inside Odoo&apos;s own
          process, uses Odoo&apos;s own view framework (form, list, kanban,
          pivot), and is upgraded, backed up, and deployed as part of Odoo
          itself.
        </p>
      </GuideSection>

      <GuideSection heading="What counts as a 'custom app' in this context?">
        <p>
          A custom app, by contrast, is a separate piece of software (its
          own front end, its own server if it needs one) that talks to
          Odoo over its external API (XML-RPC or JSON-RPC) rather than
          running inside Odoo. It reads and writes Odoo records the same
          way any other authenticated client would, but the interface, the
          hosting, and the release cycle are all independent of Odoo&apos;s.
        </p>
      </GuideSection>

      <GuideSection heading="What are the real tradeoffs between them?">
        <p>
          Customization keeps everything in one system and gives users
          Odoo&apos;s built-in conveniences (chatter/logging, activities,
          automated actions) for free, but it&apos;s constrained by Odoo&apos;s
          own view framework: genuinely simplifying a screen for a
          non-technical user is limited by what a form or list view can be
          configured to look like. And it&apos;s coupled to Odoo&apos;s
          module and upgrade mechanics, meaning changes need to be tested
          against every future Odoo upgrade.
        </p>
        <p>
          A custom app decouples the interface entirely: it can look like
          anything, be as simple as one button, and run on hardware or for
          an audience (customers, suppliers, a warehouse handheld) that
          shouldn&apos;t have Odoo backend access at all. The tradeoff is
          that it introduces an integration layer to maintain: a piece of
          software whose correctness depends on Odoo&apos;s API continuing to
          behave the way it was built against.
        </p>
      </GuideSection>

      <GuideSection heading="When does customization make more sense?">
        <p>
          When the change is genuinely part of an internal Odoo user&apos;s
          existing workflow (an extra required field on a form that
          internal staff already fill out, a validation rule, an approval
          routing change that other Odoo automations depend on), it usually
          belongs inside Odoo. Internal users who already live in Odoo all
          day benefit from the change appearing right where they&apos;re
          already working, rather than in a second app to switch to.
        </p>
      </GuideSection>

      <GuideSection heading="When does a separate custom app make more sense?">
        <p>
          When the audience is external (customers, suppliers) or mobile
          field workers who shouldn&apos;t be given Odoo backend access;
          when the interface needs to be dramatically simpler than any Odoo
          view configuration can achieve (one screen, one action, nothing
          else visible); or when the workflow doesn&apos;t map to Odoo&apos;s
          data model at all and would mean bolting an unrelated concern onto
          the ERP. In all three cases, a focused external app is usually
          both faster to build well and safer to change later than trying to
          force the same result out of Odoo&apos;s own view layer.
        </p>
      </GuideSection>

      <GuideSection heading="Can you combine both approaches?">
        <p>
          Often, yes, and it&apos;s a common pattern in practice: a small,
          targeted Odoo module adds one API-friendly field, computed value,
          or callable method inside Odoo, while the actual user-facing
          interface lives entirely in a separate app. That keeps the
          in-Odoo change minimal (and therefore low-risk across upgrades)
          while still giving the external app exactly the data or action it
          needs.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
