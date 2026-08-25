"use client";
import { useEffect, useRef, useState } from "react";
import FadeIn from "./FadeIn";

// Staggered flow-in for each field, same easing/feel as the Hero's word reveal.
const fieldStyle = (visible: boolean, i: number): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(20px)",
  transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms`,
});

// reCAPTCHA v3 placeholder:
// 1. npm install react-google-recaptcha-v3
// 2. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to .env
// 3. Wrap app in <GoogleReCaptchaProvider> and use useGoogleReCaptcha hook here

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  service: "",
  message: "",
};

// Color classes (.aivik-input, .text-on-dark-muted) are defined in globals.css
const inputClass = "w-full font-body text-sm px-4 py-3 aivik-input";

const labelClass = "block font-body text-xs text-on-dark-muted mb-1.5";

const errorTextClass = "font-body text-xs text-red-400 mt-1.5";

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validateForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "A valid email is required.";
  if (!form.company.trim()) errors.company = "Company name is required.";
  if (!form.service) errors.service = "Please select a service.";
  if (form.phone && !/^[\d\s\+\-\(\)]{7,20}$/.test(form.phone))
    errors.phone = "Phone number format is invalid.";
  return errors;
}

function RequiredMark() {
  return (
    <span aria-hidden="true" style={{ color: "var(--accent-primary)" }}>
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
  const [formVisible, setFormVisible] = useState(false);
  const formWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = formWrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setFormVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    setTouched({
      name: true,
      email: true,
      company: true,
      phone: true,
      service: true,
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

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recaptchaToken }),
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
      className="py-[120px] px-6"
      style={{ backgroundColor: "var(--section-dark)" }}
    >
      <div className="max-w-6xl mx-auto">
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
              style={{ color: "var(--section-dark-muted)" }}
            >
              Whether you have a defined project or an early idea, we are here
              to listen. Tell us where you are and we will tell you honestly how
              we can help.
            </p>

            <div
              className="h-px my-8"
              style={{ backgroundColor: "var(--section-dark-border)" }}
            />

            <div className="flex flex-col gap-4">
              {[
                "Structured discovery before any commitment",
                "Transparent delivery with regular milestones",
                "Long-term partnership beyond project delivery",
              ].map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="font-body text-sm shrink-0" style={{ color: "var(--section-dark-text)" }}>&#10003;</span>
                  <p
                    className="font-body text-sm"
                    style={{ color: "var(--section-dark-muted)" }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="h-px my-8"
              style={{ backgroundColor: "var(--section-dark-border)" }}
            />

            <div>
              <p className="font-mono text-[11px] text-on-dark-muted tracking-[2px] uppercase mb-2">
                Prefer email?
              </p>
              <a
                href="mailto:info@aivik.eu"
                className="font-body text-sm link-on-dark"
              >
                info@aivik.eu
              </a>
            </div>
          </FadeIn>

          {/* Right column — form */}
          <div ref={formWrapRef}>
            <div aria-live="polite">
            {status === "success" ? (
              <div
                className="border p-10 md:p-12 flex flex-col items-center justify-center text-center gap-6 min-h-[400px]"
                style={{
                  backgroundColor: "var(--section-dark-surface)",
                  borderColor: "var(--section-dark-border)",
                }}
              >
                <div className="w-12 h-12 border border-white flex items-center justify-center shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--section-dark-text)"
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
                  style={{ color: "var(--section-dark-text)" }}
                >
                  Thank you.
                </h3>
                <p
                  className="font-body text-sm max-w-[320px]"
                  style={{ color: "var(--section-dark-muted)" }}
                >
                  Redirecting you to book a call...
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="border flex flex-col gap-5 p-10 md:p-12"
                style={{
                  backgroundColor: "var(--section-dark-surface)",
                  borderColor: "var(--section-dark-border)",
                }}
                aria-label="Project inquiry form"
              >
                {/* Name */}
                <div style={fieldStyle(formVisible, 0)}>
                  <label htmlFor="name" className={labelClass}>
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
                <div style={fieldStyle(formVisible, 1)}>
                  <label htmlFor="email" className={labelClass}>
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
                <div style={fieldStyle(formVisible, 2)}>
                  <label htmlFor="company" className={labelClass}>
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
                <div style={fieldStyle(formVisible, 3)}>
                  <label htmlFor="phone" className={labelClass}>
                    Phone number{" "}
                    <span className="text-on-dark-muted">(optional)</span>
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

                {/* Service */}
                <div style={fieldStyle(formVisible, 4)}>
                  <label htmlFor="service" className={labelClass}>
                    What do you need?
                    <RequiredMark />
                  </label>
                  <div className="relative">
                    <select
                      id="service"
                      name="service"
                      required
                      value={form.service}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${inputClass} appearance-none cursor-pointer pr-10`}
                      aria-invalid={!!(touched.service && errors.service)}
                      aria-describedby={errors.service ? "service-error" : undefined}
                    >
                      <option value="" disabled>
                        Select a service
                      </option>
                      <option value="software">
                        Custom Software Development
                      </option>
                      <option value="ai">AI and Automation</option>
                      <option value="cloud">Cloud Infrastructure</option>
                      <option value="data">Data Analysis</option>
                      <option value="unsure">Not sure yet</option>
                    </select>
                    <div
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--section-dark-muted)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                  {touched.service && errors.service && (
                    <p id="service-error" className={errorTextClass}>
                      {errors.service}
                    </p>
                  )}
                </div>

                {/* Message (optional) */}
                <div style={fieldStyle(formVisible, 5)}>
                  <label htmlFor="message" className={labelClass}>
                    Tell us about your project{" "}
                    <span className="text-on-dark-muted">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
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
                <div className="mt-2" style={fieldStyle(formVisible, 6)}>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full font-body text-sm font-semibold py-4 transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: submitHovered ? "var(--section-light-surface)" : "var(--section-light)",
                      color: "var(--section-light-text)",
                    }}
                    onMouseEnter={() => setSubmitHovered(true)}
                    onMouseLeave={() => setSubmitHovered(false)}
                  >
                    {status === "submitting" ? "Sending..." : "Book a discovery call"}
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
