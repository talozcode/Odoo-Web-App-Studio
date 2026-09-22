import { Check } from "lucide-react";
import { PRICING_TIERS, HOSTING_NOTE } from "@/config/pricing";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { CONTACT_SECTION_ID } from "@/config/site";

export function PricingSection() {
  return (
    <section id="pricing" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading title="Small apps. Small projects. Clear prices." />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={
                tier.id === "app"
                  ? "relative flex flex-col rounded-xl border-2 border-[var(--brand-coral)]/40 bg-[var(--brand-coral)]/[0.04] p-6 pt-7 sm:-translate-y-2 sm:shadow-[0_16px_40px_-16px_rgba(184,66,15,0.3)]"
                  : "flex flex-col rounded-xl border border-[var(--border)] p-6"
              }
            >
              {tier.id === "app" ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-1 -translate-y-px rounded-full bg-[var(--brand-coral)]"
                />
              ) : null}
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {tier.name}
              </h3>
              <p className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                {tier.priceQualifier ? (
                  <span className="mr-1 text-sm font-normal text-[var(--muted-foreground)]">
                    {tier.priceQualifier}
                  </span>
                ) : null}
                {tier.price}
              </p>
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                {tier.description}
              </p>
              {tier.examples.length > 0 ? (
                <ul className="mt-4 flex flex-col gap-2">
                  {tier.examples.map((example) => (
                    <li key={example} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                      <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--odoo-teal)]" />
                      {example}
                    </li>
                  ))}
                </ul>
              ) : null}
              {tier.id === "bigger" ? (
                <ButtonLink
                  href={`#${CONTACT_SECTION_ID}`}
                  variant="secondary"
                  className="mt-6"
                >
                  Let&apos;s talk
                </ButtonLink>
              ) : null}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
          {HOSTING_NOTE}
        </p>
      </div>
    </section>
  );
}
