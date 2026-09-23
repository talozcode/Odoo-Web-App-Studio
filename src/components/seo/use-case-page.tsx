import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { CONTACT_NAV_LABEL, CONTACT_SECTION_ID, SITE_URL } from "@/config/site";
import { formatPriceFrom } from "@/config/examples";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import type { FaqItem } from "@/config/faq";

type Section = {
  heading: string;
  body: ReactNode;
};

type RelatedLink = {
  href: string;
  label: string;
};

export type UseCasePageTemplateProps = {
  /** Short label used in the breadcrumb trail, e.g. "Odoo Warehouse App". */
  breadcrumbLabel: string;
  h1: string;
  intro: string;
  demo: ReactNode;
  demoCaption?: string;
  sections: Section[];
  priceFrom?: number;
  priceNote?: string;
  faqHeading?: string;
  faqs: FaqItem[];
  relatedLinks?: RelatedLink[];
  /** Additional JSON-LD objects (e.g. a Service schema) to emit on this page. */
  extraJsonLd?: Record<string, unknown>[];
  canonicalUrl: string;
};

export function UseCasePageTemplate({
  breadcrumbLabel,
  h1,
  intro,
  demo,
  demoCaption,
  sections,
  priceFrom,
  priceNote,
  faqHeading = "Questions about this use case",
  faqs,
  relatedLinks,
  extraJsonLd = [],
  canonicalUrl,
}: UseCasePageTemplateProps) {
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: breadcrumbLabel, url: canonicalUrl },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      {faqs.length > 0 ? <JsonLd data={faqPageSchema(faqs)} /> : null}
      {extraJsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}

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
              {breadcrumbLabel}
            </li>
          </ol>
        </nav>

        <section className="border-b border-[var(--border)]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:px-8">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
                {h1}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]">
                {intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={`/#${CONTACT_SECTION_ID}`}>
                  Tell us what you want to simplify
                </ButtonLink>
                <ButtonLink href="/#examples" variant="secondary">
                  All example apps and prices
                </ButtonLink>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              {demo}
              {demoCaption ? (
                <p className="text-center text-xs text-[var(--muted-foreground)]">
                  {demoCaption}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {sections.map((section) => (
          <section key={section.heading} className="border-b border-[var(--border)]">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {section.heading}
              </h2>
              <div className="prose-content mt-4 space-y-4 text-base leading-relaxed text-[var(--muted-foreground)]">
                {section.body}
              </div>
              </div>
            </div>
          </section>
        ))}

        {priceFrom !== undefined ? (
          <section className="border-b border-[var(--border)]">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-14 sm:grid-cols-[minmax(0,12rem)_minmax(0,36rem)] sm:gap-10 sm:px-6 lg:px-8">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">Pricing</h2>
                <p className="mt-1 text-3xl font-semibold tabular-nums text-[var(--foreground)]">
                  {formatPriceFrom(priceFrom)}
                </p>
              </div>
              <div>
                {priceNote ? (
                  <p className="max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {priceNote}
                  </p>
                ) : null}
                <div className="mt-5">
                  <ButtonLink href={`/#${CONTACT_SECTION_ID}`}>
                    {CONTACT_NAV_LABEL}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {relatedLinks && relatedLinks.length > 0 ? (
          <section className="border-b border-[var(--border)]">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Related reading
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {faqs.length > 0 ? (
          <section className="border-b border-[var(--border)]">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {faqHeading}
              </h2>
              <div className="mt-8 max-w-3xl">
                <Accordion items={faqs} />
              </div>
            </div>
          </section>
        ) : null}

        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              Have a workflow like this?
            </h2>
            <p className="mt-3 max-w-xl text-base text-[var(--muted-foreground)]">
              Tell us what&apos;s slow or manual today. We&apos;ll tell you honestly
              whether a focused app is the right fix.
            </p>
            <div className="mt-6">
              <ButtonLink href={`/#${CONTACT_SECTION_ID}`}>
                Tell us what you want to simplify
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
