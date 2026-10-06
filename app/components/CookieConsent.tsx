"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CONSENT_KEY } from "@/lib/gtm";

const OPEN_EVENT = "aivik:open-consent";
// Cookies set by Google tags, removed when consent is withdrawn.
const TRACKING_COOKIE = /^(_ga|_gid|_gat|_gcl|_gac)/;

type Choice = "granted" | "denied";

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

// GTM itself loads on every page from the inline script in the layout <head>,
// with Consent Mode defaults set to "denied". The banner only updates that
// consent state, so tags in the container start or stop using cookies.
function updateConsent(choice: Choice) {
  const w = window as unknown as { dataLayer: unknown[] };
  w.dataLayer = w.dataLayer || [];
  // gtag has to push the arguments object itself, not an array.
  const gtag: (...args: unknown[]) => void = function () {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  gtag("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
  gtag("set", "ads_data_redaction", choice === "denied");
  w.dataLayer.push({ event: choice === "granted" ? "consent_granted" : "consent_denied" });
}

function clearTrackingCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!TRACKING_COOKIE.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

export function CookieSettingsButton({ className }: { className?: string }) {
  const t = useTranslations("Consent");
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={className}
    >
      {t("settings")}
    </button>
  );
}

export default function CookieConsent() {
  const t = useTranslations("Consent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // A stored "granted" was already applied by the <head> script.
    if (readChoice() === null) setVisible(true);

    const open = () => setVisible(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const decide = (choice: Choice) => {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // Storage unavailable: the choice holds for this page view only.
    }
    setVisible(false);
    updateConsent(choice);
    // Consent withdrawn: remove cookies Google tags may already have set.
    if (choice === "denied") clearTrackingCookies();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed z-[70] bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[400px] font-body p-5 rounded-2xl"
      style={{
        backgroundColor: "var(--section-light)",
        border: "1px solid var(--section-light-border)",
        color: "var(--section-light-text)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-body"
    >
      <p id="cookie-consent-title" className="font-heading text-base font-bold mb-2">
        {t("title")}
      </p>
      <p id="cookie-consent-body" className="text-sm leading-relaxed mb-4">
        {t("body")}{" "}
        <Link href="/privacy" className="underline" style={{ textUnderlineOffset: 3 }}>
          {t("privacyLink")}
        </Link>
      </p>
      {/* Both choices carry the same weight on purpose. */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => decide("denied")}
          className="uc-btn uc-btn-dark flex-1"
          style={{ padding: "10px 16px" }}
        >
          {t("decline")}
        </button>
        <button
          type="button"
          onClick={() => decide("granted")}
          className="uc-btn uc-btn-dark flex-1"
          style={{ padding: "10px 16px" }}
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
