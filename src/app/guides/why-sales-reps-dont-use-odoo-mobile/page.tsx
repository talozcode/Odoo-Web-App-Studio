import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const SLUG = "why-sales-reps-dont-use-odoo-mobile";
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
        { href: "/odoo-sales-app", label: "Odoo sales / mobile ordering app" },
        { href: "/guides/odoo-customization-vs-custom-apps", label: "Odoo customization vs. custom apps" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs. write-back Odoo integrations" },
      ]}
    >
      <GuideSection heading="Why do reps stop using Odoo in the field, even when it's set up correctly?">
        <p>
          Because Odoo&apos;s CRM and Sales apps, like most full ERP interfaces,
          are built desktop-first: lots of fields, menus, and options
          available on one screen, which is genuinely useful for someone
          sitting at a computer managing a full pipeline. A rep standing in
          front of a customer, working from a phone, is in a completely
          different context, and a full-featured interface that wasn&apos;t
          designed for a small screen and a rushed moment tends to feel
          slow and cluttered exactly when speed matters most.
        </p>
      </GuideSection>

      <GuideSection heading="What actually happens when adoption drops like this?">
        <p>
          Reps don&apos;t stop selling, they stop entering data where it
          belongs. The order gets written on paper, typed into a personal
          notes app, or sent over a messaging app to someone back at the
          office to enter later. The sale still happens, but it takes longer
          to reach Odoo, sometimes with details lost or altered in the
          hand-off, and Odoo&apos;s own records fall behind what&apos;s actually
          happening in the field. It&apos;s a well-documented pattern:
          the problem usually isn&apos;t reluctance to use software, it&apos;s a
          genuine mismatch between the interface and the moment it&apos;s being
          used in.
        </p>
      </GuideSection>

      <GuideSection heading="What do reps actually need, in the moment, to make a sale?">
        <p>
          Almost always the same three things, in the same order: pick the
          customer they&apos;re standing in front of, add the products being
          ordered, submit it. That&apos;s the entire field workflow for most
          in-person or on-site sales, and it doesn&apos;t require anything else
          Odoo&apos;s full Sales app also shows, like pipeline stages, marketing
          fields, or reporting views that only matter back at a desk.
        </p>
      </GuideSection>

      <GuideSection heading="Why is a narrow 3-screen app a better answer than more training on the full app?">
        <p>
          Because the problem isn&apos;t knowledge, it&apos;s fit. More training on
          Odoo&apos;s full Sales app doesn&apos;t make a desktop-oriented interface
          fit a rushed, one-handed, small-screen moment any better; it just
          asks reps to work around the mismatch more diligently. A purpose-built
          three-screen flow, by contrast, mirrors exactly what a rep does in
          the field and nothing more, which is precisely the kind of
          narrow-but-exact fit that tends to actually get used rather than
          worked around.
        </p>
      </GuideSection>

      <GuideSection heading="Does the order actually end up in Odoo, or somewhere separate?">
        <p>
          It should end up as a real <code>sale.order</code> written directly
          into Odoo through its API on submit, the same underlying record a
          rep entering it through Odoo&apos;s own Sales app would create. This
          is a write-back integration, not a read-only lookup tool, so it
          needs the same care around validation and authenticated,
          per-user submission that any write-back build does; see the
          read-only vs. write-back guide, linked below, for what that
          involves.
        </p>
      </GuideSection>

      <GuideSection heading="How does this match what's already built for this use case?">
        <p>
          Directly: this is exactly the pattern behind the sales / mobile
          ordering app on this site, linked below, with its own live demo of
          the customer-products-submit flow. The three-screen shape isn&apos;t a
          simplification for its own sake, it&apos;s what the actual field
          workflow already looks like once everything not needed in that
          moment is left out.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
