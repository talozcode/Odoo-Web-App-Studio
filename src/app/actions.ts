"use server";

import {
  ContactFormState,
  ContactSubmission,
  sendContactSubmission,
  validateContactSubmission,
} from "@/lib/contact";

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const submission: ContactSubmission = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    odooVersion: String(formData.get("odooVersion") ?? "").trim(),
    problemAreas: formData.getAll("problemAreas").map(String),
    message: String(formData.get("message") ?? "").trim(),
  };

  const fieldErrors = validateContactSubmission(submission);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors,
    };
  }

  try {
    await sendContactSubmission(submission);
  } catch (error) {
    console.error("[contact-submission] failed to send", error);
    return {
      status: "error",
      message: "Something went wrong on our end. Please try again.",
    };
  }

  return {
    status: "success",
    message: "Thanks — we'll get back to you shortly.",
  };
}
