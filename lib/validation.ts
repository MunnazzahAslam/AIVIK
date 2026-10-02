// Server-side validation for inbound contact submissions. Mirrors (and is
// stricter than) the client-side checks in GetAQuote.tsx — the client
// exists for UX, this exists because a request can always bypass the
// client entirely (curl, a disabled-JS browser, a modified fetch call).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\+\-\(\)]{7,20}$/;

export const LIMITS = {
  name: 100,
  email: 254, // RFC 5321 max mailbox length
  company: 150,
  phone: 20,
  service: 300, // joined multi-select string, e.g. services.join(", ")
  message: 3000,
} as const;

export type ContactInput = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
};

/**
 * Validates a raw, untyped request body into a clean ContactInput.
 * `requireCompany`/`requireService` let callers with lighter field sets
 * (e.g. a chatbot-captured lead with no service selection) reuse the same
 * checks for the fields they do collect.
 */
export function validateContactInput(
  body: unknown,
  opts: { requireCompany?: boolean; requireService?: boolean } = {}
): { ok: true; data: ContactInput } | { ok: false; error: string } {
  const { requireCompany = true, requireService = true } = opts;

  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body" };
  }
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const company = typeof b.company === "string" ? b.company.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  let service = "";
  if (Array.isArray(b.services)) {
    service = b.services
      .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
      .map((s) => s.trim())
      .join(", ");
  } else if (typeof b.service === "string") {
    service = b.service.trim();
  }

  if (!name) return { ok: false, error: "Name is required." };
  if (name.length > LIMITS.name) return { ok: false, error: `Name must be ${LIMITS.name} characters or fewer.` };

  if (!email) return { ok: false, error: "Email is required." };
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "A valid email address is required." };
  }

  if (requireCompany && !company) return { ok: false, error: "Company name is required." };
  if (company.length > LIMITS.company) return { ok: false, error: `Company must be ${LIMITS.company} characters or fewer.` };

  if (phone) {
    if (!PHONE_RE.test(phone)) return { ok: false, error: "Phone number format is invalid." };
  }

  if (requireService && !service) return { ok: false, error: "Please select at least one option." };
  if (service.length > LIMITS.service) return { ok: false, error: "Selection is too long." };

  if (message.length > LIMITS.message) {
    return { ok: false, error: `Message must be ${LIMITS.message} characters or fewer.` };
  }
  if (!requireService && !message) {
    // Chatbot leads have no service field to fall back on — a description is the one thing that must be present.
    return { ok: false, error: "A short description is required." };
  }

  return { ok: true, data: { name, email, company, phone, service, message } };
}
