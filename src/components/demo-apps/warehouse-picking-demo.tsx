"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Circle, ScanLine, RotateCcw } from "lucide-react";
import type { DemoPicking, DemoResult } from "@/lib/odoo/types";
import { AppFrame } from "./app-frame";
import { RpcReadout, type RpcActivity } from "./rpc-readout";

type WarehousePickingDemoProps = {
  picking: DemoPicking;
  /**
   * Stagger the lines in on mount. Used once, in the hero, as the page's
   * single orchestrated motion moment: the data arriving from Odoo.
   */
  animateIn?: boolean;
  /** The read that produced the picking; rendered as the readout under the app. */
  readout?: DemoResult<DemoPicking[]>;
};

export function WarehousePickingDemo({
  picking,
  animateIn = false,
  readout,
}: WarehousePickingDemoProps) {
  const lines = picking.lines;
  const totalItems = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );
  const [picked, setPicked] = useState<number[]>(() => lines.map(() => 0));
  const shouldReduceMotion = useReducedMotion();
  const stagger = animateIn && !shouldReduceMotion;

  const totalPicked = picked.reduce((sum, count) => sum + count, 0);
  const isComplete = totalItems > 0 && totalPicked >= totalItems;
  const activeIndex = picked.findIndex(
    (count, index) => count < lines[index].quantity,
  );

  function scanItem() {
    if (activeIndex === -1) return;
    setPicked((prev) => {
      const next = [...prev];
      next[activeIndex] = Math.min(
        next[activeIndex] + 1,
        lines[activeIndex].quantity,
      );
      return next;
    });
  }

  function toggleLine(index: number) {
    setPicked((prev) => {
      const next = [...prev];
      next[index] =
        next[index] >= lines[index].quantity ? 0 : lines[index].quantity;
      return next;
    });
  }

  function reset() {
    setPicked(lines.map(() => 0));
  }

  let activity: RpcActivity | undefined;
  if (isComplete) {
    activity = {
      summary: `button_validate stock.picking ${picking.name}`,
      detail: "not sent",
      sent: false,
    };
  } else if (totalPicked > 0) {
    activity = {
      summary: "write stock.move.line quantity, picked",
      detail: `${totalPicked} of ${totalItems}, not sent`,
      sent: false,
    };
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <AppFrame title={picking.name} subtitle="Warehouse picking">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {totalPicked}/{totalItems} items
            {picking.partner ? (
              <span className="ml-2 font-normal text-[var(--muted-foreground)]">
                {picking.partner}
              </span>
            ) : null}
          </p>
          {isComplete ? (
            <span className="text-xs font-semibold text-[var(--odoo-teal)]">
              Order complete
            </span>
          ) : null}
        </div>

        <div
          className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface)]"
          role="progressbar"
          aria-valuenow={totalPicked}
          aria-valuemin={0}
          aria-valuemax={totalItems}
          aria-label="Items picked"
        >
          <motion.div
            className="h-full rounded-full bg-[var(--odoo-teal)]"
            animate={{
              width: `${totalItems > 0 ? (totalPicked / totalItems) * 100 : 0}%`,
            }}
            transition={{ duration: 0.25 }}
          />
        </div>

        <ul className="flex flex-col gap-2">
          {lines.map((line, index) => {
            const count = picked[index];
            const done = count >= line.quantity;
            const remaining = line.quantity - count;
            return (
              <motion.li
                key={line.id}
                initial={stagger ? { opacity: 0, y: 6 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: stagger ? 0.15 + index * 0.08 : 0,
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleLine(index)}
                  aria-pressed={done}
                  className="flex w-full min-h-11 items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-left transition-colors hover:border-[var(--odoo-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--odoo-teal)]"
                >
                  <span className="flex items-center gap-2.5">
                    {done ? (
                      <CheckCircle2
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-[var(--odoo-teal)]"
                      />
                    ) : (
                      <Circle
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-[var(--odoo-gray)]"
                      />
                    )}
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {line.product}
                    </span>
                  </span>
                  <span
                    className={
                      done
                        ? "text-xs font-semibold text-[var(--odoo-teal)]"
                        : "text-xs text-[var(--muted-foreground)]"
                    }
                  >
                    {done
                      ? `${line.quantity} picked`
                      : `${remaining} remaining`}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={scanItem}
            disabled={isComplete}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--odoo-teal)] text-sm font-semibold text-white transition-colors hover:bg-[var(--odoo-teal-hover)] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--odoo-teal)]"
          >
            <ScanLine aria-hidden="true" className="h-4 w-4" />
            Scan item
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset demo"
            className="flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] px-3 text-[var(--muted-foreground)] transition-colors hover:border-[var(--odoo-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--odoo-teal)]"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </AppFrame>
      {readout ? <RpcReadout result={readout} activity={activity} /> : null}
    </div>
  );
}
