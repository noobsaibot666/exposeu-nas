# Phase 2: Services Pages Optimization

## What Changed

- Standardized all service pages around a clearer path: concise hero, `What you get`, `Best for`, `How this differs`, pricing, and CTA.
- Compressed service copy for mobile readability without changing page structure or shared styling.
- Clarified pricing as one-time vs recurring work, renamed tier labels, and added `Choose this if...` guidance inside pricing cards.
- Standardized service-page CTAs to the same contact path and preserved service prefill via `?service=<slug>`.

## Routes and Files Impacted

- `/documentation` -> `src/pages/Exhibitions.tsx`
- `/gallery-stories` -> `src/pages/GalleryStories.tsx`
- `/artist-sessions` -> `src/pages/ArtistSessions.tsx`
- `/performance` -> `src/pages/Performance.tsx`
- `/fashion-show` -> `src/pages/FashionShow.tsx`
- `/atmospheric` -> `src/pages/Atmospheric.tsx`
- `src/pages/WorkPageLayout.tsx`
- `src/sections/PricingSection.tsx`
- `src/data/pricingTiers.ts`
- `src/data/pricingByService.ts`
- `src/pages/PricingRequest.tsx`

## Notes

- No shared CSS modules were modified.
- `src/pages/ProjectDetail.module.css` was not changed.
- No service routes were removed or redesigned.
