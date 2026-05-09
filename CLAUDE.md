# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server (HMR)
npm run build        # tsc + vite build → dist/
npm run lint         # ESLint
npm run preview      # Serve the dist/ build locally
npm run server       # Node contact API (server/index.js) on port 8787
npm run verify:routes  # Check all routes are reachable (scripts/verify-routes.mjs)
npx cypress open     # Interactive Cypress e2e runner
npx cypress run      # Headless Cypress e2e
```

## Architecture

**Stack:** React 19 + TypeScript + Vite SPA. No backend framework for the frontend; the only server-side code is `server/index.js` (Node/Express contact form API).

**Routing** — `src/App.tsx` owns all client-side routes via `react-router-dom`. Every route change triggers scroll-to-top and a CSS micro-transition via `is-entering` class on `.page__content`. Analytics (GA4 + Clarity) fire on every route change from `App.tsx`.

**Service pages** — all six service pages (`/documentation`, `/gallery-stories`, `/artist-sessions`, `/performance`, `/fashion-show`, `/atmospheric`) are thin wrappers that pass data into `src/pages/WorkPageLayout.tsx`. `WorkPageLayout` renders the hero card stack, gallery sections, `PricingSection`, and the CTA. GSAP + ScrollTrigger handle all animations inside this layout; always check `prefers-reduced-motion` before adding new ones.

**Pricing data** — `src/data/pricingTiers.ts` defines the base three tiers. `src/data/pricingByService.ts` holds per-service price overrides. `PricingSection` merges them at render time. Clicking a tier navigates to `/contact?package=<slug>&service=<slug>`.

**Contact flow** — frontend `Contact.tsx` posts to `/api/contact` → Traefik strips `/api` prefix → `server/index.js` on port 8787 (Node/Express + nodemailer). The server reads SMTP config from `.env`. Honeypot field (`companyWebsite`) and in-memory IP rate limiting (5 req/min) guard the endpoint.

**Analytics** — `src/utils/analytics.ts` is the single analytics abstraction. All tracking requires explicit user consent (`window.__analyticsConsent`). The consent state is persisted in localStorage and initialized by `AnalyticsConsentBanner`. Never call `gtag` or `window.clarity` directly; always use `trackEvent` / `trackPageView` from this module. Debug mode: `localStorage.setItem('__analyticsDebug', 'true')`.

**Theme** — `ThemeContext.tsx` provides dark/light toggle. Default is dark. `src/theme.ts` applies the theme class to the DOM.

**Services canonical list** — `src/data/serviceMeta.ts` is the source of truth for service slugs, labels, and hrefs. Update here when adding or renaming services.

## Deployment

The production server is TrueNAS running Docker with Traefik v3 as the reverse proxy (`docker-compose.traefik.yml`). Three containers matter:
- `exposeu-nginx` — serves `dist/` (static build) for `expose-u.com`
- `exposeu-contact` — runs `server/index.js` (contact API)
- `traefik` — TLS termination + routing; `/api/*` → contact container

**Deploy sequence:** run the build on the TrueNAS host through Dockerized Node, then recreate only the changed containers.

Frontend only:
```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci && npm run build"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx
```

API only:
```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-contact
```

Frontend + API:
```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci && npm run build"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx exposeu-contact
```

Guardrails:
- never recreate `traefik`
- never run compose without explicit service names
- only touch `exposeu-nginx` and `exposeu-contact` for this project

**Env vars** — `.env` is loaded by both the frontend (Vite: `VITE_*` prefix) and the Node server. Required server-side vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_FROM`. See `.env.example`.

## Assets

Service images live under `src/assets/images/services/<number>_<slug>/`. Thumbnails are in `_thumb/1_1/` (square) and `_thumb/9_16/` (portrait). The `src/utils/resolveImagePath.ts` helper resolves image paths at runtime.
