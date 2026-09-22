import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'concerts-berlin',
  serviceSlug: 'concerts-events',
  ctaPackage: 'project',
  ogImage: 'https://expose-u.com/og-concerts-berlin.jpg',
  heroImage: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4340.webp'),
  supportImage: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4263.webp'),
  // Stage, crowd and room shots, so "what you get" reads as a body of work
  // rather than one photo. Excludes the two frames already used as the hero
  // and support stills above.
  supportImages: [
    '/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4012.webp',
    '/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4018.webp',
    '/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4038.webp',
    '/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4210.webp',
    '/src/assets/images/services/4_performance_doc/4_PD_004.webp',
  ].map((path) => resolveImagePath(path)),
  metaContentName: 'Concerts Berlin Landing Page',
  customPixelEvent: 'ConcertsBerlinView',
  // Lighter than the shared hero wash so the footage actually reads.
  heroOverlay: 'linear-gradient(90deg, rgba(5, 7, 11, 0.82), rgba(5, 7, 11, 0.34))',
  // Same background film as the homepage hero (desktop + portrait cut).
  // startAt skips into the source on first play (loop restarts at 0).
  heroVideo: { id: '1228854165', mobileId: '1228856768', startAt: 0.5 },
  // Mobile: price line / proof pills / CTA sit below the hero instead of
  // overlaid on the video, and WhatsApp/call/email move to after the
  // inline lead form so every contact option is grouped together.
  heroPriceProofBelowFoldMobile: true,
  heroContactAfterLeadFormMobile: true,
}

// The offer first, then how we shoot, then who it's for.
const SECTION_ORDER: AdLandingPageConfig['sectionOrder'] = ['included', 'proof', 'audience']

const configs: Record<'en' | 'de', AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    sectionOrder: SECTION_ORDER,
    canonical: 'https://expose-u.com/concerts-berlin',
    title: 'Concert Documentation Berlin',
    description: 'Photo and video documentation for artists, venues and promoters in Berlin. Booking, press and social assets built for what comes after the show.',
    ogTitle: 'Concert Documentation Berlin | expose.u',
    ogDescription: 'The show ends. The assets help the next one happen. Concert documentation for artists, venues and promoters in Berlin.',
    heroKicker: 'Concert documentation · Berlin',
    h1: 'The show ends. The assets help the next one happen.',
    h1Line1: 'The show ends. The assets help the next one happen.',
    h1Line2: '',
    subheadline: 'Photo and video for booking, press, social and the next date you need to promote, not just a recap of tonight.',
    subheadlineMobile: 'Photo & video for booking, press and social. Berlin.',
    heroPriceLine: 'Photo & video coverage from €300 · Berlin · 24h reply',
    heroProofItems: ['Stage photos', 'Crowd atmosphere', 'Vertical clips', 'Next-day selects'],
    heroContact: {
      whatsapp: { href: 'https://wa.me/48786696765', label: 'WhatsApp us' },
      phone: { href: 'tel:+4917622132950', label: 'Call' },
      email: { href: 'mailto:hello@expose-u.com', label: 'Email' },
    },
    cta: 'Request availability',
    ctaSecondary: "See what's included",
    stickyCta: 'Request availability',
    stickyCtaNote: 'Photo & video from €300',
    leadForm: {
      serviceLabel: 'Concert / Live event',
      heading: 'Send us your date.',
      body: 'Every show is different. Tell us the date, the venue and what you need the documentation for, and we will come back within a day with availability.',
      nameLabel: 'Name',
      emailLabel: 'Email',
      dateLabel: 'Show date',
      dateHint: '(optional)',
      datePlaceholder: 'e.g. 12 September 2026',
      submitLabel: 'Request availability →',
      sendingLabel: 'Sending…',
      successHeading: 'Got it — thank you.',
      successBody: "We've received your date and will get back to you within a day with availability and next steps.",
      errorGeneric: 'Something went wrong — please email us at hello@expose-u.com',
      fullFormLabel: 'Prefer the full form?',
      fullFormHref: '/contact?service=concerts-events&package=project',
    },
    audienceLabel: 'Who this is for',
    audienceHeading: 'For artists, venues and promoters',
    audienceGroups: [],
    audienceItems: [
      {
        title: 'Musicians, bands and DJs',
        body: 'Stage and press images ready for the next booking, release or announcement.',
      },
      {
        title: 'Venues and clubs',
        body: 'Recap and marketing assets for monthly programs and listings.',
      },
      {
        title: 'Promoters and booking agencies',
        body: 'Proof material for lineup pitches, sponsor decks and future dates.',
      },
      {
        title: 'Labels and artist management',
        body: 'Campaign assets tied to a live date, ready the morning after.',
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'What you receive',
    includedLede:
      'Organized and ready to use for booking, press and the next announcement.',
    includedCards: [
      {
        slug: 'stage-photos',
        title: 'Stage photos',
        body: 'Strong live images with light, movement and the key moments.',
      },
      {
        slug: 'crowd-atmosphere',
        title: 'Crowd & room atmosphere',
        body: 'Shots that show how the night felt, not just how it looked.',
      },
      {
        slug: 'backstage-moments',
        title: 'Backstage moments',
        body: 'Quiet details before and after the set, when access allows.',
      },
      {
        slug: 'vertical-clips',
        title: 'Vertical video clips',
        body: 'Reels- and Stories-ready moments from the same night.',
      },
      {
        slug: 'press-ready-selects',
        title: 'Press-ready selects',
        body: 'A curated set, named and ready to hand to press and partners.',
      },
      {
        slug: 'fast-delivery',
        title: 'Fast priority delivery',
        body: 'Key selects out fast enough for a next-day post or announcement.',
      },
    ],
    includedCta: 'Request availability',
    proofLabel: 'How we work',
    proofItems: [
      {
        title: 'Quiet in the room',
        body: 'One or two of us on site, working around stage light, timing and crowd flow without getting in the way.',
      },
      {
        title: 'Photo and video, one team',
        body: 'Stills and motion covered together, so nothing about the night slips past.',
      },
      {
        title: 'Fast after',
        body: 'Priority selects out fast enough to matter for the next booking or announcement.',
      },
      {
        title: 'Aimed at the next date',
        body: 'We shoot for the campaign that follows the show, not only the recap of it.',
      },
    ],
    finalHeading: "Let's cover your next show.",
    finalBody:
      'Every show is different. We build the brief around your date, venue and what you need the documentation for.',
    finalCta: 'Request availability',
  },
  de: {
    ...baseConfig,
    sectionOrder: SECTION_ORDER,
    canonical: 'https://expose-u.com/de/concerts-berlin',
    title: 'Konzertdokumentation Berlin',
    description: 'Foto- und Videodokumentation für Artists, Venues und Promoter in Berlin. Booking-, Presse- und Social-Assets für die Zeit nach der Show.',
    ogTitle: 'Konzertdokumentation Berlin | expose.u',
    ogDescription: 'Die Show endet. Die Assets bringen die nächste ins Rollen. Konzertdokumentation für Artists, Venues und Promoter in Berlin.',
    heroKicker: 'Konzertdokumentation · Berlin',
    h1: 'Die Show endet. Die Assets bringen die nächste ins Rollen.',
    h1Line1: 'Die Show endet. Die Assets bringen die nächste ins Rollen.',
    h1Line2: '',
    subheadline: 'Foto und Video für Booking, Presse, Social Media und den nächsten Termin, den Sie bewerben müssen, nicht nur ein Rückblick auf den Abend.',
    subheadlineMobile: 'Foto & Video für Booking, Presse und Social. Berlin.',
    heroPriceLine: 'Foto & Video ab 300 € · Berlin · Antwort in 24 Std.',
    heroProofItems: ['Bühnenfotos', 'Crowd-Atmosphäre', 'Vertikale Clips', 'Selects am nächsten Tag'],
    heroContact: {
      whatsapp: { href: 'https://wa.me/48786696765', label: 'WhatsApp schreiben' },
      phone: { href: 'tel:+4917622132950', label: 'Anrufen' },
      email: { href: 'mailto:hello@expose-u.com', label: 'E-Mail' },
    },
    cta: 'Verfügbarkeit anfragen',
    ctaSecondary: 'Sehen Sie, was enthalten ist',
    stickyCta: 'Verfügbarkeit anfragen',
    stickyCtaNote: 'Foto & Video ab 300 €',
    leadForm: {
      serviceLabel: 'Konzert / Live-Event',
      heading: 'Schicken Sie uns Ihren Termin.',
      body: 'Jede Show ist anders. Sagen Sie uns Termin, Venue und wofür Sie die Dokumentation brauchen, und wir melden uns innerhalb eines Tages mit der Verfügbarkeit.',
      nameLabel: 'Name',
      emailLabel: 'E-Mail',
      dateLabel: 'Show-Termin',
      dateHint: '(optional)',
      datePlaceholder: 'z. B. 12. September 2026',
      submitLabel: 'Verfügbarkeit anfragen →',
      sendingLabel: 'Wird gesendet…',
      successHeading: 'Erhalten — vielen Dank.',
      successBody: 'Wir haben Ihren Termin erhalten und melden uns innerhalb eines Tages mit Verfügbarkeit und nächsten Schritten.',
      errorGeneric: 'Etwas ist schiefgelaufen – schreiben Sie uns bitte an hello@expose-u.com',
      fullFormLabel: 'Lieber das vollständige Formular?',
      fullFormHref: '/de/contact?service=concerts-events&package=project',
    },
    audienceLabel: 'Für wen das ist',
    audienceHeading: 'Für Artists, Venues und Promoter',
    audienceGroups: [],
    audienceItems: [
      {
        title: 'Musiker:innen, Bands und DJs',
        body: 'Bühnen- und Pressebilder, einsatzbereit für das nächste Booking, Release oder die nächste Ankündigung.',
      },
      {
        title: 'Venues und Clubs',
        body: 'Recap- und Marketing-Assets für Monatsprogramme und Listings.',
      },
      {
        title: 'Promoter und Booking-Agenturen',
        body: 'Proof-Material für Lineup-Pitches, Sponsoren-Decks und zukünftige Termine.',
      },
      {
        title: 'Labels und Artist-Management',
        body: 'Kampagnen-Assets zum Live-Termin, bereit am nächsten Morgen.',
      },
    ],
    includedLabel: 'Was Sie erhalten',
    includedHeading: 'Was Sie erhalten',
    includedLede:
      'Organisiert geliefert und einsatzbereit für Booking, Presse und die nächste Ankündigung.',
    includedCards: [
      {
        slug: 'stage-photos',
        title: 'Bühnenfotos',
        body: 'Starke Live-Bilder mit Licht, Bewegung und den wichtigen Momenten.',
      },
      {
        slug: 'crowd-atmosphere',
        title: 'Crowd- & Raumatmosphäre',
        body: 'Bilder, die zeigen, wie sich der Abend angefühlt hat, nicht nur, wie er aussah.',
      },
      {
        slug: 'backstage-moments',
        title: 'Backstage-Momente',
        body: 'Ruhige Details vor und nach dem Set, wenn der Zugang es erlaubt.',
      },
      {
        slug: 'vertical-clips',
        title: 'Vertikale Videoclips',
        body: 'Reels- und Stories-fertige Momente aus derselben Nacht.',
      },
      {
        slug: 'press-ready-selects',
        title: 'Pressereife Auswahl',
        body: 'Eine kuratierte, benannte Auswahl, bereit für Presse und Partner.',
      },
      {
        slug: 'fast-delivery',
        title: 'Schnelle Priority-Lieferung',
        body: 'Wichtige Selects schnell genug für einen Post oder eine Ankündigung am nächsten Tag.',
      },
    ],
    includedCta: 'Verfügbarkeit anfragen',
    proofLabel: 'Wie wir arbeiten',
    proofItems: [
      {
        title: 'Ruhig im Raum',
        body: 'Ein bis zwei Personen vor Ort, abgestimmt auf Bühnenlicht, Timing und Publikumsfluss, ohne im Weg zu stehen.',
      },
      {
        title: 'Foto und Video, ein Team',
        body: 'Stills und Bewegtbild zusammen abgedeckt, damit nichts vom Abend verloren geht.',
      },
      {
        title: 'Schnell danach',
        body: 'Priorisierte Selects, schnell genug für das nächste Booking oder die nächste Ankündigung.',
      },
      {
        title: 'Auf den nächsten Termin gerichtet',
        body: 'Wir fotografieren für die Kampagne nach der Show, nicht nur für den Rückblick.',
      },
    ],
    finalHeading: 'Lassen Sie uns Ihre nächste Show begleiten.',
    finalBody:
      'Jede Show ist anders. Wir entwickeln das Briefing gemeinsam, abgestimmt auf Termin, Venue und den Zweck der Dokumentation.',
    finalCta: 'Verfügbarkeit anfragen',
  },
}

export default function ConcertsBerlin() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
