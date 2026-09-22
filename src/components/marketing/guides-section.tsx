import Link from "next/link";
import { GUIDES } from "@/config/guides";
import { SectionHeading } from "@/components/ui/section-heading";

const FEATURED_SLUGS = [
  "odoo-customization-vs-custom-apps",
  "how-much-does-a-custom-odoo-app-cost",
  "what-happens-when-odoo-upgrades",
  "odoo-api-integration-explained",
];

const FEATURED = FEATURED_SLUGS.map((slug) => GUIDES.find((g) => g.slug === slug)).filter(
  (guide): guide is NonNullable<typeof guide> => Boolean(guide)
);

/**
 * A typographic list, not a card grid: four guides that answer the questions
 * a buyer has before they write to us.
 */
export function GuidesSection() {
  return (
    <section id="guides" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              title="The questions people ask before they write to us."
              description="Written the way we would explain it in a scoping call."
            />
            <Link
              href="/guides"
              className="mt-6 inline-block text-sm font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-sm"
            >
              All {GUIDES.length} guides
            </Link>
          </div>

          <ol className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {FEATURED.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="group block py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-md"
                >
                  <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--odoo-teal)]">
                    {guide.title}
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {guide.description}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
