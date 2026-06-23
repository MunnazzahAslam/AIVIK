"use client";
import { useState, useEffect } from "react";

const links = [
  ["Services", "#services"],
  ["Process", "#process"],
  ["About", "#about"],
  ["Contact", "#contact"],
] as const;

type NavTheme = "hero-dark" | "dark" | "light";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<NavTheme>("hero-dark");

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-theme]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Hero section always forces hero-dark regardless of intersection ratio
          if (entry.target.id === "hero" && entry.isIntersecting) {
            setNavTheme("hero-dark");
            return;
          }

          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const theme = (entry.target as HTMLElement).dataset.theme;
            setNavTheme(theme === "light" ? "light" : "dark");
          }
        });
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const isLight = navTheme === "light";

  // hero-dark: black bg, white text, no visible border
  // dark:      black bg, white text, #1A1A1A border
  // light:     white bg, black text, #E5E5E5 border
  const bgColor = isLight ? "#FFFFFF" : "#000000";
  const textColor = isLight ? "#000000" : "#FFFFFF";
  const mutedColor = isLight ? "#666666" : "#888888";
  const borderColor =
    navTheme === "hero-dark"
      ? "#000000"
      : navTheme === "dark"
      ? "#1A1A1A"
      : "#E5E5E5";

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center px-6"
        style={{
          backgroundColor: bgColor,
          borderBottom: `1px solid ${borderColor}`,
          transition: "background-color 300ms ease, border-color 300ms ease",
        }}
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto w-full h-full relative flex items-center">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3 shrink-0 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2"
          >
            <span
              className="font-heading font-bold text-2xl tracking-tight"
              style={{
                color: textColor,
                transition: "color 300ms ease",
              }}
            >
              AIVIK
            </span>
          </a>

          {/* Desktop nav links — centered */}
          <div
            className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
            role="list"
          >
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                role="listitem"
                className="font-body text-sm transition-colors duration-300"
                style={{ color: mutedColor }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = textColor;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = mutedColor;
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop CTA — far right */}
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2">
            <button
              onClick={scrollToContact}
              className="font-body text-sm font-semibold px-5 py-[10px] transition-colors duration-300"
              style={{
                backgroundColor: isLight ? "#000000" : "#FFFFFF",
                color: isLight ? "#FFFFFF" : "#000000",
              }}
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] cursor-pointer p-2 ml-auto"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className="block w-6 h-0.5 transition-transform duration-200 origin-center"
              style={{
                backgroundColor: textColor,
                transform: open ? "rotate(45deg) translateY(7px)" : "none",
              }}
            />
            <span
              className="block w-6 h-0.5 transition-opacity duration-200"
              style={{
                backgroundColor: textColor,
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-0.5 transition-transform duration-200 origin-center"
              style={{
                backgroundColor: textColor,
                transform: open ? "rotate(-45deg) translateY(-7px)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10"
          style={{ backgroundColor: "var(--section-dark)" }}
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
          <button
            className="mt-4 font-body text-sm font-semibold bg-white text-black px-8 py-4"
            onClick={() => {
              setOpen(false);
              scrollToContact();
            }}
          >
            Get a Quote
          </button>
        </div>
      )}
    </>
  );
}
