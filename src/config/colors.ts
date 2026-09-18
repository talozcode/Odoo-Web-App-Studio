/**
 * Central color tokens.
 *
 * These hex values are the single source of truth. They are mirrored as CSS
 * variables in `src/app/globals.css` (and exposed as Tailwind utilities via
 * `@theme inline`). Components that need a raw hex value (inline SVG charts,
 * canvas, etc.) should import from here instead of hardcoding a hex code so
 * there is only ever one place these colors are defined.
 */
export const COLORS = {
  odooPurple: "#714B67",
  odooTeal: "#017E84",
  odooGray: "#8F8F8F",
  brandCoral: "#FF6B4A",
  charcoal: "#1F2937",
  background: "#FFFFFF",
  surface: "#F7F6F4",
  border: "#E5E7EB",
} as const;

export type ColorToken = keyof typeof COLORS;
