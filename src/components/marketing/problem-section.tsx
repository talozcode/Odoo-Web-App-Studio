import { Menu, ListChecks, LayoutGrid, ScanLine, Hash, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const ODOO_GIVES = [
  { icon: Menu, label: "40 menus" },
  { icon: ListChecks, label: "Hundreds of fields" },
  { icon: LayoutGrid, label: "Multiple modules" },
  { icon: LayoutGrid, label: "ERP navigation" },
];

const THEY_NEED = [
  { icon: ScanLine, label: "Scan product" },
  { icon: Hash, label: "Enter quantity" },
  { icon: CheckCircle2, label: "Done" },
];

export function ProblemSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          title="Odoo is powerful. Sometimes that's the problem."
          description="Odoo has to accommodate an entire business. One employee usually needs one tiny piece of it."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-white p-6">
            <p className="text-base font-semibold text-[var(--odoo-purple)]">
              What Odoo gives them
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {ODOO_GIVES.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <item.icon
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[var(--odoo-purple)]"
                  />
                  <span className="text-sm text-[var(--foreground)]">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[var(--brand-coral)]/30 bg-white p-6">
            <p className="text-base font-semibold text-[var(--brand-coral)]">
              What they actually need
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {THEY_NEED.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <item.icon
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[var(--brand-coral)]"
                  />
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
