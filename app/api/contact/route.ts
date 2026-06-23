import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

type Submission = {
  timestamp: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
  recaptchaToken?: string;
};

async function storeSubmission(data: Submission) {
  const filePath = path.join(process.cwd(), "data", "submissions.json");

  let submissions: Submission[] = [];
  try {
    const existing = await readFile(filePath, "utf-8");
    submissions = JSON.parse(existing);
  } catch {
    // File doesn't exist yet — start fresh
    await mkdir(path.join(process.cwd(), "data"), { recursive: true });
  }

  submissions.push(data);
  await writeFile(filePath, JSON.stringify(submissions, null, 2), "utf-8");
}

async function sendNotificationEmail(data: Submission) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    // No Resend key configured — log and continue without sending
    console.log("[contact] No RESEND_API_KEY set, skipping email notification");
    return;
  }

  const body = `
New AIVIK inquiry received:

Name: ${data.name}
Email: ${data.email}
Company: ${data.company}
Phone: ${data.phone || "not provided"}
Service: ${data.service}
Message: ${data.message}
Timestamp: ${data.timestamp}
  `.trim();

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AIVIK Website <noreply@aivik.eu>",
      to: ["info@aivik.eu"],
      subject: `New AIVIK inquiry from ${data.name}`,
      text: body,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, phone, service, message, recaptchaToken } =
      body;

    if (!name || !email || !company || !service || !message) {
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
      message,
      recaptchaToken,
    };

    await storeSubmission(submission);
    await sendNotificationEmail(submission);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
