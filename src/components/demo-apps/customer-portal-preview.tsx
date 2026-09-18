import { ShoppingCart } from "lucide-react";
import { AppFrame } from "./app-frame";

const ITEMS = [
  { name: "Sesame Crackers (case)", price: "$24.00" },
  { name: "Olive Oil 1L", price: "$12.00" },
  { name: "Tahini 500g", price: "$8.00" },
];

export function CustomerPortalPreview() {
  return (
    <AppFrame title="Shop" subtitle="Customer ordering portal">
      <ul className="flex flex-col gap-2">
        {ITEMS.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2.5"
          >
            <span className="text-sm font-medium text-[var(--foreground)]">
              {item.name}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">{item.price}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-[var(--surface)] px-3 py-2.5">
        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <ShoppingCart aria-hidden="true" className="h-4 w-4 text-[var(--odoo-purple)]" />
          Cart · 3 items
        </span>
        <span className="text-sm font-semibold text-[var(--foreground)]">$44.00</span>
      </div>
    </AppFrame>
  );
}
