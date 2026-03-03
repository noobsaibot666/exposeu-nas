# Phase 2: Services Pages Optimization

## What Changed

- Standardized all service pages around a clearer path: concise hero, `What you get`, `Best for`, `How this differs`, pricing, and CTA.
- Compressed service copy for mobile readability without changing page structure or shared styling.
- Clarified pricing as one-time vs recurring work, renamed tier labels, and added `Choose this if...` guidance inside pricing cards.
- Standardized service-page CTAs to the same contact path and preserved service prefill via `?service=<slug>`.
- Contact emails now include service/package in the subject and a lead summary block for faster triage.

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

## Done Definition / QA Checklist

- `npm run build`: not verified in this shell because Docker/sudo access is unavailable here.
- Service routes load without errors:
  - `/documentation`
  - `/gallery-stories`
  - `/artist-sessions`
  - `/performance`
  - `/fashion-show`
  - `/atmospheric`
- Pricing section renders on each service page via the shared `PricingSection` component.
- Tier labels are consistent across pricing cards and the pricing request flow: `One-time`, `Monthly`, `Studio retainer`.
- Contact prefill works:
  - Service CTAs navigate with the correct `?service=<slug>` value.
  - Contact submission includes service/package data in the payload and email body when present.
- Mobile spot check: not verified in this shell.

## Known Limitations

- Full browser QA and build verification were not completed in this shell because Docker and interactive sudo access are unavailable.
