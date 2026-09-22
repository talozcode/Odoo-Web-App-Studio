import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { CONTACT_SECTION_ID, SITE_URL } from "@/config/site";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import type { GuideMeta } from "@/config/guides";

type RelatedLink = {
  href: string;
  label: string;
};

/**
 * One H2 section of a guide. Kept intentionally plain (a heading + prose)
 * so each section reads as a self-contained, quotable question/answer block,
 * the structure that both search snippets and LLM answer-extraction favor.
 */
export function GuideSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
        {heading}
      </h2>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

export function GuidePageTemplate({
  meta,
  children,
  relatedLinks,
}: {
  meta: GuideMeta;
  children: ReactNode;
  relatedLinks?: RelatedLink[];
}) {
  const canonicalUrl = `${SITE_URL}/guides/${meta.slug}`;

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Guides", url: `${SITE_URL}/guides` },
    { name: meta.title, url: canonicalUrl },
  ];

  const readableDate = new Date(meta.datePublished).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: meta.title,
          description: meta.description,
          url: canonicalUrl,
          datePublished: meta.datePublished,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />

      <SiteHeader />

      <main className="flex-1">
        <nav aria-label="Breadcrumb" className="border-b border-[var(--border)]">
          <ol className="mx-auto flex max-w-3xl flex-wrap items-center gap-1.5 px-4 py-3 text-sm text-[var(--muted-foreground)] sm:px-6 lg:px-8">
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
            <li>
              <Link
                href="/guides"
                className="rounded-md hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)]"
              >
                Guides
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-[var(--foreground)] truncate">
              {meta.title}
            </li>
          </ol>
        </nav>

        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {meta.title}
          </h1>
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            Published {readableDate}
          </p>

          <div className="prose-content mt-8 flex flex-col gap-8 text-base leading-relaxed text-[var(--muted-foreground)]">
            {children}
          </div>

          {relatedLinks && relatedLinks.length > 0 ? (
            <div className="mt-14 border-t border-[var(--border)] pt-8">
              <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
                Related pages
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
          ) : null}
        </article>

        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              Want this looked at for your setup?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-[var(--muted-foreground)]">
              Every Odoo instance is configured a little differently. Tell us
              what you&apos;re working with and we&apos;ll give you a straight answer.
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
