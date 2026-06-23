# AIVIK Website

Built with Next.js 14, Tailwind CSS, TypeScript.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Go to vercel.com, import the repo
3. Deploy — zero config needed

## Before going live

1. Replace Calendly links with your actual Calendly URL
2. Update LinkedIn URL in Footer.tsx
3. Fill in your German registered address in /app/impressum/page.tsx
4. Generate a proper Privacy Policy at e-recht24.de and replace /app/privacy/page.tsx
5. Add your AIVIK logo to /public/ and update Nav.tsx

## Structure

- app/page.tsx — main page, imports all sections
- app/components/ — all section components
- app/impressum/ — legally required in Germany
- app/privacy/ — GDPR privacy policy
- app/globals.css — global styles and custom classes
- tailwind.config.ts — color tokens and font config
