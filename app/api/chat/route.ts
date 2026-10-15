import { NextRequest, NextResponse } from "next/server";
import { FREE_QUESTIONS, callClaude, ensureConversation, getConversationState, getHistory, saveMessage } from "@/lib/chat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, message } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    await ensureConversation(sessionId);
    const { contactCaptured, contactName, userMessages } = await getConversationState(sessionId);

    // The widget pauses the chat behind its contact form after the first
    // answer; this is the same rule for requests that skip the widget.
    if (!contactCaptured && userMessages >= FREE_QUESTIONS) {
      return NextResponse.json({ error: "Contact details required", needsContact: true }, { status: 403 });
    }

    await saveMessage(sessionId, "user", message.trim());

    const history = await getHistory(sessionId);
    const { reply, suggestions } = await callClaude(history, contactName);

    await saveMessage(sessionId, "assistant", reply);

    return NextResponse.json({ reply, suggestions, needsContact: !contactCaptured });
  } catch (err) {
    console.error("[chat] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
