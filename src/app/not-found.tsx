import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { USE_CASE_PAGES } from "@/config/use-case-pages";

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <p className="text-sm font-semibold text-[var(--odoo-teal)]">
            404
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            This page doesn&apos;t exist. Unlike your workflow, we can&apos;t
            simplify what isn&apos;t there.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--muted-foreground)]">
            The link might be old, or the page might have moved. Here&apos;s
            where you probably meant to go.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--odoo-teal)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--odoo-teal-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)]"
            >
              Back to homepage
            </Link>
            <Link
              href="/guides"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] px-5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)]"
            >
              Browse guides
            </Link>
          </div>

          <div className="mt-14 w-full border-t border-[var(--border)] pt-8">
            <p className="text-sm font-semibold text-[var(--muted-foreground)]">
              Or one of these
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {USE_CASE_PAGES.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="text-sm font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline"
                  >
                    {page.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
