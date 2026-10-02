"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Message = {
  role: "user" | "assistant";
  content: string;
  leadCaptured?: boolean;
};

const ACCENT = "var(--accent-code)"; // #2563EB — same blue as the nav logo's underscore
const SESSION_KEY = "aivik_chat_session_id";
const HISTORY_KEY = "aivik_chat_history";
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef(panelHeight);
  const dragStartRef = useRef<{ y: number; height: number } | null>(null);

  useEffect(() => {
    setSessionId(getSessionId());
    try {
      const savedHistory = sessionStorage.getItem(HISTORY_KEY);
      if (savedHistory) setMessages(JSON.parse(savedHistory) as Message[]);
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
    } catch {
      // storage unavailable (e.g. private browsing) — non-critical
    }
  }, [messages, sessionId]);

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
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

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

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading || !sessionId) return;

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
      if (!res.ok) throw new Error("chat api error");
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, leadCaptured: data.leadCaptured },
      ]);
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
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
                {m.content}
                {m.leadCaptured && (
                  <p className="font-body text-xs mt-2 opacity-70">{t("leadConfirmed")}</p>
                )}
              </div>
            ))}

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
          {(messages.length === 0 ? starters : suggestions).length > 0 && !loading && (
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
              placeholder={t("placeholder")}
              aria-label={t("placeholder")}
              disabled={loading}
              className="flex-1 font-body text-sm px-3.5 py-2 rounded-xl transition-colors duration-150"
              style={{
                backgroundColor: "var(--section-light-surface)",
                border: "1px solid var(--section-light-border)",
                color: "var(--section-light-text)",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
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
