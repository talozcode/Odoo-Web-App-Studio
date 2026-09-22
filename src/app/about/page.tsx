import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StaticPageTemplate } from "@/components/seo/static-page";
import { BRAND_NAME, BRAND_TAGLINE } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const CANONICAL_URL = `${SITE_URL}/about`;

export const metadata: Metadata = {
  title: `About | ${BRAND_NAME}`,
  description: `${BRAND_TAGLINE} What ${BRAND_NAME} builds, and why it deliberately stays narrow.`,
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: `About ${BRAND_NAME}`,
    description: BRAND_TAGLINE,
    url: CANONICAL_URL,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <StaticPageTemplate
      breadcrumbLabel="About"
      h1={`About ${BRAND_NAME}`}
      subtitle={BRAND_TAGLINE}
    >
      <Image
        src="/brand/odoowebapps-logo-stacked-transparent.png"
        alt={`${BRAND_NAME}: Odoo, simplified`}
        width={1024}
        height={1024}
        className="mx-auto -mt-2 h-40 w-auto sm:h-48"
      />
      <p>
        {BRAND_NAME} is a small studio that builds focused web apps for
        businesses already running Odoo. That&apos;s the whole scope, on
        purpose: not a general web development shop, not an Odoo
        implementation partner, not a replacement for Odoo. Just the apps
        that sit around Odoo and make one specific workflow noticeably
        easier for the people doing it.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        The core idea
      </h2>
      <p>
        Odoo does everything a business generally needs: accounting,
        inventory, sales, purchasing, manufacturing, master data, business
        logic. That&apos;s a real strength, not a weakness. But the people
        interacting with any one of those systems on a given day usually
        don&apos;t need everything Odoo can do. A warehouse picker doesn&apos;t need
        general ledger access, and a customer reordering the same three
        products doesn&apos;t need to understand pricelists and fiscal
        positions. Most of the friction people describe as &quot;Odoo is
        confusing&quot; is really that mismatch: a general-purpose backend
        being used as the interface for a narrow, repetitive task.
      </p>
      <p>
        The fix, in most cases, isn&apos;t more Odoo customization or more
        training. It&apos;s a small, separate app, connected to Odoo through
        its API, built around exactly one workflow, for exactly one kind
        of user. Odoo stays the single source of truth; the app is just a
        better front door to one part of it.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        How the model works
      </h2>
      <p>
        Each project starts with a specific workflow, not a feature list:
        what&apos;s currently slow, manual, or worked around on paper or in a
        spreadsheet. From there, the scope is deliberately kept to what that
        workflow actually needs: one or two screens, a handful of Odoo
        models, one clear job done well, rather than a second
        general-purpose system growing alongside Odoo.
      </p>
      <p>
        See{" "}
        <Link
          href="/guides/odoo-customization-vs-custom-apps"
          className="font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline"
        >
          Odoo customization vs. custom apps
        </Link>{" "}
        for a fuller breakdown of when a change belongs inside Odoo itself
        versus in a separate app,{" "}
        <Link
          href="/#examples"
          className="font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline"
        >
          the example apps
        </Link>{" "}
        for the kinds of workflows this typically applies to, and{" "}
        <Link
          href="/guides/odoo-developer-vs-web-app-studio"
          className="font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline"
        >
          Odoo developer vs. web app studio
        </Link>{" "}
        for how this fits alongside Odoo implementation partners rather than
        competing with them.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Who&apos;s behind this
      </h2>
      <p>
        {BRAND_NAME} is a new name, but not a new skill set. Behind it is
        over five years of hands-on Odoo implementation work: configuring
        Odoo for real businesses, and building the automations and
        integrations that keep it running smoothly once the initial setup is
        done. This site exists because that work kept turning up the same
        pattern, over and over: the fix a team actually needed was rarely
        &quot;more Odoo.&quot; It was one small, focused app sitting outside
        it, talking to it through its API.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Where things stand
      </h2>
      <p>
        The brand is new; the experience isn&apos;t. Rather than pad this
        page with claims that aren&apos;t true, the honest version is
        simpler: the approach above is the actual approach, the example apps
        on the homepage are real working demonstrations of the pattern (not
        mockups of hypothetical clients), and every project is scoped and
        quoted individually through a direct conversation, based on the
        specific Odoo setup and workflow in front of it. See{" "}
        <Link
          href="/#contact"
          className="font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline"
        >
          the contact section
        </Link>{" "}
        to start one.
      </p>
    </StaticPageTemplate>
  );
}
