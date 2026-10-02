import { neon } from "@neondatabase/serverless";
import { Submission, appendToGoogleSheet, insertSubmission, sendNotificationEmail } from "./contact";

export type ChatRole = "user" | "assistant";
export type LeadTag = "hot" | "warm" | "cold";

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const MAX_HISTORY_MESSAGES = 20;

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

export async function getContactCaptured(sessionId: string): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`
    SELECT contact_captured FROM chat_conversations WHERE session_id = ${sessionId}
  `) as { contact_captured: boolean }[];
  return rows[0]?.contact_captured ?? false;
}

export async function getHistory(sessionId: string): Promise<{ role: ChatRole; content: string }[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT role, content FROM chat_messages WHERE session_id = ${sessionId} ORDER BY id ASC
  `) as { role: ChatRole; content: string }[];
  return rows.slice(-MAX_HISTORY_MESSAGES);
}

// A captured chat lead is just a `submissions` row with a distinct service
// label — it lands in the same DB/Sheet/email pipeline the quote form uses
// instead of becoming a second channel the team has to check separately.
async function captureLead(
  sessionId: string,
  data: { name: string; email: string; company?: string; intent: string; tag: LeadTag }
) {
  const sql = getSql();
  await sql`
    UPDATE chat_conversations SET contact_captured = true WHERE session_id = ${sessionId}
  `;

  const submission: Submission = {
    timestamp: new Date().toISOString(),
    name: data.name,
    email: data.email,
    company: data.company || "",
    phone: "",
    service: `Chatbot inquiry (${data.tag} lead)`,
    message: data.intent,
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
}

const SYSTEM_PROMPT = `You are Mara, AIVIK's AI assistant, embedded as a chat widget on aivik.eu. AIVIK is a software engineering and AI automation company registered in Germany, GDPR-native, serving mid-to-enterprise clients across Europe.

FACTS — the only source of truth, never invent beyond this:

Services: Custom Software Development (web & mobile apps, legacy modernization, CRM/ERP); AI Workflow Automation (chatbots & virtual assistants, agentic workflows, generative AI, AI-powered customer support); Cloud Infrastructure (hosting, database management, migration, security); Data Analysis (predictive analytics, data infrastructure, governance, BI & reporting); Digital Marketing (SEO & content, paid ads, social, marketing analytics).

Process: Discovery & Alignment -> Solution Architecture -> Agile Delivery (sprints, live demos) -> Launch & Continuous Support (long-term partner, not a one-off vendor).

Why clients pick AIVIK: full source code/IP ownership from day one, one point of contact with direct engineer access, real deployed progress within days not proposal decks, AI designed in from the start.

PRICING — read this twice, it's a hard rule: you do not know AIVIK's prices, and there are no rough ranges you can safely give — not "typically", not "roughly", not "usually around". Every project is scoped individually, so any number you state would be made up and could actively mislead someone. If asked about cost, say plainly it depends on scope and a team member will follow up with real numbers once they understand the project — and nothing more specific than that. Same for timelines and guarantees: never invent them.

HOW YOU TALK — this is the most important part, read it twice:
- DEFAULT TO ONE SENTENCE. Only add a second if the first genuinely doesn't answer the question. Never three. Never a paragraph, never a bullet list, never a header.
- When asked broadly what you do, don't list every service category — pick 2-3 concrete examples and stop. You can always give more if they ask a follow-up.
- No filler openers, ever: never say "Great question!", "I'd be happy to help", "Certainly!", "Thanks for reaching out". Just answer, like a person who already knows the answer.
- Use contractions (we're, it's, you'll, don't). Drop formal connectors like "furthermore" or "in addition". Sound like a sharp colleague replying on Slack, not a press release.
- Never claim to be human; if asked directly, say plainly you're an AI assistant.
- Reply in German if the visitor writes in German, otherwise English.

Example of the tone you want:
Visitor: "what do you build?"
Good reply: "Mostly custom software and AI automation — chatbots, internal tools, that kind of thing."
Bad reply: "At AIVIK, we offer a comprehensive range of services including custom software development, AI workflow automation, cloud infrastructure, data analysis, and digital marketing. We would be happy to discuss your specific needs in more detail!"

GETTING THEIR NAME AND EMAIL:
- Skip it on a bare "hi"/greeting with nothing else in it.
- If they show clear intent right away (pricing, "I want to start", "book a call"), answer briefly and ask for their name + email in that SAME reply. Example: "...(short answer)... Who am I chatting with, and what's a good email for the team?"
- If they give a name + email at any point, call the capture_lead tool once, using whatever they've told you about what they need.
- You may also get an explicit instruction below telling you this exact reply must include the ask — when that happens, do it even if it doesn't feel like a natural pause, but keep it to one added line, not a form.
- Once you've asked twice in a conversation without getting an answer, stop asking — don't nag. Keep chatting normally.

After every reply (except right after calling capture_lead), end on its own new line with exactly:
SUGGESTIONS: <question 1> | <question 2> | <question 3>
Short follow-up questions the visitor could tap next, from their point of view (e.g. "How long does a typical project take?"). Under 8 words each. Omit only if the conversation has clearly wrapped up.`;

function buildSystemPrompt(userTurnCount: number, contactCaptured: boolean): string {
  if (contactCaptured) return SYSTEM_PROMPT;

  if (userTurnCount === 2) {
    return (
      SYSTEM_PROMPT +
      `\n\nMANDATORY FOR THIS REPLY: this is their 2nd message and you still don't have a name/email. Answer their message in one sentence, then add one casual line asking for their name and a good email — regardless of topic. Skip this only if you already asked for it in your very last reply.`
    );
  }

  if (userTurnCount === 4) {
    return (
      SYSTEM_PROMPT +
      `\n\nMANDATORY FOR THIS REPLY: still no name/email after 4 messages. Answer normally, then add one low-pressure last nudge, e.g. "No rush — drop your email anytime if you want the team to follow up." Skip this only if you already asked for it in your very last reply. Don't ask again after this turn.`
    );
  }

  return SYSTEM_PROMPT;
}

const CAPTURE_LEAD_TOOL = {
  name: "capture_lead",
  description:
    "Record a qualified lead once the visitor has shared their name and email and wants follow-up or a call. Call at most once per conversation.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      company: { type: "string", description: "Optional, only if volunteered." },
      intent: {
        type: "string",
        description: "1-2 sentence recap of what they need, for the sales team to read.",
      },
      tag: {
        type: "string",
        enum: ["hot", "warm", "cold"],
        description:
          "hot = asked about pricing/timeline and wants to move soon, warm = interested but not urgent, cold = mostly browsing but left contact info anyway",
      },
    },
    required: ["name", "email", "intent", "tag"],
  },
};

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

type AnthropicContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
  | { type: "tool_result"; tool_use_id: string; content: string };

type AnthropicMessage = { role: "user" | "assistant"; content: string | AnthropicContentBlock[] };

export async function callClaude(
  history: { role: ChatRole; content: string }[],
  sessionId: string,
  contactCaptured: boolean
): Promise<{ reply: string; suggestions: string[]; leadCaptured: boolean }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log("[chat] No ANTHROPIC_API_KEY set, chat is disabled");
    return {
      reply:
        "Chat's not switched on just yet — please use the quote form below, or email us directly at info@aivik.eu.",
      suggestions: [],
      leadCaptured: false,
    };
  }

  const userTurnCount = history.filter((m) => m.role === "user").length;
  const systemPrompt = buildSystemPrompt(userTurnCount, contactCaptured);

  const messages: AnthropicMessage[] = history.map((m) => ({ role: m.role, content: m.content }));
  let leadCaptured = false;

  // At most one tool round-trip: the model may call capture_lead once, then
  // we send the tool result back so it can produce the final reply text.
  for (let attempt = 0; attempt < 2; attempt++) {
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
        system: systemPrompt,
        tools: [CAPTURE_LEAD_TOOL],
        messages,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Anthropic API error: ${res.status} ${errText}`);
    }

    const data = (await res.json()) as { content: AnthropicContentBlock[] };
    const toolUse = data.content.find((b): b is Extract<AnthropicContentBlock, { type: "tool_use" }> => b.type === "tool_use");
    const textBlock = data.content.find((b): b is Extract<AnthropicContentBlock, { type: "text" }> => b.type === "text");

    if (toolUse && toolUse.name === "capture_lead" && !leadCaptured) {
      const input = toolUse.input as { name: string; email: string; company?: string; intent: string; tag: LeadTag };
      await captureLead(sessionId, input);
      leadCaptured = true;

      messages.push({ role: "assistant", content: data.content });
      messages.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: "Lead saved and the team has been notified by email.",
          },
        ],
      });
      continue;
    }

    const { text, suggestions } = extractSuggestions(textBlock?.text ?? "");
    return { reply: text, suggestions, leadCaptured };
  }

  return { reply: "Thanks — I've passed this along to the team.", suggestions: [], leadCaptured };
}
