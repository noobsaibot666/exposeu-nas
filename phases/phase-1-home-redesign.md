# Phase 1: Homepage Redesign Variant

## Verified State

- Added a dedicated variant route at `/home-redesign`.
- Kept the production homepage route at `/` and left `src/pages/Home.tsx` unchanged.
- Duplicated the homepage into `src/pages/HomeRedesign.tsx` for safe review.
- Updated the hero copy to clarify audience, deliverables, and business value.
- Placed "Documentation is not coverage." in the first section after the hero.
- Updated service card microcopy to emphasize outcomes and intended audience.
- Kept CTAs explicit and included a reassurance line near the conversion section.
- Preserved section order, animation behavior, branding, and responsive structure.

## Files Involved

- `src/App.tsx`
- `src/pages/Home.tsx`
- `src/pages/HomeRedesign.tsx`
- `phases/phase-1-home-redesign.md`

## Notes

- No shared CSS modules were modified.
- `src/pages/ProjectDetail.module.css` was not changed.
- The redesign variant continues to reuse the existing homepage styling.
- Phase 1.2 reduced repeated "Berlin" mentions to a single page reference, renamed `Gallery Stories` to `Social Story Coverage` on the variant, shortened CTA labels, and added a scoped readability bump via `src/pages/HomeRedesign.module.css`.
