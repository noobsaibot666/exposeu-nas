# Route and page audit

This is the source-of-truth route map from `src/App.tsx`, grouped by rendered page family. “EN/DE” denotes two explicit routes. Redirect aliases are covered in the final section. Visual inspection was performed only on the deployed homepage; all other observations below come from source review unless stated otherwise.

## Page families

| Page / route | EN | DE | Shared implementation | Audit status |
|---|---|---|---|---|
| Homepage | `/` | `/de` | `HomeV2.tsx` | Hero video: native MP4 when R2 is configured, otherwise viewport-matched Vimeo background player (V2-002). Mobile heading and CTA are in the hero (V2-012). |
| Previous homepage | `/old-home` | `/de/old-home` redirects to `/de` | Redirect to current HomeV2 | Legacy EN/DE links now resolve to current localized homepage; Home V1 component retired (V2-009). |
| About | `/about` | `/de/about` | `About.tsx` | Source-reviewed; runtime layout/content unverified. |
| Contact session booking | `/call-session` | `/de/call-session` | `CallSession.tsx` | Source-reviewed; booking destination/availability behavior needs smoke. |
| Release Content Kit | `/release-content-kit` | `/de/release-content-kit` | `ReleaseContentKit.tsx` | Source-reviewed; animation and CTA runtime unverified. |
| Exhibition landing | `/exhibition-gallery` | `/de/exhibition-gallery` | `AdLandingPage.tsx` | Source-reviewed shared campaign template. |
| Brand/agency landing | `/brand-agency` | `/de/brand-agency` | `AdLandingPage.tsx` | Source-reviewed shared campaign template; distinct from service page. |
| Pop-ups landing | `/popups` | `/de/popups` | `AdLandingPage.tsx` | Source-reviewed shared campaign template. |
| Gallery/museum landing | `/gallery-museum-documentation` | `/de/gallery-museum-documentation` | `AdLandingPage.tsx` | Source-reviewed shared campaign template. |
| Artist/musician landing | `/artist-musician-documentation` | `/de/artist-musician-documentation` | `AdLandingPage.tsx` | Source-reviewed shared campaign template. |
| Concerts Berlin landing | `/concerts-berlin` | `/de/concerts-berlin` | `AdLandingPage.tsx` | Source-reviewed shared campaign template. |
| Contact | `/contact` | `/de/contact` | `Contact.tsx` | Source reviewed; API success path and mail receipt not tested. Consent gates Meta CAPI/client conversion calls. |
| Contact success | `/contact-success` | `/de/contact-success` | `ContactSuccess.tsx` | Direct route exists; verify it cannot falsely imply successful submission when opened directly. |
| Concerts & events service | `/services/concerts-events` | `/de/services/concerts-events` | `WorkPageLayout.tsx` | Shared template; gallery lazy-loaded, stacked on mobile (V2-005, 019). |
| Exhibition & gallery service | `/services/exhibition-gallery` | `/de/services/exhibition-gallery` | `WorkPageLayout.tsx` | Shared template; gallery lazy-loaded, stacked on mobile (V2-005, 019). |
| Artist sessions service | `/services/artist-sessions` | `/de/services/artist-sessions` | `WorkPageLayout.tsx` | Shared template; gallery lazy-loaded, stacked on mobile (V2-005, 019). |
| Brand/agency service | `/services/brand-agency` | `/de/services/brand-agency` | `WorkPageLayout.tsx` | Shared template; gallery lazy-loaded, stacked on mobile (V2-005, 019). |
| Portfolio | `/portfolio` | `/de/portfolio` | `Portfolio.tsx` | Source reviewed; image/video interactions and filtering not runtime-tested. |
| Pricing request | `/pricing-request/:plan` | `/de/pricing-request/:plan` | `PricingRequest.tsx` | External endpoint required; configuration/delivery unknown (V2-004, 014). Unknown plan falls back to generic copy. |
| Pricing request success | `/pricing-request/success` | `/de/pricing-request/success` | `PricingRequestSuccess.tsx` | Route is declared after dynamic `:plan`; React Router ranks static route higher, but direct/open behavior needs runtime validation. |
| Impressum | `/impressum` | `/de/impressum` | `Impressum.tsx` | Source reviewed; legal content accuracy is outside technical verification. |
| Privacy | `/privacy` | **intentionally unavailable** | `Privacy.tsx` | English-only; locale switch and language alternates suppressed (V2-003). |
| Terms | `/terms` | **intentionally unavailable** | `Terms.tsx` | English-only; locale switch and language alternates suppressed (V2-003). |
| Data deletion | `/data-deletion` | **intentionally unavailable** | `DataDeletion.tsx` | English-only; locale switch and language alternates suppressed (V2-003). |
| Photo consent | `/consent` | no `/de/consent` route | `PhotoConsent.tsx` | Own EN/DE switch is internal; offline queue, geolocation, canvas, and Supabase persistence need device/API validation (V2-016). Global locale switch intentionally hidden. |
| Not found | `*` | `*` | `NotFound.tsx` | Source reviewed; direct unknown route and link recovery not smoke-tested. |

## Legacy redirects

| Alias routes | Destination | Notes |
|---|---|---|
| `/de/old-home` | `/de` | Old homepage collapses to V2. |
| `/services/performance`, `/de/services/performance`, `/performance`, `/de/performance`, `/atmospheric`, `/de/atmospheric`, `/services/atmospheric-films`, `/de/services/atmospheric-films` | corresponding EN/DE concerts-events service | Multiple historic names converge on one service. |
| `/services/gallery-stories`, `/de/services/gallery-stories`, `/gallery-stories`, `/de/gallery-stories`, `/documentation`, `/de/documentation`, `/exhibitions`, `/de/exhibitions` | corresponding EN/DE exhibition-gallery service | Legacy naming still supported. |
| `/services/fashion-show`, `/de/services/fashion-show`, `/fashion-show`, `/de/fashion-show` | corresponding EN/DE brand-agency service | Legacy naming still supported. |
| `/artist-sessions`, `/de/artist-sessions` | corresponding EN/DE artist-sessions service | Short alias. |
| `/v2`, `/de/v2` | `/`, `/de` | Redirects (V2-020); previously a duplicate homepage. |

## Cross-page observations

- Most marketing pages have EN and DE variants; legal pages are English-only and the language switch is hidden there (V2-003).
- Service pages are four thin data wrappers over a shared template, so the lazy gallery behavior affects all four. Gallery media now stacks below the text on mobile/tablet widths (V2-019).
- Seven campaign pages share `AdLandingPage`; fixes there can address several pages at once. `AdLeadForm.tsx` is live on six of them (V2-008).
- Direct URL, browser back/forward, anchor, and redirect behavior were not fully exercised. The repository's route verification scripts are available, but require a running server or only check source structure.
- The app is a client-rendered SPA. Initial HTML contains generic metadata; client metadata is set after mount.
