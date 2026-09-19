import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AppFrameProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Shared "looks like a real small app screen" shell used by every demo-app
 * mock. Deliberately plain: a thin border, a compact title bar, a thin
 * coral top accent stripe so it reads as a branded product screen, with no
 * gradients/glassmorphism/drop shadows.
 */
export function AppFrame({ title, subtitle, children, className }: AppFrameProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-white",
        className
      )}
    >
      <div aria-hidden="true" className="h-[3px] bg-[var(--brand-coral)]" />
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          {subtitle ?? "Your app"}
        </p>
        <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
