# Pricing — parked for a later phase

Owner decision 2026-11-16: everything pricing-related moves to its own phase. This folder collects what exists, what's broken or missing, and what to decide when that phase starts. Nothing here blocks V2.

## How pricing works today

| Piece | Where | Notes |
|---|---|---|
| Base tiers | `src/data/pricingTiers.ts` | Three tiers (`single-event`, …). |
| Per-service price overrides | `src/data/pricingByService.ts` | Merged into the tiers at render time. |
| Pricing cards | `src/sections/PricingSection.tsx` | Rendered on the four service pages (`WorkPageLayout`) and the homepage. Styles come from the legacy `src/pages/Home.css` (1,073 lines) plus `HomeV2.css`. |
| Request form | `src/pages/PricingRequest.tsx` → `/pricing-request/:plan?service=` | Clicking a tier opens it. |
| Success page | `src/pages/PricingRequestSuccess.tsx` → `/pricing-request/success` | Shown only straight after a real submission (V2-029). |
| Copy | `src/locales/{en,de}/forms.json` → `pricing.*`, `common.json` → `meta.pricingRequest` / `pricingSuccess` | EN/DE parity verified. |

**Delivery (since 2026-11-16, V2-030):** the form posts to the contact API (`/api/contact`). Requests arrive as an email (`Expose.u Lead - Pricing request: <coverage type>`) and as a `contact_submissions` row with `package`, `package_label`, `service` and `service_label`. The visitor sees success only when the API confirms. Verified on production.

## Known issues to handle in the pricing phase

1. **Lost requests before 2026-11-16 (V2-030).** The Google Apps Script endpoint (`VITE_PRICING_FORM_ENDPOINT`) answered **403 "access denied"** to every public request, while the form showed success. Every pricing request until the fix was discarded. Check Analytics for `/pricing-request/*` visits and follow up where possible.
2. **The Google Sheet copy is still broken.** The form still sends a best-effort copy to the Apps Script. To make the sheet work again: Apps Script → Deploy → Manage deployments → edit → "Who has access: **Anyone**" → Deploy. Or drop the sheet and remove `VITE_PRICING_FORM_ENDPOINT` (Supabase + email already capture everything).
3. **Unknown plan slugs** (`/pricing-request/anything`) fall back to generic copy instead of a 404 or a redirect. Decide which.
4. **No deduplication:** a double-submit sends two emails/rows (the API rate limit is 5/min per IP). Add an idempotency key like photo consent (V2-016) if that matters.
5. **Unused copy:** `forms.pricing.errors.missingEndpoint` is no longer shown (the endpoint is optional now) and can be removed.
6. **Styling debt:** `PricingSection` depends on the whole legacy `Home.css`. Split the pricing styles into their own stylesheet when the cards are redesigned.
7. **Lead attribution:** pricing requests carry `package` / `service`, but there's no Meta CAPI `Lead` mirror like the contact and campaign forms send (`/api/track-lead`, consent-gated). Add one if ads should count pricing requests as leads.

## Questions to answer when the phase starts

- Should prices be shown publicly at all, or replaced by "request a quote"?
- Are the three tiers still right, and are the per-service overrides current?
- Where should pricing requests live: inbox + Supabase only, or also a CRM / the sheet?
- Should a pricing request go straight to a booking/call link (`/call-session`)?
