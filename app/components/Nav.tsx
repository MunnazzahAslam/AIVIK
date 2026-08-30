"use client";
import { useState, useEffect } from "react";
import AIVIKLogo from "./AIVIKLogo";

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

  // hero-dark: black bg, white text, invisible border (same as bg)
  // dark:      black bg, white text, dark border
  // light:     white bg, black text, light border
  const bgColor = isLight ? "var(--nav-bg-on-light)" : "var(--nav-bg-on-dark)";
  const textColor = isLight ? "var(--nav-text-on-light)" : "var(--nav-text-on-dark)";
  const mutedColor = isLight ? "var(--section-light-muted)" : "var(--section-dark-muted)";
  const borderColor =
    navTheme === "hero-dark"
      ? "var(--nav-bg-on-dark)"
      : navTheme === "dark"
      ? "var(--nav-border-on-dark)"
      : "var(--nav-border-on-light)";

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center px-8 md:px-14"
        style={{
          backgroundColor: bgColor,
          borderBottom: `1px solid ${borderColor}`,
          transition: "background-color 300ms ease, border-color 300ms ease",
        }}
        aria-label="Main navigation"
      >
          {/* Logo — far left */}
          <a href="/" className="flex items-center shrink-0">
            <AIVIKLogo size="md" variant={isLight ? "light" : "dark"} />
          </a>

          {/* Desktop nav links — truly centered on full nav width */}
          <div
            className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2"
            role="list"
          >
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                role="listitem"
                className="font-body font-medium text-[15px] transition-opacity duration-200"
                style={{ color: textColor, opacity: 0.5 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.5"; }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop CTA — far right */}
          <button
            onClick={scrollToContact}
            className="hidden md:block ml-auto font-body font-bold text-[13px] px-6 py-[10px] transition-colors duration-200 shrink-0"
            style={{
              backgroundColor: isLight ? "var(--nav-bg-on-dark)" : "var(--nav-bg-on-light)",
              color: isLight ? "var(--nav-text-on-dark)" : "var(--nav-text-on-light)",
              letterSpacing: "0.02em",
            }}
          >
            Get a Quote
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] cursor-pointer p-2 ml-auto"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className="block w-6 h-0.5 transition-transform duration-200 origin-center"
              style={{ backgroundColor: textColor, transform: open ? "rotate(45deg) translateY(7px)" : "none" }}
            />
            <span
              className="block w-6 h-0.5 transition-opacity duration-200"
              style={{ backgroundColor: textColor, opacity: open ? 0 : 1 }}
            />
            <span
              className="block w-6 h-0.5 transition-transform duration-200 origin-center"
              style={{ backgroundColor: textColor, transform: open ? "rotate(-45deg) translateY(-7px)" : "none" }}
            />
          </button>
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
              className="font-heading text-4xl font-bold transition-colors duration-200"
              style={{ color: "var(--section-dark-text)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--section-dark-muted)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--section-dark-text)";
              }}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <button
            className="mt-4 font-body text-sm font-semibold px-8 py-4"
            style={{
              backgroundColor: "var(--section-light)",
              color: "var(--section-light-text)",
            }}
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
