"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactForm } from "@/app/actions";
import { INITIAL_CONTACT_STATE } from "@/lib/contact";
import { PROBLEM_CHIPS } from "@/config/site";
import { Chip } from "@/components/ui/chip";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 w-full rounded-lg bg-[var(--brand-coral)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e85a3c] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-coral)] sm:w-auto"
    >
      {pending ? "Sending…" : "Show us the problem"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(
    submitContactForm,
    INITIAL_CONTACT_STATE
  );
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const formId = useId();

  function toggleChip(label: string) {
    setSelectedChips((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  }

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-xl border border-[var(--odoo-teal)]/30 bg-[var(--odoo-teal)]/5 px-6 py-10 text-center"
      >
        <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-[var(--odoo-teal)]" />
        <p className="text-base font-semibold text-[var(--foreground)]">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-[var(--brand-coral)]/40 bg-[var(--brand-coral)]/5 px-4 py-3 text-sm text-[var(--brand-coral)]"
        >
          <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      ) : null}

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-[var(--foreground)]">
          What kind of workflow? <span className="font-normal text-[var(--muted-foreground)]">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {PROBLEM_CHIPS.map((label) => (
            <Chip
              key={label}
              label={label}
              selected={selectedChips.includes(label)}
              onToggle={() => toggleChip(label)}
            />
          ))}
        </div>
        {selectedChips.map((label) => (
          <input key={label} type="hidden" name="problemAreas" value={label} />
        ))}
      </fieldset>

      <div>
        <label
          htmlFor={`${formId}-message`}
          className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]"
        >
          Describe what you&apos;re doing today...
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={4}
          required
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={
            state.fieldErrors?.message ? `${formId}-message-error` : undefined
          }
          placeholder="Every morning our warehouse team opens Odoo, finds the delivery order, prints it, writes quantities on paper and someone enters everything back into Odoo later..."
          className="w-full rounded-lg border border-[var(--border)] px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-coral)]"
        />
        {state.fieldErrors?.message ? (
          <p id={`${formId}-message-error`} className="mt-1.5 text-xs text-[var(--brand-coral)]">
            {state.fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${formId}-name`}
            className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]"
          >
            Name
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={Boolean(state.fieldErrors?.name)}
            aria-describedby={
              state.fieldErrors?.name ? `${formId}-name-error` : undefined
            }
            className="min-h-11 w-full rounded-lg border border-[var(--border)] px-3.5 text-sm text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-coral)]"
          />
          {state.fieldErrors?.name ? (
            <p id={`${formId}-name-error`} className="mt-1.5 text-xs text-[var(--brand-coral)]">
              {state.fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={`${formId}-email`}
            className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]"
          >
            Work email
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={
              state.fieldErrors?.email ? `${formId}-email-error` : undefined
            }
            className="min-h-11 w-full rounded-lg border border-[var(--border)] px-3.5 text-sm text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-coral)]"
          />
          {state.fieldErrors?.email ? (
            <p id={`${formId}-email-error`} className="mt-1.5 text-xs text-[var(--brand-coral)]">
              {state.fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={`${formId}-company`}
            className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]"
          >
            Company <span className="font-normal text-[var(--muted-foreground)]">(optional)</span>
          </label>
          <input
            id={`${formId}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            className="min-h-11 w-full rounded-lg border border-[var(--border)] px-3.5 text-sm text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-coral)]"
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-odoo-version`}
            className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]"
          >
            Odoo version <span className="font-normal text-[var(--muted-foreground)]">(if known)</span>
          </label>
          <input
            id={`${formId}-odoo-version`}
            name="odooVersion"
            type="text"
            placeholder="e.g. 17"
            className="min-h-11 w-full rounded-lg border border-[var(--border)] px-3.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-coral)]"
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
