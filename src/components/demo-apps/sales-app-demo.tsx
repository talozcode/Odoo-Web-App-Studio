"use client";

import { useState, useTransition } from "react";
import { ChevronLeft, CheckCircle2, Plus, Check } from "lucide-react";
import type {
  DemoPartner,
  DemoProduct,
  DemoResult,
  DemoSalesSeed,
  RpcTrace,
} from "@/lib/odoo/types";
import { formatMoney } from "@/lib/format";
import { createDemoSaleOrder } from "@/app/demo-actions";
import { AppFrame } from "./app-frame";
import { RpcReadout, type RpcActivity } from "./rpc-readout";

type Step = "customer" | "products" | "done";

type SalesAppDemoProps = {
  seed: DemoSalesSeed;
  /** When true, submitting creates and confirms a real sale.order in the demo Odoo. */
  writesEnabled?: boolean;
  /** The read that produced the seed; rendered as the readout under the app. */
  readout?: DemoResult<DemoSalesSeed>;
};

type Outcome =
  | { kind: "local" }
  | { kind: "created"; name: string; trace: RpcTrace }
  | { kind: "declined"; message: string };

export function SalesAppDemo({
  seed,
  writesEnabled = false,
  readout,
}: SalesAppDemoProps) {
  const [step, setStep] = useState<Step>("customer");
  const [customer, setCustomer] = useState<DemoPartner | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [outcome, setOutcome] = useState<Outcome>({ kind: "local" });
  const [pending, startTransition] = useTransition();

  function pickCustomer(partner: DemoPartner) {
    setCustomer(partner);
    setStep("products");
  }

  function toggleProduct(product: DemoProduct) {
    setSelected((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id],
    );
  }

  function submit() {
    if (!writesEnabled || !customer) {
      setOutcome({ kind: "local" });
      setStep("done");
      return;
    }
    startTransition(async () => {
      const result = await createDemoSaleOrder({
        partnerId: customer.id,
        productIds: selected,
      });
      if (result.ok) {
        setOutcome({ kind: "created", name: result.name, trace: result.trace });
      } else {
        setOutcome({ kind: "declined", message: result.message });
      }
      setStep("done");
    });
  }

  function startOver() {
    setCustomer(null);
    setSelected([]);
    setOutcome({ kind: "local" });
    setStep("customer");
  }

  let activity: RpcActivity | undefined;
  if (step === "products") {
    activity = {
      summary: "search_read product.product",
      detail: `${seed.products.length} ${seed.products.length === 1 ? "record" : "records"}`,
      sent: true,
    };
  } else if (step === "done") {
    if (outcome.kind === "created") {
      activity = {
        summary: outcome.trace.summary,
        detail: `${outcome.trace.ms} ms`,
        sent: true,
        at: outcome.trace.at,
      };
    } else {
      activity = {
        summary: "create sale.order, action_confirm",
        detail: "not sent",
        sent: false,
      };
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <AppFrame title="New order" subtitle="Sales app">
        {step === "customer" ? (
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-xs font-medium text-[var(--muted-foreground)]">
              Choose a customer
            </p>
            {seed.partners.map((partner) => (
              <button
                key={partner.id}
                type="button"
                onClick={() => pickCustomer(partner)}
                className="flex min-h-11 items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2.5 text-left text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--odoo-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--odoo-teal)]"
              >
                {partner.name}
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
            <p className="mb-1 text-xs font-medium text-[var(--muted-foreground)]">
              Add products
            </p>
            <div className="flex flex-col gap-2">
              {seed.products.map((product) => {
                const isSelected = selected.includes(product.id);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProduct(product)}
                    aria-pressed={isSelected}
                    className="flex min-h-11 items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2.5 text-left transition-colors hover:border-[var(--odoo-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--odoo-teal)]"
                  >
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {product.name}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-xs tabular-nums text-[var(--muted-foreground)]">
                        {formatMoney(product.price, seed.currency)}
                      </span>
                      {isSelected ? (
                        <Check
                          aria-hidden="true"
                          className="h-4 w-4 text-[var(--odoo-teal)]"
                        />
                      ) : (
                        <Plus
                          aria-hidden="true"
                          className="h-4 w-4 text-[var(--odoo-gray)]"
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={submit}
              disabled={selected.length === 0 || pending}
              className="mt-4 min-h-11 w-full rounded-lg bg-[var(--odoo-teal)] text-sm font-semibold text-white transition-colors hover:bg-[var(--odoo-teal-hover)] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--odoo-teal)]"
            >
              {pending
                ? "Sending to Odoo"
                : writesEnabled
                  ? `Send to Odoo (${selected.length})`
                  : `Submit order (${selected.length})`}
            </button>
          </div>
        ) : null}

        {step === "done" && customer ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2
              aria-hidden="true"
              className="h-8 w-8 text-[var(--odoo-teal)]"
            />
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {outcome.kind === "created"
                ? `${outcome.name} confirmed in Odoo`
                : outcome.kind === "declined"
                  ? "Order kept local"
                  : "Order built, demo only"}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {selected.length} line{selected.length === 1 ? "" : "s"} for{" "}
              {customer.name}
            </p>
            {outcome.kind === "created" ? (
              <p className="font-mono text-[11px] text-[var(--muted-foreground)]">
                {outcome.trace.summary}, {outcome.trace.ms} ms
              </p>
            ) : null}
            {outcome.kind === "declined" ? (
              <p className="max-w-[16rem] text-xs text-[var(--muted-foreground)]">
                {outcome.message}
              </p>
            ) : null}
            {outcome.kind === "local" ? (
              <p className="max-w-[16rem] text-xs text-[var(--muted-foreground)]">
                Demo only: nothing was written to Odoo. With the live instance
                connected this creates and confirms a sale.order.
              </p>
            ) : null}
            <button
              type="button"
              onClick={startOver}
              className="mt-1 min-h-11 rounded-lg border border-[var(--border)] px-4 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--odoo-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--odoo-teal)]"
            >
              Start another order
            </button>
          </div>
        ) : null}
      </AppFrame>
      {readout ? <RpcReadout result={readout} activity={activity} /> : null}
    </div>
  );
}
