# Services Revamp — Status
*Week 7 — June 2026. Reference: `00_master_roadmap.md`*

---

## What Is Done

### Phase 1 — Pricing removal + hero rewrites (all four service pages)

**Exhibition & Gallery** `/services/exhibition-gallery`
- [x] Pricing section replaced with editorial block ("Every exhibition is different…")
- [x] "Ideal for" → "Who we work with"
- [x] Trust signals block added between deliverables and audience sections ("Small crew…")
- [x] Museums and foundations added as 4th audience item
- [x] SEO title → "Exhibition Documentation Berlin — expose.u"
- [x] SEO description updated

**Concerts & Live Events** `/services/concerts-events`
- [x] Hero headline rewritten → "Live event documentation for venues, labels and promoters…"
- [x] Hero subhead rewritten → operational, delivery-focused
- [x] Pricing replaced with editorial block ("Every production has different requirements…")
- [x] "Ideal for" → "Who we work with"
- [x] Audience list reordered: Labels first, independent artists last
- [x] Business outcomes paragraph added between sections
- [x] SEO title → "Live Event Documentation Berlin — expose.u"
- [x] SEO description updated

**Artist Sessions** `/services/artist-sessions`
- [x] Pricing replaced with editorial block — includes €400–700 range, artist-to-artist framing, 5 paragraphs
  - **Superseded 2026-08-24**: the €400–700 range and 5-paragraph body were flagged as
    inconsistent with the page's own "no visible price" pattern and read as an
    undesigned wall of text. Rewritten to 2 short paragraphs, no price, CTA-focused —
    see `services_audit.md` Week 12 entry. SEO description/ogDescription (below) had
    the same €400–700 mention and were updated to match.
- [x] Audience line updated: labels and managers added
- [x] "Ideal for" → "Who we work with" — Labels and management added as 2nd item
- [x] Hero subhead updated → "One session, everything you need."
- [x] SEO title → "Artist Sessions Berlin — Editorial Content for Artists — expose.u"
- [x] SEO description updated (includes €400–700) — *see superseded note above*

**Brand & Agency** `/services/brand-agency`
- [x] Hero headline → "Documentation for designed experiences."
- [x] Hero subhead → activations + installations + case studies/award submissions framing
- [x] Pricing replaced with editorial block, no numbers
- [x] "Ideal for" → "Who we work with" — 4 new agency-specific audience items
- [x] Deliverables expanded: Spatial documentation, Award submission imagery, Case study material added
- [x] Trust block added between sections ("Built by designers…")
- [x] Footer CTA → "Let's document your next project."
- [x] Brand & Agency now visible on homepage service cards (was hidden)
- [x] Homepage card copy updated to match new positioning
- [x] SEO title → "Brand & Agency Documentation Berlin — expose.u"
- [x] SEO description updated

### Infrastructure
- [x] `WorkPageLayout` — editorial pricing block (`editorialPricingTitle/Body/Cta/CtaHref` props)
- [x] `WorkPageLayout` — mid-section note slot (`midSectionNote` prop) for trust signals and outcomes paragraphs
- [x] "Ideal for" label renamed to "Who we work with" across all service pages (EN + DE)
- [x] All changes committed: `2883dcd`

---

## What Is Missing

### Brand & Agency Landing Page `/brand-agency` — brief_06

The ad landing page exists and the route is live, but the **content does not match brief_06**. It was built for a consumer-facing brand activation audience and needs a full copy rewrite for the agency/design audience.

Gaps:
- [ ] Page title: currently "Brand Activation Photo and Video Content Berlin" → should be "Brand & Agency Documentation Berlin — expose.u"
- [ ] Hero h1: currently "Photo and video proof / for your brand activation." → should be "Documentation for Designed Experiences" (single line)
- [ ] Hero subhead: activation/launch framing → installations + agency-built environments + case studies/award submissions
- [ ] Audience section heading: "You built the moment. Now you need the proof." → "For agencies and creative teams"
- [ ] Audience items: Brands/PR Teams/Pop-ups → Experience design agencies, Creative studios, Brand teams, Exhibition designers
- [ ] Deliverables: needs Spatial documentation sequences, Award submission imagery, Website case study material, Presentation-ready assets
- [ ] "What the documentation does" section: missing — awards, pitches, client deliverables, portfolio, press/social
- [ ] How We Work section: currently 3 bullet proofItems → "Small crew. Quiet production. We work the way designers work…"
- [ ] Final CTA body: "Every project has different requirements. We build proposals together…"
- [ ] Final CTA label: "Tell us about the project" → "Request availability"
- [ ] OG tags: activation framing → designed experiences framing
- [ ] DE version: same gaps apply

### Phase 3 — Following week (not started)

- [ ] German versions — all updated service pages reviewed for tone and accuracy
- [ ] SEO metadata — DE versions of page titles and meta descriptions
- [ ] Homepage service cards — update Exhibition, Concerts, Artist Sessions card copy and CTA text ("See pricing →" is now misleading)

---

## Pages Not Touched

These pages are out of scope for Week 7 and remain unchanged:

| Page | Route |
|---|---|
| Release Content Kit (landing) | `/release-content-kit` |
| Concerts Berlin (landing) | `/concerts-berlin` |
| Exhibition Gallery (landing) | `/exhibition-gallery` |
| Pop-ups (landing) | `/popups` |

---

*Updated 2026-06-08.*
