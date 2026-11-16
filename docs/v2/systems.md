# Systems and shared-feature audit

## Architecture and routes

- Frontend: React 19, TypeScript 5.9, Vite 7, React Router 7. Routes are centralized in `src/App.tsx`; no route-level lazy loading is visible. Page modules and libraries imported by the root route are therefore candidates for a large initial JavaScript graph. Obtain bundle stats before deciding the size impact.
- Shared page systems: `WorkPageLayout` for four services; `AdLandingPage` for seven campaign pages; `TopNav`, locale switcher, footer, metadata helper, consent banner and analytics wrapper are cross-cutting.
- Locale resources are imported eagerly from EN and DE JSON. Missing string translations fall back to English in dev with a warning; missing object translations throw. Audit the DE key parity and content by page before launch.
- Canonical URL, locale prefix, route config, page-level `SEOMeta`, and route component declarations are split across files. Consolidation is recommended (V2-010, 013).

## Integrations and service boundaries

| Service | Current implementation | Risk / evidence |
|---|---|---|
| Contact email | `/api/contact` → Traefik prefix strip → Express `/contact` → SMTP | Required env config and SMTP handshake are checked at startup. Responses include a request ID echoed in a response header and safe logs. Success requires SMTP to accept a configured recipient; this does not prove inbox delivery. Staging reconciliation is still needed. Rate limit is in-memory but bounded; email syntax and field limits are validated (V2-006, 014, 015). |
| Contact persistence | Optional Supabase insert after email send | Best effort: user receives success if SMTP accepted the message even when the Supabase insert fails. Confirm whether this split delivery is intended and how it is reconciled. |
| Pricing request | Browser POST to `VITE_PRICING_FORM_ENDPOINT`; Apps Script branch uses `no-cors` | Missing env var is a hard user-facing failure. Opaque responses cannot confirm a saved record, so the UI can report success without destination-level evidence. Destination owner and test-inbox staging URL are still unknown. |
| Meta CAPI | `/api/track-lead` sends lead to Meta | Contact UI gates call by analytics consent. HTML no longer bootstraps the Pixel; consented initialization is handled by `initializeAnalyticsVendors()` (V2-001). |
| Analytics | GA4 + Clarity + Meta hooks + scroll/form events | Before the fix, Clarity and Meta requests were verified before choice. Source now gates all vendor script injection on affirmative consent; post-deployment network confirmation remains (V2-001). |
| Photo consent | `/api/photo-consent` writes signature and location metadata to Supabase; reverse-geocode uses Overpass/Nominatim | 3x print-resolution canvas, base64 PNG, user-agent/IP/location persistence. Client queue now validates entries, caps storage to 10 records/4 MiB, surfaces pending/retry state, and offers a backup if persistence fails. Server ignores the client submission ID, so duplicate prevention is not guaranteed. Validate retention/privacy copy and idempotency against the actual schema. |
| Geolocation | Browser geolocation, then server-side reverse-geocode | External Overpass/Nominatim dependency can take up to sequential timeouts; UX needs offline/timeout test. Lat/lon are checked for finiteness but not geographic range. |
| SMTP diagnostics | `/smtp-test` token-gated outside dev and rate-limited in process | Ensure production token is set only when needed; validate endpoint is not surfaced publicly in docs/monitoring. |

## Performance and loading

1. **Homepage Vimeo hero:** before the fix, initial load transferred roughly 20 MB of adaptive video segments. Source now uses small local posters and starts the corresponding Vimeo player only after a play action; production transfer/LCP recheck remains (V2-002).
2. **Service galleries:** shared template keeps the hero eager/high priority and lazy-loads below-hero images. Gallery images stack below section copy at widths ≤900 px (V2-005, 019).
3. **Unused image assets:** the audit moved 35 files / 2.71 MB reported by `check:images` to `archive/unused-assets/`, outside the eagerly-globbed image tree (V2-007); checker now reports no unused assets.
4. **Image sizes and layout stability:** project checklist asks for dimensions/aspect-ratio. A complete image audit by page and CLS measurement has not been done. Current source tree is ~19 MB locally, 176 WebP files; 18 WebP files exceed 200 KB. File size alone does not show which are initial viewport assets.
5. **Initial JS:** root imports all page components directly. No route-level `lazy()` or `Suspense` exists in `App.tsx`; quantify with deployment build bundle report before changing.
6. **Animation work:** GSAP appears in home, legacy home, portfolio, about, shared work and landing template. Several files include reduced-motion CSS, but source inspection has not verified every animation setup checks preference. Test reduced motion and script-disabled content visibility.
7. **Third-party work:** Google, Meta, Clarity, Vimeo, Overpass and Nominatim add network and privacy dependencies. Delay nonessential scripts and measure cold/warm starts on mobile.

## Navigation and usability

- Top nav is shared but links vary by page. Mobile drawer has modal semantics, Tab/Shift+Tab trapping, Escape, body scroll lock and focus restoration. A local keyboard pass verified these behaviors; assistive-technology review remains open.
- `/v2` is an alias rendering the same homepage without redirect; `/de/v2` likewise. This can create duplicate URLs/canonical drift.
- Root skip link is in the accessibility tree, but appears at a negative viewport y until focused, which is normal visually; verify focus style on keyboard.
- Before the fix, the mobile homepage first viewport showed a full-screen decorative video with no offer text. Source now overlays localized H1/subhead/primary CTA on the mobile poster; screenshot validation remains (V2-012).
- Consent banner takes a small fixed area at bottom on mobile, but focus management and keyboard dismissal were not inspected.

## Accessibility

- `id="main"`, skip link and reduced-motion CSS are included in project conventions. Lint passes but does not establish WCAG conformance.
- Mobile drawer has modal semantics and a Tab focus trap; keyboard behavior was exercised locally, while screen-reader review remains (V2-011).
- Locale menu now restores focus after selection/Escape and makes the closed menu inert; local locale-switch checks had no console warnings.
- `LocationAutocomplete` renders a listbox and keyboard arrows/Enter/Escape, but the input does not expose combobox/listbox active-descendant relationships. It may be difficult for screen readers to understand suggestions.
- `SignaturePad` supports pointer drawing and clear action. No keyboard alternative for creating a signature is evident; confirm legal/operational requirements and offer an accessible non-drawing consent path if appropriate.
- Check color contrast, target sizes, zoom/reflow, form error live regions, headings, alt text and focus visibility across all page families.

## Security and resilience notes

- Positive controls found: CORS allowlist, one trusted proxy hop, honeypot, timing-safe SMTP token check, generic API error handler, JSON size cap, API endpoint rate limits.
- Rate limiting currently lives in process memory; maps now cap at 10,000 IP keys and prune stale records (V2-006). Compose defines one API container. Restart resets remain; use a shared store before adding replicas.
- Contact endpoint logs IP and lead metadata; signature endpoint stores IP, user-agent, geolocation, signature PNG and name/location. Confirm retention, access, deletion and least-privilege policies with service owners.
- Reverse-geocode accepts finite but out-of-range coordinates; add geographic bounds before making external requests.
- Contact email syntax/field caps are implemented (V2-015). Consider idempotency/replay controls for duplicate form posts and protect PII in logs.
- `docker-compose.traefik.yml` is not audited here for secret exposure or full routing; inspect deployment configuration and production headers in the remediation pass.

## Dead-code review

- **Live component:** `src/components/AdLeadForm.tsx` is imported/rendered by `AdLandingPage.tsx` and enabled in six campaign page configs; the prior dead-code candidate was a false positive (V2-008).
- **Retired:** `src/pages/Home.tsx` was removed after `/old-home` was changed to redirect to the current homepage (V2-009). `Home.css` remains imported by `PricingSection`.
- **Not dead:** `src/pages/AdLandingPage.tsx`, `AdLeadForm`, and `ImageCarousel` are used by campaign routes.
- **Asset dead code:** the 35 orphan images were moved outside the shipped asset glob; `npm run check:images` now passes (V2-007).
- **Unverified:** this pass did not run a full import graph or TypeScript build; more unused exports/CSS may remain.
