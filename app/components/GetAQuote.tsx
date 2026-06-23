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

const inputClass =
  "w-full font-body text-sm text-white bg-[#0A0A0A] border border-[#1A1A1A] px-4 py-3 placeholder:text-[#444444] focus:outline-none focus:border-white transition-colors duration-200";

const labelClass = "block font-body text-xs text-[#888888] mb-1.5";

function validateForm(form: FormState): string | null {
  if (!form.name.trim()) return "Name is required.";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    return "A valid email is required.";
  if (!form.company.trim()) return "Company name is required.";
  if (!form.service) return "Please select a service.";
  if (!form.message.trim()) return "Please tell us about your project.";
  if (form.phone && !/^[\d\s\+\-\(\)]{7,20}$/.test(form.phone))
    return "Phone number format is invalid.";
  return null;
}

export default function GetAQuote() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm(form);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    setErrorMsg("");
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
      className="py-20 md:py-[120px] px-6"
      style={{ backgroundColor: "var(--section-dark)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[45fr_55fr] gap-16 md:gap-24 items-start">
          {/* Left column */}
          <FadeIn className="flex flex-col justify-center">
            <h2
              className="font-heading font-black text-white mb-6"
              style={{
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
                  <span className="font-body text-sm text-white shrink-0">&#10003;</span>
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
              <p className="font-mono text-[11px] text-[#444444] tracking-[2px] uppercase mb-2">
                Prefer email?
              </p>
              <a
                href="mailto:info@aivik.eu"
                className="font-body text-sm text-white hover:text-[#888888] transition-colors duration-200"
              >
                info@aivik.eu
              </a>
            </div>
          </FadeIn>

          {/* Right column — form */}
          <FadeIn delay={150}>
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
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-white">
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
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Munnazzah Aslam"
                    className={inputClass}
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Work email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className={labelClass}>
                    Company name
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company"
                    className={inputClass}
                    autoComplete="organization"
                  />
                </div>

                {/* Phone (optional) */}
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone number{" "}
                    <span className="text-[#444444]">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+49 123 456 7890"
                    className={inputClass}
                    autoComplete="tel"
                  />
                </div>

                {/* Service */}
                <div>
                  <label htmlFor="service" className={labelClass}>
                    What do you need?
                  </label>
                  <div className="relative">
                    <select
                      id="service"
                      name="service"
                      required
                      value={form.service}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none cursor-pointer pr-10`}
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
                        stroke="#888888"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className={labelClass}>
                    Tell us about your project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="What are you building and what do you need help with?"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Validation error */}
                {errorMsg && (
                  <p className="font-body text-xs text-red-400">{errorMsg}</p>
                )}

                {/* API error */}
                {status === "error" && (
                  <p className="font-body text-xs text-red-400">
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
                  className="w-full font-body text-sm font-semibold bg-white text-black py-4 hover:bg-[#F5F5F5] transition-colors duration-200 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? "Sending..." : "Book a discovery call"}
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
