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

const BOX_HEIGHT = 38;
const ICON_SIZE = 15;
const FONT_SIZE = 13;

// Size each box to its own label so "Manufacturing" is never clipped.
function boxWidth(label: string): number {
  return Math.max(96, label.length * 7.6 + 48);
}

const MODULE_DEFS: { label: string; x: number; y: number; icon: LucideIcon }[] = [
  { label: "Sales", x: 40, y: 22, icon: ShoppingCart },
  { label: "Contacts", x: 200, y: 62, icon: Users },
  { label: "Inventory", x: 14, y: 110, icon: Package },
  { label: "Purchase", x: 26, y: 196, icon: ClipboardList },
  { label: "Manufacturing", x: 74, y: 258, icon: Factory },
  { label: "Accounting", x: 222, y: 236, icon: Calculator },
];

const MODULES = MODULE_DEFS.map((mod) => ({ ...mod, width: boxWidth(mod.label) }));

export const CLUSTER_WIDTH = 400;
export const CLUSTER_HEIGHT = 320;
const HUB_X = 366;
const HUB_Y = 160;
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
        const x1 = mod.x + mod.width / 2;
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
      <circle cx={HUB_X} cy={HUB_Y} r={HUB_RADIUS + 6} fill="var(--odoo-purple)" fillOpacity={0.12} />
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
        y={HUB_Y + HUB_RADIUS + 20}
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
