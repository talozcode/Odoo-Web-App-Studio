import type { Metadata } from "next";
import { StaticPageTemplate } from "@/components/seo/static-page";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL, CONTACT_EMAIL } from "@/config/site";

const CANONICAL_URL = `${SITE_URL}/privacy`;
const LAST_UPDATED = "September 18, 2026";

export const metadata: Metadata = {
  title: `Privacy Policy | ${BRAND_NAME}`,
  description: `What ${BRAND_NAME} collects through this website's contact form, how it's handled today, and what analytics (if any) are in use.`,
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <StaticPageTemplate
      breadcrumbLabel="Privacy"
      h1="Privacy Policy"
      subtitle={`Last updated ${LAST_UPDATED}`}
    >
      <p>
        This page describes, in plain terms, what actually happens with
        information submitted through this website, no more and no less.
        If anything here becomes inaccurate as the site changes, this page
        will be updated to match.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        What we collect
      </h2>
      <p>
        The only place this site collects personal information is the
        contact form. When it&apos;s submitted, it includes: your name, a work
        email address, your company name, which Odoo version you&apos;re on,
        which problem area(s) you selected, and your message describing the
        workflow you want help with. Nothing else is collected from you
        directly. There is no advertising pixel or third-party cookie on this
        site; the only script beyond the site itself is the cookieless
        page-view counter described below.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        What happens to it
      </h2>
      <p>
        A contact form submission is sent by email (via Resend, our
        transactional email provider) directly to the person who reads and
        replies to these, and is used solely to follow up with you about the
        project you described. It is not sent to a CRM, added to a marketing
        list, or sold, rented, or shared with any other organization.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Analytics and cookies
      </h2>
      <p>
        This site uses Vercel Web Analytics to see which pages get visited
        and roughly how much traffic the site gets. It doesn&apos;t use
        cookies, doesn&apos;t track you across other sites, and doesn&apos;t build
        an individual profile of any visitor; it counts anonymized,
        aggregate page views. There is no Google Analytics, no advertising
        pixel, no session-replay tool, and still no cookie banner, since
        nothing on this site sets a tracking cookie or requires consent to
        run. If that changes, this policy will be updated before any such
        tool goes live, not after.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Data retention and access
      </h2>
      <p>
        Contact form submissions are delivered as email and kept only in
        that inbox; there is no separate marketing database they&apos;re
        copied into. If you&apos;d like a submission you sent deleted or want
        to know what was received, contact us at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline"
        >
          {CONTACT_EMAIL}
        </a>{" "}
        and we&apos;ll take care of it directly.
      </p>

      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        Changes to this policy
      </h2>
      <p>
        As this site adds real infrastructure (a database, new analytics, or
        anything else that touches your data), this page will be updated in
        the same change that introduces it, so it always reflects what the
        site actually does rather than a generic template.
      </p>
    </StaticPageTemplate>
  );
}
