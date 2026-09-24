import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { ImportChecker } from "@/components/tools/import-checker";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_SECTION_ID, SITE_URL } from "@/config/site";
import { BRAND_NAME } from "@/config/brand";

const PATH = "/tools/odoo-import-checker";

export const metadata: Metadata = pageMetadata({
  title: "Odoo CSV Import Checker: Find Errors Before You Import",
  ogTitle: "Odoo CSV import checker",
  description:
    "Free Odoo import file checker. Finds duplicate external IDs, missing /id headers, references to records that do not exist yet, ambiguous dates, unreadable numbers and empty columns that overwrite defaults. Runs in your browser; the file is never uploaded.",
  path: PATH,
});

const LINK = "font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline";

// What the checker looks for, rendered as plain text so crawlers and answer
// engines can read what the tool does without running it.
const CHECKS: { title: string; body: string }[] = [
  { title: "External IDs", body: "A missing ID column (so a second import duplicates everything), duplicate IDs, plain numeric IDs that can collide across models, and stray spaces." },
  { title: "Relation columns", body: "The same field referenced by name and by ID at once, a name column that actually holds external IDs and is missing its /id suffix, and many-to-many values separated by comma plus space." },
  { title: "References", body: "External IDs the file points at but does not define, which must already exist in the database or every row using them fails with no matching record found." },
  { title: "Dates", body: "Columns where no value settles whether the date is day first or month first, so Odoo has to guess." },
  { title: "Numbers", body: "Values Odoo documents as unreadable, such as a currency sign outside the parentheses of a negative, and columns that look numeric in the first ten lines and turn to text later." },
  { title: "Empty columns", body: "A column that is present but empty sets the field to empty for every record instead of leaving Odoo's default in place." },
  { title: "File structure", body: "Tab separators Odoo will not detect, semicolons it needs telling about, rows with the wrong number of columns, broken encoding and duplicate headers." },
];

export default function ImportCheckerPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Odoo CSV import checker",
    url: `${SITE_URL}${PATH}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any (runs in the browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": `${SITE_URL}/#organization` },
    description:
      "Checks a CSV file for the problems that make an Odoo import fail or import the wrong data, entirely in the browser.",
  };

  return (
    <>
      <JsonLd data={appSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Odoo import checker", url: `${SITE_URL}${PATH}` },
        ])}
      />
      <SiteHeader />

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <nav aria-label="Breadcrumb" className="border-b border-[var(--border)]">
          <ol className="mx-auto flex max-w-3xl items-center gap-1.5 px-4 py-3 text-sm text-[var(--muted-foreground)] sm:px-6 lg:px-8">
            <li>
              <Link href="/" className="rounded-md hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-[var(--foreground)]">
              Odoo import checker
            </li>
          </ol>
        </nav>

        <section className="mx-auto max-w-3xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Odoo CSV import checker
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)]">
            Odoo imports cannot be undone, and the worst failures report success. Drop in the file
            you are about to import and see every reason Odoo would reject it, or accept it and
            store the wrong data.
          </p>
          <div className="mt-8">
            <ImportChecker />
          </div>
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">What it checks</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--muted-foreground)]">
              Every check follows Odoo&apos;s own export and import documentation. The reasoning
              behind each one is in{" "}
              <Link href="/guides/odoo-import-errors" className={LINK}>
                Odoo import errors: external IDs, relations, and what fails silently
              </Link>
              .
            </p>
            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CHECKS.map((c) => (
                <div key={c.title} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
                  <dt className="font-semibold text-[var(--foreground)]">{c.title}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">{c.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">What it cannot check</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--muted-foreground)]">
              It reads the file, not your database. It cannot see whether a referenced record
              already exists in Odoo, whether a column name maps to a real field on your model, or
              whether the importing user is allowed to write it. A clean result means the file is
              well formed; the import screen&apos;s own Test step is still the last check before
              Import.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted-foreground)]">
              Your file stays on your machine. It is read by your browser and checked by code
              running on this page; nothing is sent to {BRAND_NAME} or anyone else.
            </p>
          </div>
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              Importing the same file every week?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--muted-foreground)]">
              Then the spreadsheet has become production software with no validation and no undo. A
              small app that reads the source, checks it the way this page does and writes to Odoo
              through the API does the same job every week, whoever runs it.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href={`/#${CONTACT_SECTION_ID}`}>Tell us what you want to simplify</ButtonLink>
              <Link href="/custom-odoo-web-app" className="text-sm font-medium text-[var(--foreground)] underline underline-offset-4 hover:text-[var(--odoo-teal)]">
                Custom Odoo web apps
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
