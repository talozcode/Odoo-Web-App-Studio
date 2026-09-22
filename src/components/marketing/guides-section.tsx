import Link from "next/link";
import { GUIDES } from "@/config/guides";
import { SectionHeading } from "@/components/ui/section-heading";

const FEATURED_SLUGS = [
  "odoo-api-examples-python-javascript",
  "how-much-does-a-custom-odoo-app-cost",
  "odoo-19-json-2-api",
  "odoo-api-key-setup",
  "odoo-barcode-app-buy-or-build",
  "odoo-customization-vs-custom-apps",
];

const FEATURED = FEATURED_SLUGS.map((slug) => GUIDES.find((g) => g.slug === slug)).filter(
  (guide): guide is NonNullable<typeof guide> => Boolean(guide)
);

/**
 * Six guide titles in two columns, full width, titles only. Deliberately a
 * different shape from the FAQ that follows it.
 */
export function GuidesSection() {
  return (
    <section id="guides" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            title="The questions people ask before they write to us"
            description="Written the way we would explain it in a scoping call."
          />
          <Link
            href="/guides"
            className="text-sm font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-sm"
          >
            All {GUIDES.length} guides
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-x-16 border-t border-[var(--border)] md:grid-cols-2">
          {FEATURED.map((guide) => (
            <li key={guide.slug} className="border-b border-[var(--border)]">
              <Link
                href={`/guides/${guide.slug}`}
                className="block py-5 text-lg font-medium leading-snug text-[var(--foreground)] hover:text-[var(--odoo-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-md"
              >
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
