# V2 pre-flight — owner to-do

Everything that still needs **you** after the 2026-11-16 remediation pass, in the order to do it. IDs link to [issues.md](./issues.md), which has the evidence for each. Items Claude could do alone are done and logged at the bottom.

## 1. Deploy

- [ ] **Run `scripts/deploy.sh all`** (not just `frontend`). Since the last `all`, the API changed twice: the dependency fixes (V2-027: `express` 4.22.3, `nodemailer` 10.6.0) and idempotent photo-consent saves (V2-016). Both need `exposeu-contact` restarted.
- [ ] Afterwards, send one real message through `/contact` to your own inbox. It's the first live send on `nodemailer` 10, which was only tested against a local mail sink.

## 2. Review by eye (production)

- [ ] **V2-026 Light mode:** check every page family in both themes. (Portfolio thumbnail text is now white, fixed from your first review; campaign/RCK/pricing hero headlines too.) In particular:
  - the hard edge where a dark campaign / Release Content Kit hero meets the light page (in dark mode it fades)
  - the homepage nav: white over the video, then dark text on a light frosted bar after scrolling (desktop and phone)
  - the theme and language buttons beside the menu button on phones
- [ ] **V2-002 Hero video:** the homepage plays the Vimeo background players. Confirm that's fine until step 5.
- [ ] **V2-018 Per-route look** at phone, tablet and desktop widths. Automated reflow (320 px and 200% zoom) and contrast scans already pass, so this is a design check only.

## 3. Decisions (you / legal)

- [ ] **V2-001 AdSense:** AdSense loads with the same "Accept" as analytics. Keep that, or give ads their own choice?
- [ ] **V2-018 Signature:** `/consent` only accepts a drawn signature. Is a non-drawing alternative (typed name + checkbox, or staff-assisted) acceptable? Claude builds it once decided.
- [ ] **Photo-consent data policy:** signatures store name, signature PNG, IP, user agent and location. Decide retention, deletion and access, and confirm the on-page wording.
- [ ] **Contact persistence:** a message counts as sent once SMTP accepts it, even if the Supabase log insert fails. Keep that?
- [ ] **V2-010 Link previews:** the site is client-rendered, so shared links show the generic preview. Do per-page previews matter (that needs prerendering)?
- [ ] **V2-004 Pricing endpoint:** who owns the Google Apps Script destination? Its `no-cors` mode can't confirm a save. Choose between an endpoint that returns a readable response and routing pricing requests through the contact API (Claude can build the latter).

## 4. Staging (send Claude the staging URL + test inbox)

- [ ] **V2-014 Contact:** reconcile a staging submission (request ID) with the test inbox and Supabase, including the error and duplicate paths.
- [ ] **V2-025 / V2-004 Pricing:** a staging request lands on `/pricing-request/success` with no console error and reaches its destination.
- [ ] **V2-016 Photo consent:** go offline → sign → back online and reload; check exactly one row appears. Also try private mode / storage full.

## 5. Media / infrastructure

- [ ] **V2-002 First-party hero video:**
  1. Export landscape + portrait MP4s (H.264, faststart, no audio, ~2–4 / ~1.5–2.5 Mbps).
  2. Upload them as `home-hero-desktop-v1.mp4` / `home-hero-mobile-v1.mp4` to R2 behind a custom domain with long cache headers.
  3. Set `VITE_HOME_HERO_VIDEO_BASE_URL` in the build env and deploy. The hero switches from Vimeo automatically.
- [ ] **V2-006 Shared rate limiter:** only needed before running more than one `exposeu-contact` container.

## 6. Assistive tech

- [ ] **V2-018 Screen reader** (VoiceOver on Mac/iPhone, NVDA on Windows if available): cookie banner, mobile menu, the `/consent` location field (V2-023), form errors on contact/pricing/campaign/consent, and the signature label.

---

## Done by Claude this pass (no action needed)

- V2-001 consent gating verified on production: nothing before a choice or after Reject; all vendors after Accept (requests aborted, no analytics pollution).
- V2-016 idempotent consent retries: the client UUID is the row id and duplicates return `ok` (live schema checked read-only; tested on a mock, no rows written).
- V2-024 closed: lazy-loading German saves only 13 kB gzip and would slow German visitors.
- V2-027 dependency advisories: the critical and all runtime advisories are fixed. The 7 dev-only typescript-eslint moderates are left (their "fix" is a downgrade).
- Tidy-ups reviewed and left as-is on purpose:
  - Splitting `Home.css` saves nothing now that the homepage imports it into the main stylesheet.
  - The old light-mode rules are harmless.
