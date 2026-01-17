# A/B Test: SecondHome (Pricing Removed)

## Goal
Test the impact of removing the pricing section from the Home experience while keeping all other content and behavior the same.

## Variant Details
- Control: `src/pages/Home.tsx` at `/`
- Variant: `src/pages/SecondHome.tsx` at `/second-home`
- Difference: Pricing section removed; a hidden `#services` anchor remains so existing buttons and nav links still scroll without breaking.

## How to Access
- Direct URL: `/second-home`
- No UI navigation changes were added. Use the direct link for A/B test traffic.

## Cleanup After Test
1. Delete `src/pages/SecondHome.tsx`.
2. Remove the import and route for `SecondHome` from `src/App.tsx`.
3. Delete this file: `AB-TEST-SECOND-HOME.md`.
