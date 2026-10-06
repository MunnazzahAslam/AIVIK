"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const GTM_ID = "GTM-MSBD5SV6";
const GTM_SCRIPT_ID = "gtm-loader";
const CONSENT_KEY = "aivik_consent";
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

// Google Tag Manager is only ever loaded from here, after the visitor has
// accepted. This is Google's standard loader plus Consent Mode signals, so
// tags in the container that check consent see it as granted.
function loadGtm() {
  if (document.getElementById(GTM_SCRIPT_ID)) return;
  const w = window as unknown as { dataLayer: unknown[] };
  w.dataLayer = w.dataLayer || [];
  // gtag has to push the arguments object itself, not an array.
  const gtag: (...args: unknown[]) => void = function () {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  gtag("consent", "default", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
  w.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const script = document.createElement("script");
  script.id = GTM_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
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
    const choice = readChoice();
    if (choice === "granted") loadGtm();
    if (choice === null) setVisible(true);

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
    if (choice === "granted") {
      loadGtm();
    } else if (document.getElementById(GTM_SCRIPT_ID)) {
      // Consent withdrawn after tags were running: a reload is the only way
      // to stop scripts that are already on the page.
      clearTrackingCookies();
      location.reload();
    }
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
