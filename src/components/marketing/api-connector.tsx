"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type ApiConnectorProps = {
  label?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
};

/**
 * The literal "thin API connection line" from the brief's visual motif.
 * A small dot travels along the line to suggest data flowing across it;
 * disabled entirely under prefers-reduced-motion.
 */
export function ApiConnector({
  label = "Secure API",
  orientation = "horizontal",
  className,
}: ApiConnectorProps) {
  const shouldReduceMotion = useReducedMotion();
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        isHorizontal ? "w-full flex-row" : "h-full flex-col",
        className
      )}
    >
      <div
        className={cn(
          "relative bg-[var(--odoo-teal)]/30",
          isHorizontal ? "h-px flex-1" : "w-px flex-1"
        )}
      >
        {!shouldReduceMotion ? (
          <motion.span
            className={cn(
              "absolute rounded-full bg-[var(--odoo-teal)]",
              isHorizontal ? "top-1/2 h-1.5 w-1.5 -translate-y-1/2" : "left-1/2 h-1.5 w-1.5 -translate-x-1/2"
            )}
            animate={
              isHorizontal
                ? { left: ["0%", "100%"] }
                : { top: ["0%", "100%"] }
            }
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
      </div>
      <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--odoo-teal)]">
        <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
        {label}
      </span>
      <div
        className={cn(
          "bg-[var(--odoo-teal)]/30",
          isHorizontal ? "h-px flex-1" : "w-px flex-1"
        )}
      />
    </div>
  );
}
