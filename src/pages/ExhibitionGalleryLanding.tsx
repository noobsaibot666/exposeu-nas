import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'exhibition-gallery',
  serviceSlug: 'exhibition-gallery',
  ctaPackage: 'project',
  ogImage: 'https://expose-u.com/og-exhibition-gallery.jpg',
  heroImage: resolveImagePath('/src/assets/images/landing/gallery_hero_01.webp'),
  supportImage: resolveImagePath('src/assets/images/landing/gallery_hero_03.webp'),
  // Installation views, detail and opening shots, so "what you get" reads as a
  // body of work rather than one photo. Deliberately a different selection to
  // the one gallery-museum carries, so the two pages don't look identical.
  supportImages: [
    '/src/assets/images/services/1_exhibition_doc/_incoming/gallery/003.webp',
    '/src/assets/images/services/1_exhibition_doc/_incoming/gallery/006.webp',
    '/src/assets/images/services/1_exhibition_doc/_incoming/gallery/008.webp',
    '/src/assets/images/services/1_exhibition_doc/_incoming/gallery/011.webp',
    '/src/assets/images/services/1_exhibition_doc/1_ED_055.webp',
  ].map((path) => resolveImagePath(path)),
  metaContentName: 'Exhibition Gallery Landing Page',
  customPixelEvent: 'ExhibitionGalleryLandingView',
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
    canonical: 'https://expose-u.com/exhibition-gallery',
    title: 'Exhibition Documentation for Berlin Project Spaces',
    description: 'Press-ready photo and video documentation for independent galleries and artist-run project spaces in Berlin, sized for independent budgets.',
    ogTitle: 'Exhibition Documentation for Berlin Project Spaces | expose.u',
    ogDescription: 'The same eye, a different scale. Exhibition documentation for independent galleries and project spaces in Berlin.',
    heroKicker: 'Exhibition documentation · Berlin',
    h1: 'The same eye, at your scale.',
    h1Line1: 'The same eye, at your scale.',
    h1Line2: '',
    subheadline: 'Press-ready photo and video for openings and installation views, priced for independent and artist-run spaces rather than institutional budgets.',
    subheadlineMobile: 'Press-ready photo & video for Berlin project spaces.',
    heroPriceLine: 'Photo & video coverage from €300 · Berlin · 24h reply',
    heroProofItems: ['Installation views', 'Artwork detail', 'Opening night', 'Fast delivery'],
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
      serviceLabel: 'Exhibition / Project space',
      heading: 'Tell us your opening date.',
      body: 'Every space is different. Send us the date and what you need the documentation for, and we will come back within a day with availability.',
      nameLabel: 'Name',
      emailLabel: 'Email',
      dateLabel: 'Opening or install date',
      dateHint: '(optional)',
      datePlaceholder: 'e.g. 12 September 2026',
      submitLabel: 'Request availability →',
      sendingLabel: 'Sending…',
      successHeading: 'Got it — thank you.',
      successBody: "We've received your dates and will get back to you within a day with availability and next steps.",
      errorGeneric: 'Something went wrong — please email us at hello@expose-u.com',
      fullFormLabel: 'Prefer the full form?',
      fullFormHref: '/contact?service=exhibition-gallery&package=project',
    },
    audienceLabel: 'Who this is for',
    audienceHeading: 'For independent Berlin galleries and project spaces',
    audienceGroups: [],
    audienceItems: [
      {
        title: 'Independent galleries',
        body: 'Opening and installation documentation ready for your website and socials.',
      },
      {
        title: 'Artist-run and project spaces',
        body: 'Clean, press-ready coverage without an institutional price tag.',
      },
      {
        title: 'Emerging curators',
        body: 'Portfolio-ready material for every show, even a one-week run.',
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'What you receive',
    includedLede:
      'Organized and ready to use for the website, social and the archive, before press or partners ask for it.',
    includedCards: [
      {
        slug: 'room-and-work',
        title: 'Room and work',
        body: 'Clean views of the space, artwork and installation.',
      },
      {
        slug: 'artwork-detail',
        title: 'Artwork detail',
        body: 'Close frames of individual works and materials.',
      },
      {
        slug: 'opening-atmosphere',
        title: 'Opening atmosphere',
        body: 'Guests and the room on opening night, without staged scenes.',
      },
      {
        slug: 'vertical-social',
        title: 'Vertical social assets',
        body: 'Reels- and Stories-ready clips and images that keep the show visible after it closes.',
      },
      {
        slug: 'fast-delivery',
        title: 'Fast delivery',
        body: 'Selects out quickly, sized for short exhibition runs.',
      },
    ],
    includedCta: 'Request availability',
    proofLabel: 'How we work',
    proofItems: [
      {
        title: 'The same eye, a different scale',
        body: 'Project spaces and artist-run galleries get the care we would bring to an institutional show.',
      },
      {
        title: 'Built for short runs',
        body: 'Tight timelines and one-week shows are the normal case here, not the exception.',
      },
      {
        title: 'Quiet on site',
        body: 'We move through the opening without turning it into a shoot.',
      },
      {
        title: 'Back to you fast',
        body: 'Edited selects while the show is still up.',
      },
    ],
    finalHeading: "Let's document your show.",
    finalBody:
      'Every space is different. Tell us the opening date and what you need the documentation for.',
    finalCta: 'Request availability',
  },
  de: {
    ...baseConfig,
    sectionOrder: SECTION_ORDER,
    canonical: 'https://expose-u.com/de/exhibition-gallery',
    title: 'Ausstellungsdokumentation für Berliner Projekträume',
    description: 'Pressereife Foto- und Videodokumentation für unabhängige Galerien und Projekträume in Berlin, kalkuliert für unabhängige Budgets.',
    ogTitle: 'Ausstellungsdokumentation für Berliner Projekträume | expose.u',
    ogDescription: 'Derselbe Blick, anderer Maßstab. Ausstellungsdokumentation für unabhängige Galerien und Projekträume in Berlin.',
    heroKicker: 'Ausstellungsdokumentation · Berlin',
    h1: 'Derselbe Blick, in Ihrem Maßstab.',
    h1Line1: 'Derselbe Blick, in Ihrem Maßstab.',
    h1Line2: '',
    subheadline: 'Pressereife Foto- und Videoarbeit für Eröffnungen und Installationsansichten, kalkuliert für unabhängige und selbstorganisierte Räume statt für Institutionsbudgets.',
    subheadlineMobile: 'Pressereifes Foto & Video für Berliner Projekträume.',
    heroPriceLine: 'Foto & Video ab 300 € · Berlin · Antwort in 24 Std.',
    heroProofItems: ['Installationsansichten', 'Werkdetails', 'Eröffnungsabend', 'Schnelle Lieferung'],
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
      serviceLabel: 'Ausstellung / Projektraum',
      heading: 'Sagen Sie uns Ihren Eröffnungstermin.',
      body: 'Jeder Raum ist anders. Schicken Sie uns den Termin und wofür Sie die Dokumentation brauchen, und wir melden uns innerhalb eines Tages mit der Verfügbarkeit.',
      nameLabel: 'Name',
      emailLabel: 'E-Mail',
      dateLabel: 'Eröffnungs- oder Aufbautermin',
      dateHint: '(optional)',
      datePlaceholder: 'z. B. 12. September 2026',
      submitLabel: 'Verfügbarkeit anfragen →',
      sendingLabel: 'Wird gesendet…',
      successHeading: 'Erhalten — vielen Dank.',
      successBody: 'Wir haben Ihre Termine erhalten und melden uns innerhalb eines Tages mit Verfügbarkeit und nächsten Schritten.',
      errorGeneric: 'Etwas ist schiefgelaufen – schreiben Sie uns bitte an hello@expose-u.com',
      fullFormLabel: 'Lieber das vollständige Formular?',
      fullFormHref: '/de/contact?service=exhibition-gallery&package=project',
    },
    audienceLabel: 'Für wen das ist',
    audienceHeading: 'Für unabhängige Berliner Galerien und Projekträume',
    audienceGroups: [],
    audienceItems: [
      {
        title: 'Unabhängige Galerien',
        body: 'Eröffnungs- und Installationsdokumentation, einsatzbereit für Website und Social Media.',
      },
      {
        title: 'Selbstorganisierte und Projekträume',
        body: 'Klare, pressereife Dokumentation ohne institutionellen Preis.',
      },
      {
        title: 'Aufstrebende Kurator:innen',
        body: 'Portfoliofertiges Material für jede Ausstellung, auch für eine einwöchige Laufzeit.',
      },
    ],
    includedLabel: 'Was Sie erhalten',
    includedHeading: 'Was Sie erhalten',
    includedLede:
      'Organisiert geliefert und einsatzbereit für Website, Social Media und Archiv, bevor Presse oder Partner danach fragen.',
    includedCards: [
      {
        slug: 'room-and-work',
        title: 'Raum und Arbeit',
        body: 'Klare Ansichten von Raum, Kunstwerk und Installation.',
      },
      {
        slug: 'artwork-detail',
        title: 'Werkdetail',
        body: 'Nahaufnahmen einzelner Werke und Materialien.',
      },
      {
        slug: 'opening-atmosphere',
        title: 'Eröffnungsatmosphäre',
        body: 'Gäste und Raum am Eröffnungsabend, ohne inszenierte Szenen.',
      },
      {
        slug: 'vertical-social',
        title: 'Vertikale Social-Assets',
        body: 'Reels- und Stories-fertige Clips und Bilder, die die Ausstellung über die Laufzeit hinaus sichtbar halten.',
      },
      {
        slug: 'fast-delivery',
        title: 'Schnelle Lieferung',
        body: 'Auswahl schnell verfügbar, abgestimmt auf kurze Ausstellungslaufzeiten.',
      },
    ],
    includedCta: 'Verfügbarkeit anfragen',
    proofLabel: 'Wie wir arbeiten',
    proofItems: [
      {
        title: 'Derselbe Blick, anderer Maßstab',
        body: 'Projekträume und selbstorganisierte Galerien bekommen die Sorgfalt, die wir einer institutionellen Ausstellung widmen würden.',
      },
      {
        title: 'Auf kurze Laufzeiten ausgelegt',
        body: 'Enge Zeitpläne und einwöchige Ausstellungen sind hier der Normalfall, nicht die Ausnahme.',
      },
      {
        title: 'Ruhig vor Ort',
        body: 'Wir bewegen uns durch die Eröffnung, ohne sie in einen Dreh zu verwandeln.',
      },
      {
        title: 'Schnell zurück bei Ihnen',
        body: 'Bearbeitete Auswahl, solange die Ausstellung noch läuft.',
      },
    ],
    finalHeading: 'Lassen Sie uns Ihre Ausstellung dokumentieren.',
    finalBody:
      'Jeder Raum ist anders. Sagen Sie uns das Eröffnungsdatum und wofür Sie die Dokumentation brauchen.',
    finalCta: 'Verfügbarkeit anfragen',
  },
}

export default function ExhibitionGalleryLanding() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
