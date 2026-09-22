import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type ApiLinkProps = {
  orientation?: "horizontal" | "vertical";
  animated?: boolean;
  label?: string;
  className?: string;
};

/**
 * The dashed teal line between the Odoo hub and an app: the API. Horizontal
 * when the diagram and the app sit side by side, vertical when stacked.
 */
export function ApiLink({
  orientation = "horizontal",
  animated = false,
  label = "JSON-RPC API",
  className,
}: ApiLinkProps) {
  const horizontal = orientation === "horizontal";
  const length = 120;
  const thickness = 40;
  const width = horizontal ? length : thickness;
  const height = horizontal ? thickness : length;
  const x1 = horizontal ? 0 : thickness / 2;
  const y1 = horizontal ? thickness / 2 + 6 : 0;
  const x2 = horizontal ? length : thickness / 2;
  const y2 = horizontal ? thickness / 2 + 6 : length;
  const dotStyle = {
    offsetPath: `path("M ${x1} ${y1} L ${x2} ${y2}")`,
    "--flow-duration": "1.8s",
  } as CSSProperties;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className={cn(horizontal ? "h-10 w-[120px] shrink-0" : "h-[120px] w-10 shrink-0", className)}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="var(--odoo-teal)"
        strokeWidth={2}
        strokeDasharray="6 4"
        className={animated ? "flow-dash" : undefined}
      />
      {animated ? <circle className="flow-dot" r={3.5} fill="var(--odoo-teal)" style={dotStyle} /> : null}
      {horizontal ? (
        <text
          x={length / 2}
          y={12}
          fontSize={11}
          fontWeight={600}
          textAnchor="middle"
          fill="var(--odoo-teal)"
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
}
