# V2 audit gap-closure plan

**Goal:** Close the remaining issue IDs with source fixes and reproducible evidence, leaving only items that depend on staging access or owner policy decisions explicitly blocked.

**Approach:** Separate work into five streams: metadata ownership and delivery strategy (V2-010, V2-013), pricing/contact delivery observability (V2-004, V2-014), photo-consent offline recovery (V2-016), route smoke coverage (V2-017), and responsive/accessibility coverage (V2-018). Use the current Vite/React app and Express API; preserve existing external destinations until a staging test confirms replacement behavior. Update `issues.md` and `verification.md` as each acceptance criterion is evidenced.

**Tech stack:** React 19, TypeScript, Vite, React Router, Express, Supabase, SMTP, Playwright browser connector.

## Task 1 — Establish one metadata writer per route (V2-010, V2-013)

**Files:** `src/App.tsx`, `src/i18n/pageMeta.ts`, `src/i18n/pageMetaConfig.ts`, `src/components/SEOMeta.tsx`, page components that render `SEOMeta`, `docs/v2/issues.md`, `docs/v2/verification.md`.

- [x] Inventory routes that render page-level `SEOMeta` and those that use the app fallback.
- [x] Ensure the app fallback does not overwrite a page-level metadata owner on the same route.
- [x] Verify exactly one canonical, description, title, and alternate set after direct navigation and SPA navigation, including English-only legal pages.
- [x] Record the rendering strategy decision. Keep the current client-rendered SPA through this remediation pass and document the generic static social-preview limitation.

## Task 2 — Make pricing and contact delivery observable (V2-004, V2-014)

**Files:** `src/pages/PricingRequest.tsx`, `server/index.js`, `src/pages/Contact.tsx`, `.env.example`, `docs/v2/systems.md`, `docs/v2/issues.md`, `docs/v2/verification.md`.

- [ ] Confirm the configured pricing destination and use only a staging sink for synthetic submissions. User confirmed test-inbox behavior; staging URL is still required.
- [ ] Remove success-on-opaque-response behavior; pending staging endpoint contract and destination confirmation.
- [x] Add a request correlation identifier to contact API responses and safe server logs without logging submitted message/signature content.
- [ ] Exercise validation, success, downstream failure and duplicate submission paths against staging; reconcile the synthetic records with their destinations.

## Task 3 — Harden photo-consent offline recovery (V2-016)

**Files:** `src/pages/PhotoConsent.tsx`, `server/index.js`, `docs/v2/systems.md`, `docs/v2/issues.md`, `docs/v2/verification.md`.

- [x] Validate persisted queue entries and bound queue size and serialized storage use.
- [x] Show an accurate recovery state when local storage is unavailable/full; never imply that a record was queued when persistence failed.
- [ ] Preserve stable submission IDs across retries if the deployed database schema supports idempotent inserts; schema compatibility is not available in this checkout.
- [ ] Exercise reload/online retry, storage failure and duplicate retry with synthetic records; document retention and device-local behavior. Local offline queue state was verified; staging and storage-failure cases remain open.

## Task 4 — Complete route smoke coverage (V2-017)

**Files:** `src/App.tsx`, `scripts/verify-routes.mjs` or a new read-only route audit script, `docs/v2/pages.md`, `docs/v2/issues.md`, `docs/v2/verification.md`.

- [x] Enumerate canonical English and German routes, aliases and redirects from the router.
- [x] Check direct-load status, title, H1, broken images, console errors and navigation outcomes for every page family locally.
- [x] Run route checks against the local app; externally dependent flows remain staging-only.

## Task 5 — Complete responsive/accessibility coverage (V2-018)

**Files:** affected page and shared component styles only where reproducible issues are found; `docs/v2/pages.md`, `docs/v2/issues.md`, `docs/v2/verification.md`.

- [ ] Inspect representative routes at 320, 390, 768, 1024 and 1440 px, including 200% zoom/reflow and reduced-motion settings.
- [x] Verify menu keyboard operation and focus wrapping/restoration; broader consent controls, form errors, focus visibility and page landmarks remain open.
- [x] Fix the confirmed locale-menu focus warning and document remaining owner/legal-policy decisions without claiming conformance.
