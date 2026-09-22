import { TrendingUp, Package, ShoppingCart, Percent } from "lucide-react";
import type { DemoKpis } from "@/lib/odoo/types";
import { formatInteger, formatMoney } from "@/lib/format";
import { AppFrame } from "./app-frame";

type DashboardDemoProps = {
  kpis: DemoKpis;
};

export function DashboardDemo({ kpis }: DashboardDemoProps) {
  const cards = [
    {
      label: "Sales, last 7 order days",
      value: formatMoney(kpis.salesRecent, kpis.currency, { compact: true }),
      icon: TrendingUp,
      tone: "text-[var(--odoo-teal)]",
    },
    {
      label: "Margin",
      value: `${kpis.marginPct}%`,
      icon: Percent,
      tone: "text-[var(--odoo-purple)]",
    },
    {
      label: "Units on hand",
      value: formatInteger(kpis.onHandUnits),
      icon: Package,
      tone: "text-[var(--odoo-teal)]",
    },
    {
      label: "Open purchase orders",
      value: formatInteger(kpis.openPurchaseOrders),
      icon: ShoppingCart,
      tone: "text-[var(--odoo-purple)]",
    },
  ];

  const max = Math.max(1, ...kpis.salesByDay);

  return (
    <AppFrame title="This week" subtitle="Management dashboard">
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-[var(--border)] px-3 py-2.5"
          >
            <card.icon aria-hidden="true" className={`h-4 w-4 ${card.tone}`} />
            <p className="mt-1.5 text-base font-semibold tabular-nums text-[var(--foreground)]">
              {card.value}
            </p>
            <p className="text-[11px] text-[var(--muted-foreground)]">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-[var(--border)] p-3">
        <p className="mb-2 text-[11px] font-medium text-[var(--muted-foreground)]">
          Sales by day
        </p>
        <div
          className="flex h-20 items-end gap-1.5"
          role="img"
          aria-label={`Bar chart of daily sales for the last ${kpis.salesByDay.length} order days`}
        >
          {kpis.salesByDay.map((value, index) => (
            <div
              key={index}
              className="flex-1 rounded-sm bg-[var(--odoo-teal)]/80"
              style={{ height: `${Math.max(4, (value / max) * 100)}%` }}
            />
          ))}
        </div>
      </div>
    </AppFrame>
  );
}
