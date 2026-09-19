const MIN_BOX_WIDTH = 72;
const BOX_HEIGHT = 28;

// Fixed-width boxes clip longer labels like "Manufacturing": size each box
// to its own label instead of assuming every module name is short.
function boxWidth(label: string): number {
  return Math.max(MIN_BOX_WIDTH, label.length * 6.5 + 20);
}

const MODULES = [
  { label: "Sales", x: 40, y: 30 },
  { label: "Inventory", x: 20, y: 100 },
  { label: "Purchase", x: 30, y: 175 },
  { label: "Manufacturing", x: 70, y: 220 },
  { label: "Accounting", x: 200, y: 210 },
  { label: "Contacts", x: 230, y: 60 },
].map((mod) => ({ ...mod, width: boxWidth(mod.label) }));

const CONVERGE_X = 300;
const CONVERGE_Y = 125;

/**
 * The "complex Odoo" half of the hero visual motif: several module nodes
 * converging through thin lines into a single connection point, which the
 * hero then continues with a literal connector into the small app card.
 */
export function OdooCluster() {
  return (
    <svg
      viewBox="0 0 340 250"
      role="img"
      aria-label="Odoo modules for Sales, Inventory, Purchase, Manufacturing, Accounting and Contacts, converging into a single connection"
      className="h-auto w-full max-w-md"
    >
      {MODULES.map((mod) => (
        <line
          key={`line-${mod.label}`}
          x1={mod.x + mod.width / 2}
          y1={mod.y + BOX_HEIGHT / 2}
          x2={CONVERGE_X}
          y2={CONVERGE_Y}
          stroke="var(--odoo-purple)"
          strokeOpacity={0.35}
          strokeWidth={1.5}
        />
      ))}

      {MODULES.map((mod) => (
        <g key={mod.label}>
          <rect
            x={mod.x}
            y={mod.y}
            width={mod.width}
            height={BOX_HEIGHT}
            rx={8}
            fill="white"
            stroke="var(--odoo-gray)"
            strokeOpacity={0.6}
          />
          <text
            x={mod.x + mod.width / 2}
            y={mod.y + 18}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill="var(--foreground)"
            fillOpacity={0.7}
          >
            {mod.label}
          </text>
        </g>
      ))}

      <circle cx={CONVERGE_X} cy={CONVERGE_Y} r={5} fill="var(--odoo-purple)" />
    </svg>
  );
}
