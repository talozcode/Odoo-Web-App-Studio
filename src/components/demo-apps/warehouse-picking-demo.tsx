"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ScanLine, RotateCcw } from "lucide-react";
import { AppFrame } from "./app-frame";

type PickLine = {
  name: string;
  total: number;
};

const ORDER_ID = "SO0421";

const LINES: PickLine[] = [
  { name: "Chicken Breast", total: 4 },
  { name: "Tahini", total: 2 },
  { name: "Olive Oil", total: 2 },
  { name: "Pita Bread", total: 4 },
];

const TOTAL_ITEMS = LINES.reduce((sum, line) => sum + line.total, 0);

export function WarehousePickingDemo() {
  const [picked, setPicked] = useState<number[]>(() => LINES.map(() => 0));

  const totalPicked = useMemo(
    () => picked.reduce((sum, count) => sum + count, 0),
    [picked]
  );
  const isComplete = totalPicked >= TOTAL_ITEMS;
  const activeIndex = picked.findIndex(
    (count, index) => count < LINES[index].total
  );

  function scanItem() {
    if (activeIndex === -1) return;
    setPicked((prev) => {
      const next = [...prev];
      next[activeIndex] = Math.min(next[activeIndex] + 1, LINES[activeIndex].total);
      return next;
    });
  }

  function toggleLine(index: number) {
    setPicked((prev) => {
      const next = [...prev];
      next[index] = next[index] >= LINES[index].total ? 0 : LINES[index].total;
      return next;
    });
  }

  function reset() {
    setPicked(LINES.map(() => 0));
  }

  return (
    <AppFrame title={`Order ${ORDER_ID}`} subtitle="Warehouse picking">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {totalPicked}/{TOTAL_ITEMS} items
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
        aria-valuemax={TOTAL_ITEMS}
        aria-label="Items picked"
      >
        <motion.div
          className="h-full rounded-full bg-[var(--odoo-teal)]"
          animate={{ width: `${(totalPicked / TOTAL_ITEMS) * 100}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>

      <ul className="flex flex-col gap-2">
        {LINES.map((line, index) => {
          const count = picked[index];
          const done = count >= line.total;
          const remaining = line.total - count;
          return (
            <li key={line.name}>
              <button
                type="button"
                onClick={() => toggleLine(index)}
                aria-pressed={done}
                className="flex w-full min-h-11 items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-left transition-colors hover:border-[var(--odoo-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-coral)]"
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
                    {line.name}
                  </span>
                </span>
                <span
                  className={
                    done
                      ? "text-xs font-semibold text-[var(--odoo-teal)]"
                      : "text-xs text-[var(--muted-foreground)]"
                  }
                >
                  {done ? `✓ ${line.total} picked` : `— ${remaining} remaining`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={scanItem}
          disabled={isComplete}
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--brand-coral)] text-sm font-semibold text-white transition-colors hover:bg-[#e85a3c] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-coral)]"
        >
          <ScanLine aria-hidden="true" className="h-4 w-4" />
          Scan item
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset demo"
          className="flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] px-3 text-[var(--muted-foreground)] transition-colors hover:border-[var(--odoo-gray)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-coral)]"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </AppFrame>
  );
}
