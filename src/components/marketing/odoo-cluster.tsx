"use client";

import { motion, useReducedMotion } from "framer-motion";
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

const BOX_HEIGHT = 32;
const ICON_SIZE = 13;

// Fixed-width boxes clip longer labels like "Manufacturing": size each box
// to its own label instead of assuming every module name is short.
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

const CONVERGE_X = 300;
const CONVERGE_Y = 125;
const HUB_RADIUS = 11;

/**
 * The "complex Odoo" half of the hero visual motif: several real, iconed
 * module nodes feeding into one live-looking hub, which the hero then
 * continues with the literal API connector into the small app card. Icons
 * and a pulsing hub/data-flow give this the "real technical system" weight
 * that plain outlined text boxes didn't have.
 */
export function OdooCluster() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 340 250"
      role="img"
      aria-label="Odoo modules for Sales, Inventory, Purchase, Manufacturing, Accounting and Contacts, all feeding live into one connected hub"
      className="h-auto w-full max-w-md"
    >
      {MODULES.map((mod, index) => {
        const x1 = mod.x + mod.width / 2;
        const y1 = mod.y + BOX_HEIGHT / 2;
        return (
          <g key={`line-${mod.label}`}>
            <line
              x1={x1}
              y1={y1}
              x2={CONVERGE_X}
              y2={CONVERGE_Y}
              stroke="var(--odoo-purple)"
              strokeOpacity={0.3}
              strokeWidth={1.5}
            />
            {!shouldReduceMotion ? (
              <motion.circle
                r={2.2}
                fill="var(--odoo-purple)"
                initial={{ cx: x1, cy: y1, opacity: 0 }}
                animate={{
                  cx: [x1, CONVERGE_X],
                  cy: [y1, CONVERGE_Y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: 3,
                  delay: index * 0.5,
                  ease: "easeIn",
                }}
              />
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
            rx={8}
            fill="white"
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

      {!shouldReduceMotion ? (
        <motion.circle
          cx={CONVERGE_X}
          cy={CONVERGE_Y}
          r={HUB_RADIUS}
          fill="var(--odoo-purple)"
          fillOpacity={0.15}
          animate={{ r: [HUB_RADIUS, HUB_RADIUS + 6, HUB_RADIUS] }}
          transition={{ duration: 2.4, repeat: 3, ease: "easeInOut" }}
        />
      ) : null}
      <circle cx={CONVERGE_X} cy={CONVERGE_Y} r={HUB_RADIUS - 4} fill="white" />
      <circle
        cx={CONVERGE_X}
        cy={CONVERGE_Y}
        r={HUB_RADIUS - 4}
        fill="none"
        stroke="var(--odoo-purple)"
        strokeWidth={1.5}
      />
      <Database
        x={CONVERGE_X - 6.5}
        y={CONVERGE_Y - 6.5}
        width={13}
        height={13}
        stroke="var(--odoo-purple)"
        strokeWidth={2}
        aria-hidden="true"
      />
    </svg>
  );
}
