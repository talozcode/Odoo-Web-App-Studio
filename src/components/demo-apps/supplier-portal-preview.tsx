"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AppFrame } from "./app-frame";
import { Chip } from "@/components/ui/chip";

// Purchase order names follow Odoo's default P000NN sequence; the supplier
// names are the vendors shipped with the Odoo demo dataset.
const PURCHASE_ORDERS = [
  { id: "P00012", supplierLine: "Wood Corner, 24 units, due Friday", status: "confirmed" as const },
  { id: "P00015", supplierLine: "Ready Mat, 60 units, due Monday", status: "pending" as const },
];

const STATUS_FILTERS = ["Pending", "Confirmed"] as const;

export function SupplierPortalPreview() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof STATUS_FILTERS)[number]>("Pending");

  return (
    <AppFrame title="Purchase orders" subtitle="Supplier portal">
      <div className="mb-3 flex gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            selected={activeFilter === filter}
            onToggle={() => setActiveFilter(filter)}
          />
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {PURCHASE_ORDERS.filter((po) => po.status === activeFilter.toLowerCase()).map((po) => (
          <li
            key={po.id}
            className="rounded-lg border border-[var(--border)] px-3 py-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--foreground)]">
                {po.id}
              </span>
              {po.status === "confirmed" ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-[var(--odoo-teal)]">
                  <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                  Confirmed
                </span>
              ) : (
                <button
                  type="button"
                  className="min-h-11 rounded-md bg-[var(--odoo-teal)] px-3 text-xs font-semibold text-white transition-colors hover:bg-[var(--odoo-teal-hover)]"
                >
                  Confirm
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {po.supplierLine}
            </p>
          </li>
        ))}
      </ul>
    </AppFrame>
  );
}
