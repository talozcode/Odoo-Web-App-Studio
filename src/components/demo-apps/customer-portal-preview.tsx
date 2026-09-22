"use client";

import { useState } from "react";
import { Minus, Plus, Package, ShoppingCart } from "lucide-react";
import type { DemoSalesSeed } from "@/lib/odoo/types";
import { formatMoney } from "@/lib/format";
import { AppFrame } from "./app-frame";

type CustomerPortalPreviewProps = {
  seed: DemoSalesSeed;
};

export function CustomerPortalPreview({ seed }: CustomerPortalPreviewProps) {
  const [quantity, setQuantity] = useState(2);
  const products = seed.products;
  const first = products[0];
  const cartUnits = quantity + Math.max(0, products.length - 1);
  const cartTotal =
    (first ? first.price * quantity : 0) +
    products.slice(1).reduce((sum, product) => sum + product.price, 0);

  return (
    <AppFrame title="Shop" subtitle="Customer ordering portal">
      <ul className="flex flex-col gap-2">
        {products.map((product, index) => (
          <li
            key={product.id}
            className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--surface)]">
              <Package aria-hidden="true" className="h-4 w-4 text-[var(--odoo-gray)]" />
            </span>
            <span className="flex-1 text-sm font-medium text-[var(--foreground)]">
              {product.name}
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
                <span className="w-4 text-center text-sm font-semibold tabular-nums text-[var(--foreground)]">
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
              <span className="text-xs tabular-nums text-[var(--muted-foreground)]">
                {formatMoney(product.price, seed.currency)}
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-[var(--surface)] px-3 py-2.5">
        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <ShoppingCart aria-hidden="true" className="h-4 w-4 text-[var(--odoo-purple)]" />
          Cart, {cartUnits} {cartUnits === 1 ? "item" : "items"}
        </span>
        <span className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
          {formatMoney(cartTotal, seed.currency)}
        </span>
      </div>
    </AppFrame>
  );
}
