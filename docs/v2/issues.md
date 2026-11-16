# Immediate fixes and prioritized issue register

Each item includes evidence and a concrete acceptance condition. Findings based on source are not presented as observed failures unless separately verified in production.

## P0 — stop-ship

### [x] V2-001 — Analytics and advertising trackers run before a consent decision

**Status: DONE IN SOURCE — local reject-path network check passes; accept-path and production recheck pending.** Before the fix, a fresh production session with the consent dialog still open requested Meta `fbevents.js`, sent a Facebook `PageView`, loaded Clarity, and sent Clarity collection requests. `index.html` unconditionally bootstrapped Meta Pixel, Clarity, Google tag and AdSense. The app's consent state gated some events, but did not prevent vendor scripts from loading. The dialog says only anonymous data is collected, while the observed Meta request included page URL/title/locale and a browser event ID.

The static snippets were removed from `index.html`; `initializeAnalyticsVendors()` now injects Google, Meta, Clarity and AdSense only after affirmative consent or a previously stored affirmative choice. The reject path does not initialize vendors. Existing route attribution is queued only after accepted bootstrap.

**Files:** `index.html`, `src/components/AnalyticsConsentBanner.tsx`, `src/utils/analytics.ts`.

**Acceptance:** source and static checks confirm there are no vendor bootstraps in initial HTML and only the affirmative consent path initializes them. A fresh local reject-path browser check found no analytics, ad, Clarity or Vimeo resources. Verify the affirmative path and repeat both paths on deployed production. AdSense is currently grouped with this same affirmative choice; confirm that remains the intended policy.

## P1 — pre-V2

### [x] V2-002 — Homepage background video causes heavy first-load work

**Status: DONE IN SOURCE — local initial no-player state verified; post-play and production transfer checks remain.** Previously, a Vimeo iframe loaded automatically on first visit; the observed trace included adaptive playlists and roughly 20 MB of video segments. The hero background is decorative. The source already mounts only the matching desktop or mobile iframe, but both variants autoplay as soon as that viewport loads.

The homepage now shows lightweight local WebP posters (49 KB desktop, 19 KB mobile) and loads the corresponding Vimeo player only after the visitor selects “Play background video.” Vimeo preconnects were also removed from the initial HTML. If iframe loading errors, the play action returns so the visitor can retry.

**Files:** `src/pages/HomeV2.tsx`, `src/pages/HomeV2.css`, `index.html` (Vimeo preconnects).

**Acceptance:** source and static checks show no initial iframe source or Vimeo preconnect; the play action mounts only the active viewport's player; mobile/desktop poster assets are small and the title/controls remain available without video. Local browser confirms the initial player stays unloaded. Verify click-to-play and compare production network/LCP after deployment.

### [x] V2-003 — German language switch can navigate to missing legal routes

**Status: DONE IN SOURCE — mobile legal page control verified; head metadata still requires inspection.** `/privacy`, `/terms`, and `/data-deletion` are routed only in English. The global locale switcher previously generated missing German routes and metadata advertised them. The language switcher is now hidden on those legal pages and both metadata owners omit hreflang alternates there. This avoids directing visitors and crawlers to nonexistent translations while the pages remain English-only.

**Files:** `src/App.tsx`, `src/i18n/routing.ts`, `src/i18n/pageMeta.ts`, `src/components/LocaleSwitcher.tsx`.

**Acceptance:** source hides locale switching and removes alternates on all three English-only legal pages; local browser confirmed the language control is absent on `/privacy`. Inspect the rendered head to confirm hreflang tags are absent on all three routes.

### V2-004 — Pricing request form has a runtime-only endpoint dependency

**Status: BLOCKED — local configuration is present; production delivery cannot be confirmed from this checkout.** `PricingRequest.tsx` returns an inline missing-endpoint error when `VITE_PRICING_FORM_ENDPOINT` is absent. The variable was not documented in `.env.example`; that example now names the required build-time setting without a value. A local `.env` contains the setting (its value is intentionally not copied into this audit). The endpoint appears to support Google Apps Script; its `no-cors` branch receives an opaque response and treats any HTTP response as success. This checkout cannot establish whether the production build has the variable or whether records reach the destination.

**Files:** `src/pages/PricingRequest.tsx`, `.env.example`, `src/locales/{en,de}/forms.json`.

**Acceptance:** document endpoint owner and destination, reconcile a staging submission with its received record, and give the browser an observable success/error response. Local configuration alone does not meet this acceptance, so this ID remains open.

### [x] V2-005 — Service gallery images are all eager-loaded

**Status: DONE IN SOURCE — lint/type check and static loading-attribute check verified.** `WorkPageLayout.tsx` marks gallery images lazy and async-decodes them. The shared template's hero remains `loading="eager"` and `fetchPriority="high"`. Mobile gallery images are restored in a responsive stacked layout under V2-019.

**Files:** `src/pages/WorkPageLayout.tsx`, `src/pages/WorkPage.css`.

**Acceptance:** source check confirms hero eager/high priority and gallery lazy/async. Slow-network reveal and CLS checks remain post-build verification.

### [x] V2-006 — In-memory API rate limits reset and are per-process

**Status: DONE FOR CURRENT DEPLOYMENT — bounded memory added and single-instance topology confirmed.** Contact, CAPI, consent, reverse geocoding and SMTP diagnostics each use in-memory `Map` stores in `server/index.js`. Compose currently defines one `exposeu-contact` instance. Each rate-limit map now caps keys at 10,000, prunes stale entries and evicts the oldest key when full, preventing unbounded growth under high-cardinality traffic. Process restarts still reset limits and replicated instances would not share them; use a shared limiter before scaling the API.

**Files:** `server/index.js`, `docker-compose.traefik.yml`.

**Acceptance:** current single-instance assumption is documented and maps are bounded. Revisit before adding API replicas; per-process restart behavior remains a known operational limitation.

## P2 — include in V2 backlog

### [x] V2-007 — Unreferenced images still ship

**Status: DONE — archived outside the Vite image glob.** `npm run check:images` reported 35 unreferenced files totaling 2.71 MB. They were moved, preserving their source directory structure, to `archive/unused-assets/`; this keeps the files recoverable without importing them into the app's eager image glob.

**Acceptance:** checker reports no unreferenced/missing assets; archived files are outside `src/assets/images`. Built asset byte comparison remains a deployment/build check.

### [x] V2-008 — `AdLeadForm` component was misclassified as dead code

**Status: CLOSED — false positive; no code change needed.** `AdLandingPage.tsx` imports and renders `AdLeadForm` when `leadForm` config exists. Six campaign pages (Brand Agency, Pop-ups, Gallery/Museum, Artist/Musician, Exhibition Gallery and Concerts Berlin) define EN/DE lead form config. The component is live functionality, not dead code.

### [x] V2-009 — Home V1 remains reachable as a legacy route

**Status: DONE — owner chose to retire V1; English legacy redirect browser-verified.** `/old-home` now redirects to `/` and `/de/old-home` already redirects to `/de`, preserving old links while keeping visitors on the current homepage. The unused `Home.tsx` implementation was removed. `Home.css` remains because `PricingSection` still imports shared pricing styles from it; separating that stylesheet is outside this item.

### V2-010 — SPA navigation and metadata should be checked for every route

**Status: source-based.** Route metadata is updated client-side with `useEffect`; initial HTML is a generic shell. Crawlers that do not execute the app see generic title/OG fields. Route-specific metadata is split between `pageMeta.ts`, route config, and page `SEOMeta` calls, creating duplicate sources of truth and possible stale canonical/alternates.

**Acceptance:** establish a single route metadata source and decide prerender/SSR strategy for campaign pages; validate rendered source and social previews for all indexed routes.

### [x] V2-011 — Mobile menu is not a complete modal drawer interaction

**Status: DONE IN SOURCE — local browser verified dialog semantics, Escape close and focus restoration.** `TopNav.tsx` now marks the mobile panel as a modal dialog, hides/inerts the closed drawer, traps Tab/Shift+Tab within the panel, closes on Escape, and restores focus to the toggle. Localized dialog labels were added in EN/DE.

**Acceptance:** local browser confirmed the modal dialog appears, Escape closes it and focus returns to the menu toggle. Verify Tab/Shift+Tab wrapping and assistive-technology behavior.

### [x] V2-012 — Homepage starts with a full-screen visual before its primary heading

**Status: DONE IN SOURCE — mobile browser snapshot confirms heading and CTA at 390×844.** Production inspection at 390 px showed a full-height hero media section followed by an H1 beginning around document y=948 px. The mobile hero now carries the localized H1, subhead and primary contact CTA over its lightweight poster. The duplicate title/action row below the video is hidden only at the mobile breakpoint; desktop layout is unchanged.

**Acceptance:** local browser at 390×844 exposes the localized offer and primary action in the first mobile hero with video disabled. Check text wrapping and CTA at 320/360/430 px and review screenshots before closing the broader responsive audit.

### V2-013 — Service metadata and page-level SEO are duplicated

**Status: source-based.** `usePageMeta()` always runs from `App.tsx`, while several pages also render `SEOMeta` and set canonical/title metadata. The duplication can make head state depend on effect order and contributes to multiple maintenance locations.

**Acceptance:** each route has one metadata owner, correct locale-specific canonical and alternates, and no duplicate tags after client navigation.

### V2-014 — Contact and pricing forms need end-to-end delivery observability

**Status: incomplete evidence.** Contact API sends email and only then best-effort logs to Supabase; pricing request uses an external endpoint/no-cors path. Static inspection cannot establish email deliverability, Supabase RLS/schema fit, duplicate submission handling, or third-party endpoint reliability.

**Acceptance:** add correlation IDs and safe delivery outcomes; document retries/idempotency and data retention; perform staging submissions and reconcile mail + persistence destinations.

### [x] V2-015 — Contact API request validation is minimal

**Status: DONE IN SOURCE — field limits and email validation added before logging/email.** Contact API now validates email syntax and enforces caps for name (120), email (254), message (10,000), plus bounded project/service/package/source/referrer/event fields. Overlong values return a 413 `FIELD_TOO_LONG`; malformed email returns a 400 `INVALID_EMAIL`. The global JSON parser remains 8 MB for the photo-consent signature payload, while contact fields are checked before they are logged or emailed.

**Acceptance:** field limits and validation are implemented; static server syntax/lint checks pass. Staging API responses and log behavior still need runtime verification.

## P3 — verify with owner/production data

### V2-016 — Photo-consent offline queue durability and user recovery

`PhotoConsent.tsx` queues failed submissions in localStorage. Verify that queue persistence survives browser storage limits, that retries do not duplicate accepted records, that a different device is not implied, and that users can clearly tell “saved locally” from “stored on server.” Test offline, private browsing, full storage, reload, and retry.

### V2-017 — Production runtime/route smoke pass

Local Vite initially failed because the optional Darwin Rollup native package was absent. A temporary package workaround under `/tmp` enabled local browser smoke checks without mutating repository dependencies: homepage, `/old-home` redirect, `/privacy`, one service detail route, mobile gallery rendering and mobile drawer Escape/focus restoration were exercised. Production smoke is still limited to the homepage; the full page/deep-link matrix, browser back/forward, language switch actions and authenticated/external integrations remain open.

### V2-018 — Responsive and accessibility audit beyond homepage

Production homepage was inspected at 1200× and 390×. Local checks now cover the 390×844 homepage offer, `/privacy` language control, one service gallery and mobile drawer Escape/focus restoration. All page families, other responsive widths, error states, Tab wrapping, zoom/reflow, contrast and screen-reader semantics remain unverified in a browser.

### [x] V2-019 — Service-page gallery media is hidden on mobile/tablet widths

**Status: DONE IN SOURCE — owner requested responsive images; local 390 px browser confirms two gallery images render.** At widths ≤900 px, each service page now stacks its gallery image below its text section, with a bounded responsive height; narrow screens use a smaller height and radius. Images remain lazy-loaded by the shared layout (V2-005).

**Acceptance:** local browser at 390 px confirms gallery media containers render as blocks at 351×242 px and both images load. Check crops and scroll flow across 320–900 px and all service routes.
