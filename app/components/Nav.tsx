"use client";
import { useState } from "react";

const links = [
  ["Services", "#services"],
  ["Process", "#process"],
  ["About", "#about"],
  ["Contact", "#contact"],
] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-[#000000] border-b border-[#1A1A1A] flex items-center px-6"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto w-full h-full relative flex items-center">
          {/* Logo — absolute on desktop, in-flow on mobile */}
          <a
            href="/"
            className="flex items-center gap-3 shrink-0 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2"
          >
            <span className="font-heading font-bold text-2xl text-white tracking-tight">
              AIVIK
            </span>
            {/* <span className="hidden sm:block font-mono text-[11px] text-[#888888]">
              Think it. Build it. AIVIK.
            </span> */}
          </a>

          {/* Desktop nav links — perfectly centered */}
          <div
            className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
            role="list"
          >
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                role="listitem"
                className="font-body text-sm text-[#888888] hover:text-white transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop CTA — far right */}
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2">
            <a
              href="#contact"
              className="font-body text-sm font-semibold bg-white text-black px-5 py-[10px] hover:bg-[#F5F5F5] transition-colors duration-200"
            >
              Get a Quote
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] cursor-pointer p-2 ml-auto"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-200 origin-center ${
                open ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-200 origin-center ${
                open ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#000000] flex flex-col items-center justify-center gap-10"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="font-heading text-4xl font-bold text-white hover:text-[#888888] transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-4 font-body text-sm font-semibold bg-white text-black px-8 py-4"
            onClick={() => setOpen(false)}
          >
            Get a Quote
          </a>
        </div>
      )}
    </>
  );
}
