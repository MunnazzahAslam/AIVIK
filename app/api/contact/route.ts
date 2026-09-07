import { NextRequest, NextResponse } from "next/server";
import {
  Submission,
  appendToGoogleSheet,
  insertSubmission,
  sendNotificationEmail,
} from "@/lib/contact";
import { validateContactInput } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Re-validates everything the client already checked (required fields,
    // email/phone format, max lengths) rather than trusting it — the client
    // form can be bypassed entirely (curl, disabled JS, a modified fetch).
    const validation = validateContactInput(body);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const { name, email, company, phone, service, message } = validation.data;
    const { recaptchaToken } = body;

    const submission: Submission = {
      timestamp: new Date().toISOString(),
      name,
      email,
      company,
      phone,
      service,
      message,
      recaptchaToken,
    };

    // Postgres is the source of truth — a failure here is a real failure.
    await insertSubmission(submission);

    // Sheet + email are best-effort notifications; don't fail the request for them.
    const results = await Promise.allSettled([
      appendToGoogleSheet(submission),
      sendNotificationEmail(submission),
    ]);
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("[contact] notification failed:", result.reason);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
