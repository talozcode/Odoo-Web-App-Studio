import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Straight answers about building on Odoo
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]">
              No vague marketing copy. These are the same practical
              explanations we&apos;d give in a real scoping conversation, written
              down so you don&apos;t have to ask first.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {GUIDES.map((guide) => (
                <article
                  key={guide.slug}
                  className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)]"
                >
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="group flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface)]">
                      <Image
                        src={`/images/guides/${guide.slug}.webp`}
                        alt={`Illustration for the guide: ${guide.title}`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="flex items-start gap-2 text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--odoo-teal)]">
                        <span>{guide.title}</span>
                        <ArrowRight
                          aria-hidden="true"
                          className="mt-1 h-4 w-4 shrink-0 text-[var(--odoo-teal)] opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                        {guide.description}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
