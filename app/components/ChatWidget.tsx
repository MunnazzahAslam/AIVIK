"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ContactField = "name" | "email" | "phone";
const CONTACT_FIELDS: { field: ContactField; type: string; autoComplete: string }[] = [
  { field: "name", type: "text", autoComplete: "name" },
  { field: "email", type: "email", autoComplete: "email" },
  { field: "phone", type: "tel", autoComplete: "tel" },
];
// Same rules as the server (lib/chat.ts), which checks again on submit.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[\d\s+\-()]{7,20}$/;

function invalidFields(contact: Record<ContactField, string>): ContactField[] {
  const invalid: ContactField[] = [];
  if (contact.name.trim().length < 2) invalid.push("name");
  if (!EMAIL_PATTERN.test(contact.email.trim())) invalid.push("email");
  const phone = contact.phone.trim();
  if (!PHONE_PATTERN.test(phone) || phone.replace(/\D/g, "").length < 7) invalid.push("phone");
  return invalid;
}

const ACCENT = "var(--accent-code)"; // #2563EB — same blue as the nav logo's underscore
const SESSION_KEY = "aivik_chat_session_id";
const HISTORY_KEY = "aivik_chat_history";
const NEEDS_CONTACT_KEY = "aivik_chat_needs_contact";
const PANEL_HEIGHT_KEY = "aivik_chat_panel_height";
const NUDGE_DELAY_MS = 20000;
const MIN_PANEL_HEIGHT = 380;
const DEFAULT_PANEL_HEIGHT = 560;
const VIEWPORT_MARGIN = 140; // space reserved above/below so the panel never runs off-screen

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// Replies are plain text. Links to our own site (the use-case pages Mara
// points to) become real links; nothing else is turned into markup.
const OWN_LINK = /(https:\/\/(?:www\.)?aivik\.eu\/[^\s<>"')\]]*)/g;

function linkify(text: string): React.ReactNode[] {
  return text.split(OWN_LINK).map((part, i) => {
    if (i % 2 === 0) return part;
    // Sentence punctuation right after a link belongs to the sentence.
    const url = part.replace(/[.,;:!?]+$/, "");
    return (
      <span key={i}>
        <a href={url} className="underline" style={{ color: ACCENT, textUnderlineOffset: 3, wordBreak: "break-word" }}>
          {url.replace(/^https:\/\/(?:www\.)?/, "")}
        </a>
        {part.slice(url.length)}
      </span>
    );
  });
}

function clampHeight(h: number): number {
  if (typeof window === "undefined") return h;
  const max = Math.max(window.innerHeight - VIEWPORT_MARGIN, MIN_PANEL_HEIGHT);
  return Math.min(Math.max(h, MIN_PANEL_HEIGHT), max);
}

export default function ChatWidget() {
  const t = useTranslations("Chat");
  const starters = t.raw("starters") as string[];

  const [sessionId, setSessionId] = useState("");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [panelHeight, setPanelHeight] = useState(DEFAULT_PANEL_HEIGHT);
  const [resizing, setResizing] = useState(false);
  // After the first answer the chat pauses until the visitor leaves their details.
  const [needsContact, setNeedsContact] = useState(false);
  const [contact, setContact] = useState<Record<ContactField, string>>({ name: "", email: "", phone: "" });
  const [contactErrors, setContactErrors] = useState<ContactField[]>([]);
  const [contactSending, setContactSending] = useState(false);
  const [contactFailed, setContactFailed] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const queuedRef = useRef(""); // a question asked while the form was open
  const heightRef = useRef(panelHeight);
  const dragStartRef = useRef<{ y: number; height: number } | null>(null);

  useEffect(() => {
    setSessionId(getSessionId());
    try {
      const savedHistory = sessionStorage.getItem(HISTORY_KEY);
      if (savedHistory) setMessages(JSON.parse(savedHistory) as Message[]);
      setNeedsContact(sessionStorage.getItem(NEEDS_CONTACT_KEY) === "1");
    } catch {
      // ignore corrupt/missing history
    }
    try {
      const savedHeight = localStorage.getItem(PANEL_HEIGHT_KEY);
      setPanelHeight(clampHeight(savedHeight ? parseInt(savedHeight, 10) : Math.round(window.innerHeight * 0.7)));
    } catch {
      // storage unavailable — keep the default height
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
      sessionStorage.setItem(NEEDS_CONTACT_KEY, needsContact ? "1" : "0");
    } catch {
      // storage unavailable (e.g. private browsing) — non-critical
    }
  }, [messages, needsContact, sessionId]);

  useEffect(() => {
    heightRef.current = panelHeight;
  }, [panelHeight]);

  useEffect(() => {
    if (open || nudgeDismissed || messages.length > 0) return;
    const timer = setTimeout(() => setShowNudge(true), NUDGE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [open, nudgeDismissed, messages.length]);

  useEffect(() => {
    if (open) {
      (needsContact ? nameRef : inputRef).current?.focus();
    }
  }, [open, needsContact]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, needsContact]);

  const saveHeight = (h: number) => {
    try {
      localStorage.setItem(PANEL_HEIGHT_KEY, String(h));
    } catch {
      // non-critical
    }
  };

  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: PointerEvent) => {
      if (!dragStartRef.current) return;
      const delta = dragStartRef.current.y - e.clientY; // dragging up grows the panel
      setPanelHeight(clampHeight(dragStartRef.current.height + delta));
    };
    const onUp = () => {
      setResizing(false);
      dragStartRef.current = null;
      document.body.style.userSelect = "";
      saveHeight(heightRef.current);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [resizing]);

  const startResize = (clientY: number) => {
    dragStartRef.current = { y: clientY, height: panelHeight };
    document.body.style.userSelect = "none";
    setResizing(true);
  };

  const handleResizeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const next = clampHeight(panelHeight + (e.key === "ArrowUp" ? 20 : -20));
    setPanelHeight(next);
    saveHeight(next);
  };

  const openWidget = () => {
    setOpen(true);
    setShowNudge(false);
  };

  const send = async (text: string, afterContact = false) => {
    const trimmed = text.trim();
    if (!trimmed || loading || !sessionId) return;
    if (needsContact && !afterContact) {
      queuedRef.current = trimmed;
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setSuggestions([]);
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 403 && data.needsContact) {
        // The server is still waiting for the form (e.g. storage was cleared):
        // take the question back out and ask it once the form is in.
        setMessages((prev) => prev.slice(0, -1));
        queuedRef.current = trimmed;
        setNeedsContact(true);
        return;
      }
      if (!res.ok) throw new Error("chat api error");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      if (data.needsContact) setNeedsContact(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // "Ask the AI assistant" buttons elsewhere on the site open the widget and
  // ask their question (see AskAssistantButton). The ref keeps the listener
  // on the latest send, which closes over the session and loading state.
  const sendRef = useRef(send);
  sendRef.current = send;
  useEffect(() => {
    const onAsk = (e: Event) => {
      openWidget();
      const message = (e as CustomEvent<{ message?: string }>).detail?.message;
      if (message) sendRef.current(message);
    };
    window.addEventListener("aivik:open-chat", onAsk);
    return () => window.removeEventListener("aivik:open-chat", onAsk);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactSending) return;
    const invalid = invalidFields(contact);
    setContactErrors(invalid);
    setContactFailed(false);
    if (invalid.length > 0) return;

    setContactSending(true);
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, ...contact }),
      });
      if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        if (data.field) {
          setContactErrors([data.field as ContactField]);
          return;
        }
      }
      if (!res.ok) throw new Error("chat lead api error");

      setNeedsContact(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("leadConfirmed", { name: contact.name.trim().split(/\s+/)[0] }) },
      ]);
      const queued = queuedRef.current;
      queuedRef.current = "";
      if (queued) send(queued, true);
    } catch {
      setContactFailed(true);
    } finally {
      setContactSending(false);
    }
  };

  return (
    <>
      {/* Nudge bubble */}
      {showNudge && !open && (
        <div
          className="fixed bottom-[96px] right-6 z-[60] max-w-[260px] font-body text-sm p-4 rounded-2xl shadow-lg"
          style={{
            backgroundColor: "var(--section-light)",
            border: "1px solid var(--section-light-border)",
            color: "var(--section-light-text)",
          }}
          role="status"
        >
          <button
            type="button"
            aria-label={t("close")}
            onClick={() => {
              setShowNudge(false);
              setNudgeDismissed(true);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--section-light-border)", color: "var(--section-light-text)" }}
          >
            ×
          </button>
          <button type="button" onClick={openWidget} className="text-left w-full cursor-pointer">
            {t("nudge")}
          </button>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openWidget())}
        aria-label={open ? t("close") : t("open")}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
        style={{ backgroundColor: ACCENT }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed z-[60] flex flex-col overflow-hidden"
          style={{
            bottom: "96px",
            right: "24px",
            width: "min(92vw, 380px)",
            height: `${panelHeight}px`,
            backgroundColor: "var(--section-light)",
            border: "1px solid var(--section-light-border)",
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          }}
          role="dialog"
          aria-label={t("title")}
        >
          {/* Resize handle */}
          <div
            onPointerDown={(e) => {
              e.preventDefault();
              startResize(e.clientY);
            }}
            onKeyDown={handleResizeKeyDown}
            role="separator"
            aria-orientation="horizontal"
            aria-label={t("resize")}
            aria-valuenow={Math.round(panelHeight)}
            aria-valuemin={MIN_PANEL_HEIGHT}
            aria-valuemax={typeof window !== "undefined" ? window.innerHeight - VIEWPORT_MARGIN : DEFAULT_PANEL_HEIGHT}
            tabIndex={0}
            className="flex items-center justify-center shrink-0 h-3.5 cursor-ns-resize touch-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-code)] focus-visible:ring-inset"
          >
            <span
              className="w-9 h-1 rounded-full"
              style={{ backgroundColor: "var(--section-light-border)" }}
              aria-hidden="true"
            />
          </div>

          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 pb-4"
            style={{ borderBottom: "1px solid var(--section-light-border)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-sm shrink-0"
              style={{ backgroundColor: ACCENT, color: "#fff" }}
              aria-hidden="true"
            >
              M
            </div>
            <div className="min-w-0">
              <p className="font-heading text-sm font-bold truncate" style={{ color: "var(--section-light-text)" }}>
                {t("title")}
              </p>
              <p className="font-body text-xs truncate" style={{ color: "var(--section-light-muted)" }}>
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3"
            aria-live="polite"
          >
            <div
              className="font-body text-sm max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tl-sm"
              style={{ backgroundColor: "var(--section-light-surface)", color: "var(--section-light-text)" }}
            >
              {t("greeting")}
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`font-body text-sm max-w-[85%] px-4 py-2.5 leading-relaxed ${
                  m.role === "user" ? "self-end rounded-2xl rounded-tr-sm" : "rounded-2xl rounded-tl-sm"
                }`}
                style={
                  m.role === "user"
                    ? { backgroundColor: ACCENT, color: "#fff" }
                    : { backgroundColor: "var(--section-light-surface)", color: "var(--section-light-text)" }
                }
              >
                {m.role === "assistant" ? linkify(m.content) : m.content}
              </div>
            ))}

            {needsContact && !loading && (
              <form
                onSubmit={handleContactSubmit}
                noValidate
                className="font-body text-sm w-full px-4 py-3.5 rounded-2xl rounded-tl-sm flex flex-col gap-2.5"
                style={{ backgroundColor: "var(--section-light-surface)", color: "var(--section-light-text)" }}
              >
                <p className="leading-relaxed">{t("contact.intro")}</p>
                {CONTACT_FIELDS.map(({ field, type, autoComplete }) => {
                  const invalid = contactErrors.includes(field);
                  return (
                    <label key={field} className="flex flex-col gap-1">
                      <span className="text-xs" style={{ color: "var(--section-light-muted)" }}>
                        {t(`contact.${field}`)}
                      </span>
                      <input
                        ref={field === "name" ? nameRef : undefined}
                        type={type}
                        name={field}
                        autoComplete={autoComplete}
                        value={contact[field]}
                        onChange={(e) => {
                          setContact((prev) => ({ ...prev, [field]: e.target.value }));
                          setContactErrors((prev) => prev.filter((f) => f !== field));
                        }}
                        disabled={contactSending}
                        aria-invalid={invalid}
                        aria-describedby={invalid ? `aivik-chat-${field}-error` : undefined}
                        className="font-body text-sm px-3 py-2 rounded-lg"
                        style={{
                          backgroundColor: "var(--section-light)",
                          border: `1px solid ${invalid ? "#DC2626" : "var(--section-light-border)"}`,
                          color: "var(--section-light-text)",
                        }}
                      />
                      {invalid && (
                        <span id={`aivik-chat-${field}-error`} className="text-xs" style={{ color: "#DC2626" }} role="alert">
                          {t(`contact.errors.${field}`)}
                        </span>
                      )}
                    </label>
                  );
                })}
                {contactFailed && (
                  <p className="text-xs" style={{ color: "#DC2626" }} role="alert">
                    {t("contact.failed")}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={contactSending}
                  className="font-body text-sm font-medium mt-1 px-4 py-2 rounded-lg disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                  style={{ backgroundColor: ACCENT, color: "#fff" }}
                >
                  {contactSending ? t("contact.sending") : t("contact.submit")}
                </button>
                <p className="text-xs leading-snug" style={{ color: "var(--section-light-muted)" }}>
                  {t.rich("contact.privacy", {
                    link: (chunks) => (
                      <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </form>
            )}

            {loading && (
              <div
                className="self-start flex items-center gap-1 px-4 py-3 rounded-2xl rounded-tl-sm"
                style={{ backgroundColor: "var(--section-light-surface)" }}
                aria-label={t("typing")}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: "var(--section-light-muted)",
                      animation: `aivik-chat-bounce 1.2s ${i * 0.15}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            )}

            {error && (
              <p className="font-body text-xs" style={{ color: "#DC2626" }} role="alert">
                {t("error")}{" "}
                <a href="mailto:info@aivik.eu" className="underline">
                  info@aivik.eu
                </a>
              </p>
            )}
          </div>

          {/* Suggestion chips */}
          {(messages.length === 0 ? starters : suggestions).length > 0 && !loading && !needsContact && (
            <div className="flex flex-wrap gap-2 px-5 pb-3">
              {(messages.length === 0 ? starters : suggestions).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="font-body text-xs px-3 py-1.5 rounded-full transition-colors duration-150 cursor-pointer"
                  style={{
                    border: "1px solid var(--section-light-border)",
                    color: "var(--section-light-text)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderTop: "1px solid var(--section-light-border)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={needsContact ? t("contact.paused") : t("placeholder")}
              aria-label={needsContact ? t("contact.paused") : t("placeholder")}
              disabled={loading || needsContact}
              className="flex-1 font-body text-sm px-3.5 py-2 rounded-xl transition-colors duration-150"
              style={{
                backgroundColor: "var(--section-light-surface)",
                border: "1px solid var(--section-light-border)",
                color: "var(--section-light-text)",
              }}
            />
            <button
              type="submit"
              disabled={loading || needsContact || !input.trim()}
              aria-label={t("send")}
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              style={{ backgroundColor: ACCENT }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>

          <p className="font-body text-center pb-2" style={{ fontSize: 10, color: "var(--section-light-muted)" }}>
            {t("disclosure")}
          </p>
        </div>
      )}

      <style jsx global>{`
        @keyframes aivik-chat-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes aivik-chat-bounce {
            0%, 100% { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </>
  );
}
