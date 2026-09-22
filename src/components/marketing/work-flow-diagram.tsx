import { Users, Smartphone, Monitor, Database, Clock } from "lucide-react";

type WorkFlowDiagramProps = {
  /** Who uses the app, short. */
  users: string;
  /** The app's name, short. */
  app: string;
  /** Odoo models it touches; drawn under the Odoo node. */
  models: string[];
  /** Which glyph represents the app. */
  kind?: "phone" | "screen" | "cron";
};

const W = 520;
const H = 170;
const NODE_Y = 34;
const NODE_H = 40;

/**
 * One case study as a picture: the people, the app, and the Odoo models
 * behind it. Same visual language as the hero diagram, static.
 */
export function WorkFlowDiagram({ users, app, models, kind = "phone" }: WorkFlowDiagramProps) {
  const AppIcon = kind === "screen" ? Monitor : kind === "cron" ? Clock : Smartphone;
  const usersW = 150;
  const appW = 170;
  const odooW = 110;
  const gap = (W - usersW - appW - odooW) / 2;
  const usersX = 0;
  const appX = usersX + usersW + gap;
  const odooX = appX + appW + gap;
  const midY = NODE_Y + NODE_H / 2;
  const modelLines = models.slice(0, 4);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${users} use ${app}, which connects to Odoo through the API: ${models.join(", ")}`}
      className="h-auto w-full"
    >
      {/* users -> app */}
      <line
        x1={usersX + usersW}
        y1={midY}
        x2={appX}
        y2={midY}
        stroke="var(--odoo-gray)"
        strokeOpacity={0.6}
        strokeWidth={1.5}
      />
      {/* app -> odoo (API) */}
      <line
        x1={appX + appW}
        y1={midY}
        x2={odooX}
        y2={midY}
        stroke="var(--odoo-teal)"
        strokeWidth={2}
        strokeDasharray="6 4"
      />
      <text
        x={appX + appW + gap / 2}
        y={midY - 9}
        fontSize={10}
        fontWeight={600}
        textAnchor="middle"
        fill="var(--odoo-teal)"
      >
        API
      </text>

      {/* users */}
      <rect
        x={usersX}
        y={NODE_Y}
        width={usersW}
        height={NODE_H}
        rx={9}
        fill="var(--background)"
        stroke="var(--odoo-gray)"
        strokeOpacity={0.55}
      />
      <Users
        x={usersX + 12}
        y={midY - 8}
        width={16}
        height={16}
        stroke="var(--muted-foreground)"
        strokeWidth={2}
        aria-hidden="true"
      />
      <text x={usersX + 36} y={midY + 4.5} fontSize={12} fontWeight={600} fill="var(--foreground)">
        {users}
      </text>

      {/* app */}
      <rect
        x={appX}
        y={NODE_Y}
        width={appW}
        height={NODE_H}
        rx={9}
        fill="var(--background)"
        stroke="var(--odoo-teal)"
        strokeWidth={1.75}
      />
      <AppIcon
        x={appX + 12}
        y={midY - 8}
        width={16}
        height={16}
        stroke="var(--odoo-teal)"
        strokeWidth={2}
        aria-hidden="true"
      />
      <text x={appX + 36} y={midY + 4.5} fontSize={12} fontWeight={600} fill="var(--foreground)">
        {app}
      </text>

      {/* odoo */}
      <rect
        x={odooX}
        y={NODE_Y}
        width={odooW}
        height={NODE_H}
        rx={9}
        fill="var(--odoo-purple)"
        fillOpacity={0.08}
        stroke="var(--odoo-purple)"
        strokeOpacity={0.7}
        strokeWidth={1.5}
      />
      <Database
        x={odooX + 12}
        y={midY - 8}
        width={16}
        height={16}
        stroke="var(--odoo-purple)"
        strokeWidth={2}
        aria-hidden="true"
      />
      <text x={odooX + 36} y={midY + 4.5} fontSize={12} fontWeight={600} fill="var(--odoo-purple)">
        Odoo
      </text>
      {modelLines.map((model, index) => (
        <text
          key={model}
          x={odooX + odooW}
          y={NODE_Y + NODE_H + 20 + index * 15}
          fontSize={10.5}
          textAnchor="end"
          fontFamily="var(--font-mono), ui-monospace, monospace"
          fill="var(--odoo-purple)"
        >
          {model}
        </text>
      ))}
    </svg>
  );
}
