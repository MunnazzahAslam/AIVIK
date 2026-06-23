"use client";
import { useState } from "react";
import FadeIn from "./FadeIn";

type FormState = {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  message: "",
};

const inputClass =
  "w-full font-body text-sm text-white bg-[#0A0A0A] border border-[#1A1A1A] px-4 py-3 placeholder:text-[#444444] focus:outline-none focus:border-white transition-colors duration-200";

const labelClass = "block font-body text-xs text-[#888888] mb-1.5";

export default function GetAQuote() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open("https://calendly.com", "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-black py-20 md:py-[120px] px-6">
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
            <p className="font-body text-base text-[#888888] leading-relaxed max-w-[480px]">
              Whether you have a defined project or an early idea, we are here
              to listen. Tell us where you are and we will tell you honestly how
              we can help.
            </p>

            <div className="h-px bg-[#1A1A1A] my-8" />

            <div className="flex flex-col gap-4">
              {[
                "Structured discovery before any commitment",
                "Transparent delivery with regular milestones",
                "Long-term partnership beyond project delivery",
              ].map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="font-body text-sm text-white shrink-0">&#10003;</span>
                  <p className="font-body text-sm text-[#888888]">{text}</p>
                </div>
              ))}
            </div>

            <div className="h-px bg-[#1A1A1A] my-8" />

            <div>
              <p className="font-mono text-[11px] text-[#444444] tracking-[2px] uppercase mb-2">
                Prefer email?
              </p>
              <a
                href="mailto:hello@aivik.eu"
                className="font-body text-sm text-white hover:text-[#888888] transition-colors duration-200"
              >
                hello@aivik.eu
              </a>
            </div>
          </FadeIn>

          {/* Right column — form */}
          <FadeIn delay={150}>
            {submitted ? (
              <div className="bg-[#111111] border border-[#1A1A1A] p-10 md:p-12 flex flex-col items-center justify-center text-center gap-6 min-h-[400px]">
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
                  We&apos;ll be in touch.
                </h3>
                <p className="font-body text-sm text-[#888888] max-w-[320px]">
                  Your discovery call has been opened in a new tab. We look
                  forward to speaking with you.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-[#111111] border border-[#1A1A1A] p-10 md:p-12 flex flex-col gap-5"
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
                      <option value="digital">Digital Presence</option>
                      <option value="hardware">Hardware and IoT</option>
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

                {/* Budget */}
                <div>
                  <label htmlFor="budget" className={labelClass}>
                    Budget range
                  </label>
                  <div className="relative">
                    <select
                      id="budget"
                      name="budget"
                      required
                      value={form.budget}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none cursor-pointer pr-10`}
                    >
                      <option value="" disabled>
                        Select a budget
                      </option>
                      <option value="under5k">Under €5,000</option>
                      <option value="5k-15k">€5,000 to €15,000</option>
                      <option value="15k-50k">€15,000 to €50,000</option>
                      <option value="50k+">€50,000+</option>
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

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full font-body text-sm font-semibold bg-white text-black py-4 hover:bg-[#F5F5F5] transition-colors duration-200 mt-2 cursor-pointer"
                >
                  Book a discovery call
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
