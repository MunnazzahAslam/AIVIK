import { NextRequest, NextResponse } from "next/server";
import {
  Submission,
  appendToGoogleSheet,
  insertSubmission,
  sendNotificationEmail,
} from "@/lib/contact";

// Receives leads captured by the Chatbase widget (configured on Chatbase's
// own dashboard to POST here via a webhook/action once it has name, email,
// and a short description) and feeds them through the same
// DB/Sheet/email pipeline the contact form uses, so this doesn't become a
// second inquiry channel to maintain. Company is optional here since the
// chatbot only asks for it if the visitor volunteers it.
export async function POST(req: NextRequest) {
  const secret = process.env.CHATBOT_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    const submission: Submission = {
      timestamp: new Date().toISOString(),
      name,
      email,
      company: company || "",
      phone: "",
      service: "Chatbot inquiry",
      message,
    };

    await insertSubmission(submission);

    const results = await Promise.allSettled([
      appendToGoogleSheet(submission),
      sendNotificationEmail(submission),
    ]);
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("[chatbot-lead] notification failed:", result.reason);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[chatbot-lead] submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
