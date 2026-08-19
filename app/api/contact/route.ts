import { NextRequest, NextResponse } from "next/server";
import {
  Submission,
  appendToGoogleSheet,
  insertSubmission,
  sendNotificationEmail,
} from "@/lib/contact";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, phone, service, message, recaptchaToken } =
      body;

    if (!name || !email || !company || !service) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const submission: Submission = {
      timestamp: new Date().toISOString(),
      name,
      email,
      company,
      phone: phone || "",
      service,
      message: message || "",
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
