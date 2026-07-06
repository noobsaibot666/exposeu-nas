# Services Pages — Site Inventory

Full map of all public-facing pages. Updated after Week 7 revamp (June 2026).

---

## Service Pages

Canonical service pages linked from the homepage grid.

| Service | EN | DE |
| --- | --- | --- |
| Concerts & Live Events | [/services/concerts-events](https://expose-u.com/services/concerts-events) | [/de/services/concerts-events](https://expose-u.com/de/services/concerts-events) |
| Exhibition & Gallery | [/services/exhibition-gallery](https://expose-u.com/services/exhibition-gallery) | [/de/services/exhibition-gallery](https://expose-u.com/de/services/exhibition-gallery) |
| Artist Sessions & Portraits | [/services/artist-sessions](https://expose-u.com/services/artist-sessions) | [/de/services/artist-sessions](https://expose-u.com/de/services/artist-sessions) |
| Brand & Agency Documentation | [/services/brand-agency](https://expose-u.com/services/brand-agency) | [/de/services/brand-agency](https://expose-u.com/de/services/brand-agency) |

---

## Ad Landing Pages

Standalone pages for paid campaigns. Not linked from the homepage grid or global navigation.

| Tier | Page | EN | DE |
| --- | --- | --- | --- |
| Tier 1 | Gallery/Museum Documentation | [/gallery-museum-documentation](https://expose-u.com/gallery-museum-documentation) | [/de/gallery-museum-documentation](https://expose-u.com/de/gallery-museum-documentation) |
| Tier 2 *(consolidated → Brand & Agency)* | Brand & Agency Documentation | [/brand-agency](https://expose-u.com/brand-agency) | [/de/brand-agency](https://expose-u.com/de/brand-agency) |
| Tier 3 | Artist/Musician Documentation | [/artist-musician-documentation](https://expose-u.com/artist-musician-documentation) | [/de/artist-musician-documentation](https://expose-u.com/de/artist-musician-documentation) |
| Tier 4 *(consolidated → Pop-ups)* | Pop-ups | [/popups](https://expose-u.com/popups) | [/de/popups](https://expose-u.com/de/popups) |
| — | Release Content Kit | [/release-content-kit](https://expose-u.com/release-content-kit) | [/de/release-content-kit](https://expose-u.com/de/release-content-kit) |
| — | Concerts Berlin | [/concerts-berlin](https://expose-u.com/concerts-berlin) | [/de/concerts-berlin](https://expose-u.com/de/concerts-berlin) |
| — | Exhibition Gallery | [/exhibition-gallery](https://expose-u.com/exhibition-gallery) | [/de/exhibition-gallery](https://expose-u.com/de/exhibition-gallery) |

---

## Notes

- **Brand & Agency** is visible on the homepage service cards as of Week 7 (was hidden prior).
- **Exhibition & Gallery** has both a service page (`/services/exhibition-gallery`) and an ad landing page (`/exhibition-gallery`). The homepage card links to the service page.
- **Brand & Agency** similarly has both a service page and an ad landing page. The landing page (`/brand-agency`) was fully rewritten in Week 7 for the agency/designed-experiences audience.
- Legacy slugs (`/gallery-stories`, `/documentation`, `/exhibitions`, `/performance`, `/services/fashion-show`, etc.) redirect to the appropriate service pages.
- No pages carry a visible price. Every CTA ("Request availability" / "Verfügbarkeit anfragen") is an inquiry starting point via `/contact`, not a booking commitment.

---

## Week 11 Changes (July 2026)

Two new ad landing pages added for CEO-defined ad tiers (Tier 1 and Tier 3; Tier 2 and Tier 4 were consolidated into `/brand-agency` and `/popups` instead of new pages):

- **Gallery/Museum Documentation** (`/gallery-museum-documentation`) — culture & arts audience: galleries, museums, curators, cultural institutions.
- **Artist/Musician Documentation** (`/artist-musician-documentation`) — creative identity audience: musicians, artists, performers.
- Both use the shared `AdLandingPage` component (same pattern as `/brand-agency`, `/popups`). DE routes follow the site's existing `/de/<same-slug>` convention.
- Hero/support images are temporary placeholders pending real photography.

---

## Week 7 Changes (June 2026)

All four service pages revised:

- Pricing sections removed — replaced with editorial blocks
- "Ideal for" renamed to "Who we work with" / `Mit wem wir arbeiten` (EN + DE)
- Hero copy and subheads rewritten for all four services
- Trust signals and business outcomes paragraphs added (mid-section)
- Audience sections expanded with agency and institutional audiences
- Brand & Agency service page added to homepage grid (was hidden)
- Homepage service card CTAs updated: "See pricing →" → "How we work →"
- All four service card descriptions updated (EN + DE)
- DE versions of all four service pages updated (copy, tone, SEO)
- Locale-conditional SEO metadata and canonical URLs added to all four service TSX files
- Brand & Agency landing page (`/brand-agency`) fully rewritten for agency audience (EN + DE)
- Brand & Agency image folder created (`src/assets/images/services/6_brand_agency/`)

*See `services_revamp_status.md` for the full Phase 1–3 checklist.*

---

*Updated 2026-07-06.*
