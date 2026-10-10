import { NextRequest, NextResponse } from "next/server";
import { captureLead, validateChatContact } from "@/lib/chat";

// The contact form the chat widget shows after the first answer.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = body?.sessionId;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const result = validateChatContact(body);
    if (!result.ok) {
      return NextResponse.json({ error: "Invalid contact details", field: result.field }, { status: 400 });
    }

    const saved = await captureLead(sessionId, result.data);
    if (!saved) {
      return NextResponse.json({ error: "Unknown conversation" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[chat] lead error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
