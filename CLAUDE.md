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

**Deploy sequence:** run `scripts/deploy.sh {frontend|api|all}` on the TrueNAS host (SSH in first, no need to `cd` — the script locates the repo from its own path).

```sh
scripts/deploy.sh frontend   # build + recreate exposeu-nginx
scripts/deploy.sh api        # build + recreate exposeu-contact
scripts/deploy.sh all        # build + recreate both
```

The script does **not** run `npm ci`/`npm run build` directly against this working copy. This directory's `node_modules` is shared, physical storage — this repo lives on the TrueNAS host's own disk at `/mnt/Gaia/...`, and a dev machine mounts the *same files* over SMB as `/Volumes/Gaia/...`. A plain `npm ci` here writes thousands of small files straight onto that shared path; if anything on the other side (a local `tsc`/`eslint`/dev-server run) touches `node_modules` at the same moment, files corrupt (this happened 2026-08-24 — `tsc`'s own `package.json` came back with unrelated content). Instead the script copies source into the deploy container's own private filesystem, builds entirely there, and copies back only the finished `node_modules`/`dist` in one bounded operation — plus a `flock` so two deploys can't overlap. See the comment block at the top of `scripts/deploy.sh` for the full rationale, and `docs/nas-dependency-repair.md` for an earlier, related incident (missing Darwin-arm64 native binaries — different symptom, same shared-mount root cause).

**Local tooling rule:** never run `npm install`, `npm ci`, or `npm run build` against this working directory from a local machine — that's the exact operation that corrupts the shared `node_modules`. Local verification should be read-only (`tsc --noEmit`, `eslint`) against whatever is already installed; if that's missing or broken, report it rather than reinstalling. `npm run dev`/`npm run build` locally on macOS depend on the `node_modules/.darwin-native/node_modules` fallback described in `docs/nas-dependency-repair.md` — it's gitignored and not recreated by `npm ci`, so it can go missing after any clean install on either side.

**If a git command fails with a confusing error on this mount** (`unable to write loose object file: Is a directory`, `couldn't write '...refs/heads/X.lock'`, or similar) — this is the same shared-SMB-mount issue, hitting `.git` itself rather than `node_modules`. It's leftover junk blocking the next write, not lost work; `git status`/`git diff` come back clean every time this has happened. Run `scripts/git-nas-doctor.sh` to see what it found, or `scripts/git-nas-doctor.sh --fix` to clear it, then retry the git command.

Guardrails:
- never recreate `traefik`
- never run compose without explicit service names
- only touch `exposeu-nginx` and `exposeu-contact` for this project

**Env vars** — `.env` is loaded by both the frontend (Vite: `VITE_*` prefix) and the Node server. Required server-side vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_FROM`. See `.env.example`.

## Assets

Service images live under `src/assets/images/services/<number>_<slug>/`. Thumbnails are in `_thumb/1_1/` (square) and `_thumb/9_16/` (portrait). The `src/utils/resolveImagePath.ts` helper resolves image paths at runtime.
