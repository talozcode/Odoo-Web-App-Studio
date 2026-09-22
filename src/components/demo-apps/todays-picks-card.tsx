import { CheckCircle2 } from "lucide-react";
import { AppFrame } from "./app-frame";

type PickOrder = {
  id: string;
  items: number;
  status: "Ready";
};

const ORDERS: PickOrder[] = [
  { id: "SO0421", items: 12, status: "Ready" },
  { id: "SO0424", items: 8, status: "Ready" },
  { id: "SO0429", items: 16, status: "Ready" },
];

export function TodaysPicksCard() {
  return (
    <AppFrame title="Today's Picks" subtitle="Warehouse">
      <ul className="flex flex-col gap-2">
        {ORDERS.map((order) => (
          <li
            key={order.id}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                aria-hidden="true"
                className="h-4 w-4 text-[var(--odoo-teal)]"
              />
              <span className="text-sm font-medium text-[var(--foreground)]">
                {order.id}
              </span>
              <span className="text-sm text-[var(--muted-foreground)]">
                · {order.items} items
              </span>
            </div>
            <span className="text-xs font-semibold text-[var(--odoo-teal)]">
              {order.status}
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-4 min-h-11 w-full rounded-lg bg-[var(--odoo-teal)] text-sm font-semibold text-white transition-colors hover:bg-[var(--odoo-teal-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--odoo-teal)]"
      >
        Start picking
      </button>
    </AppFrame>
  );
}
