import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";
import { BRAND_NAME } from "@/config/brand";

const SLUG = "odoo-developer-vs-web-app-studio";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/about", label: `About ${BRAND_NAME}` },
        { href: "/#faq", label: "FAQ" },
        { href: "/guides/odoo-customization-vs-custom-apps", label: "Odoo customization vs. custom apps" },
      ]}
    >
      <GuideSection heading="What does an Odoo developer or implementation partner actually do?">
        <p>
          An Odoo developer or implementation partner works inside Odoo
          itself: configuring modules, building custom modules (Python
          models, XML views, security rules), migrating data during
          onboarding, and handling version upgrades of the Odoo instance as
          a whole. Their job is Odoo&apos;s correctness and configuration as a
          complete ERP: accounting, inventory, manufacturing, and
          everything else it runs.
        </p>
      </GuideSection>

      <GuideSection heading="What does a web app studio (like this one) do instead?">
        <p>
          A narrower, specific thing: building a standalone interface, a
          web app with its own front end, hosted independently, that
          connects to an already-running Odoo instance through its API. It
          doesn&apos;t touch Odoo&apos;s configuration, doesn&apos;t install Odoo
          modules by default, and isn&apos;t involved in Odoo&apos;s own upgrade
          process. The scope is one focused workflow layered on top of data
          that already lives correctly in Odoo.
        </p>
      </GuideSection>

      <GuideSection heading="When is an Odoo developer the right call?">
        <p>
          When the actual need is inside Odoo: a new required field on an
          existing form that internal staff already use, a change to
          approval routing that other Odoo automations depend on, a custom
          module that needs to run as part of Odoo&apos;s own business logic,
          or handling an Odoo version upgrade for a database with existing
          customizations. Anything that&apos;s fundamentally about changing
          how Odoo itself behaves belongs with someone who works inside
          Odoo&apos;s module and view framework day to day.
        </p>
      </GuideSection>

      <GuideSection heading="When is a web app studio the better fit?">
        <p>
          When the need is a small, standalone interface for a narrow
          audience or workflow that shouldn&apos;t (or can&apos;t reasonably)
          live inside Odoo&apos;s own backend: a mobile picking screen for
          warehouse staff, a branded ordering portal for customers, a
          dashboard for management, an approval screen for one specific
          process. The defining trait is that the interface itself, not
          Odoo&apos;s underlying configuration, is the thing that needs to
          change or be built.
        </p>
      </GuideSection>

      <GuideSection heading="Can the two overlap on the same project?">
        <p>
          Yes, and it&apos;s a common, sensible pattern: an Odoo developer
          adds one small, API-friendly field or method inside Odoo, while a
          web app studio builds the actual external interface that calls
          it. Neither role needs to cover the other&apos;s territory for that
          to work. It just means a project sometimes genuinely needs both,
          scoped as two separate, well-defined pieces of work rather than
          one vendor trying to do everything.
        </p>
      </GuideSection>

      <GuideSection heading="Why does this site say 'no' to some requests instead of taking every project?">
        <p>
          Because scope discipline is the whole point of the distinction
          above. The FAQ on this site is direct about it: asked &quot;can you
          build anything,&quot; the honest answer is no: if a request starts
          becoming another ERP, or is really an in-Odoo configuration or
          module change, Odoo itself (or an Odoo implementation partner) is
          the better place for it, not a web app studio stretching outside
          its actual expertise. That&apos;s meant as a trust signal, not a
          limitation to work around: it&apos;s the same honesty this guide is
          trying to give you about the developer-vs-studio choice itself.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
