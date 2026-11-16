# Immediate fixes and prioritized issue register

Each item includes evidence and a concrete acceptance condition. Findings based on source are not presented as observed failures unless separately verified in production.

## P0 — stop-ship

### [x] V2-001 — Analytics and advertising trackers run before a consent decision

**Status: DONE — verified on production 2026-11-16.** A clean Chromium session on `expose-u.com/about` made no Google/Meta/Clarity/AdSense requests before a choice or after Reject. Accept loaded gtag, Meta `fbevents.js`, Clarity and AdSense, and a stored Accept re-loads them after reload. Vendor requests were aborted in the browser, so no analytics/ad hits were sent. The only open point is the AdSense-with-analytics policy, an owner decision (todo.md). Before the fix, a fresh production session with the consent dialog still open requested Meta `fbevents.js`, sent a Facebook `PageView`, loaded Clarity, and sent Clarity collection requests. `index.html` unconditionally bootstrapped Meta Pixel, Clarity, Google tag and AdSense. The app's consent state gated some events, but did not prevent vendor scripts from loading. The dialog says only anonymous data is collected, while the observed Meta request included page URL/title/locale and a browser event ID.

**Resolution:** Trackers loaded before consent; vendor scripts now initialize only after affirmative consent, with production and accept-path verification still open.

The static snippets were removed from `index.html`; `initializeAnalyticsVendors()` now injects Google, Meta, Clarity and AdSense only after affirmative consent or a previously stored affirmative choice. The reject path does not initialize vendors. Existing route attribution is queued only after accepted bootstrap.

**Files:** `index.html`, `src/components/AnalyticsConsentBanner.tsx`, `src/utils/analytics.ts`.

**Acceptance:** source and static checks confirm there are no vendor bootstraps in initial HTML and only the affirmative consent path initializes them. A fresh local reject-path browser check found no analytics, ad, Clarity or Vimeo resources. Verify the affirmative path and repeat both paths on deployed production. AdSense is currently grouped with this same affirmative choice; confirm that remains the intended policy.

## P1 — pre-V2

### [x] V2-002 — Homepage background video causes heavy first-load work

**Update 2026-11-16 — source corrected.** The original first-party hero used `leoniswork_&_liquidrom_v1 (1080p).mp4`, which is the Leonis project film and belongs on that project page. The owner identified `website_-_main_v1 (1080p).mp4` as the homepage source. New immutable outputs are named `home-hero-desktop-v2.mp4` and `home-hero-mobile-v2.mp4` to avoid stale CDN copies; they remain self-hosted under `public/assets/media/` and are copied by the deploy script. The asset is still ignored by Git because the NAS working copy carries it into production builds. The mobile output remains a 608×1080 centre crop.

**Status: source corrected; deploy and owner visual confirmation pending.** Production currently serves the previously encoded Leonis/Liquidrom film in the homepage hero. The correct homepage media is the newly supplied `website_-_main_v1 (1080p).mp4`; the Leonis film belongs on its project page. V2 encodes are ready and the config points to them, but they are ignored by Git and must be carried by the TrueNAS deploy script.

The earlier native-video rewrite (`ddf557b`) rendered `<source>` elements only when `VITE_HOME_HERO_VIDEO_BASE_URL` was set. When that variable was blank and no MP4s were present, production showed an empty black hero; a Vimeo fallback was restored until self-hosted assets were supplied. The current runtime uses the media files when available and falls back to Vimeo if a file fails:

- **Native (target):** when `VITE_HOME_HERO_VIDEO_BASE_URL` is set, one muted, inline, looping `<video>` with media-selected mobile/desktop MP4s, pause/play/retry controls and reduced-motion support (unchanged from `ddf557b`).
- **Vimeo fallback (current production):** when it is blank, the pre-audit Vimeo background players (desktop `1228854165`, mobile `1228856768`) are mounted — only the variant for the current viewport, swapped at 900 px. URL adds `dnt=1` so Vimeo sets no tracking cookies before consent. The iframe fades in on Vimeo's `play` event (3.5 s fallback), the early-loop seek hides Vimeo's loop-point black frame, and the same localized pause/play button and `prefers-reduced-motion` pause work through the player postMessage API.

**Files:** `src/config/homeHeroVideo.ts`, `src/pages/HomeV2.tsx`, `src/pages/HomeV2.css`, `.env.example`.

**Acceptance (fallback):** `tsc --noEmit` and targeted ESLint pass. After deploy, verify on desktop and a phone that the video appears within a few seconds, loops without a black flash, the pause/play button works, and a desktop↔mobile resize swaps the variant. Vimeo's player can't be probed via curl (JS bot check), so playback is confirmed in a real browser only.

**Acceptance (close V2-002):** deploy the `v2` assets and config; confirm on desktop and phone that the homepage plays `website_-_main_v1`, the phone crop is 9:16, and the Leonis/Liquidrom video remains on its project page.

### [x] V2-003 — German language switch can navigate to missing legal routes

**Status: DONE IN SOURCE — local mobile control and rendered head verified.** `/privacy`, `/terms`, and `/data-deletion` are routed only in English. The global locale switcher previously generated missing German routes and metadata advertised them. The language switcher is now hidden on those legal pages and both metadata owners omit hreflang alternates there. This avoids directing visitors and crawlers to nonexistent translations while the pages remain English-only.

**Resolution:** English-only legal pages generated dead German destinations; their language switcher and German hreflang links are now suppressed.

**Files:** `src/App.tsx`, `src/i18n/routing.ts`, `src/i18n/pageMeta.ts`, `src/components/LocaleSwitcher.tsx`.

**Acceptance:** source hides locale switching and removes alternates on all three English-only legal pages; the local browser confirmed the control is hidden and the rendered legal heads have no hreflang tags.

### [x] V2-004 — Pricing request form has a runtime-only endpoint dependency

**Update 2026-11-16: resolved by V2-030** (pricing now posts to the contact API; the Apps Script endpoint is an optional secondary copy).

**Original status: BLOCKED — local configuration is present; production delivery cannot be confirmed from this checkout.** `PricingRequest.tsx` returns an inline missing-endpoint error when `VITE_PRICING_FORM_ENDPOINT` is absent. The variable was not documented in `.env.example`; that example now names the required build-time setting without a value. A local `.env` contains the setting (its value is intentionally not copied into this audit). The endpoint appears to support Google Apps Script; its `no-cors` branch receives an opaque response and treats any HTTP response as success. This checkout cannot establish whether the production build has the variable or whether records reach the destination.

**Resolution:** The required build variable is now documented, but opaque Apps Script success and destination delivery remain unresolved pending staging access.

**Files:** `src/pages/PricingRequest.tsx`, `.env.example`, `src/locales/{en,de}/forms.json`.

**Acceptance:** document endpoint owner and destination, reconcile a staging submission with its received record, and give the browser an observable success/error response. Local configuration alone does not meet this acceptance, so this ID remains open.

### [x] V2-005 — Service gallery images are all eager-loaded

**Status: DONE IN SOURCE — lint/type check and static loading-attribute check verified.** `WorkPageLayout.tsx` marks gallery images lazy and async-decodes them. The shared template's hero remains `loading="eager"` and `fetchPriority="high"`. Mobile gallery images are restored in a responsive stacked layout under V2-019.

**Resolution:** Service galleries eagerly loaded every image; gallery assets now lazy-load and async-decode while the hero stays high priority.

**Files:** `src/pages/WorkPageLayout.tsx`, `src/pages/WorkPage.css`.

**Acceptance:** source check confirms hero eager/high priority and gallery lazy/async. Slow-network reveal and CLS checks remain post-build verification.

### [x] V2-006 — In-memory API rate limits reset and are per-process

**Status: DONE FOR CURRENT DEPLOYMENT — bounded memory added and single-instance topology confirmed.** Contact, CAPI, consent, reverse geocoding and SMTP diagnostics each use in-memory `Map` stores in `server/index.js`. Compose currently defines one `exposeu-contact` instance. Each rate-limit map now caps keys at 10,000, prunes stale entries and evicts the oldest key when full, preventing unbounded growth under high-cardinality traffic. Process restarts still reset limits and replicated instances would not share them; use a shared limiter before scaling the API.

**Resolution:** Per-process limits could grow without bound; each map now prunes and caps entries, while shared limits remain needed before scaling replicas.

**Files:** `server/index.js`, `docker-compose.traefik.yml`.

**Acceptance:** current single-instance assumption is documented and maps are bounded. Revisit before adding API replicas; per-process restart behavior remains a known operational limitation.

## P2 — include in V2 backlog

### [x] V2-007 — Unreferenced images still ship

**Status: DONE — final image checker passes.** The first audit reported 35 unreferenced files totaling 2.71 MB and moved them to `archive/unused-assets/`; the final check found four additional unused thumbnails (about 0.12 MB), which were also archived with their source paths preserved.

**Resolution:** Unused images were still inside the shipped asset tree; all 39 identified files are now archived outside the Vite image glob and the checker reports none remaining.

**Acceptance:** checker reports no unreferenced/missing assets; archived files are outside `src/assets/images`. Built asset byte comparison remains a deployment/build check.

### [x] V2-008 — `AdLeadForm` component was misclassified as dead code

**Status: CLOSED — false positive; no code change needed.** `AdLandingPage.tsx` imports and renders `AdLeadForm` when `leadForm` config exists. Six campaign pages (Brand Agency, Pop-ups, Gallery/Museum, Artist/Musician, Exhibition Gallery and Concerts Berlin) define EN/DE lead form config. The component is live functionality, not dead code.

**Resolution:** `AdLeadForm` appeared unused in isolation but is rendered by six configured campaign pages, so it was retained as live code.

### [x] V2-009 — Home V1 remains reachable as a legacy route

**Status: DONE — owner chose to retire V1; English legacy redirect browser-verified.** `/old-home` now redirects to `/` and `/de/old-home` already redirects to `/de`, preserving old links while keeping visitors on the current homepage. The unused `Home.tsx` implementation was removed. `Home.css` remains because `PricingSection` still imports shared pricing styles from it; separating that stylesheet is outside this item.

**Resolution:** The obsolete Home V1 route exposed a second homepage; it now redirects to the current localized home and its unused component was removed.

### [x] V2-010 — SPA navigation and metadata should be checked for every route

**Status: CLOSED BY ARCHITECTURE DECISION — keep the current client-rendered SPA through V2; do not add SSR/prerender in this remediation pass.** Every canonical app route gets route-specific metadata after React renders. Initial HTML remains a generic shell, so social preview crawlers that do not execute JavaScript may still show generic metadata. This is a known limitation for the current strategy; reconsider static generation if social/search previews are a V2 requirement.

**Resolution:** SPA routes needed consistent metadata; one runtime metadata owner is now selected per route and prerendering is deferred by decision, leaving generic static previews as a known limitation.

**Acceptance:** route rendering strategy is recorded; runtime metadata was checked across the page families and EN/DE paths in the local browser. Static source and non-JavaScript social preview output were not validated because this strategy intentionally remains client-rendered.

### [x] V2-011 — Mobile menu is not a complete modal drawer interaction

**Status: DONE IN SOURCE — local browser verified dialog semantics, Escape close and focus restoration.** `TopNav.tsx` now marks the mobile panel as a modal dialog, hides/inerts the closed drawer, traps Tab/Shift+Tab within the panel, closes on Escape, and restores focus to the toggle. Localized dialog labels were added in EN/DE.

**Resolution:** The mobile drawer lacked complete keyboard and modal behavior; it now traps focus, closes on Escape, and restores focus to its trigger.

**Acceptance:** local browser confirmed modal semantics, Tab/Shift+Tab wrapping, Escape close and focus restoration; screen-reader behavior remains unverified.

### [x] V2-012 — Homepage starts with a full-screen visual before its primary heading

**Status: DONE IN SOURCE — mobile browser snapshot confirms heading and CTA at 390×844.** Production inspection at 390 px showed a full-height hero media section followed by an H1 beginning around document y=948 px. The mobile hero now carries the localized H1, subhead and primary contact CTA over its lightweight poster. The duplicate title/action row below the video is hidden only at the mobile breakpoint; desktop layout is unchanged.

**Resolution:** Mobile visitors saw a full-screen visual before the offer; the localized heading and contact CTA now appear in the poster hero.

**Acceptance:** local browser at 390×844 exposes the localized offer and primary action in the first mobile hero with video disabled; detailed CTA wrapping at 320/360/430 px remains part of V2-018.

### [x] V2-013 — Service metadata and page-level SEO are duplicated

**Status: DONE — one metadata owner is active for each route.** `usePageMeta()` now acts as the complete fallback for routes without `SEOMeta`; page-level SEO routes are excluded from that writer. The fallback also resets Open Graph/Twitter metadata and the document language when navigating away from an SEO page, preventing stale social tags. German About, Contact, Call Session and Portfolio metadata use localized copy.

**Resolution:** Global and page-level SEO writers duplicated or overwrote tags; route ownership is now exclusive and the fallback clears stale metadata on navigation.

**Acceptance:** local browser route checks found one description and one canonical on rendered pages; legal English-only pages had no hreflang alternates. EN/DE navigation showed localized title/description, `lang`, canonical/alternates, and fallback Open Graph values without duplicate tags.

### [x] V2-014 — Contact and pricing forms need end-to-end delivery observability

**Update 2026-11-16 — CLOSED.** Request IDs round-trip (body + `X-Request-Id`) and were reconciled live: the contact and pricing test submissions each produced exactly one `contact_submissions` row, and the success state is shown only on `{ok:true}`. The downstream-failure path (SMTP down → error + reference, no false success) was verified end to end locally (V2-030). Duplicate contact posts aren't deduplicated server-side (only rate-limited, 5/min). That is acceptable for a contact form and recorded as policy, not a defect.

**Status: PARTIALLY CLOSED IN SOURCE — contact API correlation and response checks added; staging delivery and pricing observability remain open.** Contact API now returns a request ID in the body/header, includes it in logs, confirms SMTP accepted at least one recipient before success, and avoids logging the visitor's reply-to address in the send summary. The contact page rejects a non-JSON/`ok:false` response and displays server reference IDs. Local API checks confirmed matching response/header IDs for invalid email, oversize field and missing-SMTP responses, without sending mail. Pricing still uses an opaque Apps Script response and cannot confirm the destination receipt.

**Resolution:** Contact outcomes were hard to trace; request IDs and SMTP acceptance checks were added, while pricing receipt confirmation and staging reconciliation remain open.

**Acceptance:** contact SMTP acceptance and destination reconciliation, Supabase delivery semantics, safe retry/idempotency policy and pricing staging reconciliation still require the staging entry point. User confirmed staging uses a test inbox; URL is pending.

### [x] V2-015 — Contact API request validation is minimal

**Status: DONE IN SOURCE — field limits and email validation added before logging/email.** Contact API now validates email syntax and enforces caps for name (120), email (254), message (10,000), plus bounded project/service/package/source/referrer/event fields. Overlong values return a 413 `FIELD_TOO_LONG`; malformed email returns a 400 `INVALID_EMAIL`. The global JSON parser remains 8 MB for the photo-consent signature payload, while contact fields are checked before they are logged or emailed.

**Resolution:** Contact inputs lacked consistent validation and size limits; the API now validates email and rejects oversized fields before logging or sending.

**Acceptance:** field limits and validation are implemented; static server syntax/lint checks pass. Staging API responses and log behavior still need runtime verification.

## P3 — verify with owner/production data

### [x] V2-016 — Photo-consent offline queue durability and user recovery

**Closed 2026-11-16:** idempotent saves were verified live (offline → sync → exactly one row, with the duplicate retry answered `ok`), and the data policy is an owner decision: signatures are exported and stored manually per project.

**Update 2026-11-16 — server idempotency DONE IN SOURCE (API deploy).** A read-only check of the live `outreach-app` schema showed `photo_consent_signatures.id` is a `uuid` primary key with a `gen_random_uuid()` default, and the anon INSERT policy places no restriction on columns. The API now stores the client's `submissionId` (a `crypto.randomUUID()`, re-sent unchanged by the offline queue) as `id`. A retry whose first attempt already landed gets Postgres `23505`, which the API answers as `{ ok: true, duplicate: true }`, so there's no second row and the client clears its queue. Non-UUID legacy ids keep the DB default. Tested against a local PostgREST mock (new → 201, same id → duplicate ok, legacy → default id); no rows were written to the real table. Remaining: the retention/deletion policy and device wording (owner), plus a staging run.

**Status: PARTIALLY CLOSED IN SOURCE — queue size and user recovery are bounded/visible; server idempotency done (above); policy still needs owner input.** The local queue validates entries, caps at 10 records and 4 MiB serialized storage, avoids overlapping retry loops, requires an `{ok:true}` JSON server response, and shows a pending count with an explicit retry action. If local storage cannot persist a failed record, the UI reports that state after generating the downloadable backup instead of claiming it will sync. A local synthetic queued record remained visible after an offline/local API failure; the fixture was removed afterward. The server currently ignores the client submission ID, so duplicate prevention after a lost acknowledgement is not guaranteed across retries or restarts.

**Resolution:** Offline consent retries could be lost or misreported; the local queue is now bounded with explicit pending/retry and backup states, but server deduplication and retention policy remain unverified.

Confirm the Supabase schema can safely persist a unique submission ID before claiming idempotent retries. Still test private browsing/quota failure, reload/online recovery against staging, retention/deletion policy and the exact device-local wording with the owner.

### [x] V2-017 — Route smoke coverage

**Status: DONE FOR LOCAL ROUTE SMOKE — production and external integrations are tracked separately.** `scripts/verify-routes.mjs` now checks all canonical EN/DE routes, valid pricing routes and legacy aliases. Against the local app, all canonical routes returned 200 and all aliases used the SPA fallback. Browser review covered route families in both languages, checked H1s, duplicate metadata, loaded broken images and horizontal overflow; `/old-home` and language switching were exercised. Pricing/contact/photo-consent delivery is not part of this route smoke and remains open under V2-004/014/016.

**Resolution:** Route coverage missed aliases and localized paths; the smoke script now checks canonical EN/DE routes and redirects, with local results passing and production health still separate.

Production remains limited to the homepage. Do not interpret local SPA fallback checks as deployment/API health checks.

### [ ] V2-018 — Responsive and accessibility audit beyond homepage

**Remaining (owner only):** the visual design check and a screen-reader pass. All automated checks pass (reflow at 320 px / 200% zoom, contrast in both themes, keyboard flows).

Production homepage was inspected at 1200× and 390×. Local route-family checks at 320, 390, 768, 1024 and 1440 px found no horizontal overflow on the sampled home, service, campaign, contact, pricing, legal, portfolio, photo-consent and 404 pages. The mobile navigation drawer's dialog, Tab/Shift+Tab wrapping, Escape, focus restoration, `inert` and scroll lock were exercised. A language-menu focus warning was found and fixed with focus restoration and closed-state `inert`; the follow-up browser pass had no console errors or warnings.

**Resolution:** Sampled layouts and menu keyboard flows were checked and the locale-menu focus warning was fixed; remaining zoom, contrast, screen-reader and signature-accessibility checks are still open.

**Source pass 2026-11-16 (done):**

- **Consent banner:** dropped `role="dialog"`. The banner never took or trapped focus, so a labelled `<aside>` landmark is accurate. After Accept/Reject, focus moves to `#main` instead of falling back to `<body>` when the focused button unmounts.
- **Skip link:** `/consent` and `/call-session` had no `id="main"`, so "Skip to content" went nowhere. Both now have it, and every routed page has the skip target. Programmatic focus on `<main>` draws no outline.
- **Form errors:** Contact and AdLeadForm already announced errors. PricingRequest field errors now have ids, `aria-describedby` and `role="alert"`, the submit error is `role="alert"`, and focus moves to the first invalid field. The PhotoConsent save error is `role="alert"`.
- **Signature canvas:** it had no accessible name; it is now `role="img"` labelled with the localized "sign" copy.
- **Contrast:** all dark-theme text tokens are ≥7:1 on `--page-bg`. A scan of hard-coded `rgba(245,245,244,a)` text found two failures, now fixed: the AdLanding quick-book placeholder (0.4 → 0.6, ~3.5:1 → ≥4.5:1) and the Release Content Kit testimonial handle (0.42 → 0.62). The third hit is a decorative `›` chevron, which is exempt.

**Remaining (browser/owner):** 200% zoom/reflow, the full per-route screenshot pass, a VoiceOver/NVDA pass (banner, drawer, combobox, form errors), and an accessible alternative to the drawing-only signature. Confirm legal/product acceptance before changing the signature method.

### [x] V2-019 — Service-page gallery media is hidden on mobile/tablet widths

**Status: DONE IN SOURCE — owner requested responsive images; local 390 px browser confirms two gallery images render.** At widths ≤900 px, each service page now stacks its gallery image below its text section, with a bounded responsive height; narrow screens use a smaller height and radius. Images remain lazy-loaded by the shared layout (V2-005).

**Resolution:** Service galleries disappeared below 900 px; responsive stacked gallery images now display on mobile and tablet widths.

**Acceptance:** local browser at 390 px confirms gallery media containers render as blocks at 351×242 px and both images load. Check crops and scroll flow across 320–900 px and all service routes.

## Gap pass — 2026-11-16 (items found in pages.md / systems.md without an issue ID)

### [x] V2-020 — `/v2` and `/de/v2` served a duplicate homepage

**Status: DONE IN SOURCE.** Both paths rendered `HomeV2` without redirecting, which created duplicate URLs for the homepage. They now `<Navigate replace>` to `/` and `/de`, like `/old-home`. `scripts/verify-routes.mjs` lists them as redirects instead of canonical routes.

**Files:** `src/App.tsx`, `scripts/verify-routes.mjs`.

**Acceptance:** after deploy, `/v2` → `/` and `/de/v2` → `/de`.

### [x] V2-021 — Reverse-geocode and photo-consent accepted out-of-range coordinates

**Status: DONE IN SOURCE (API deploy).** `/reverse-geocode` checked only that coordinates were finite, so values like `lat=500` were forwarded to Overpass/Nominatim. It now returns 400 unless −90 ≤ lat ≤ 90 and −180 ≤ lon ≤ 180. `/photo-consent` stores `null` for out-of-range coordinates instead of persisting them.

**Files:** `server/index.js`.

**Acceptance:** `GET /api/reverse-geocode?lat=500&lon=0` returns 400 `INVALID_PAYLOAD`. A valid Berlin coordinate still returns a label.

### [x] V2-022 — No route-level code splitting

**Status: DONE IN SOURCE — bundle size to be confirmed from the deploy build.** `App.tsx` imported every page eagerly, so the homepage downloaded the JS and CSS for every campaign, legal and consent page (including SignaturePad/geolocation code). All routes except `HomeV2` now load through `lazyWithReload()` (`React.lazy` + one `Suspense` with a viewport-height placeholder). The homepage stays in the main bundle because most visits land there.

- **Stale-deploy recovery:** a tab opened before a deploy requests old chunk hashes. If a chunk import fails, the page reloads once (sessionStorage guard against loops) to pick up the new `index.html`.
- **CSS cascade:** page CSS now loads with its chunk. `HomeV2` relied on `Home.css` arriving via `WorkPageLayout → PricingSection`, so it now imports `Home.css` before `HomeV2.css`, keeping the original order. A scan of classes defined in more than one stylesheet found only scoped or higher-specificity overlaps (`.work-page .home__pricing`, `.contact .footer`, `.x.is-open`), so load order doesn't change them.

**Files:** `src/App.tsx`, `src/utils/lazyWithReload.ts`, `src/pages/HomeV2.tsx`, `src/App.css`.

**Acceptance:** the deploy build emits separate page chunks. Homepage, a service page, contact, portfolio and `/consent` render with unchanged styling on direct load and SPA navigation. The homepage pricing section looks unchanged.

### [x] V2-023 — `LocationAutocomplete` lacks combobox semantics

**Status: DONE IN SOURCE — screen-reader pass pending (V2-018).** The suggestions list supported arrows/Enter/Escape, but the input had no combobox semantics and each `role="option"` wrapped a `<button>` (interactive content inside an option). It now follows the ARIA 1.2 combobox pattern:

- The input has `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` and `aria-activedescendant`.
- The listbox is always in the DOM (`hidden` when closed) with an accessible name, and each `<li role="option">` has an id, `aria-selected` and mouse selection. The buttons were removed.
- ArrowDown/ArrowUp open a closed list, Tab closes it, and the highlighted index is clamped when the filtered list shrinks.

**Files:** `src/components/LocationAutocomplete.tsx`, `src/components/LocationAutocomplete.css`.

**Acceptance:** on `/consent`, VoiceOver/NVDA announce the location field as a combobox, report expanded/collapsed, and read the highlighted suggestion while arrowing. Mouse/touch selection still fills the field.

### [x] V2-024 — Main bundle is 522 kB (170 kB gzip) after route splitting

**Status: CLOSED — measured, not worth doing.** The German locale data is 47.9 kB raw / **13.2 kB gzip** (~8% of the main bundle). English must stay eager (fallback for missing DE strings). Lazy-loading DE would add a blocking request before first render for every German visitor to save 13 kB for English visitors. The rest of the chunk is React DOM, React Router and GSAP, which the homepage needs. Original note: The 2026-11-16 deploy build split out all 28 non-home pages (largest: PhotoConsent 18 kB), but the main chunk still holds React DOM, React Router, GSAP (all needed by the homepage), both EN and DE locale JSON (~109 kB raw), pricing tiers and portfolio data. Lazy-loading the inactive locale is the only sizeable remaining saving. Measure homepage LCP/TBT before deciding whether it's worth doing.

### [x] V2-025 — Pricing request never reached its success page (P1)

**Status: DONE IN SOURCE — confirm with a staging submission (V2-004).** `PricingRequest.handleSubmit` called `event.currentTarget.reset()` after the `await fetch(...)`. React clears `currentTarget` once the handler's synchronous part returns, so that line threw `TypeError` (null). `navigate('/pricing-request/success')` never ran and the visitor stayed on the form, even though the request had been sent. The form element is now captured before the `await`, the same pattern `Contact.tsx` already uses. `AdLeadForm` only reads the form before awaiting and was unaffected.

**Files:** `src/pages/PricingRequest.tsx`.

**Acceptance:** a successful staging submission lands on `/pricing-request/success` with no console error.

### [x] V2-026 — Light mode existed but had no toggle and no light tokens

**Status: DONE IN SOURCE — owner eye review pending.** A "day version" beta (`7bdd2a8`) added `[data-theme='light']` tokens and a toggle. Both were later removed (`e34574a`), `initTheme()` forced dark, and nothing rendered `useThemeContext()`, so only 12 orphan light rules remained. Owner decision 2026-11-16: keep light mode and make the toggle work.

- **Step 1 — foundation (done):** a light token set in `index.css` (text ≥4.5:1 on `#f6f5f2`), a `ThemeToggle` beside the language switcher (it takes the switcher's spot on English-only legal pages and is hidden on `/consent`, which has its own mode), EN/DE labels, a persisted choice (`localStorage('site-theme')`, default dark), and an inline `<head>` script that applies it before first paint. Pages already built on tokens (services, About, Contact, CallSession, legal, pricing, footer, nav) follow automatically.
- **Step 2 — homepage + Portfolio (done):** a "dark islands" block in `index.css` re-declares the dark tokens, aliases included, on components that stay dark in light mode: the video hero, home nav bar over the video, monthly/custom pricing accent cards, the Portfolio lightbox and the thumbnail pills. Homepage focus rings use `--border-highlight`. Portfolio card text and hover border use tokens. A light-mode contrast scan of the built site (Playwright, 1280/390 px) found 0 text elements below 3:1 on `/`, `/portfolio`, `/about`, `/contact`, a service page, pricing, privacy and call-session. Scanner control: unconverted `/popups` and `/release-content-kit` were flagged at 1:1.
- **Step 3 — campaign pages, Release Content Kit, shared bits (done):** 109 hard-coded colours in `AdLandingPage.css` / `ReleaseContentKit.css`, plus the consent banner, Contact/Pricing focus rings and the FAQ border, were rewritten as `color-mix(in srgb, var(--token) N%, transparent)`, which keeps each original opacity so **dark mode renders the same**. Text opacity has a 62% floor so light mode stays ≥4.5:1; that only raises dark-mode contrast. `.alp__hero` and `.rck__hero` (photo heroes) are dark islands, so their copy stays white over the image, while the mobile below-the-fold copies of the price/proof and contact rows follow the page theme. Fixed along the way: the consent banner had a hard-coded dark background with token text, which would have been dark-on-dark in light mode. ImageCarousel arrows/dots sit on photos and stay white; PhotoConsent keeps its own light/dark mode (global toggle hidden there).
- **Owner eye review fix (2026-11-16):** Portfolio card text sits *on* the thumbnail and was dark in light mode. The `.portfolio__thumb` element is now a dark island, and the card description/context are back to their exact original 82% opacity. A new scan for dark text over photos/video (light mode, all routes, 1280/390) found two more cases:
  - Campaign and RCK hero headlines inherited the resolved light colour from `.alp`/`.rck`. Islands now also set `color: var(--text-strong)`.
  - The pricing request hero (a photo) wasn't an island. It is now, and its nav uses `useNavOverMedia`.
  - The remaining scan hits are solid white buttons and text on the frosted nav/sticky bars, confirmed by reading their computed backgrounds.
- **Verification:** the built site was scanned with Playwright on 25 routes (EN + `/de` sample, 404) at 1280 and 390 px in **both** themes: 0 text elements below 3:1. Toggle click flips and persists the theme; the banner computes light bg/dark text in light mode and the reverse in dark.

**Acceptance:** toggle on every page except `/consent`; the choice survives reload without a flash; each page family is readable in both themes (owner eye review).

### [x] V2-027 — `npm audit`: 19 vulnerabilities including 1 critical in the contact API

**Status: DONE IN SOURCE — deploy with `all`.** The 2026-11-16 deploy log reported 19 vulnerabilities (1 critical, 9 high, 9 moderate). The ones that matter run inside `exposeu-contact`:

- **`proxy-addr` (critical):** IP spoofing via IPv4-mapped IPv6 in `trust proxy`, which the rate limits and logs depend on.
- **`body-parser` / `qs`:** request-parsing DoS.
- **`nodemailer` (high):** `resolveContent` file-access bypass and IDN allow-list bypass.

**Changes:** `npm audit fix` (non-breaking) plus `express` ^4.19.2 → ^4.22.3 (`qs` 6.16.2) and `nodemailer` ^9.0.5 → ^10.6.0. The build-tool advisories (vite 7.3.8, browserslist, source-map-js, js-yaml, brace-expansion, zod, systeminformation via cypress) were cleared by the same fix. All of this was done in an isolated copy; only `package.json` and `package-lock.json` changed in the repo, and the shared `node_modules` was never touched.

**Verification:** `tsc -b` + `vite build` pass. The contact API ran against a local SMTP sink: a contact POST returned 200 with a matching `X-Request-Id`, and the sink received the message (correct from/to/subject). `/reverse-geocode?lat=500` → 400 (also confirms V2-021). Remaining: 7 moderate typescript-eslint advisories (dev-only; the offered fix is a downgrade).

### [x] V2-028 — Project pop-up showed an empty white/grey frame instead of the film

**Status: DONE IN SOURCE — owner to confirm Vimeo films in a real browser.** The pop-up's film frame was the bare Vimeo/YouTube iframe on a transparent background. Whenever the embed didn't render (blocked by browser privacy settings or a content blocker, network filter, slow load), the frame showed nothing or the browser's light-grey error page. Reproduced by blocking the players.

**Fix (`useVideoLightbox.tsx`, `Portfolio.css`):**
- The film frame now shows the **project cover** on a dark base.
- The iframe stays invisible until its player **reports in via postMessage**: Vimeo `api=1` (it posts `ready`, and answers a `ping`); YouTube `enablejsapi=1` (it answers a `listening` handshake). Only messages whose `source` is that iframe count. Error pages never post, so a broken embed never shows.
- After 6 s without a player, a **"Watch the film on Vimeo/YouTube"** link (EN/DE) appears over the cover.
- Applies to the Portfolio page and the homepage "Last Projects" (same hook).

**Verified:** a live YouTube film fades in (`is-ready` at 2.5 s, no link). With players blocked, the cover shows and the link appears at 6 s (YouTube and Vimeo). Live Vimeo couldn't be loaded here (Vimeo bot-checks automated browsers). Its readiness protocol was confirmed from Vimeo's `player.js`, and failure degrades to cover + link, never a blank frame.

### [x] V2-029 — Success pages confirmed a submission when opened directly; residual audit checks

**Status: DONE IN SOURCE.** The remaining source-level findings from pages.md / systems.md that had no issue ID:

- **Success pages (fixed):** `/contact-success` had no inbound link (the contact form confirms inline), so it was reachable only by typing the URL, and it then claimed the message was received. `/pricing-request/success` said the same when opened directly. The new `useSubmittedGuard()` makes both pages render only with `{ submitted: true }` navigation state, which `PricingRequest` now passes after a real submission. Otherwise they redirect (localized, `replace`) to `/contact`. The real pricing flow and its success URL are unchanged, so analytics goals on that URL keep working.
- **EN/DE key parity (verified, no change):** every key in all 15 `en/*.json` files exists in `de/`, with equal list lengths, so no missing-object crash is possible.
- **Reduced motion (verified, no change):** all GSAP animation in HomeV2, AdLandingPage, WorkPageLayout, ReleaseContentKit, Portfolio, About, Contact and the lightbox runs inside effects that return early on `prefers-reduced-motion: reduce`.
- **Sitemap (verified):** no retired URLs (`/v2`, `/old-home`, legacy service aliases). Note: it lists 3 of the 7 campaign pages (concerts-berlin, exhibition-gallery, brand-agency); see todo.md.

### [x] V2-030 — Every pricing request was being lost (P0, found in live QA)

**Status: DONE — verified on production 2026-11-16.** After deploy, a marked live test request returned 200 with a `requestId`, landed on `/pricing-request/success`, and produced one `contact_submissions` row (project type `Pricing request: Photo only`, service `concerts-events`, package `single-event` / `One-time`); the test row was then deleted. During the owner-delegated live form test on 2026-11-16, the pricing form showed its success page, but the browser logged a 403. A direct test POST to the configured Google Apps Script URL returned **403 "Zugriff verweigert – Sie benötigen Zugriff"**: the web app isn't deployed for "Anyone". Because the form used `no-cors`, the page couldn't see the 403 and always reported success. **Every public pricing request since that deployment state was discarded.**

**Fix (`PricingRequest.tsx`):**
- Pricing requests now go to the contact API (`/api/contact`), the same delivery as `/contact`: email to the inbox plus a `contact_submissions` row with `package` / `package_label` / service. The page reaches `/pricing-request/success` only on `{ ok: true }`; otherwise it shows an error with the server reference.
- The email subject is `Expose.u Lead - Pricing request: <coverage type>`, and the body carries plan, service, coverage, phone, organisation, date, location and details.
- If `VITE_PRICING_FORM_ENDPOINT` is set, the sheet still gets a best-effort `no-cors` copy (`keepalive`). It never gates success.

**Verified locally (full stack):** built frontend → Traefik-style `/api` strip proxy → contact API → SMTP sink. Success lands on the success page and the email is received with the pricing details. With SMTP down, the form shows the error plus a reference and stays on the form.

### Live form QA on production (2026-11-16, owner-delegated)

All marked "TEST — please ignore (QA 2026-11-16)"; the test rows were deleted afterwards (exact name match).

- **Contact (V2-014):** 200 with a matching `requestId` / `X-Request-Id`, the thank-you shown, exactly 1 `contact_submissions` row. This is the first live send on nodemailer 10 (V2-027).
- **Photo consent (V2-016):** an offline save was queued; on reconnect the first sync's reply was lost to a reload, and the retry got `{ok:true, duplicate:true}`. Exactly **1** row: idempotency confirmed in production.
- **Pricing:** reached the success page (V2-025 confirmed live) but was silently lost. See V2-030.

### [x] V2-031 — Production metadata sweep: German titles and the 404

**Status: DONE IN SOURCE.** A Playwright pass over all 41 canonical EN/DE routes on production found exactly one description, canonical and visible H1 everywhere, plus correct `lang` and alternates, `noindex` on the ads-only pages, no page errors and no broken images. All aliases (including the success-page guards) redirect correctly, browser back/forward works, and the "Services" anchor scrolls to `#cases`. Three gaps were fixed:

- **German homepage title** was hard-coded English in `HomeV2`. It now comes from `common.meta.home` (EN keeps the exact live copy; DE "Foto- & Videodokumentation Berlin").
- **German Portfolio title** said "Last Projects"; it is now "Letzte Projekte", matching the German homepage section.
- **The 404 was indexable:** it declared itself canonical and had hreflang alternates. Unknown routes now get `noindex` with no canonical/alternates/`og:url`. Indexable pages clear a leftover robots tag on SPA navigation (both metadata writers).

### [x] V2-032 — Portfolio work needs shareable project pages

**Status: DONE IN SOURCE — TypeScript, targeted ESLint and a fixture build of the social metadata generator pass; visual runtime review is blocked by the missing local Rollup binary.** Portfolio and homepage project cards now open localized `/projects/:projectId` pages. Each page uses existing project media, brief EN/DE context and outcome copy, a cover-backed film player with a direct-watch fallback, a responsive image gallery, previous/next project navigation, and a contact CTA. The build emits static HTML and route-specific cover images for the homepage, portfolio, all four services and all projects in EN/DE. Unknown project IDs return to the localized portfolio. Pricing remains parked for its later phase.

**Owner visual check:** desktop and mobile layouts, both themes, and each film embed after deployment.

**Owner decisions 2026-11-16:** require both contact email acceptance and Supabase persistence before reporting success; generate route-specific social preview pages for the homepage, portfolio, four services and every project in EN/DE. Persistence failures after mail acceptance return a reference error, tell visitors not to resubmit, and disable another submit in the current form view.

### Owner decisions 2026-11-16

- **V2-001 AdSense:** keep it grouped with the analytics "Accept". Closed.
- **V2-018 Signature:** keep drawing-only; no alternative will be built. Closed.
- **V2-016 Photo-consent data:** handled manually. The owner exports signatures per project and stores them in their own folders, so no automatic retention job is planned. Closed.
- **Pricing:** parked for a later phase; everything open is in [pricing/README.md](./pricing/README.md).
- **Ads-only pages:** `noindex`, not in the sitemap (done).

### [x] V2-033 — Project pages: visual-first rebuild, mobile navigation, readable URLs

**Status: DONE IN SOURCE — owner eye review pending.** This closes the gaps left in V2-032 against the owner's brief (visual over text, big reveals, a proper mobile navigation, both themes):

- **Editorial gallery** from each image's real shape (`scripts/gen-project-image-dims.mjs` → `src/data/projectImageDims.json`, read from WebP headers; 119 images): a landscape opens full-bleed, the next landscapes sit side by side, portraits pair up with an offset, and lone portraits alternate left/right. No crops, and `width`/`height` on every image reserves its space (no layout shift). The first 14 stills go in the editorial layout and the rest in a compact grid.
- **Reveals (GSAP, skipped with reduced motion):** the hero photo settles from a zoom with a slow scroll parallax and the copy rises; each gallery image is unveiled upward (clip-path) while easing out of a zoom; full-bleed images drift; the highlight line rises on scroll; the compact grid fades up in batches; the next-project image eases in.
- **Text hierarchy:** eyebrow (tag · place · year · 01/08), large H1, lead, two short project-specific paragraphs, facts (context / outcome / place), and one large highlight line between gallery blocks. The copy is per project in EN/DE (`portfolio.videos[].story` / `highlight`), mostly real with light placeholder framing.
- **Mobile navigation:** a thumb-reach bottom bar (← Projects · 06 / 08 · Next →, 44 px targets, safe-area aware) appears after the hero and hides at the end of the page, where the full next-project teaser and the previous/all-projects links take over. The gallery stacks full-width.
- **Next project:** a big image teaser with title and counter.
- **Readable URLs:** `/projects/lick-the-walls`, `/projects/abigail-toll-idol`, … (`src/data/projectSlugs.json`, also used by the social prerender). Legacy `/projects/v1` / `v2` redirect to the slug, and unknown slugs go to `/portfolio`.
- **Search:** all 16 project URLs are in `sitemap.xml` (with EN/DE alternates) and in `scripts/verify-routes.mjs`.
- **Nav fix:** on project pages the theme/language controls now use the homepage position (fixed top-right, 16 px clear of "Contact"); before, they overlapped "About"/"Contact" and scrolled away.
- **Dead code removed:** `useVideoLightbox` (the old pop-up) and 71 pop-up-only rules in `Portfolio.css` (1,137 → 679 lines).

**Verified (local build, Playwright):** dark/light × 1440/390 plus reduced motion. Every image ends up visible, there's no horizontal overflow, one H1, two story paragraphs, the mobile bar goes hidden → visible → hidden, legacy redirects work, and Portfolio/homepage link to the slugs. ESLint, `tsc -b`, the build and the prerender all pass (16 static project pages emitted).

### [x] V2-034 — Pre-rendered pages redirect to add a trailing slash (via http)

**Status: DONE — verified on production 2026-11-16.** The owner applied the change (`try_files $uri $uri/index.html /index.html;` plus `absolute_redirect off;`) and restarted `exposeu-nginx`. The project, service, Portfolio and home URLs now return `200` with no redirect and their own `og:title`; 60 sampled image assets return 200 (no cached errors). **Gotcha:** `default.conf` is a single-file read-only bind mount. Editors and `sed -i` replace the file, and the running container keeps the old copy, so a reload re-reads the old config. A `docker restart exposeu-nginx` is needed after editing it (documented in CLAUDE.md).

**Original report:**** Since the social-metadata prerender (V2-032) writes `dist/<path>/index.html`, nginx's `try_files $uri $uri/ /index.html` finds a directory and issues `301 Location: http://expose-u.com/<path>/` (absolute redirect, plain http behind Traefik's TLS). Measured on production 2026-11-16: `/projects/lick-the-walls`, `/de/projects/sanam-silent-green`, `/services/concerts-events` and `/portfolio` each take one redirect, then 200 with the correct per-page `og:title`. **Fix:** `try_files $uri $uri/index.html /index.html;` in `location /` (serves the directory index without redirecting) plus `absolute_redirect off;`. Exact steps are in todo.md step 1.

### [x] V2-035 — Clicking to another project from the bottom of a project page blanked the page

**Status: DONE IN SOURCE — deploy `frontend`.** Reported by the owner: after scrolling to the end of a project and opening another one, the new page didn't load until a refresh. Reproduced: the whole app unmounted with `TypeError: Cannot read properties of undefined (reading 'end')` thrown inside `ScrollTrigger.refresh`. **Cause:** the new project's scroll animations were created while the window was still scrolled to the bottom (the app-level scroll reset ran only after the page's own layout effects). Triggers using `once: true` whose start was already passed then fired and killed themselves *inside* ScrollTrigger's refresh loop, which crashed it.

**Fix:**
- `RouteScrollReset` in `App.tsx` resets scroll before any incoming page's layout effects run (it's a sibling placed before `<Routes>`). This protects every page that builds ScrollTriggers on mount (projects, Portfolio, campaign pages).
- Each project mounts as a fresh instance (`key={projectId}`), and it scrolls to the top before creating triggers.
- Project reveals use `toggleActions: 'play none none none'` instead of self-killing `once` triggers.

**Verified (local build, 1440 and 390 px):** a chain through all 8 projects via the next-project teaser from the very bottom of each page, previous, "All projects", browser back, and the mobile bar's Next from mid-page all render the new page at the top with no errors.

