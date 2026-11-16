# expose.u application audit — V2.0 preflight

**Audit date:** 2026-11-16 (Europe/Berlin)
**Scope:** deployed public site, checked-out frontend and API source, route map, assets, and repository checks.
**Purpose:** identify defects and risks to fix before V2 implementation begins.

## Current status

This is a React 19 / TypeScript / Vite single-page application with 28 page components, 73 explicit route entries (including language variants, legacy redirects and dynamic forms), 4 canonical shared-layout service pages, 7 campaign landing pages, and a separate Express API for contact, Meta lead events, photo consent, reverse geocoding and SMTP diagnostics.

The production homepage responded successfully on 2026-11-15. Playwright inspection at desktop (1200 px) and mobile (390 px) found no browser console errors and one warning. This was a homepage smoke review, not a full end-to-end test of every production route. The checked-out code passes ESLint. The image audit reports 35 unused image files (2.71 MB). A local Vite server could not start because `@rollup/rollup-darwin-arm64` is missing; repository guidance prohibits repairing dependencies in this SMB-shared checkout. Therefore local route-by-route visual checks and a current production build comparison remain open.

## Start here

- [Immediate fixes and prioritized issue register](./issues.md)
- [Route and page audit](./pages.md)
- [Services, integrations, performance, accessibility and security review](./systems.md)
- [Verification record and limitations](./verification.md)
- [Open items for owner review](./todo.md)

## Priority legend

- **P0 — stop-ship:** fix before V2 work or any further release; data/consent boundary or core conversion path is at immediate risk.
- **P1 — pre-V2:** fix before V2 starts; serious user-facing, routing, data integrity or performance defect.
- **P2 — planned:** should be included in V2 scope; quality, maintainability, accessibility or measurable optimization.
- **P3 — investigate:** evidence is incomplete or requires owner/product/production configuration confirmation.

Severity reflects urgency to this business, not a formal security CVSS score. Findings are labeled **verified**, **source-based**, or **needs runtime validation**.

## Suggested sequence

1. Resolve P0/P1 items in [issues.md](./issues.md).
2. Run a complete EN/DE route and form smoke pass against a build from the deployment environment.
3. Record baseline Lighthouse/Web Vitals, real-device mobile checks, and API delivery outcomes.
4. Freeze the accepted V2 backlog from this audit; retest each issue after remediation.
