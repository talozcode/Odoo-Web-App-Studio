import Image from "next/image";

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
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--surface)]">
      <Image
        src="/images/philosophy-glow.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="pointer-events-none select-none object-cover opacity-80"
      />
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          We don&apos;t rebuild Odoo.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--odoo-purple)]">
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
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand-coral)]">
              We build
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {WE_BUILD.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[var(--brand-coral)]/20 bg-[var(--brand-coral)]/10 px-3 py-1 text-sm font-medium text-[var(--brand-coral)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-16 max-w-3xl text-center text-4xl font-semibold leading-snug tracking-tight text-[var(--brand-coral)] sm:text-5xl lg:text-6xl">
          Odoo does everything.
          <br />
          Your users don&apos;t need everything.
        </p>
      </div>
    </section>
  );
}
