import { cn } from "@/lib/utils";
import type { DemoResult } from "@/lib/odoo/types";
import { SyncedAgo } from "./synced-ago";

type RpcReadoutProps = {
  result: DemoResult<unknown>;
  className?: string;
};

/**
 * The line of truth under each demo: the actual ORM call that produced the
 * data, how long it took, and whether it came from the live demo Odoo or the
 * bundled snapshot of Odoo's demo dataset. Set in the mono face because it
 * is code, not copy.
 */
export function RpcReadout({ result, className }: RpcReadoutProps) {
  const { trace, source, fetchedAt } = result;
  const isLive = source === "live";

  return (
    <div
      className={cn(
        "flex w-full max-w-sm flex-col gap-1 font-mono text-[12px] leading-5 text-[var(--muted-foreground)]",
        className
      )}
    >
      <p className="flex items-baseline justify-between gap-3">
        <span className="truncate text-[var(--foreground)]">{trace.summary}</span>
        {isLive ? (
          <span className="shrink-0 tabular-nums">
            {trace.records} {trace.records === 1 ? "record" : "records"}, {trace.ms} ms
          </span>
        ) : (
          <span className="shrink-0 tabular-nums">
            {trace.records} {trace.records === 1 ? "record" : "records"}
          </span>
        )}
      </p>
      <p className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            isLive ? "bg-[var(--odoo-teal)]" : "bg-[var(--odoo-gray)]"
          )}
        />
        {isLive ? (
          <>
            <span className="text-[var(--odoo-teal)]">live Odoo 18</span>
            <span aria-hidden="true">/</span>
            <SyncedAgo fetchedAt={fetchedAt} />
          </>
        ) : (
          <span>Odoo 18 demo dataset, snapshot</span>
        )}
      </p>
    </div>
  );
}
