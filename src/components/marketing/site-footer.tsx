import { BRAND_NAME } from "@/config/brand";
import { FOOTER_LINKS } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--foreground)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-white">{BRAND_NAME}</p>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/50 sm:px-6 lg:px-8">
          Independent software studio. Not affiliated with Odoo S.A.
        </p>
      </div>
    </footer>
  );
}
