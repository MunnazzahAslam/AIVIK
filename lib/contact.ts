import { neon } from "@neondatabase/serverless";
import { google } from "googleapis";

export type Submission = {
  timestamp: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
  recaptchaToken?: string;
};

// Postgres (Vercel/Neon) — source of truth for every inquiry.
export async function insertSubmission(data: Submission) {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("No POSTGRES_URL/DATABASE_URL configured");
  }

  const sql = neon(connectionString);

  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT NOT NULL,
      phone TEXT,
      service TEXT NOT NULL,
      message TEXT
    )
  `;

  await sql`
    INSERT INTO submissions (name, email, company, phone, service, message)
    VALUES (${data.name}, ${data.email}, ${data.company}, ${data.phone || null}, ${data.service}, ${data.message || null})
  `;
}

// Google Sheets — best-effort mirror for a human-readable inquiry log.
export async function appendToGoogleSheet(data: Submission) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !sheetId) {
    console.log("[contact] Google Sheets env vars not set, skipping sheet append");
    return;
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Submissions!A:G",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          data.timestamp,
          data.name,
          data.email,
          data.company,
          data.phone || "",
          data.service,
          data.message || "",
        ],
      ],
    },
  });
}

// Resend — best-effort notification email to the team inbox.
export async function sendNotificationEmail(data: Submission) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
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
Message: ${data.message || "not provided"}
Timestamp: ${data.timestamp}
  `.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AIVIK Website <noreply@aivik.eu>",
      to: ["info@aivik.eu", "aslammunnazzah@gmail.com"],
      subject: `New AIVIK inquiry from ${data.name}`,
      text: body,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend API error: ${res.status}`);
  }
}
