"use client";

import { cn } from "@/lib/utils";
import type { DemoResult } from "@/lib/odoo/types";
import { SyncedAgo } from "./synced-ago";

/** What the demo is doing right now, when that differs from the initial read. */
export type RpcActivity = {
  /** The call, e.g. "create sale.order S00042, action_confirm". */
  summary: string;
  /** Right-hand detail, e.g. "118 ms" or "not sent". */
  detail: string;
  /** Whether the call actually reached Odoo. */
  sent: boolean;
  /** ISO time the call completed, when it was sent. */
  at?: string;
};

type RpcReadoutProps = {
  result: DemoResult<unknown>;
  activity?: RpcActivity;
  className?: string;
};

/**
 * The line of truth under each demo: the ORM call behind what is on screen,
 * how long it took, and whether it came from the live demo Odoo or the
 * bundled snapshot of Odoo's demo dataset. Set in the mono face because it
 * is code, not copy. When a demo acts, the line follows it.
 */
export function RpcReadout({ result, activity, className }: RpcReadoutProps) {
  const { trace, source, fetchedAt } = result;
  const isLive = source === "live";
  const records = `${trace.records} ${trace.records === 1 ? "record" : "records"}`;

  const summary = activity ? activity.summary : trace.summary;
  const detail = activity ? activity.detail : isLive ? `${records}, ${trace.ms} ms` : records;
  const notSent = activity ? !activity.sent : false;
  const syncedAt = activity?.sent && activity.at ? activity.at : fetchedAt;

  return (
    <div
      className={cn(
        "flex w-full max-w-sm flex-col gap-1 font-mono text-[12px] leading-5 text-[var(--muted-foreground)]",
        className
      )}
      aria-live="polite"
    >
      <p className="flex items-baseline justify-between gap-3">
        <span className="truncate text-[var(--foreground)]">{summary}</span>
        <span className="shrink-0 tabular-nums">{detail}</span>
      </p>
      <p className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            !notSent && isLive ? "bg-[var(--odoo-teal)]" : "bg-[var(--odoo-gray)]"
          )}
        />
        {notSent ? (
          <span>not sent to Odoo, demo only</span>
        ) : isLive ? (
          <>
            <span className="text-[var(--odoo-teal)]">live Odoo 18</span>
            <span aria-hidden="true">/</span>
            <SyncedAgo fetchedAt={syncedAt} />
          </>
        ) : (
          <span>Odoo 18 demo dataset, snapshot</span>
        )}
      </p>
    </div>
  );
}
