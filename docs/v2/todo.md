# V2 pre-flight — owner to-do

Only what still needs **you**, in the order to do it. Everything Claude could do alone is finished (31 issues; evidence in [issues.md](./issues.md) and [verification.md](./verification.md)) and summarised at the bottom. IDs link to issues.md.

## 1. Deploy and check your inbox

- [ ] **Run `scripts/deploy.sh frontend`** for the last fixes: German homepage/Portfolio titles, the 404 hidden from search (V2-031), the photo-only lightbox fix and the ads-only `noindex`. The API is already up to date.
- [ ] **Inbox:** you should have two emails marked "TEST — please ignore", one from the contact form and one from the pricing form (Claude's live tests). If either is missing, tell Claude.

## 2. Review by eye (production)

- [ ] **V2-026 Light mode:** check every page family in both themes. In particular:
  - the hard edge where a dark campaign / Release Content Kit hero meets the light page (in dark mode it fades)
  - the homepage nav: white over the video, then dark text on a light frosted bar after scrolling (desktop and phone)
  - the theme and language buttons beside the menu button on phones
- [ ] **V2-028 Pop-up films:** open Leonis Work & Liquidrom, SANAM and Gleo (Vimeo) and Lick the walls (YouTube). Each film should fade in over its cover within a second or two. If one stays on the cover with a "Watch the film on …" link, tell Claude which project and browser. (Vimeo blocks automated browsers, so only you can confirm the live Vimeo path.)
- [ ] **V2-002 Hero video:** the homepage plays the Vimeo background players. Confirm that's fine until step 5.
- [ ] **V2-018 Overall look** at phone, tablet and desktop widths. Reflow, zoom and contrast already pass automatically, so this is a design check only.

## 3. Pricing follow-ups (V2-030)

- [ ] **Lost requests:** until today every pricing request was silently discarded (the Google Apps Script refused them). If Analytics shows recent visits to `/pricing-request/*`, those people never reached you; consider following up through other channels.
- [ ] **Optional, Google Sheet:** pricing requests now reach your inbox and Supabase. If you also want them in the sheet, open the Apps Script and set **Deploy → Manage deployments → edit → "Who has access: Anyone"** → Deploy. Otherwise ignore this.

## 4. Decisions (you / legal); answer Claude and it builds the change

- [ ] **V2-001 AdSense:** it loads with the same "Accept" as analytics. Keep that, or give ads their own choice?
- [ ] **V2-018 Signature:** `/consent` only accepts a drawn signature. Is a non-drawing alternative (typed name + checkbox, or staff-assisted) acceptable?
- [ ] **V2-016 Photo-consent data policy:** signatures store name, signature image, IP, browser and location. How long should they be kept, who may access them, and is the on-page wording right?
- [ ] **Contact persistence:** a message counts as sent once the email is accepted, even if the Supabase log fails. Keep that?
- [ ] **V2-010 Link previews:** shared links show the generic site preview, not per-page ones. Does that matter (fixing it needs prerendering)?

## 5. Media (when you have it)

- [ ] **V2-002 First-party hero video:**
  1. Export landscape + portrait MP4s (H.264, faststart, no audio, ~2–4 / ~1.5–2.5 Mbps).
  2. Upload them as `home-hero-desktop-v1.mp4` / `home-hero-mobile-v1.mp4` to R2 behind a custom domain with long cache headers.
  3. Set `VITE_HOME_HERO_VIDEO_BASE_URL` in the build env and deploy. The hero switches from Vimeo automatically; this is the biggest remaining homepage speed win.

## 6. Assistive tech

- [ ] **V2-018 Screen reader** (VoiceOver on Mac/iPhone; NVDA on Windows if available): cookie banner, mobile menu, the `/consent` location field, form errors on contact/pricing/campaign/consent, and the signature label.

## Only if you scale up later

- **V2-006:** API rate limits are per container. Move them to a shared store before running more than one `exposeu-contact` container. Nothing to do today.

---

## Done by Claude (no action needed)

- **Live and verified on production:** consent gating, the contact form on the new email library, photo-consent offline sync with duplicate protection, and the pricing form rerouted to the contact API (was losing every request). Test rows were deleted.
- **Site-wide:** light mode with a working toggle; text stays readable over photos; the nav adapts over video and photos; the lightbox never shows an empty film frame.
- **SEO:** route matrix, a 41-route metadata sweep, German titles fixed, the 404 and ads-only pages are `noindex`, and the sitemap is clean.
- **Accessibility source fixes:** banner, skip link, form errors, combobox, signature label, contrast, reflow.
- **Security:** the critical and all runtime dependency advisories are fixed. The 7 dev-only typescript-eslint warnings are left on purpose, because their "fix" is a downgrade.
- **Speed:** a performance baseline is recorded (all pages "good"). Lazy routes are done; lazy German text was rejected as not worth it.
- **Repo health:** `scripts/git-nas-doctor.sh` now also catches misnamed junk in `.git/objects` (seen today).
