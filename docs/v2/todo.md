# V2 pre-flight — open items

Everything still open after the 2026-11-16 remediation pass, for owner review. Items are grouped by what unblocks them. IDs link to [issues.md](./issues.md), which has the full evidence for each.

## Needs owner review (by eye)

- [ ] **V2-026 Light mode.** Review every page family in both themes. Look in particular at:
  - the hard edge where a dark campaign / Release Content Kit hero meets the light page (it was a fade-to-background in dark mode)
  - the homepage nav switching from white (over the video) to dark text on a light frosted bar after scrolling, on desktop and phone
  - the theme and language buttons beside the menu button on phones
- [ ] **V2-002 hero fallback.** The homepage hero plays the Vimeo background players; confirm you're happy keeping that until R2 is ready.

## Needs a decision from the owner / legal

- [ ] **V2-018 Signature accessibility.** `/consent` only accepts a drawn signature. Decide whether a non-drawing alternative (typed name + checkbox, or staff-assisted) is acceptable before building one.
- [ ] **V2-001 AdSense grouping.** AdSense loads with the same "Accept" as analytics. Confirm that's the intended policy.
- [ ] **Contact persistence.** A contact submission counts as successful once SMTP accepts it, even if the Supabase log insert fails. Confirm that split is intended.
- [ ] **Photo-consent data policy.** Signatures store name, signature PNG, IP, user agent and location. Define retention, deletion and who can access them, and confirm the on-page wording.
- [ ] **V2-010 Social previews.** The site stays a client-rendered SPA, so link previews show the generic `index.html` metadata. Revisit if per-page previews matter (that needs prerender/SSG).

## Needs staging access (send the staging URL + test inbox)

- [ ] **V2-004 Pricing endpoint.** Confirm the destination owner and receive a staging submission. The Apps Script `no-cors` branch can't confirm success, so pick an endpoint that returns a readable response.
- [ ] **V2-025 Pricing success redirect.** Confirm a staging submission lands on `/pricing-request/success` with no console error (fixed in source).
- [ ] **V2-014 Contact delivery.** Reconcile a staging submission (request ID) with the test inbox and Supabase. Exercise validation, downstream-failure and duplicate paths.
- [ ] **V2-016 Photo-consent retries.** Check whether the Supabase schema can store a unique client submission ID (needed for idempotent retries). Test reload/online retry, private-mode/quota failure and duplicate retry.
- [ ] **V2-001 Accept path on production.** Accept consent on production and confirm the vendors load only then; re-check the reject path.

## Needs media / infrastructure

- [ ] **V2-002 First-party hero video.** Export landscape + portrait MP4s (H.264, faststart, no audio, ~2–4 / ~1.5–2.5 Mbps). Upload as `home-hero-desktop-v1.mp4` / `home-hero-mobile-v1.mp4` to R2 behind a custom domain with long cache headers, then set `VITE_HOME_HERO_VIDEO_BASE_URL` in the build env. Verify first frame, range requests and mobile autoplay.
- [ ] **V2-006 Shared rate limiter.** The API rate limits are per process (fine for the single `exposeu-contact` container). Move them to a shared store before adding API replicas.
- [x] **Dependencies (V2-027).** Done in source: the critical and every runtime advisory are fixed (see issues.md). **Deploy with `scripts/deploy.sh all`** so `exposeu-contact` restarts on the new `express`/`nodemailer`. Remaining: 7 moderate typescript-eslint advisories, dev-only; their "fix" is a downgrade, so they're left alone.

## Needs a real browser / assistive tech

- [ ] **V2-018 Screen-reader pass** (VoiceOver + NVDA): cookie banner, mobile drawer, location combobox (V2-023), form errors on contact/pricing/campaign/consent, signature label.
- [ ] **V2-018 Per-route screenshot review** at 320/390/768/1024/1440. Automated reflow (320 px and 200% zoom) and contrast scans already pass.

## Optional / later

- [ ] **V2-024 Main bundle 522 kB (170 kB gzip).** Lazy-loading the inactive locale JSON is the only sizeable saving left. Measure homepage LCP/TBT first.
- [ ] **Tidy-ups:**
  - `PricingSection` still imports the whole legacy `Home.css` (1,073 lines); split out the pricing styles.
  - Leftover pre-2026 light rules (`[data-theme='light'] .home__background`, `.top-nav__theme`) target elements that no longer render.
