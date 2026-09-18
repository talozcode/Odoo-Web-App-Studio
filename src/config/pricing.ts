/**
 * Central pricing config. Change numbers here and they propagate everywhere
 * (example app cards, the pricing section) since no component hardcodes a
 * price directly.
 */

import { EXAMPLE_APPS, type ExampleAppId } from "./examples";

export type PricingTier = {
  id: "tiny" | "app" | "bigger";
  name: string;
  price: string;
  priceQualifier?: string;
  description: string;
  examples: string[];
};

// The "Custom Workflow" example lives at the Tiny-tier price point (it's
// this tier's own example, not one of the multi-screen App-tier builds), so
// it's excluded when deriving the App tier's range below.
const APP_TIER_EXCLUDED_EXAMPLE_IDS: ExampleAppId[] = ["custom-workflow"];

function formatPriceRange(min: number, max: number): string {
  return `$${min.toLocaleString("en-US")}–$${max.toLocaleString("en-US")}`;
}

const appTierExamplePrices = EXAMPLE_APPS.filter(
  (app) => !APP_TIER_EXCLUDED_EXAMPLE_IDS.includes(app.id)
).map((app) => app.priceFrom);

// Derived from EXAMPLE_APPS (src/config/examples.ts) rather than hardcoded,
// so a price change there always stays consistent with what's shown here.
const APP_TIER_PRICE_RANGE = formatPriceRange(
  Math.min(...appTierExamplePrices),
  Math.max(...appTierExamplePrices)
);

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "tiny",
    name: "Tiny",
    price: "From $390",
    description: "One focused workflow.",
    examples: ["Approval screen", "Simple report", "Small data entry tool"],
  },
  {
    id: "app",
    name: "App",
    price: APP_TIER_PRICE_RANGE,
    priceQualifier: "Typically",
    description:
      "A polished multi-screen web application built around one workflow.",
    examples: [],
  },
  {
    id: "bigger",
    name: "Bigger idea",
    price: "Let's talk",
    description: "For more sophisticated workflows, portals or systems.",
    examples: [],
  },
];

export const HOSTING_NOTE =
  "Need us to host and maintain it? We can do that too.";
