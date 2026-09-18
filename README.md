# Odoo Web App Studio — marketing site

Marketing site for a web app studio that turns a specific Odoo workflow into
a small, focused standalone web app connected to a customer's existing Odoo
via API. Odoo is never replaced.

## Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS v4
- Framer Motion (used sparingly, respects `prefers-reduced-motion`)
- lucide-react icons

## Structure

- `src/config` — brand name, colors, pricing, example apps, nav/contact copy. Components read from here instead of hardcoding content.
- `src/components/marketing` — the page sections (hero, pricing, FAQ, etc.)
- `src/components/demo-apps` — the small functioning mock app UIs used throughout the site (warehouse picking, sales app, dashboard, etc.)
- `src/components/ui` — small shared primitives (button, accordion, chip, segmented control)
- `src/lib/contact.ts` + `src/app/actions.ts` — the contact form's Server Action. `sendContactSubmission()` currently only logs; wiring in email/DB later is a single-function change (see the `TODO` in `src/lib/contact.ts`).

## Development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npx tsc --noEmit
npx eslint .
npm run build
```
