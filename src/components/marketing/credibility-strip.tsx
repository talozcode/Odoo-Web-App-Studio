import { BadgeCheck } from "lucide-react";

/**
 * A single honest credibility fact, surfaced right below the hero rather
 * than buried on the About page. No client logos or testimonials here
 * since none exist yet; this is the one real trust signal available.
 */
export function CredibilityStrip() {
  return (
    <div className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-3 text-center sm:px-6 lg:px-8">
        <BadgeCheck
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-[var(--odoo-teal)]"
        />
        <p className="text-sm text-[var(--muted-foreground)]">
          Built on 5+ years of hands-on Odoo implementation and automation
          work, not a weekend project.
        </p>
      </div>
    </div>
  );
}
