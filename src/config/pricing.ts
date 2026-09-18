/**
 * Central pricing config. Change numbers here and they propagate everywhere
 * (example app cards, the pricing section) since no component hardcodes a
 * price directly.
 */

export type PricingTier = {
  id: "tiny" | "app" | "bigger";
  name: string;
  price: string;
  priceQualifier?: string;
  description: string;
  examples: string[];
};

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
    price: "$590–$1,500",
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
