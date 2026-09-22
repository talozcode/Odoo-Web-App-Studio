const ODOO_RESPONSIBLE_FOR = [
  "Accounting",
  "Inventory",
  "Sales",
  "Purchasing",
  "Manufacturing",
  "Business logic",
  "Master data",
];

const WE_BUILD = [
  "Focused interfaces",
  "Mobile workflows",
  "External portals",
  "Dashboards",
  "Specialist tools",
];

export function PhilosophySection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          We don&apos;t rebuild Odoo.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-white p-6">
            <p className="text-base font-semibold text-[var(--odoo-purple)]">
              Odoo stays responsible for
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {ODOO_RESPONSIBLE_FOR.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[var(--odoo-purple)]/20 bg-[var(--odoo-purple)]/10 px-3 py-1 text-sm font-medium text-[var(--odoo-purple)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-white p-6">
            <p className="text-base font-semibold text-[var(--odoo-teal)]">
              We build
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {WE_BUILD.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[var(--odoo-teal)]/20 bg-[var(--odoo-teal)]/10 px-3 py-1 text-sm font-medium text-[var(--odoo-teal)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-lg font-medium text-[var(--foreground)]">
          Odoo does everything. Your users don&apos;t need everything.
        </p>
      </div>
    </section>
  );
}
