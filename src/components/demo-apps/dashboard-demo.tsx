import { TrendingUp, Package, ShoppingCart, Percent } from "lucide-react";
import { AppFrame } from "./app-frame";

type Kpi = {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  tone: "teal" | "coral" | "purple";
};

const KPIS: Kpi[] = [
  { label: "Sales (7d)", value: "$18,420", icon: TrendingUp, tone: "teal" },
  { label: "Margin", value: "34%", icon: Percent, tone: "coral" },
  { label: "In stock", value: "1,248", icon: Package, tone: "purple" },
  { label: "Open POs", value: "6", icon: ShoppingCart, tone: "teal" },
];

const WEEK_BARS = [42, 58, 39, 71, 64, 80, 55];

const toneClass: Record<Kpi["tone"], string> = {
  teal: "text-[var(--odoo-teal)]",
  coral: "text-[var(--brand-coral)]",
  purple: "text-[var(--odoo-purple)]",
};

export function DashboardDemo() {
  return (
    <AppFrame title="This week" subtitle="Management dashboard">
      <div className="grid grid-cols-2 gap-2">
        {KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-lg border border-[var(--border)] px-3 py-2.5"
          >
            <kpi.icon aria-hidden="true" className={`h-4 w-4 ${toneClass[kpi.tone]}`} />
            <p className="mt-1.5 text-base font-semibold text-[var(--foreground)]">
              {kpi.value}
            </p>
            <p className="text-[11px] text-[var(--muted-foreground)]">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-[var(--border)] p-3">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Sales by day
        </p>
        <div
          className="flex h-20 items-end gap-1.5"
          role="img"
          aria-label="Bar chart of sales for the last 7 days"
        >
          {WEEK_BARS.map((value, index) => (
            <div
              key={index}
              className="flex-1 rounded-sm bg-[var(--odoo-teal)]/80"
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
      </div>
    </AppFrame>
  );
}
