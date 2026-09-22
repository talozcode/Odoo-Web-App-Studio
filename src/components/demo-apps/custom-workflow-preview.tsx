import { AppFrame } from "./app-frame";

export function CustomWorkflowPreview() {
  return (
    <AppFrame title="Expense Report #482" subtitle="Custom workflow">
      <span className="mb-3 inline-block rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted-foreground)]">
        Example: Expense approval
      </span>
      <div className="rounded-lg border border-[var(--border)] px-3 py-2.5">
        <p className="text-sm font-medium text-[var(--foreground)]">
          Chiang Mai supplier trip
        </p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Submitted by N. Somsak · $184.00
        </p>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="min-h-11 flex-1 rounded-lg bg-[var(--odoo-teal)] text-sm font-semibold text-white transition-colors hover:bg-[var(--odoo-teal-hover)]"
        >
          Approve
        </button>
        <button
          type="button"
          className="min-h-11 flex-1 rounded-lg border border-[var(--border)] text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--odoo-gray)]"
        >
          Reject
        </button>
      </div>
    </AppFrame>
  );
}
