import type { CSSProperties } from "react";
import {
  ShoppingCart,
  Package,
  ClipboardList,
  Factory,
  Calculator,
  Users,
  Database,
  type LucideIcon,
} from "lucide-react";

const BOX_HEIGHT = 36;
const BOX_WIDTH = 146;
const ICON_SIZE = 15;
const FONT_SIZE = 13;
const ROW_GAP = 50;

// One tidy column: every module box shares a left edge, and every line
// leaves the box's right edge for the hub, so no line crosses a box.
const MODULE_DEFS: { label: string; icon: LucideIcon }[] = [
  { label: "Sales", icon: ShoppingCart },
  { label: "Inventory", icon: Package },
  { label: "Purchase", icon: ClipboardList },
  { label: "Manufacturing", icon: Factory },
  { label: "Accounting", icon: Calculator },
  { label: "Contacts", icon: Users },
];

const MODULES = MODULE_DEFS.map((mod, index) => ({
  ...mod,
  x: 2,
  y: 10 + index * ROW_GAP,
  width: BOX_WIDTH,
}));

export const CLUSTER_WIDTH = 330;
export const CLUSTER_HEIGHT = 10 + (MODULE_DEFS.length - 1) * ROW_GAP + BOX_HEIGHT + 10;
const HUB_X = 296;
const HUB_Y = CLUSTER_HEIGHT / 2;
const HUB_RADIUS = 14;

type OdooClusterProps = {
  /** Records travelling along the lines into the hub. */
  animated?: boolean;
  className?: string;
};

/**
 * Odoo's modules feeding one database. The hub sits on the right edge so
 * the composition can continue, through an ApiLink, into a real app card.
 */
export function OdooCluster({ animated = false, className }: OdooClusterProps) {
  return (
    <svg
      viewBox={`0 0 ${CLUSTER_WIDTH} ${CLUSTER_HEIGHT}`}
      role="img"
      aria-label="Odoo modules for Sales, Contacts, Inventory, Purchase, Manufacturing and Accounting all feed one Odoo database"
      className={className ?? "h-auto w-full"}
    >
      {MODULES.map((mod, index) => {
        const x1 = mod.x + mod.width;
        const y1 = mod.y + BOX_HEIGHT / 2;
        const path = `M ${x1} ${y1} L ${HUB_X} ${HUB_Y}`;
        const style = {
          offsetPath: `path("${path}")`,
          "--flow-delay": `${index * 0.45}s`,
          "--flow-duration": `${2.4 + (index % 3) * 0.3}s`,
        } as CSSProperties;
        return (
          <g key={`line-${mod.label}`}>
            <line
              x1={x1}
              y1={y1}
              x2={HUB_X}
              y2={HUB_Y}
              stroke="var(--odoo-purple)"
              strokeOpacity={0.28}
              strokeWidth={1.5}
            />
            {animated ? (
              <circle className="flow-dot" r={3} fill="var(--odoo-purple)" style={style} />
            ) : null}
          </g>
        );
      })}

      {MODULES.map((mod) => (
        <g key={mod.label}>
          <rect
            x={mod.x}
            y={mod.y}
            width={mod.width}
            height={BOX_HEIGHT}
            rx={9}
            fill="var(--background)"
            stroke="var(--odoo-gray)"
            strokeOpacity={0.55}
          />
          <mod.icon
            x={mod.x + 13}
            y={mod.y + BOX_HEIGHT / 2 - ICON_SIZE / 2}
            width={ICON_SIZE}
            height={ICON_SIZE}
            stroke="var(--odoo-purple)"
            strokeOpacity={0.85}
            strokeWidth={2}
            aria-hidden="true"
          />
          <text
            x={mod.x + 13 + ICON_SIZE + 8}
            y={mod.y + BOX_HEIGHT / 2 + 4.5}
            fontSize={FONT_SIZE}
            fontWeight={600}
            fill="var(--foreground)"
            fillOpacity={0.85}
          >
            {mod.label}
          </text>
        </g>
      ))}

      {/* Odoo database hub */}
      {animated ? (
        <circle
          className="flow-pulse"
          cx={HUB_X}
          cy={HUB_Y}
          r={HUB_RADIUS + 4}
          fill="var(--odoo-purple)"
        />
      ) : null}
      <circle cx={HUB_X} cy={HUB_Y} r={HUB_RADIUS + 8} fill="var(--odoo-purple)" fillOpacity={0.1} />
      <circle cx={HUB_X} cy={HUB_Y} r={HUB_RADIUS} fill="var(--background)" />
      <circle
        cx={HUB_X}
        cy={HUB_Y}
        r={HUB_RADIUS}
        fill="none"
        stroke="var(--odoo-purple)"
        strokeWidth={1.75}
      />
      <Database
        x={HUB_X - 8}
        y={HUB_Y - 8}
        width={16}
        height={16}
        stroke="var(--odoo-purple)"
        strokeWidth={2}
        aria-hidden="true"
      />
      <text
        x={HUB_X}
        y={HUB_Y + HUB_RADIUS + 24}
        fontSize={12}
        fontWeight={600}
        textAnchor="middle"
        fill="var(--odoo-purple)"
      >
        Odoo
      </text>
    </svg>
  );
}
