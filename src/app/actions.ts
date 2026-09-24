"use server";

import { headers } from "next/headers";
import { checkForBot } from "@/lib/bot-check";
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
  const values = {
    name: submission.name,
    email: submission.email,
    company: submission.company,
    odooVersion: submission.odooVersion,
    message: submission.message,
  };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const verdict = await checkForBot(formData, ip);
  if (!verdict.ok) {
    if (verdict.silent) {
      // Tell the bot it worked; nothing is sent.
      console.warn("[contact-submission] dropped as bot:", verdict.reason);
      return { status: "success", message: "Thanks, we'll get back to you shortly." };
    }
    return {
      status: "error",
      message: "Please tick the verification box and send again.",
      values,
    };
  }


  const fieldErrors = validateContactSubmission(submission);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors,
      values,
    };
  }

  try {
    await sendContactSubmission(submission);
  } catch (error) {
    console.error("[contact-submission] failed to send", error);
    return {
      status: "error",
      message: "Something went wrong on our end. Please try again.",
      values,
    };
  }

  return {
    status: "success",
    message: "Thanks, we'll get back to you shortly.",
  };
}
