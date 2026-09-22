import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-coral)] " +
  "disabled:opacity-50 disabled:pointer-events-none min-h-11 px-5 py-2.5";

const variantStyles = {
  primary:
    "bg-[var(--brand-coral)] text-white shadow-[0_4px_14px_-4px_rgba(184,66,15,0.35)] hover:bg-[#c1592c] hover:shadow-[0_6px_18px_-4px_rgba(184,66,15,0.45)] active:bg-[#9c380d]",
  secondary:
    "bg-transparent text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--foreground)]",
  ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface)]",
} as const;

type Variant = keyof typeof variantStyles;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
};

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <a className={cn(baseStyles, variantStyles[variant], className)} {...props} />
  );
}
