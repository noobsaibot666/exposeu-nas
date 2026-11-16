# Verification record

## Checks performed

| Check | Result | Scope / limitation |
|---|---|---|
| `npm run lint` | Pass, no reported warnings/errors | Read-only against existing shared dependencies. |
| `tsc --noEmit --pretty false` | Pass | Read-only TypeScript check after V2-001 source change. |
| `npm run check:images` | Fails by design with 35 unused files (2.71 MB) | Source reference and on-disk asset scan; see V2-007. |
| `npm run check:images` after V2-007 | Pass: no unreferenced images found | 35 initial files and four residual thumbnails from the final audit are archived under `archive/unused-assets/`, preserving their relative paths. |
| Production homepage desktop | HTTP 200; title `Documentation Studio Berlin \| expose.u`; 0 console errors, 1 warning | Browser at 1200 px. No full conversion flow. |
| Production homepage mobile | Same page rendered at 390×844; 0 console errors, 1 warning | Visual/a11y snapshot only; no full device matrix. H1 begins below initial viewport. |
| Pre-choice vendor requests | Meta Pixel script and PageView; Clarity script and collection observed while consent dialog remained open | Clean browser profile; confirms V2-001. |
| V2-001 post-fix source check | Pass | Vendor script URLs now occur only inside `initializeAnalyticsVendors()`; the banner calls it only for stored/affirmative consent. Fresh local reject-path network check is recorded below; accept and deployed behavior remain open. |
| V2-002 post-fix source check | Pass | Vimeo iframe `src` is rendered only after the play action; initial Vimeo preconnects removed. Posters are 49 KB desktop and 19 KB mobile. Local initial no-player state is recorded below; playback transfer/LCP measurement remains open. |
| V2-003 post-fix source check | Pass | Locale switcher is suppressed on English-only legal paths; route metadata and page `SEOMeta` both remove hreflang alternates. Mobile browser confirmed the legal page control is hidden; head-tag alternates remain uninspected. |
| V2-004 configuration check | Partial | Local ignored `.env` contains `VITE_PRICING_FORM_ENDPOINT`; value was not displayed or copied. `.env.example` now documents the build-time variable. Production delivery still requires a reconciled staging submission. |
| V2-005 post-fix source check | Pass | Shared hero remains eager/high priority; shared gallery image now uses lazy loading and async decoding. Slow-network/CLS check awaits browser build. |
| V2-006 post-fix source check | Pass | All five rate-limit maps use the bounded capacity helper; compose has one API service definition. Runtime high-cardinality behavior was not load-tested. |
| V2-011 post-fix source check | Pass | Mobile panel has modal semantics, closed-state `inert`/`aria-hidden`, Tab wrapping and Escape/focus restoration paths. Local browser confirms dialog, Escape close and focus restoration; Tab wrapping remains unverified. |
| V2-012 post-fix source check | Pass | Mobile video section now contains the localized H1, subhead and contact CTA; duplicate below-video title/actions are hidden at the mobile breakpoint. At 390×844, all three appeared in the accessibility snapshot; other widths/screenshots remain open. |
| V2-015 post-fix source check | Pass | Contact endpoint validates email and enforces field caps before lead metadata logging and email delivery; `node --check server/index.js` passed. |
| V2-019 post-fix source check | Pass | Gallery media is displayed in the single-column responsive layout, with bounded heights at ≤900 px and ≤600 px. Local 390 px browser check confirmed two loaded gallery images in visible layout; broader width/crop review remains open. |
| V2-009 post-fix source check | Pass | `/old-home` navigates to `/`; `/de/old-home` continues to navigate to `/de`; no Home V1 import remains. Local browser confirmed the English redirect. |
| Homepage video | Vimeo player and adaptive media requests observed on initial load | Confirms V2-002 direction; transfer size approximately 20 MB for observed video ranges, not a repeatable benchmark. |
| Local Vite startup | Blocked: missing `@rollup/rollup-darwin-arm64` | Not repaired because `CLAUDE.md` warns against dependency mutation in this SMB-shared checkout. |
| Local Vite runtime workaround | Pass | Started Vite with the exact optional Darwin Rollup and esbuild packages unpacked under `/tmp`; repository dependencies were not changed. |
| V2-001 fresh local reject path | Pass | On `http://127.0.0.1:5173/`, rejected consent and inspected resource entries: no Google Analytics, Google Tag Manager, Meta/Facebook, Clarity, AdSense, DoubleClick, or Vimeo requests. Accept path and deployed behavior remain unverified. |
| V2-002 local initial hero | Pass | On the same fresh local homepage before selecting Play, no Vimeo resource was present; the accessible “Play background video” control remained available. Playback/transfer after selection was not exercised. |
| V2-003 legal page controls | Pass | `/privacy` rendered at mobile width without a language switcher. Head-tag alternates were not inspected in this browser pass. |
| V2-009 legacy route | Pass | Direct navigation to `/old-home` settled at `/` and rendered the current homepage title. German redirect remains source-verified only. |
| V2-011 mobile drawer | Partial pass | At 390 px, the drawer exposed a “Navigation menu” dialog; Escape closed it and focus returned to “Open menu.” Tab wrapping and assistive-technology behavior were not exercised. |
| V2-012 mobile homepage offer | Pass | At 390×844, accessibility snapshot exposed the localized hero H1, subhead and contact link in the video hero. Not a multi-width screenshot review. |
| V2-019 mobile service gallery | Pass | At 390 px, `/services/exhibition-gallery` rendered two gallery media containers as `display:block` at 351×242 px; both images loaded. Other service routes and widths remain unverified. |
| V2-002 hero regression (2026-11-16) | Fixed in source; browser check pending deploy | Production hero was empty: native `<video>` had no sources because `VITE_HOME_HERO_VIDEO_BASE_URL` is blank and no MP4s exist. The Vimeo fallback is restored and `tsc --noEmit` and ESLint pass. Vimeo's player returns a JS bot check to curl, so playback can only be confirmed in a browser. Earlier V2-002 rows describe the superseded click-to-play poster design. |
| V2-020/021 gap fixes | Pass, source | `/v2` aliases redirect; coordinate range checks added. Full ESLint and `tsc --noEmit` pass. API syntax is checked when the deploy container starts. |
| Staging contact/pricing/photo-consent delivery | Not exercised | Requires the staging URL and configured test inbox/Supabase/external endpoint; no real personal data submitted. Local isolated contact API and synthetic local photo queue checks are recorded below. |
| V2 metadata ownership and SPA navigation | Pass | Local browser checked direct and in-app EN/DE routes. Page-level SEO is not overwritten by the fallback; fallback clears stale OG/Twitter values, emits one canonical/description, sets document language, and creates localized alternates except on English-only legal routes. `/de/privacy` resolves to localized NotFound metadata without hreflang. Static `index.html` remains generic by the recorded SPA decision. |
| V2 route matrix | Pass | `scripts/verify-routes.mjs` checked canonical EN/DE route families and aliases against local Vite: canonical and alias paths returned HTTP 200/SPA fallback. Browser matrix checked H1, one description/canonical, image load failures, and overflow across routes; this is not a production health check. |
| V2 responsive overflow matrix | Pass, sampled | Local widths 320, 390, 768, 1024 and 1440 px across representative home, service, campaign, contact, pricing, legal, portfolio, consent and NotFound pages showed no horizontal overflow. Full per-route screenshots, zoom and contrast remain open. |
| V2 locale-menu keyboard/focus regression | Pass | Locale selection and Escape return focus to the trigger; closed menu is inert/hidden. Switching EN→DE produced no console errors or warnings. Browser back/forward coverage is still required. |
| V2 photo-consent local pending queue | Pass, synthetic local fixture | A synthetic record with API pointed to a local server remained pending after sync failure and showed retry state. The fixture was removed. The local app was restarted with a localhost API override after a browser preflight to the production origin was blocked; the preflight did not reach POST and no production submission occurred. Staging reload/retry, quota/private-mode and deduplication remain open. |
| V2 contact API request IDs and validation | Pass, local isolated API | With SMTP/Supabase credentials blank, invalid email returned 400 `INVALID_EMAIL`, oversize message returned 413 `FIELD_TOO_LONG`, malformed JSON returned 400 `INVALID_JSON`, and a valid dummy payload returned 500 `EMAIL_CONFIG_MISSING`. Each response's `X-Request-Id` matched its JSON `requestId`; no mail or database delivery was configured. |
| V2 staging form delivery | Blocked pending staging URL | Owner confirmed staging uses a test inbox, but has not provided its URL/browser entry point. No contact, pricing or photo-consent staging record has been submitted or reconciled. |

## Commands and evidence

- `npm run lint` completed successfully.
- `npm run check:images` printed 35 unreferenced images totaling 2.71 MB.
- `npm run dev -- --host 127.0.0.1` initially failed before listening because the optional Darwin Rollup package could not be resolved. A temporary `/tmp` package workaround enabled browser review without changing repository dependencies.
- Production browser capture was taken with the consent prompt unanswered, then viewport changed from 1200 px to 390 px. Network request capture showed pre-choice Meta and Clarity activity and Vimeo video range requests.

## Open verification before closing the audit

1. Run a build and deep-link route matrix from the deployment container, not from this shared mount.
2. For all canonical EN/DE pages: capture title, description, canonical, hreflang, H1, broken images, JS errors and layout at desktop/mobile. Route families and representative matrix are checked; full per-route screenshots remain open.
3. Test navigation, language switching, browser back/forward, anchors, full mobile drawer keyboard flow, reduced motion and 200% zoom. Drawer Tab wrapping and locale focus restoration are verified; zoom/reflow and reduced-motion review remain open.
4. In staging, submit contact, pricing and photo-consent forms; reconcile user success state with SMTP, external endpoint and Supabase records.
5. Record reproducible Lighthouse/Web Vitals and total transferred bytes for a fresh consent-rejected session and an accepted session.
6. Ask the owner to confirm legal language variants, tracker policy, photo-consent retention/deletion rules, pricing endpoint owner, and whether submission IDs can be persisted uniquely. `/old-home` retirement was already approved.
