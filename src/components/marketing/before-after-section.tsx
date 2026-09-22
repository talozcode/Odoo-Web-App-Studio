"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { SegmentedControl } from "@/components/ui/segmented-control";

type Scenario = {
  id: string;
  persona: string;
  before: string[];
  after: string[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "warehouse",
    persona: "Warehouse employee",
    before: [
      "Inventory",
      "Operations",
      "Deliveries",
      "Search order",
      "Open delivery",
      "Operations",
      "Find item",
      "Select lot",
      "Enter quantity",
      "Validate",
    ],
    after: ["Scan order", "Scan product", "Done"],
  },
  {
    id: "sales",
    persona: "Sales rep",
    before: [
      "Open Odoo mobile",
      "Customers",
      "Search",
      "Sales",
      "Create quotation",
      "Add lines",
      "Products",
      "Confirm",
    ],
    after: ["Customer", "Products", "Submit"],
  },
];

export function BeforeAfterSection() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [mode, setMode] = useState<"before" | "after">("before");
  const shouldReduceMotion = useReducedMotion();
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const steps = mode === "before" ? scenario.before : scenario.after;

  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading title="Same job. A lot fewer clicks." />

        <div className="mt-8 flex flex-col items-center gap-4">
          <SegmentedControl
            aria-label="Choose an example"
            options={SCENARIOS.map((s) => ({ value: s.id, label: s.persona }))}
            value={scenarioId}
            onChange={(value) => setScenarioId(value)}
          />
          <SegmentedControl
            aria-label="Before or after"
            options={[
              { value: "before", label: "Before" },
              { value: "after", label: "After" },
            ]}
            value={mode}
            onChange={(value) => setMode(value as "before" | "after")}
          />
        </div>

        <div className="mt-10 min-h-[140px] rounded-xl border border-[var(--border)] bg-white p-6 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${scenarioId}-${mode}`}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {steps.map((step, index) => (
                <div key={`${step}-${index}`} className="flex items-center gap-2">
                  <span
                    className={
                      mode === "after"
                        ? "rounded-lg bg-[var(--odoo-teal)]/10 px-3 py-2 text-sm font-semibold text-[var(--odoo-teal)]"
                        : "rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted-foreground)]"
                    }
                  >
                    {step}
                  </span>
                  {index < steps.length - 1 ? (
                    <ChevronRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[var(--odoo-gray)]"
                    />
                  ) : null}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
          {mode === "before"
            ? `${scenario.before.length} steps in Odoo today.`
            : `${scenario.after.length} steps in the app.`}
        </p>
      </div>
    </section>
  );
}
