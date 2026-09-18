"use client";

import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

type SegmentedControlProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  "aria-label": string;
  className?: string;
};

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
  ...rest
}: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      aria-label={rest["aria-label"]}
      className={cn(
        "inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-9 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-coral)]",
              isActive
                ? "bg-white text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
