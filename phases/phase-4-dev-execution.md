# Phase 4: Contact & Conversion Hardening

## What Was Hardened

- Strengthened the contact form with client-side validation for name, email, and message.
- Added accessible inline field errors plus submission status messaging.
- Kept service, package, source URL, and referrer metadata in the contact payload without duplicating that metadata inside the submitted message content.
- Hardened the contact API with server-side validation, structured JSON errors, a honeypot field, and simple in-memory rate limiting.
- Audited conversion CTAs across home, home redesign, service pages, and pricing request paths to confirm routing and label consistency.

## Spam Mitigation

- Honeypot field: `companyWebsite`
  - Hidden on the contact form.
  - If filled, the API silently discards the submission and returns `{ ok: true }`.
- Rate limiting:
  - In-memory per IP.
  - Threshold: 5 contact submissions per minute.
  - Exceeded requests return `429` with a structured JSON error.

## CTA Audit

- Home and home redesign primary CTAs still point to the expected contact or in-page services targets.
- Service-page primary CTAs still route to `/contact?service=<slug>`.
- Pricing section tier CTAs still route to `/contact?service=<slug>&package=<tier>`.
- No dead `#cases` or `#services` targets were found in the audited home flows.

## QA Checklist

- Contact form blocks submission when name, email, or message is missing.
- Inline field errors render with accessible messaging.
- Submit button disables while request is pending.
- Repeated clicks do not trigger duplicate requests.
- Contact success path still redirects to the success page.
- Contact error path preserves user-entered values.
- Honeypot submissions are silently discarded.
- Rate limiting returns `429` after 5 requests per minute from the same IP.
- Analytics tracking still fires through the existing consent-gated event flow.
- Build passes.

## Constraints Respected

- No route definitions were changed.
- No shared CSS modules were modified.
- `src/pages/ProjectDetail.module.css` was not changed.
- No new heavy dependencies were added.
