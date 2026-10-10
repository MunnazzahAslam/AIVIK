import { neon } from "@neondatabase/serverless";
import { Submission, appendToGoogleSheet, insertSubmission, sendNotificationEmail } from "./contact";
import { LIMITS } from "./validation";
import { USE_CASES, USE_CASES_BASE, siteUrl, useCasePath } from "@/data/use-cases";

export type ChatRole = "user" | "assistant";
export type ChatContact = { name: string; email: string; phone: string };

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const MAX_HISTORY_MESSAGES = 20;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[\d\s+\-()]{7,20}$/;
// The visitor gets one answer, then the widget asks for their details.
export const FREE_QUESTIONS = 1;

function getSql() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("No POSTGRES_URL/DATABASE_URL configured");
  }
  return neon(connectionString);
}

// Same Postgres instance the contact form uses — conversations/messages are
// a separate concern from `submissions` (full transcript vs. a qualified
// lead record), so they get their own tables rather than overloading one.
async function ensureTables() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS chat_conversations (
      id SERIAL PRIMARY KEY,
      session_id TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      contact_captured BOOLEAN NOT NULL DEFAULT false
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    ALTER TABLE chat_conversations
      ADD COLUMN IF NOT EXISTS contact_name TEXT,
      ADD COLUMN IF NOT EXISTS contact_email TEXT,
      ADD COLUMN IF NOT EXISTS contact_phone TEXT
  `;
}

export async function ensureConversation(sessionId: string) {
  const sql = getSql();
  await ensureTables();
  await sql`
    INSERT INTO chat_conversations (session_id)
    VALUES (${sessionId})
    ON CONFLICT (session_id) DO NOTHING
  `;
}

export async function saveMessage(sessionId: string, role: ChatRole, content: string) {
  const sql = getSql();
  await sql`
    INSERT INTO chat_messages (session_id, role, content)
    VALUES (${sessionId}, ${role}, ${content})
  `;
}

export async function getConversationState(
  sessionId: string
): Promise<{ contactCaptured: boolean; contactName: string; userMessages: number }> {
  const sql = getSql();
  const rows = (await sql`
    SELECT c.contact_captured, c.contact_name,
      (SELECT count(*) FROM chat_messages m WHERE m.session_id = c.session_id AND m.role = 'user')::int AS user_messages
    FROM chat_conversations c WHERE c.session_id = ${sessionId}
  `) as { contact_captured: boolean; contact_name: string | null; user_messages: number }[];
  return {
    contactCaptured: rows[0]?.contact_captured ?? false,
    contactName: rows[0]?.contact_name ?? "",
    userMessages: rows[0]?.user_messages ?? 0,
  };
}

export async function getHistory(sessionId: string): Promise<{ role: ChatRole; content: string }[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT role, content FROM chat_messages WHERE session_id = ${sessionId} ORDER BY id ASC
  `) as { role: ChatRole; content: string }[];
  return rows.slice(-MAX_HISTORY_MESSAGES);
}

export function validateChatContact(
  body: unknown
): { ok: true; data: ChatContact } | { ok: false; field: keyof ChatContact } {
  const b = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.replace(/\s+/g, " ").trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";

  if (name.length < 2 || name.length > LIMITS.name) return { ok: false, field: "name" };
  if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) return { ok: false, field: "email" };
  if (!PHONE_PATTERN.test(phone) || phone.replace(/\D/g, "").length < 7) return { ok: false, field: "phone" };
  return { ok: true, data: { name, email, phone } };
}

// A captured chat lead is just a `submissions` row with a distinct service
// label — it lands in the same DB/Sheet/email pipeline the quote form uses
// instead of becoming a second channel the team has to check separately.
// Returns false when the conversation doesn't exist or has no question yet.
export async function captureLead(sessionId: string, contact: ChatContact): Promise<boolean> {
  const sql = getSql();
  await ensureTables();

  const questions = (await sql`
    SELECT content FROM chat_messages WHERE session_id = ${sessionId} AND role = 'user' ORDER BY id ASC
  `) as { content: string }[];
  if (questions.length === 0) return false;

  // Only the request that flips the flag sends the lead, so a double submit
  // doesn't notify the team twice.
  const claimed = (await sql`
    UPDATE chat_conversations
    SET contact_captured = true, contact_name = ${contact.name}, contact_email = ${contact.email}, contact_phone = ${contact.phone}
    WHERE session_id = ${sessionId} AND contact_captured = false
    RETURNING id
  `) as { id: number }[];
  if (claimed.length === 0) return true;

  const submission: Submission = {
    timestamp: new Date().toISOString(),
    name: contact.name,
    email: contact.email,
    company: "",
    phone: contact.phone,
    service: "Chatbot inquiry",
    message: `Asked in the chat: ${questions.map((q) => q.content).join(" / ")}`.slice(0, LIMITS.message),
  };

  await insertSubmission(submission);

  const results = await Promise.allSettled([
    appendToGoogleSheet(submission),
    sendNotificationEmail(submission),
  ]);
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("[chat] lead notification failed:", result.reason);
    }
  });
  return true;
}

// The use cases Mara can point to, built from the same data as the pages so
// the two never drift apart.
const USE_CASE_FACTS = USE_CASES.map(
  (u) =>
    `- ${u.brand} (${u.industry.en}; shows: ${u.proves.en}): ${u.summary.en} What it is and isn't: ${u.conceptNote.en} English page: ${siteUrl("en", useCasePath("en", u))} German page: ${siteUrl("de", useCasePath("de", u))}`
).join("\n");

const SYSTEM_PROMPT = `You are Mara, AIVIK's AI assistant, embedded as a chat widget on aivik.eu. AIVIK is a software engineering and AI automation company registered in Germany, GDPR-native, serving mid-to-enterprise clients across Europe.

FACTS — the only source of truth, never invent beyond this:

Services: Custom Software Development (web & mobile apps, legacy modernization, CRM/ERP); AI Workflow Automation (chatbots & virtual assistants, agentic workflows, generative AI, AI-powered customer support); Cloud Infrastructure (hosting, database management, migration, security); Data Analysis (predictive analytics, data infrastructure, governance, BI & reporting); Digital Marketing (SEO & content, paid ads, social, marketing analytics).

Process: Discovery & Alignment -> Solution Architecture -> Agile Delivery (sprints, live demos) -> Launch & Continuous Support (long-term partner, not a one-off vendor).

Why clients pick AIVIK: full source code/IP ownership from day one, one point of contact with direct engineer access, real deployed progress within days not proposal decks, AI designed in from the start.

USE CASES — four concept builds AIVIK designed and built to show what it can do. The brands are fictional: always call them concept builds (German: Konzeptprojekte), never clients or client projects, and never claim results, numbers or testimonials for them.
${USE_CASE_FACTS}
Overview of all four: ${siteUrl("en", USE_CASES_BASE.en)} (German: ${siteUrl("de", USE_CASES_BASE.de)})
When a visitor asks whether AIVIK has built something like their idea, or asks for examples, a portfolio or past work: name the closest use case in one sentence, say it's a concept build, and paste its full URL as plain text (the German page if they write in German). For a general request (portfolio, examples, past work) with no specific idea, give the overview URL. If none of the four is close to what they describe, say plainly that it isn't among the use cases and give the overview URL; never stretch a use case to fit or describe it as more than it is (Duneline, for example, is a front end only, with no back end, saved bookings or live data). One URL per reply.

PRICING — read this twice, it's a hard rule: you do not know AIVIK's prices, and there are no rough ranges you can safely give — not "typically", not "roughly", not "usually around". Every project is scoped individually, so any number you state would be made up and could actively mislead someone. If asked about cost, say plainly it depends on scope and a team member will follow up with real numbers once they understand the project — and nothing more specific than that. Same for timelines and guarantees: never invent them.

HOW YOU TALK — this is the most important part, read it twice:
- DEFAULT TO ONE SENTENCE. Only add a second if the first genuinely doesn't answer the question. Never three. Never a paragraph, never a bullet list, never a header.
- When asked broadly what you do, don't list every service category — pick 2-3 concrete examples and stop. You can always give more if they ask a follow-up.
- No filler openers, ever: never say "Great question!", "I'd be happy to help", "Certainly!", "Thanks for reaching out". Just answer, like a person who already knows the answer.
- Use contractions (we're, it's, you'll, don't). Drop formal connectors like "furthermore" or "in addition". Sound like a sharp colleague replying on Slack, not a press release.
- The length limit holds when you're refusing, explaining or being pushed too: two sentences at most, never paragraphs.
- Plain text only. The widget doesn't render markdown, so no asterisks, bold, italics, headers or bullet points.
- Only say what FACTS supports. Don't add claims about AIVIK such as how often you build something, how fast it pays off, or which clients you work with beyond "mid-to-enterprise".
- You only help with AIVIK and its services. For anything else (poems, homework, general knowledge, coding help for their own project), don't do it: say in one sentence that you're here for questions about AIVIK, and offer a relevant next step.
- Never claim to be human; if asked directly, say plainly you're an AI assistant.
- Reply in German if the visitor writes in German, otherwise English. In German, write proper German (nouns capitalised, e.g. "Chatbots", "KI-Automatisierung").

Example of the tone you want:
Visitor: "what do you build?"
Good reply: "Mostly custom software and AI automation — chatbots, internal tools, that kind of thing."
Bad reply: "At AIVIK, we offer a comprehensive range of services including custom software development, AI workflow automation, cloud infrastructure, data analysis, and digital marketing. We would be happy to discuss your specific needs in more detail!"

CONTACT DETAILS: the widget collects the visitor's name, email and phone number itself, with a short form shown right after your first reply. Never ask for a name, email address or phone number yourself, and don't mention the form. If they want a call, a quote or a person, say the team will follow up using the details they leave in the chat.

After every reply, end on its own new line with exactly:
SUGGESTIONS: <question 1> | <question 2> | <question 3>
Short follow-up questions the visitor could tap next, from their point of view (e.g. "How does your process work?"). Under 8 words each, in the visitor's language, and only questions FACTS lets you answer (not prices, timelines, or client types beyond mid-to-enterprise). Omit only if the conversation has clearly wrapped up.`;

function buildSystemPrompt(contactName: string): string {
  if (!contactName) return SYSTEM_PROMPT;
  // The name is visitor input: keep it to one short line of plain characters.
  const name = contactName.replace(/[^A-Za-z\u00C0-\u024F .'-]/g, "").slice(0, 60).trim();
  return (
    SYSTEM_PROMPT +
    `\n\nThe visitor has left their contact details in the widget${name ? `; their name is ${name}` : ""}. The team will follow up by email or phone, so don't ask for contact details.`
  );
}

function extractSuggestions(raw: string): { text: string; suggestions: string[] } {
  const match = raw.match(/\n?SUGGESTIONS:\s*(.+)\s*$/i);
  if (!match) return { text: raw.trim(), suggestions: [] };
  const suggestions = match[1]
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  return { text: raw.slice(0, match.index).trim(), suggestions };
}

export async function callClaude(
  history: { role: ChatRole; content: string }[],
  contactName: string
): Promise<{ reply: string; suggestions: string[] }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log("[chat] No ANTHROPIC_API_KEY set, chat is disabled");
    return {
      reply:
        "Chat's not switched on just yet — please use the quote form below, or email us directly at info@aivik.eu.",
      suggestions: [],
    };
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 350,
      system: buildSystemPrompt(contactName),
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${errText}`);
  }

  const data = (await res.json()) as { content: { type: string; text?: string }[] };
  const raw = data.content.find((b) => b.type === "text")?.text ?? "";
  const { text, suggestions } = extractSuggestions(raw);
  return { reply: text, suggestions };
}
