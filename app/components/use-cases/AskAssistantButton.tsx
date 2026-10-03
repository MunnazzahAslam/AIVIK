"use client";

/** Opens the chat widget and asks its question for the visitor (ChatWidget listens for this event). */
export default function AskAssistantButton({ label, message }: { label: string; message: string }) {
  return (
    <button
      type="button"
      className="uc-btn uc-btn-ghost"
      onClick={() => window.dispatchEvent(new CustomEvent("aivik:open-chat", { detail: { message } }))}
    >
      {label}
    </button>
  );
}
