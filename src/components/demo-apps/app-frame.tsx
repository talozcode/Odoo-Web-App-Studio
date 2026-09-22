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
 * mock. Deliberately plain: a thin border, a compact title bar, no
 * gradients or drop shadows, so the app's own content carries the visual
 * interest. The title bar's small label is set in the mono face because it
 * names the app, the way a window title would.
 */
export function AppFrame({ title, subtitle, children, className }: AppFrameProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]",
        className
      )}
    >
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <p className="font-mono text-[11px] text-[var(--muted-foreground)]">
          {subtitle ?? "Your app"}
        </p>
        <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
