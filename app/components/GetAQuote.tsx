"use client";
import { useState } from "react";
import FadeIn from "./FadeIn";

// reCAPTCHA v3 placeholder:
// 1. npm install react-google-recaptcha-v3
// 2. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to .env
// 3. Wrap app in <GoogleReCaptchaProvider> and use useGoogleReCaptcha hook here

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  services: string[];
  otherService: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  services: [],
  otherService: "",
  message: "",
};

// Value doubles as the label — the API just joins selected values into one
// human-readable string, so there's no separate code-to-label map to keep in sync.
const SERVICE_OPTIONS = [
  "Custom Software Development",
  "AI and Automation",
  "Cloud Infrastructure",
  "Data Analysis",
  "Other",
  "Not sure yet",
];

// "Other" and "Not sure yet" are catch-alls — picking one doesn't make sense
// alongside a specific service, so each clears every other selection.
const EXCLUSIVE_OPTIONS = ["Other", "Not sure yet"];

// Color classes (.aivik-input) are defined in globals.css
const inputClass = "w-full font-body text-sm px-4 py-3 aivik-input";

const labelClass = "block font-body text-xs mb-1.5";
const labelColor = "#F5F5F7";
const mutedColor = "#A1A1A6";

const errorTextClass = "font-body text-xs text-red-400 mt-1.5";

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validateForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "A valid email is required.";
  if (!form.company.trim()) errors.company = "Company name is required.";
  if (form.services.length === 0) errors.services = "Please select at least one option.";
  if (form.phone && !/^[\d\s\+\-\(\)]{7,20}$/.test(form.phone))
    errors.phone = "Phone number format is invalid.";
  return errors;
}

function RequiredMark() {
  return (
    <span aria-hidden="true" style={{ color: mutedColor }}>
      {" "}
      *
    </span>
  );
}

export default function GetAQuote() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitHovered, setSubmitHovered] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Re-validate live once a field has been touched, so errors clear as the user fixes them.
    if (touched[name as keyof FormState]) {
      setErrors(validateForm({ ...form, [name]: value }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validateForm(form));
  };

  const toggleService = (value: string) => {
    setForm((prev) => {
      const isSelected = prev.services.includes(value);
      let nextServices: string[];
      if (isSelected) {
        nextServices = prev.services.filter((v) => v !== value);
      } else if (EXCLUSIVE_OPTIONS.includes(value)) {
        // Selecting "Other" or "Not sure yet" clears every other selection.
        nextServices = [value];
      } else {
        // Selecting a real service clears any exclusive catch-all option.
        nextServices = [
          ...prev.services.filter((v) => !EXCLUSIVE_OPTIONS.includes(v)),
          value,
        ];
      }
      if (touched.services) {
        setErrors(validateForm({ ...prev, services: nextServices }));
      }
      return { ...prev, services: nextServices };
    });
    setTouched((prev) => ({ ...prev, services: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    setTouched({
      name: true,
      email: true,
      company: true,
      phone: true,
      services: true,
      message: true,
    });
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setStatus("submitting");

    try {
      // reCAPTCHA v3 token would be obtained here:
      // const token = await executeRecaptcha("contact_form");
      const recaptchaToken = undefined; // replace with token once CAPTCHA key is configured

      // Fold the free-text "Other" detail into the services list the API expects,
      // rather than sending it as a separate field.
      const services = form.services.map((s) =>
        s === "Other" && form.otherService.trim() ? `Other: ${form.otherService.trim()}` : s
      );

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, services, recaptchaToken }),
      });

      if (!res.ok) throw new Error("API error");

      setStatus("success");

      // Redirect to Calendly after 2 seconds
      setTimeout(() => {
        const calendlyUrl =
          process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com";
        window.location.href = calendlyUrl;
      }, 2000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      data-theme="dark"
      className="py-20 px-6"
      style={{ backgroundColor: "var(--section-dark)", position: "relative", overflow: "hidden", zIndex: 0 }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "50%",
          height: "70%",
          background: "radial-gradient(circle, rgba(37,99,235,0.16), transparent 65%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "50%",
          height: "70%",
          background: "radial-gradient(circle, rgba(37,99,235,0.16), transparent 65%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <div className="max-w-6xl mx-auto" style={{ position: "relative" }}>
        <div className="grid grid-cols-1 md:grid-cols-[45fr_55fr] gap-16 md:gap-24 items-start">
          {/* Left column */}
          <FadeIn className="flex flex-col justify-center">
            <h2
              className="font-heading font-black mb-6"
              style={{
                color: "var(--section-dark-text)",
                fontSize: "clamp(48px, 6vw, 72px)",
                letterSpacing: "-2px",
                lineHeight: "1",
              }}
            >
              Let&apos;s Connect.
            </h2>
            <p
              className="font-body text-base leading-relaxed max-w-[480px]"
              style={{ color: "#A1A1A6" }}
            >
              Whether you have a defined project or an early idea, we are here
              to listen. Tell us where you are and we will tell you honestly how
              we can help.
            </p>

            <div
              className="h-px my-8"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            />

            <div className="flex flex-col gap-4">
              {[
                "Structured discovery before any commitment",
                "Transparent delivery with regular milestones",
                "Long-term partnership beyond project delivery",
              ].map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="font-mono"
                    style={{ fontSize: 13, color: "#F5F5F7", display: "inline-block", transform: "scaleX(-1)" }}
                  >
                    ↵
                  </span>
                  <p
                    className="font-body text-sm"
                    style={{ color: "#A1A1A6" }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="h-px my-8"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            />

            <div>
              <p className="font-mono text-[11px] tracking-[2px] uppercase mb-2" style={{ color: labelColor }}>
                Prefer email?
              </p>
              <a
                href="mailto:info@aivik.eu"
                className="font-body text-sm"
                style={{ color: mutedColor }}
              >
                info@aivik.eu
              </a>
            </div>
          </FadeIn>

          {/* Right column — form */}
          <FadeIn delay={150}>
            <div aria-live="polite">
            {status === "success" ? (
              <div
                className="p-10 md:p-12 flex flex-col items-center justify-center text-center gap-6 min-h-[400px]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 28,
                }}
              >
                <div
                  style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: "rgba(37,99,235,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8CB4FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3
                  className="font-heading text-2xl font-bold"
                  style={{ color: "#F5F5F7" }}
                >
                  Thank you.
                </h3>
                <p
                  className="font-body text-sm max-w-[320px]"
                  style={{ color: "#A1A1A6" }}
                >
                  Redirecting you to book a call...
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-4 p-8 md:p-10"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 28,
                }}
                aria-label="Project inquiry form"
              >
                {/* Name */}
                <div>
                  <label htmlFor="name" className={labelClass} style={{ color: labelColor }}>
                    Your name
                    <RequiredMark />
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your name"
                    className={inputClass}
                    autoComplete="name"
                    aria-invalid={!!(touched.name && errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {touched.name && errors.name && (
                    <p id="name-error" className={errorTextClass}>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClass} style={{ color: labelColor }}>
                    Your email
                    <RequiredMark />
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@company.com"
                    className={inputClass}
                    autoComplete="email"
                    aria-invalid={!!(touched.email && errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {touched.email && errors.email && (
                    <p id="email-error" className={errorTextClass}>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className={labelClass} style={{ color: labelColor }}>
                    Company name
                    <RequiredMark />
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    value={form.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your company"
                    className={inputClass}
                    autoComplete="organization"
                    aria-invalid={!!(touched.company && errors.company)}
                    aria-describedby={errors.company ? "company-error" : undefined}
                  />
                  {touched.company && errors.company && (
                    <p id="company-error" className={errorTextClass}>
                      {errors.company}
                    </p>
                  )}
                </div>

                {/* Phone (optional) */}
                <div>
                  <label htmlFor="phone" className={labelClass} style={{ color: labelColor }}>
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+49 123 456 7890"
                    className={inputClass}
                    autoComplete="tel"
                    aria-invalid={!!(touched.phone && errors.phone)}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {touched.phone && errors.phone && (
                    <p id="phone-error" className={errorTextClass}>
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Services */}
                <div>
                  <p id="services-label" className={labelClass} style={{ color: labelColor }}>
                    What can we help you with?
                    <RequiredMark />
                  </p>
                  <div
                    role="group"
                    aria-labelledby="services-label"
                    aria-invalid={!!(touched.services && errors.services)}
                    aria-describedby={errors.services ? "services-error" : undefined}
                    className="flex flex-wrap gap-2"
                  >
                    {SERVICE_OPTIONS.map((option) => {
                      const checked = form.services.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={checked}
                          onClick={() => toggleService(option)}
                          className={`font-body text-sm transition-colors duration-150 aivik-pill${checked ? " is-checked" : ""}`}
                          style={{
                            padding: "8px 14px",
                            borderRadius: 999,
                            color: checked ? labelColor : mutedColor,
                            cursor: "pointer",
                          }}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {form.services.includes("Other") && (
                    <input
                      type="text"
                      name="otherService"
                      value={form.otherService}
                      onChange={handleChange}
                      placeholder="Please specify"
                      aria-label="Please specify the other service"
                      className={`${inputClass} mt-3`}
                    />
                  )}
                  {touched.services && errors.services && (
                    <p id="services-error" className={errorTextClass}>
                      {errors.services}
                    </p>
                  )}
                </div>

                {/* Message (optional) */}
                <div>
                  <label htmlFor="message" className={labelClass} style={{ color: labelColor }}>
                    Give us a brief description of what you need
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="What are you building and what do you need help with?"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* API error */}
                {status === "error" && (
                  <p className="font-body text-xs text-red-400" role="alert">
                    Something went wrong. Please email us at{" "}
                    <a
                      href="mailto:info@aivik.eu"
                      className="underline hover:text-white"
                    >
                      info@aivik.eu
                    </a>
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full font-body text-sm font-semibold py-4 transition-colors duration-200 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: submitHovered ? "var(--section-light-surface)" : "var(--section-light)",
                    color: "var(--section-light-text)",
                    borderRadius: 12,
                  }}
                  onMouseEnter={() => setSubmitHovered(true)}
                  onMouseLeave={() => setSubmitHovered(false)}
                >
                  {status === "submitting" ? "Sending..." : "Book a discovery call"}
                </button>
              </form>
            )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
