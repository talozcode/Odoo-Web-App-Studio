"use client";

import { useState } from "react";
import { ChevronLeft, CheckCircle2, Plus, Check } from "lucide-react";
import { AppFrame } from "./app-frame";

type Customer = { id: string; name: string };
type Product = { id: string; name: string; price: number };

const CUSTOMERS: Customer[] = [
  { id: "c1", name: "Green Valley Foods" },
  { id: "c2", name: "Riverside Cafe" },
  { id: "c3", name: "Sunrise Market" },
];

const PRODUCTS: Product[] = [
  { id: "p1", name: "Sesame Crackers (case)", price: 24 },
  { id: "p2", name: "Olive Oil 1L", price: 12 },
  { id: "p3", name: "Tahini 500g", price: 8 },
];

type Step = "customer" | "products" | "done";

export function SalesAppDemo() {
  const [step, setStep] = useState<Step>("customer");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  function pickCustomer(c: Customer) {
    setCustomer(c);
    setStep("products");
  }

  function toggleProduct(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function submit() {
    setStep("done");
  }

  function startOver() {
    setCustomer(null);
    setSelected([]);
    setStep("customer");
  }

  return (
    <AppFrame title="New order" subtitle="Sales app">
      {step === "customer" ? (
        <div className="flex flex-col gap-2">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Choose a customer
          </p>
          {CUSTOMERS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => pickCustomer(c)}
              className="flex min-h-11 items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2.5 text-left text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--odoo-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-coral)]"
            >
              {c.name}
              <ChevronLeft
                aria-hidden="true"
                className="h-4 w-4 rotate-180 text-[var(--odoo-gray)]"
              />
            </button>
          ))}
        </div>
      ) : null}

      {step === "products" && customer ? (
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setStep("customer")}
            className="mb-3 flex items-center gap-1 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
            {customer.name}
          </button>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Add products
          </p>
          <div className="flex flex-col gap-2">
            {PRODUCTS.map((p) => {
              const isSelected = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProduct(p.id)}
                  aria-pressed={isSelected}
                  className="flex min-h-11 items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2.5 text-left transition-colors hover:border-[var(--odoo-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-coral)]"
                >
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {p.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-[var(--muted-foreground)]">
                      ${p.price}
                    </span>
                    {isSelected ? (
                      <Check
                        aria-hidden="true"
                        className="h-4 w-4 text-[var(--odoo-teal)]"
                      />
                    ) : (
                      <Plus aria-hidden="true" className="h-4 w-4 text-[var(--odoo-gray)]" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={selected.length === 0}
            className="mt-4 min-h-11 w-full rounded-lg bg-[var(--brand-coral)] text-sm font-semibold text-white transition-colors hover:bg-[#e85a3c] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-coral)]"
          >
            Submit order ({selected.length})
          </button>
        </div>
      ) : null}

      {step === "done" && customer ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-[var(--odoo-teal)]" />
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Order sent to Odoo
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            {selected.length} line{selected.length === 1 ? "" : "s"} for {customer.name}
          </p>
          <button
            type="button"
            onClick={startOver}
            className="mt-1 min-h-11 rounded-lg border border-[var(--border)] px-4 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--odoo-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-coral)]"
          >
            Start another order
          </button>
        </div>
      ) : null}
    </AppFrame>
  );
}
