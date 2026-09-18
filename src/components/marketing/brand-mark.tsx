import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
};

/**
 * Small coded (no image asset) abstract logomark: a 2x2 grid of rounded
 * squares in the four brand tones, inside a rounded-square tile. Purely
 * decorative — sits immediately left of the "Layer" wordmark.
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-7 w-7 shrink-0 grid-cols-2 grid-rows-2 gap-[3px] rounded-lg bg-[var(--surface)] p-[5px]",
        className
      )}
    >
      <span className="rounded-[2px] bg-[var(--odoo-purple)]" />
      <span className="rounded-[2px] bg-[var(--odoo-teal)]" />
      <span className="rounded-[2px] bg-[var(--brand-coral)]" />
      <span className="rounded-[2px] bg-[var(--foreground)]" />
    </span>
  );
}
