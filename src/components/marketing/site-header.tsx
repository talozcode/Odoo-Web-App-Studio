"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, CONTACT_NAV_LABEL, CONTACT_SECTION_ID } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function isCurrent(pathname: string, href: string): boolean {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/#top"
          className="flex shrink-0 items-center text-lg font-bold tracking-tight text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-md"
        >
          OdooWebApps<span className="text-[var(--odoo-teal)]">.com</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            const current = isCurrent(pathname, link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap text-sm font-medium transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] rounded-md",
                  current
                    ? "text-[var(--foreground)] underline underline-offset-8 decoration-[var(--odoo-teal)] decoration-2"
                    : "text-[var(--muted-foreground)]"
                )}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href={`/#${CONTACT_SECTION_ID}`}>{CONTACT_NAV_LABEL}</ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)] lg:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? (
            <X aria-hidden="true" className="h-6 w-6" />
          ) : (
            <Menu aria-hidden="true" className="h-6 w-6" />
          )}
        </button>
      </div>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 top-16 z-40 bg-[var(--foreground)]/20 lg:hidden"
          />
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="absolute inset-x-0 top-16 z-50 border-b border-[var(--border)] bg-[var(--background)] px-4 py-4 sm:px-6 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const current = isCurrent(pathname, link.href);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block min-h-11 rounded-md py-2.5 text-base font-medium text-[var(--foreground)] hover:bg-[var(--surface)]",
                        current && "text-[var(--odoo-teal)]"
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
              <li className="mt-2">
                <ButtonLink
                  href={`/#${CONTACT_SECTION_ID}`}
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  {CONTACT_NAV_LABEL}
                </ButtonLink>
              </li>
            </ul>
          </nav>
        </>
      ) : null}
    </header>
  );
}
