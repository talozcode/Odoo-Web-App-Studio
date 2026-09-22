import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { GUIDES } from "@/config/guides";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/config/site";

const CANONICAL_URL = `${SITE_URL}/guides`;

export const metadata: Metadata = {
  title: `Odoo Guides: API, Cost, Upgrades & Customization | ${BRAND_NAME}`,
  description:
    "Practical, technically accurate guides on Odoo integration, customization, API development, upgrade risk, and the real cost of a custom Odoo app.",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Odoo Guides: API, Cost, Upgrades & Customization",
    description:
      "Practical, technically accurate guides on Odoo integration, customization, and cost.",
    url: CANONICAL_URL,
    type: "website",
  },
};

export default function GuidesIndexPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: GUIDES.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      url: `${SITE_URL}/guides/${guide.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Straight answers about building on Odoo
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]">
              No vague marketing copy. These are the same practical
              explanations we&apos;d give in a real scoping conversation, written
              down so you don&apos;t have to ask first.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <ul className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
              {GUIDES.map((guide) => (
                <li key={guide.slug} className="border-b border-[var(--border)]">
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="group block py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-md"
                  >
                    <h2 className="text-xl font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--odoo-teal)]">
                      {guide.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {guide.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
