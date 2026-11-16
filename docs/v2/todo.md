# V2 pre-flight — owner to-do

Only what still needs **you**, in the order to do it. Pricing is parked for a later phase: see [pricing/README.md](./pricing/README.md). Source work is finished (32 issues; evidence in [issues.md](./issues.md) and [verification.md](./verification.md)); production deployment and owner review are summarised below. IDs link to issues.md.

## 1. Deploy and check your inbox

- [ ] **Run `scripts/deploy.sh all`** for the latest changes: corrected homepage film, project-page contrast, German titles, smaller nav buttons, project pages, required contact persistence, and pre-rendered social metadata.
- [ ] **Inbox:** you should have two emails marked "TEST — please ignore", one from the contact form and one from the pricing form (Claude's live tests). If either is missing, tell Claude.

- [ ] **nginx: stop the trailing-slash redirect (found after the 2026-11-16 deploy).** Pre-rendered pages (projects, services, Portfolio) answer `301 → http://…/projects/<slug>/`: an extra hop, briefly to plain `http`, and the URL no longer matches its canonical (no slash). `nginx/default.conf` is write-protected for Claude, so on the NAS change the `location /` block to:
  ```nginx
  location / {
    add_header Cache-Control "no-cache" always;
    try_files $uri $uri/index.html /index.html;
  }
  ```
  and add `absolute_redirect off;` near the top of the `server { … }` block. Then run `scripts/deploy.sh frontend` (it reloads nginx). Check: `curl -sI https://expose-u.com/projects/lick-the-walls` should return `200`, not `301`. Tell Claude and it will re-verify.

## 2. Review by eye (production)

- [ ] **V2-026 Light mode:** check every page family in both themes. In particular:
  - the hard edge where a dark campaign / Release Content Kit hero meets the light page (in dark mode it fades)
  - the homepage nav: white over the video, then dark text on a light frosted bar after scrolling (desktop and phone)
  - the theme and language buttons beside the menu button on phones
- [ ] **V2-032/033 Project pages:** open a few projects from Portfolio and the homepage, on desktop and phone, in both themes. Check that:
  - the big image reveals feel right and the gallery rhythm reads well
  - on the phone, the bottom bar (← Projects · 03 / 08 · Next →) appears after the opening photo and hides at the end
  - the films play: press Play on Leonis Work & Liquidrom, SANAM and Gleo (Vimeo) and Lick the walls (YouTube). Each should fade in over its cover; if one stays on the cover with "Watch the film on …", tell Claude the project and browser
  - the per-project texts are mostly real with light placeholder framing. Edit them in `src/locales/{en,de}/portfolio.json` → `videos[].story` / `highlight`, or send Claude corrections.
- [ ] **Social previews:** use a social preview debugger on one project URL and one service URL; confirm each shows its own title, description and image.
- [ ] **V2-002 Hero video:** after the source-swap deploy, confirm the homepage uses `website_-_main_v1 (1080p).mp4` on desktop and its 9:16 crop on phone. Leonis Work & Liquidrom remains the film on its project page.
- [ ] **V2-018 Overall look** at phone, tablet and desktop widths. Reflow, zoom and contrast already pass automatically, so this is a design check only.

## 3. Decisions recorded 2026-11-16

- **Contact delivery:** both email acceptance and a saved Supabase record are required before showing success. If email was accepted but saving failed, the form explains not to resubmit and includes a reference ID.
- **Link previews:** per-page previews for the homepage, portfolio, four service pages and all project pages in EN/DE. Build emits static metadata pages; deployment and social debugger review remain above.
- **AdSense:** keeps sharing the analytics "Accept".
- **Signature:** stays drawing-only; no alternate method for now.
- **Photo-consent data:** handled manually; export signatures per project and store them in the project folders.

## 4. Assistive tech

- [ ] **V2-018 Screen reader** (VoiceOver on Mac/iPhone; NVDA on Windows if available): cookie banner, mobile menu, the `/consent` location field, form errors on contact/pricing/campaign/consent, and the signature label.

## Only if you scale up later

- **V2-006:** API rate limits are per container. Move them to a shared store before running more than one `exposeu-contact` container. Nothing to do today.

---

## Done by Claude (no action needed)

- **Previously live and verified on production:** consent gating, contact email delivery, photo-consent offline sync with duplicate protection, and pricing form delivery. The new requirement that contact email and Supabase persistence both succeed is source-verified but awaits deployment and a safe failure-path check.
- **Site-wide:** light mode with a working toggle; text stays readable over photos; the nav adapts over video and photos; the lightbox never shows an empty film frame.
- **SEO:** route matrix, a 41-route metadata sweep, German titles fixed, the 404 and ads-only pages are `noindex`, and the sitemap is clean.
- **Accessibility source fixes:** banner, skip link, form errors, combobox, signature label, contrast, reflow.
- **Security:** the critical and all runtime dependency advisories are fixed. The 7 dev-only typescript-eslint warnings are left on purpose, because their "fix" is a downgrade.
- **Speed:** a performance baseline is recorded (all pages "good"). Lazy routes are done; lazy German text was rejected as not worth it.
- **Repo health:** `scripts/git-nas-doctor.sh` now also catches misnamed junk in `.git/objects` (seen today).
