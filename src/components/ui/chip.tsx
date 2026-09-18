"use client";

import { cn } from "@/lib/utils";

type ChipProps = {
  label: string;
  selected: boolean;
  onToggle: () => void;
};

export function Chip({ label, selected, onToggle }: ChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={cn(
        "min-h-9 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-coral)]",
        selected
          ? "border-[var(--brand-coral)] bg-[var(--brand-coral)] text-white"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--odoo-gray)] hover:bg-[var(--border)]/40"
      )}
    >
      {label}
    </button>
  );
}
