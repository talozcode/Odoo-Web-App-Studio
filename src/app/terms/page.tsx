import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StaticPageTemplate } from "@/components/seo/static-page";
import { BRAND_NAME } from "@/config/brand";
import { CONTACT_EMAIL } from "@/config/site";

const LAST_UPDATED = "22 September 2026";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    `Basic terms for engaging ${BRAND_NAME} to build a custom Odoo-connected app: how projects are scoped, quoted, and delivered.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <StaticPageTemplate
      path="/terms"
      breadcrumbLabel="Terms"
      h1="Terms of Service"
      subtitle={`Last updated ${LAST_UPDATED}`}
    >
      <p>
        These terms cover how engagements with {BRAND_NAME} generally work.
        They&apos;re intentionally plain: this is a small services business, not
        a large vendor with a dense standard contract, and any
        project-specific terms (deliverables, timeline, price) are agreed in
        writing before work starts, separately from this page.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Engagement basis
      </h2>
      <p>
        Work is project-based. Nothing is built on spec or assumed: every
        project starts with a scoping conversation about the specific
        workflow involved, followed by a quote covering what will be built,
        at what price, before any development work begins. If scope changes
        materially after work starts, that&apos;s discussed and re-quoted rather
        than absorbed silently or billed without agreement.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Quotes and pricing
      </h2>
      <p>
        The price ranges shown on this site (in the pricing section and on
        individual use-case pages) are starting points for typical scope,
        not fixed prices for every possible variation of that kind of app.
        A firm quote is only given after understanding the actual workflow,
        which Odoo data it touches, and whether it needs to read data,
        write data back to Odoo, or both.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Access to your Odoo instance
      </h2>
      <p>
        Where a project needs to connect to your Odoo instance, that access
        is scoped to what the specific integration requires (typically a
        dedicated API user with limited permissions) rather than requested
        as broad admin access by default. Credentials you provide are used
        only for the agreed project work.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        No guarantees beyond what&apos;s explicitly agreed
      </h2>
      <p>
        We don&apos;t make service-level guarantees, uptime commitments, or
        support-response-time promises on this website, because none
        currently exist as a standard offering. If a specific project
        includes hosting, maintenance, or support terms, those are written
        into that project&apos;s own agreement rather than implied here.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Ownership
      </h2>
      <p>
        Unless otherwise agreed in a specific project&apos;s terms, the
        custom application code built for a client belongs to that client
        once the engagement is paid in full. This site&apos;s own branding,
        copy, and demo components remain the property of {BRAND_NAME}.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Changes to these terms
      </h2>
      <p>
        These general terms may be updated as the business grows; any
        active project is governed by the terms agreed at the time that
        project started. Questions about a specific engagement can be sent
        to{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </StaticPageTemplate>
  );
}
