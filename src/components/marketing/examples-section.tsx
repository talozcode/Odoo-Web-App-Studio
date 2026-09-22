import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EXAMPLE_APPS, formatPriceFrom } from "@/config/examples";
import { findUseCasePageByExampleId } from "@/config/use-case-pages";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { ExamplePreview } from "@/components/demo-apps/example-preview";

export function ExamplesSection() {
  const [featured, ...rest] = EXAMPLE_APPS;
  const featuredPage = findUseCasePageByExampleId(featured.id);

  return (
    <section id="examples" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading title="One job. One simple app." />

        {/* Featured example: rendered larger and side-by-side with its demo,
            since one convincing interactive screen does more for credibility
            than six equally-weighted small ones. */}
        <div className="mt-12 grid grid-cols-1 items-center gap-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h3 className="text-2xl font-semibold text-[var(--foreground)]">
              {featuredPage ? (
                <Link
                  href={`/${featuredPage.slug}`}
                  className="hover:text-[var(--odoo-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-md"
                >
                  {featured.name}
                </Link>
              ) : (
                featured.name
              )}
            </h3>
            <p className="mt-1 text-base font-medium text-[var(--odoo-teal)]">
              {featured.flow}
            </p>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-[var(--muted-foreground)]">
              {featured.description} Try it below: scan a line, watch the
              count update, mark the order complete.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <p className="text-base font-semibold text-[var(--foreground)]">
                {formatPriceFrom(featured.priceFrom)}
              </p>
              {featuredPage ? (
                <ButtonLink href={`/${featuredPage.slug}`} variant="secondary">
                  Full details
                </ButtonLink>
              ) : null}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <ExamplePreview app={featured} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((app) => {
            const useCasePage = findUseCasePageByExampleId(app.id);

            return (
              <article
                key={app.id}
                className="flex flex-col rounded-xl border border-[var(--border)] p-6"
              >
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {useCasePage ? (
                    <Link
                      href={`/${useCasePage.slug}`}
                      className="hover:text-[var(--odoo-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-md"
                    >
                      {app.name}
                    </Link>
                  ) : (
                    app.name
                  )}
                </h3>
                <p className="mt-1 text-sm font-medium text-[var(--odoo-teal)]">
                  {app.flow}
                </p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {app.description}
                </p>

                <div className="mt-5 flex justify-center">
                  <ExamplePreview app={app} />
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {formatPriceFrom(app.priceFrom)}
                  </p>
                  {useCasePage ? (
                    <Link
                      href={`/${useCasePage.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-[var(--odoo-teal)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-md"
                    >
                      Full details
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
