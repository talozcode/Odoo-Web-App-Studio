import {
  ShoppingCart,
  Package,
  ClipboardList,
  Factory,
  Calculator,
  Users,
  Database,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

const BOX_HEIGHT = 32;
const ICON_SIZE = 13;

// Size each box to its own label so "Manufacturing" is never clipped.
function boxWidth(label: string): number {
  return Math.max(84, label.length * 6.5 + 40);
}

const MODULE_DEFS: { label: string; x: number; y: number; icon: LucideIcon }[] = [
  { label: "Sales", x: 36, y: 26, icon: ShoppingCart },
  { label: "Inventory", x: 14, y: 96, icon: Package },
  { label: "Purchase", x: 24, y: 172, icon: ClipboardList },
  { label: "Manufacturing", x: 64, y: 220, icon: Factory },
  { label: "Accounting", x: 202, y: 210, icon: Calculator },
  { label: "Contacts", x: 232, y: 58, icon: Users },
];

const MODULES = MODULE_DEFS.map((mod) => ({ ...mod, width: boxWidth(mod.label) }));

const HUB_X = 326;
const HUB_Y = 125;
const HUB_RADIUS = 11;

const APP_X = 392;
const APP_WIDTH = 80;

/**
 * Static system diagram: Odoo's modules feed one database, and the app sits
 * outside it, connected only through the API. No motion; the picture is the
 * point.
 */
export function OdooCluster({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 264"
      role="img"
      aria-label="Odoo modules for Sales, Inventory, Purchase, Manufacturing, Accounting and Contacts feed one Odoo database; a separate app connects to it through the API"
      className={className ?? "h-auto w-full max-w-lg"}
    >
      {MODULES.map((mod) => {
        const x1 = mod.x + mod.width / 2;
        const y1 = mod.y + BOX_HEIGHT / 2;
        return (
          <line
            key={`line-${mod.label}`}
            x1={x1}
            y1={y1}
            x2={HUB_X}
            y2={HUB_Y}
            stroke="var(--odoo-purple)"
            strokeOpacity={0.3}
            strokeWidth={1.5}
          />
        );
      })}

      {MODULES.map((mod) => (
        <g key={mod.label}>
          <rect
            x={mod.x}
            y={mod.y}
            width={mod.width}
            height={BOX_HEIGHT}
            rx={8}
            fill="var(--background)"
            stroke="var(--odoo-gray)"
            strokeOpacity={0.6}
          />
          <mod.icon
            x={mod.x + 10}
            y={mod.y + BOX_HEIGHT / 2 - ICON_SIZE / 2}
            width={ICON_SIZE}
            height={ICON_SIZE}
            stroke="var(--odoo-purple)"
            strokeOpacity={0.8}
            strokeWidth={2}
            aria-hidden="true"
          />
          <text
            x={mod.x + 10 + ICON_SIZE + 6}
            y={mod.y + BOX_HEIGHT / 2 + 4}
            fontSize={11}
            fontWeight={600}
            fill="var(--foreground)"
            fillOpacity={0.75}
          >
            {mod.label}
          </text>
        </g>
      ))}

      {/* Odoo database hub */}
      <circle cx={HUB_X} cy={HUB_Y} r={HUB_RADIUS + 4} fill="var(--odoo-purple)" fillOpacity={0.12} />
      <circle cx={HUB_X} cy={HUB_Y} r={HUB_RADIUS - 4} fill="var(--background)" />
      <circle
        cx={HUB_X}
        cy={HUB_Y}
        r={HUB_RADIUS - 4}
        fill="none"
        stroke="var(--odoo-purple)"
        strokeWidth={1.5}
      />
      <Database
        x={HUB_X - 6.5}
        y={HUB_Y - 6.5}
        width={13}
        height={13}
        stroke="var(--odoo-purple)"
        strokeWidth={2}
        aria-hidden="true"
      />
      <text
        x={HUB_X}
        y={HUB_Y + 30}
        fontSize={10}
        textAnchor="middle"
        fill="var(--muted-foreground)"
      >
        Odoo
      </text>

      {/* API link to the app */}
      <line
        x1={HUB_X + HUB_RADIUS + 4}
        y1={HUB_Y}
        x2={APP_X}
        y2={HUB_Y}
        stroke="var(--odoo-teal)"
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />
      <text
        x={(HUB_X + HUB_RADIUS + 4 + APP_X) / 2}
        y={HUB_Y - 7}
        fontSize={9}
        textAnchor="middle"
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fill="var(--odoo-teal)"
      >
        API
      </text>

      <rect
        x={APP_X}
        y={HUB_Y - BOX_HEIGHT / 2}
        width={APP_WIDTH}
        height={BOX_HEIGHT}
        rx={8}
        fill="var(--background)"
        stroke="var(--odoo-teal)"
        strokeWidth={1.5}
      />
      <Smartphone
        x={APP_X + 10}
        y={HUB_Y - ICON_SIZE / 2}
        width={ICON_SIZE}
        height={ICON_SIZE}
        stroke="var(--odoo-teal)"
        strokeWidth={2}
        aria-hidden="true"
      />
      <text
        x={APP_X + 10 + ICON_SIZE + 6}
        y={HUB_Y + 4}
        fontSize={11}
        fontWeight={600}
        fill="var(--foreground)"
      >
        Your app
      </text>
    </svg>
  );
}
