const MODULES = [
  { label: "Sales", x: 40, y: 30 },
  { label: "Inventory", x: 20, y: 100 },
  { label: "Purchase", x: 30, y: 175 },
  { label: "Manufacturing", x: 100, y: 220 },
  { label: "Accounting", x: 190, y: 210 },
  { label: "Contacts", x: 230, y: 60 },
];

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
          x1={mod.x + 34}
          y1={mod.y + 14}
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
            width={72}
            height={28}
            rx={8}
            fill="white"
            stroke="var(--odoo-purple)"
            strokeOpacity={0.5}
          />
          <text
            x={mod.x + 36}
            y={mod.y + 18}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill="var(--odoo-purple)"
          >
            {mod.label}
          </text>
        </g>
      ))}

      <circle cx={CONVERGE_X} cy={CONVERGE_Y} r={5} fill="var(--odoo-purple)" />
    </svg>
  );
}
