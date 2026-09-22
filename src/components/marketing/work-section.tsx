import Link from "next/link";
import { HOMEPAGE_WORK_SLUGS, WORK_CASES, WORK_CONTEXT, workCaseBySlug } from "@/config/work";
import { SectionHeading } from "@/components/ui/section-heading";
import { WorkCaseRow } from "./work-case";

const FEATURED = HOMEPAGE_WORK_SLUGS.map(workCaseBySlug).filter(
  (c): c is NonNullable<typeof c> => Boolean(c)
);

/**
 * Shipped, in-production apps for our clients, anonymised. This is the
 * proof the demos point at: the same approach, on a real Odoo, in daily use.
 */
export function WorkSection() {
  return (
    <section id="work" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          align="left"
          title="What we have built for our clients"
          description={WORK_CONTEXT}
        />

        <div className="mt-6 divide-y divide-[var(--border)] border-t border-[var(--border)]">
          {FEATURED.map((workCase, index) => (
            <WorkCaseRow key={workCase.slug} workCase={workCase} index={index} />
          ))}
        </div>

        <p className="mt-8 text-sm text-[var(--muted-foreground)]">
          <Link
            href="/work"
            className="font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-sm"
          >
            All {WORK_CASES.length} apps
          </Link>
          , including the ones that turned out not to need an app at all.
        </p>
      </div>
    </section>
  );
}
