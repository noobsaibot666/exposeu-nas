# Consent & Measurement — Action Plan

Goal: maximize **lawful** data collection (GDPR/ePrivacy-compliant). No item here relies on misleading banner copy or on collecting data without a valid legal basis — those approaches create fines/legal exposure, not durable measurement gains.

## Status quo (already done)

- [x] GA4 loads immediately via Advanced Consent Mode (`gtag('consent','default',{...denied})` before `gtag.js` loads) — sends anonymous, cookieless pings pre-consent, upgrades to full tracking post-consent.
- [x] `trackPageView()` fires unconditionally; not gated behind app-level consent on top of Consent Mode.
- [x] First-touch UTM/click-IDs persisted in `sessionStorage` and forwarded on every page view, including the re-fire that happens right when consent is granted.

## To do

1. **Gate Meta Pixel behind consent.** It currently fires unconditionally in `index.html` with zero consent check, setting the `_fbp` identifier cookie before any user decision. Wire `fbq('init', ...)` / `fbq('track','PageView')` to the same consent state as GA4 (Meta's Limited Data Use flag, or delay init until `ad_storage`/marketing consent is granted).
2. **Fix the banner-vs-policy mismatch.** The Privacy Policy discloses "Advertising data via Meta Pixel"; the banner copy only mentions "analytics" and never asks about advertising/marketing use. Split consent into two categories — Analytics and Advertising — so what's asked for matches what's disclosed and what's actually collected.
3. **Rewrite banner copy to be accurate, not just reassuring.** State plainly what is and isn't collected per category (e.g. "Analytics: aggregated usage data, no ad tracking" / "Advertising: Meta Pixel, used to measure ad performance"). Do not claim "no personal data is collected" — it's false today (IP, device signals, Meta identifiers).
4. **Decide whether to extend Advanced-Consent-Mode-style cookieless measurement to custom events.** `sendEvent()` (scroll depth, engagement timers, CTA clicks) is still fully blocked pre-consent rather than degrading to cookieless pings like page views do. Low priority — page_view/conversion signals matter far more to modeling than engagement pings, so evaluate before investing here.
5. **Confirm GA4 property settings support this model.** Check Admin → Data Settings → Data Collection: Consent Mode / behavioral & conversion modeling should be enabled so the cookieless pings sent pre-consent are actually used, not discarded.
6. **Re-audit after each change** using the incognito UTM test (`?utm_source=...`) + DebugView, checking that campaign data survives both the pre/post-consent transition and in-session navigation.
