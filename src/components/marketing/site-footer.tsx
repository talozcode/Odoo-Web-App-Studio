import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS, FOOTER_RESOURCE_LINKS } from "@/config/site";
import { USE_CASE_PAGES } from "@/config/use-case-pages";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--foreground)]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
          <div className="inline-flex w-fit items-center rounded-lg bg-white p-2">
            <Image
              src="/brand/odoowebapps-logo-horizontal-white.png"
              alt="OdooWebApps"
              width={1024}
              height={341}
              className="h-6 w-auto"
            />
          </div>
          <p className="max-w-[220px] text-sm text-white/60">
            A web app studio for businesses that already use Odoo.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
            Solutions
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {USE_CASE_PAGES.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/${page.slug}`}
                  className="text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
                >
                  {page.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
            Site
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
            Resources
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {FOOTER_RESOURCE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/50 sm:px-6 lg:px-8">
          Independent software studio. Not affiliated with Odoo S.A.
        </p>
      </div>
    </footer>
  );
}
