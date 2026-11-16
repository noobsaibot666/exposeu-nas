# V2 pre-flight — owner to-do

Only what still needs **you**, in the order to do it. Pricing is parked for a later phase: see [pricing/README.md](./pricing/README.md). Everything Claude could do alone is finished (31 issues; evidence in [issues.md](./issues.md) and [verification.md](./verification.md)) and summarised at the bottom. IDs link to issues.md.

## 1. Deploy and check your inbox

- [ ] **Run `scripts/deploy.sh frontend`** for the latest changes: German titles, the 404 hidden from search, smaller nav buttons, the self-hosted hero video and the new project pages.
- [ ] **Inbox:** you should have two emails marked "TEST — please ignore", one from the contact form and one from the pricing form (Claude's live tests). If either is missing, tell Claude.

## 2. Review by eye (production)

- [ ] **V2-026 Light mode:** check every page family in both themes. In particular:
  - the hard edge where a dark campaign / Release Content Kit hero meets the light page (in dark mode it fades)
  - the homepage nav: white over the video, then dark text on a light frosted bar after scrolling (desktop and phone)
  - the theme and language buttons beside the menu button on phones
- [ ] **V2-028 Pop-up films:** open Leonis Work & Liquidrom, SANAM and Gleo (Vimeo) and Lick the walls (YouTube). Each film should fade in over its cover within a second or two. If one stays on the cover with a "Watch the film on …" link, tell Claude which project and browser. (Vimeo blocks automated browsers, so only you can confirm the live Vimeo path.)
- [ ] **V2-002 Hero video:** the homepage now plays your Leonis/Liquidrom film (self-hosted). Check it on desktop and phone; the phone version is a 9:16 centre crop.
- [ ] **V2-018 Overall look** at phone, tablet and desktop widths. Reflow, zoom and contrast already pass automatically, so this is a design check only.

## 3. Two decisions left (explained in plain words)

- [ ] **Contact delivery:** when someone sends the contact form, two things happen: an email to you, and a copy saved in Supabase. Today the visitor sees "sent" as soon as the email goes out, even if saving the Supabase copy fails. Is that OK (you still get the email), or should a failed Supabase save also count as an error? Claude recommends keeping it as is.
- [ ] **Link previews:** when someone shares a page on WhatsApp, LinkedIn, Facebook etc., the preview card shows the same generic expose.u title and image for every page, because the site builds its pages in the browser. Per-page previews (each project or service with its own image and title) need pre-rendered pages, a moderate build change. Do you want that? It matters most once the new project pages are shared.

Decided 2026-11-16 (no action): **AdSense** keeps sharing the analytics "Accept"; **signature** stays drawing-only; **photo-consent data** is handled manually (you export signatures per project and store them in your own folders).

## 4. Assistive tech

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
