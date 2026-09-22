import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WorkCaseRow } from "@/components/marketing/work-case";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { WORK_CASES, WORK_CONTEXT } from "@/config/work";
import { BRAND_NAME } from "@/config/brand";
import { CONTACT_SECTION_ID, SITE_URL } from "@/config/site";

const CANONICAL_URL = `${SITE_URL}/work`;

const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const COUNT = COUNT_WORDS[WORK_CASES.length] ?? String(WORK_CASES.length);

export const metadata: Metadata = {
  title: `Work: Odoo-connected apps in production | ${BRAND_NAME}`,
  description: `${COUNT.charAt(0).toUpperCase()}${COUNT.slice(1)} shipped apps and automations around one client's Odoo 18: barcode picking, a B2B ordering portal, a kitchen production board, container planning and more. Anonymised, all in daily use.`,
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Work: Odoo-connected apps in production",
    description: WORK_CONTEXT,
    url: CANONICAL_URL,
    type: "website",
  },
};

export default function WorkPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Odoo-connected apps built by OdooWebApps",
    itemListElement: WORK_CASES.map((c, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: c.title,
      url: `${CANONICAL_URL}#${c.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: SITE_URL }, { name: "Work", url: CANONICAL_URL }])} />
      <JsonLd data={itemListSchema} />
      <SiteHeader />

      <main className="flex-1">
        <nav aria-label="Breadcrumb" className="border-b border-[var(--border)]">
          <ol className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-3 text-sm text-[var(--muted-foreground)] sm:px-6 lg:px-8">
            <li>
              <Link
                href="/"
                className="rounded-md hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)]"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-[var(--foreground)]">
              Work
            </li>
          </ol>
        </nav>

        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
              What we have built around one real Odoo
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]">
              {WORK_CONTEXT} The client is not named here; the apps, models
              and numbers are as they are.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl divide-y divide-[var(--border)] px-4 sm:px-6 lg:px-8">
            {WORK_CASES.map((workCase, index) => (
              <WorkCaseRow key={workCase.slug} workCase={workCase} index={index} headingLevel="h2" />
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              Most of these started as one sentence about something slow.
            </h2>
            <div className="mt-6">
              <ButtonLink href={`/#${CONTACT_SECTION_ID}`}>Tell us what you want to simplify</ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
