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
 * Sends the contact submission somewhere durable.
 *
 * TODO(v1 launch blocker): there is no email/DB backend wired up yet. For
 * now this just logs the submission server-side so the request is at least
 * visible in server logs. Swap the body of this function for a Resend call
 * (or a DB insert) later — everything upstream (the server action + form)
 * already treats this as the single integration point, so wiring in a real
 * destination is a one-function change.
 */
export async function sendContactSubmission(
  submission: ContactSubmission
): Promise<void> {
  console.log("[contact-submission]", {
    receivedAt: new Date().toISOString(),
    ...submission,
  });
}
