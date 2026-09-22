import { CONTACT_EMAIL } from "@/config/site";

/**
 * Contact submission types + validation, shared between the server action
 * and (indirectly) the client form's expectations.
 */

export type ContactSubmission = {
  name: string;
  email: string;
  company: string;
  odooVersion: string;
  problemAreas: string[];
  message: string;
};

export type FieldErrors = Partial<
  Record<"name" | "email" | "message", string>
>;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
};

export const INITIAL_CONTACT_STATE: ContactFormState = { status: "idle" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactSubmission(
  data: ContactSubmission
): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.name.trim()) {
    errors.name = "Please tell us your name.";
  }

  if (!data.email.trim()) {
    errors.email = "Please add a work email.";
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = "That email address doesn't look right.";
  }

  if (!data.message.trim()) {
    errors.message = "Tell us a bit about the workflow.";
  } else if (data.message.trim().length < 10) {
    errors.message = "A few more details would help (10 characters minimum).";
  }

  return errors;
}

/**
 * Sends the contact submission by email via Resend. Falls back to a console
 * log (rather than throwing) when RESEND_API_KEY isn't set, so local dev
 * without the env var configured still works end to end.
 */
export async function sendContactSubmission(
  submission: ContactSubmission
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[contact-submission] RESEND_API_KEY not set, logging only", {
      receivedAt: new Date().toISOString(),
      ...submission,
    });
    return;
  }

  const problemAreas = submission.problemAreas.length
    ? submission.problemAreas.join(", ")
    : "(none selected)";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "OdooWebApps <leads@odoowebapps.com>",
      to: CONTACT_EMAIL,
      reply_to: submission.email,
      subject: `New workflow submission from ${submission.name}`,
      text: [
        `Name: ${submission.name}`,
        `Work email: ${submission.email}`,
        `Company: ${submission.company || "(not given)"}`,
        `Odoo version: ${submission.odooVersion || "(not given)"}`,
        `Workflow areas: ${problemAreas}`,
        "",
        "What they're doing today:",
        submission.message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend request failed (${response.status}): ${body}`);
  }
}
