# Phase 3: Analytics Tracking

## Integration Detected

- Analytics method: `gtag` / GA4 via `index.html`
- `window.dataLayer` is present as part of the same GA setup
- No GTM container detected
- No third-party consent manager detected in the repo

## Consent Gating

- Tracking only fires when analytics is installed and consent is explicitly granted.
- A minimal analytics consent banner is mounted globally in the app shell.
- Consent storage key: `localStorage.__analyticsConsent`
- Consent is accepted from:
  - `window.__analyticsConsent === true`
  - `localStorage.__analyticsConsent === "true"`
  - known localStorage keys such as `analytics_consent`
  - known cookie keys such as `analytics_consent`
- If `localStorage.__analyticsConsent === "false"`, analytics remains blocked.
- If consent is not present, analytics calls no-op safely and the banner is shown.

## Consent Banner (Phase 5)

- Component: `src/components/AnalyticsConsentBanner.tsx`
- Styles: `src/components/AnalyticsConsentBanner.module.css`
- Storage key: `localStorage.__analyticsConsent`
- Behavior:
  - no stored value: banner is shown
  - `true`: sets `window.__analyticsConsent = true` and keeps the banner hidden
  - `false`: sets `window.__analyticsConsent = false` and keeps the banner hidden
  - `Accept`: enables analytics and persists consent
  - `Reject`: keeps analytics disabled and persists the rejection

## QA / Debug

- Enable dev consent on localhost or in development:
  - run `localStorage.__analyticsConsent = "true"` in the browser console
  - reload the page
- Enable analytics debug logging:
  - run `localStorage.__analyticsDebug = "true"` in the browser console
  - reload if you want page-view events to appear from first paint
- Disable either flag:
  - `delete localStorage.__analyticsConsent`
  - `delete localStorage.__analyticsDebug`
- GA4 DebugView test flow:
  - open the site locally with both flags enabled
  - open GA4 DebugView for the property
  - navigate page by page and confirm each event appears once with the expected params
  - verify blocked state by deleting `__analyticsConsent` and reloading
- Suggested QA checklist:
  - clear `localStorage.__analyticsConsent`, reload, and confirm the banner appears
  - click `Reject`, reload, and confirm the banner stays hidden and events do not fire
  - click `Accept`, reload, and confirm the banner stays hidden and events fire
  - confirm the stored choice persists across reloads
  - `/`: confirm `home_view`, scroll thresholds, hero/footer CTA clicks, and service card clicks
  - `/home-redesign`: confirm `home_redesign_view`, scroll thresholds, hero/footer CTA clicks, and service card clicks
  - one service page such as `/documentation`: confirm `service_view`, `service_scroll_50`, `service_scroll_75`, `service_pricing_view`, `service_tier_click`, and `service_cta_click`
  - `/pricing-request`: confirm `pricing_request_view`, `pricing_request_plan_select`, and `pricing_request_cta_click`
  - `/contact`: confirm `contact_view`, `contact_form_start`, `contact_form_abandon`, and either `contact_form_submit_success` or `contact_form_submit_error`
  - start the contact form, then close the tab or navigate away without submitting: `contact_form_abandon` should fire once
  - start and submit successfully: `contact_form_abandon` should not fire

## Events and Parameters

- Global params when available:
  - `page_path`
  - `page_title`
  - `source_url`
  - `referrer`

- Home (`/`)
  - `home_view`
  - `home_scroll_25`
  - `home_scroll_50`
  - `home_scroll_75`
  - `home_scroll_90`
  - `home_cta_click`
    - `cta_label`
    - `cta_location`
  - `home_service_card_click`
    - `service_slug`
    - `card_position`

- Home redesign (`/home-redesign`)
  - `home_redesign_view`
  - `home_redesign_scroll_25`
  - `home_redesign_scroll_50`
  - `home_redesign_scroll_75`
  - `home_redesign_scroll_90`
  - `home_redesign_cta_click`
    - `cta_label`
    - `cta_location`
  - `home_redesign_service_card_click`
    - `service_slug`
    - `card_position`

- Service pages
  - `service_view`
    - `service_slug`
    - `service_label`
  - `service_scroll_50`
    - `service_slug`
    - `service_label`
  - `service_scroll_75`
    - `service_slug`
    - `service_label`
  - `service_pricing_view`
    - `service_slug`
  - `service_tier_click`
    - `service_slug`
    - `tier_id`
    - `tier_label`
  - `service_cta_click`
    - `service_slug`
    - `service_label`
    - `cta_label`
    - `cta_location`

- Pricing request
  - `pricing_request_view`
    - `tier_id`
    - `tier_label`
    - `service`
    - `serviceLabel`
  - `pricing_request_plan_select`
    - `tier_id`
    - `tier_label`
    - `service`
    - `serviceLabel`
  - `pricing_request_cta_click`
    - `cta_label`
    - `tier_id`
    - `tier_label`
    - `service`
    - `serviceLabel`

- Contact funnel
  - `contact_view`
    - `service`
    - `serviceLabel`
    - `package`
    - `packageLabel`
  - `contact_form_start`
    - `service`
    - `serviceLabel`
    - `package`
    - `packageLabel`
  - `contact_form_abandon`
    - `service`
    - `serviceLabel`
    - `package`
    - `packageLabel`
  - `contact_form_submit_success`
    - `service`
    - `serviceLabel`
    - `package`
    - `packageLabel`
  - `contact_form_submit_error`
    - `error_type`
    - `service`
    - `serviceLabel`
    - `package`
    - `packageLabel`

## Where Events Fire

- `src/utils/analytics.ts`
  - central tracking utility
  - consent gating
  - stored consent initialization
  - scroll-depth hook
  - element-view hook

- `src/components/AnalyticsConsentBanner.tsx`
  - global accept / reject consent UI

- `src/components/AnalyticsConsentBanner.module.css`
  - scoped consent banner styles

- `src/pages/Home.tsx`
  - home view
  - home scroll thresholds
  - home CTA clicks
  - home service card clicks

- `src/pages/HomeRedesign.tsx`
  - redesign view
  - redesign scroll thresholds
  - redesign CTA clicks
  - redesign service card clicks

- `src/pages/WorkPageLayout.tsx`
  - service page view
  - service page scroll thresholds
  - service footer CTA clicks

- `src/sections/PricingSection.tsx`
  - pricing section view
  - tier click events

- `src/pages/PricingRequest.tsx`
  - pricing request view
  - plan intent on page load
  - pricing request CTA click on submit attempt

- `src/pages/Contact.tsx`
  - contact view
  - contact form start
  - contact form abandon on tab close / navigation away after start
  - contact submit success
  - contact submit error

- `server/index.js`
  - minimal structured contact lead metadata logging
  - no message content logged

## QA Checklist

- Events fire once where intended per page view
- Scroll thresholds fire once per page view
- Pricing section visibility fires once on service pages
- Contact funnel events include service/package context when present
- Contact abandonment fires once only after form start and never after submit success
- No console errors from analytics utility when consent is absent
- Build passes

## Known Limitations

- Build and browser QA were not completed in this shell because Docker and interactive sudo access are unavailable.
- Users can change consent later by clearing `localStorage.__analyticsConsent` until a dedicated preferences control is added.
