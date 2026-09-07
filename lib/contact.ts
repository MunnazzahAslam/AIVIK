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
    // console.error (not .log) so a missing config is impossible to miss in
    // Vercel's function logs -- this exact class of silent skip (present
    // but unnoticed for the Resend key) is what caused notification emails
    // to go quietly missing for an unknown stretch of time.
    console.error("[contact] Google Sheets env vars not set, skipping sheet append");
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
          neutralizeFormula(data.name),
          neutralizeFormula(data.email),
          neutralizeFormula(data.company),
          neutralizeFormula(data.phone || ""),
          neutralizeFormula(data.service),
          neutralizeFormula(data.message || ""),
        ],
      ],
    },
  });
}

// USER_ENTERED makes Sheets evaluate any cell starting with =, +, -, or @
// as a formula (e.g. a submitted name of =HYPERLINK("evil.com") would
// render as a live, clickable formula for whoever opens the sheet) — a
// leading apostrophe forces Sheets to treat the value as plain text.
function neutralizeFormula(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

// Resend — best-effort notification email to the team inbox.
export async function sendNotificationEmail(data: Submission) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    // console.error (not .log) -- RESEND_API_KEY was missing from Vercel's
    // production env entirely, which silently no-op'd every notification
    // email with only an info-level log line nobody was watching for. This
    // alone doesn't send an alert (there's no key to send one *with*), but
    // it at least makes the failure visible in Vercel's function logs/error
    // tracking instead of indistinguishable from a normal skip.
    console.error("[contact] No RESEND_API_KEY set, skipping email notification");
    return;
  }

  // Company/phone are usually blank now (dropped from the simplified
  // contact form) -- only show them when there's something to show, rather
  // than printing empty labels on every inquiry.
  const optionalLines = [
    data.company && `Company: ${data.company}`,
    data.phone && `Phone: ${data.phone}`,
  ].filter(Boolean);

  const body = `
New AIVIK inquiry received:

Name: ${data.name}
Email: ${data.email}
${optionalLines.length ? optionalLines.join("\n") + "\n" : ""}Service: ${data.service}
Message: ${data.message || "not provided"}
Timestamp: ${data.timestamp}

Reply directly to follow up -- include a Calendly link if it's time to schedule a call.
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
      // So "Reply" on this notification goes to the lead, not to noreply@ --
      // makes the "reply directly to follow up" instruction above actually work.
      reply_to: data.email,
      subject: `New AIVIK inquiry from ${data.name}`,
      text: body,
    }),
  });

  if (!res.ok) {
    // Capture Resend's actual error body (e.g. "domain not verified",
    // "invalid API key") -- a bare status code isn't enough to diagnose a
    // delivery failure after the fact, and a 200 from this fetch only means
    // Resend *accepted* the request, not that it reached an inbox.
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend API error: ${res.status} ${detail}`.trim());
  }
}
