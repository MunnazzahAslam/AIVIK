# AIVIK — CLAUDE.md

## Project overview

AIVIK is the marketing/agency website for AIVIK, a software engineering and AI automation company registered in Germany. The site is a single-page landing with sections for services, process, team, and a call-to-action, plus two legally required routes (`/impressum` and `/privacy`).

Live domain: `https://aivik.eu`

---

## Tech stack and versions

| Tool | Version |
|---|---|
| Next.js | 14.2.3 (App Router) |
| React | ^18 |
| TypeScript | ^5 (strict mode) |
| Tailwind CSS | ^3.4.1 |
| PostCSS | ^8 |
| Node | ^20 |

No UI libraries, no animation libraries, no state management. Pure Next.js + Tailwind.

---

## Folder structure

```
aivik/
├── app/
│   ├── layout.tsx              # Root layout — metadata, global CSS import
│   ├── page.tsx                # Home page — imports and orders all sections
│   ├── globals.css             # Global styles, Tailwind directives, custom utilities
│   ├── components/
│   │   ├── Nav.tsx             # Fixed top nav with mobile hamburger (client component)
│   │   ├── Hero.tsx            # Full-height hero with headline, stats row
│   │   ├── TrustBar.tsx        # Past employer / trust logos bar
│   │   ├── Services.tsx        # 2-col grid of service cards
│   │   ├── HowItWorks.tsx      # 3-step process section (dark background)
│   │   ├── WhyAivik.tsx        # 6-item reasons grid
│   │   ├── Team.tsx            # 3-card team section (dark background)
│   │   ├── CTA.tsx             # Full-width CTA block with glow effect
│   │   └── Footer.tsx          # Footer with nav links and legal links
│   ├── impressum/
│   │   └── page.tsx            # German Impressum — legally required (§5 TMG)
│   └── privacy/
│       └── page.tsx            # GDPR Privacy Policy placeholder
├── tailwind.config.ts          # Color tokens and font config
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## Color tokens and design system

Defined in `tailwind.config.ts` and usable as `bg-bg`, `text-heading`, etc.

| Token | Hex | Usage |
|---|---|---|
| `bg` | `#0A0F1E` | Page background, primary dark |
| `surface` | `#111827` | Alternate section background (HowItWorks, Team, TrustBar) |
| `card` | `#151E30` | Card backgrounds (unused directly, available) |
| `border` | `#1E2D4A` | All borders throughout the site |
| `accent` | `#2563EB` | Primary blue — CTAs, icons, active states |
| `accent-light` | `#3B82F6` | Hover state for accent (buttons, links) |
| `muted` | `#64748B` | Body text, descriptions, secondary content |
| `subtle` | `#94A3B8` | Slightly lighter secondary text, hover states |
| `body` | `#CBD5E1` | Default body text color |
| `heading` | `#F1F5F9` | All headings and high-contrast text |

Additional dark tones used inline (not tokenized): `#475569`, `#334155`.

**Fonts:**
- `font-sans` → Inter (loaded from Google Fonts in globals.css)
- `font-mono` → JetBrains Mono (used for step numbers in HowItWorks)

**Global CSS utilities** (defined in `globals.css`, never Tailwind classes):
- `.gradient-text` — white-to-blue gradient on text (used in Hero h1)
- `.card-hover` — lift + border-color transition on hover
- `.glow` — blue box-shadow ambient glow

**Layout constant:** All sections use `max-w-6xl mx-auto` as the content container. Do not change this.

---

## Component conventions

- All components are **server components by default**. Only add `"use client"` when React hooks or browser APIs are needed (currently only `Nav.tsx`).
- Data arrays (services, steps, team members, reasons) are defined as `const` at the **top of the file**, above the component function. Keep this pattern — it makes copy editing easy without touching JSX.
- Section IDs for anchor navigation: `id="services"`, `id="how-it-works"`, `id="team"`. These match the Nav links exactly.
- Sections alternate backgrounds: most use the default `bg` (`#0A0F1E`), while HowItWorks, Team, and TrustBar use `bg-[#111827]` (the `surface` token).
- Card pattern: `bg-[#111827] border border-[#1E2D4A] rounded-xl p-7 card-hover`
- Tag/pill pattern: `text-xs text-[#475569] border border-[#1E2D4A] px-2.5 py-1 rounded-full`
- Section header pattern: uppercase accent label → bold h2 → muted description paragraph
- The `max-w-6xl mx-auto` wrapper and `px-6` horizontal padding are consistent across every section. Keep them.
- Inline hex values are used in most components rather than Tailwind token names — this is intentional for readability; do not refactor to token names unless updating the whole file.

---

## How to run

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # serve production build locally
```

## How to deploy

Deploy to Vercel — zero config required:

1. Push to GitHub
2. Import repo at vercel.com
3. Deploy — Vercel auto-detects Next.js

No environment variables are needed for the current site.

---

## Before going live — required placeholders

These are placeholder values in the current codebase that must be replaced:

| File | What to replace |
|---|---|
| `app/components/Nav.tsx` | `https://calendly.com` → real Calendly URL |
| `app/components/Hero.tsx` | `https://calendly.com` → real Calendly URL |
| `app/components/CTA.tsx` | `https://calendly.com` → real Calendly URL |
| `app/components/Footer.tsx` | `https://linkedin.com/company/aivik` → real LinkedIn URL |
| `app/impressum/page.tsx` | `[Your registered address in Germany]` → real registered address |
| `app/privacy/page.tsx` | Replace entire content with a proper GDPR policy (generate at e-recht24.de) |
| `app/layout.tsx` | Update `openGraph.url` if domain changes from `aivik.eu` |

---

## Things to never change

- **Color tokens in `tailwind.config.ts`** — the entire visual identity depends on these values. Do not rename or remove tokens.
- **Global CSS utilities** (`.gradient-text`, `.card-hover`, `.glow`) in `globals.css` — used across many components without local overrides.
- **`max-w-6xl mx-auto`** layout container — changing this breaks visual alignment across all sections simultaneously.
- **Section `id` attributes** (`#services`, `#how-it-works`, `#team`) — the Nav links anchor to these; changing one requires changing both.
- **`/impressum` and `/privacy` routes** — legally required in Germany. Do not remove, rename, or redirect these pages.
- **`lang="en"` on `<html>`** in `layout.tsx` — intentional; the site is in English for European clients.
- **`"use client"` in `Nav.tsx`** — required for the mobile menu toggle state. Do not remove it.
- **`rel="noopener noreferrer"`** on all `target="_blank"` links — security best practice, must stay on all external links.
