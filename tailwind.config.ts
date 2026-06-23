import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "aivik-black": "#000000",
        "aivik-white": "#FFFFFF",
        "aivik-dark": "#000000",
        "aivik-surface": "#111111",
        "aivik-border-dark": "#1A1A1A",
        "aivik-border-light": "#E5E5E5",
        "aivik-muted-dark": "#888888",
        "aivik-muted-light": "#666666",
        "aivik-ghost": "#333333",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      transitionTimingFunction: {
        aivik: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
