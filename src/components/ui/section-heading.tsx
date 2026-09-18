import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--odoo-teal)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-[var(--muted-foreground)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
