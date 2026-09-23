import Link from "next/link";
import { PRICING_TIERS, HOSTING_NOTE } from "@/config/pricing";
import { EXAMPLE_APPS, formatPriceFrom } from "@/config/examples";
import { findUseCasePageByExampleId } from "@/config/use-case-pages";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { CONTACT_SECTION_ID } from "@/config/site";
import { cn } from "@/lib/utils";

const APP_TIER_EXAMPLES = EXAMPLE_APPS.filter((app) => app.id !== "custom-workflow");

/**
 * Three tiers as rows, not three lifted cards. The App row doubles as the
 * catalogue of example apps (each linking to its own page), which is why it
 * carries the #examples anchor.
 */
export function PricingSection() {
  return (
    <section id="pricing" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          align="left"
          title="Prices for small, scoped projects"
          description="Every project is scoped to one workflow, so the starting price is known before the conversation starts."
        />

        <div className="mt-12 border-t border-[var(--border)]">
          {PRICING_TIERS.map((tier) => {
            const highlighted = tier.id === "app";
            return (
              <div
                key={tier.id}
                id={highlighted ? "examples" : undefined}
                className={cn(
                  "grid grid-cols-1 gap-6 border-b border-[var(--border)] py-8 pl-5 lg:grid-cols-[11rem_1fr] lg:gap-12 lg:py-10",
                  highlighted
                    ? "border-l-4 border-l-[var(--odoo-teal)]"
                    : "border-l-4 border-l-transparent"
                )}
              >
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{tier.name}</h3>
                  {tier.priceQualifier ? (
                    <p className="mt-1 text-sm font-normal text-[var(--muted-foreground)]">
                      {tier.priceQualifier}
                    </p>
                  ) : null}
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
                    {tier.price}
                  </p>
                </div>

                <div>
                  <p className="max-w-xl text-base text-[var(--muted-foreground)]">
                    {tier.description}
                  </p>

                  {tier.examples.length > 0 ? (
                    <p className="mt-3 text-sm text-[var(--foreground)]">
                      {tier.examples.join(", ")}.
                    </p>
                  ) : null}

                  {highlighted ? (
                    <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                      {APP_TIER_EXAMPLES.map((app) => {
                        const page = findUseCasePageByExampleId(app.id);
                        return (
                          <li
                            key={app.id}
                            className="flex items-baseline justify-between gap-4 border-b border-dotted border-[var(--border)] pb-2"
                          >
                            {page ? (
                              <Link
                                href={`/${page.slug}`}
                                className="text-sm font-medium text-[var(--foreground)] underline decoration-[var(--odoo-gray)]/60 underline-offset-4 hover:text-[var(--odoo-teal)] hover:decoration-[var(--odoo-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-sm"
                              >
                                {app.name}
                              </Link>
                            ) : (
                              <span className="text-sm font-medium text-[var(--foreground)]">
                                {app.name}
                              </span>
                            )}
                            <span className="shrink-0 text-sm tabular-nums text-[var(--muted-foreground)]">
                              {formatPriceFrom(app.priceFrom)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}

                  {tier.id === "bigger" ? (
                    <ButtonLink
                      href={`#${CONTACT_SECTION_ID}`}
                      variant="secondary"
                      className="mt-5"
                    >
                      Tell us what you want to simplify
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-[var(--muted-foreground)]">{HOSTING_NOTE}</p>
      </div>
    </section>
  );
}
