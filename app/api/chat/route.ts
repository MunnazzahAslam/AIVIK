import { NextRequest, NextResponse } from "next/server";
import { callClaude, ensureConversation, getContactCaptured, getHistory, saveMessage } from "@/lib/chat";

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
    await saveMessage(sessionId, "user", message.trim());

    const [history, contactCaptured] = await Promise.all([
      getHistory(sessionId),
      getContactCaptured(sessionId),
    ]);
    const { reply, suggestions, leadCaptured } = await callClaude(history, sessionId, contactCaptured);

    await saveMessage(sessionId, "assistant", reply);

    return NextResponse.json({ reply, suggestions, leadCaptured });
  } catch (err) {
    console.error("[chat] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
