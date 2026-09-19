import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

/**
 * Shared shell for simple prose pages (About, Privacy, Terms) that don't
 * need a demo, pricing callout, or FAQ: just a heading, a breadcrumb, and
 * body content.
 */
export function StaticPageTemplate({
  breadcrumbLabel,
  eyebrow,
  h1,
  subtitle,
  children,
}: {
  breadcrumbLabel: string;
  eyebrow: string;
  h1: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <nav aria-label="Breadcrumb" className="border-b border-[var(--border)]">
          <ol className="mx-auto flex max-w-3xl items-center gap-1.5 px-4 py-3 text-sm text-[var(--muted-foreground)] sm:px-6 lg:px-8">
            <li>
              <Link
                href="/"
                className="rounded-md hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-coral)]"
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

        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--odoo-teal)]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {h1}
          </h1>
          {subtitle ? (
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              {subtitle}
            </p>
          ) : null}

          <div className="prose-content mt-8 flex flex-col gap-6 text-base leading-relaxed text-[var(--muted-foreground)]">
            {children}
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
