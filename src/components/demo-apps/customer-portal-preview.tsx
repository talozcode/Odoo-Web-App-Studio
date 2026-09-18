"use client";

import { useState } from "react";
import { Minus, Plus, Package, ShoppingCart } from "lucide-react";
import { AppFrame } from "./app-frame";

const ITEMS = [
  { name: "Sesame Crackers (case)", price: "$24.00" },
  { name: "Olive Oil 1L", price: "$12.00" },
  { name: "Tahini 500g", price: "$8.00" },
];

export function CustomerPortalPreview() {
  const [quantity, setQuantity] = useState(2);

  return (
    <AppFrame title="Shop" subtitle="Customer ordering portal">
      <ul className="flex flex-col gap-2">
        {ITEMS.map((item, index) => (
          <li
            key={item.name}
            className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--surface)]">
              <Package aria-hidden="true" className="h-4 w-4 text-[var(--odoo-gray)]" />
            </span>
            <span className="flex-1 text-sm font-medium text-[var(--foreground)]">
              {item.name}
            </span>
            {index === 0 ? (
              <span className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--foreground)] transition-colors hover:border-[var(--odoo-gray)]"
                >
                  <Minus aria-hidden="true" className="h-3 w-3" />
                </button>
                <span className="w-4 text-center text-sm font-semibold text-[var(--foreground)]">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--foreground)] transition-colors hover:border-[var(--odoo-gray)]"
                >
                  <Plus aria-hidden="true" className="h-3 w-3" />
                </button>
              </span>
            ) : (
              <span className="text-xs text-[var(--muted-foreground)]">{item.price}</span>
            )}
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
