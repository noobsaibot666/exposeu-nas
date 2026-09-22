import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'brand-agency',
  serviceSlug: 'brand-agency',
  ctaPackage: 'project',
  ogImage: 'https://expose-u.com/og-brand-agency.jpg',
  heroImage: resolveImagePath('src/assets/images/landing/agency_hero_01.webp'),
  supportImage: resolveImagePath('src/assets/images/landing/agency_hero.webp'),
  // No supportImages carousel here: only two agency frames exist on disk, so
  // the static supportImage above stays (ImageCarousel needs 2+ to be worth it).
  metaContentName: 'Brand Agency Landing Page',
  customPixelEvent: 'BrandAgencyLandingView',
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

// The offer first, then how we shoot, then who it's for. `usage` keeps this
// page's platform breakdown, which the other landing pages don't carry.
const SECTION_ORDER: AdLandingPageConfig['sectionOrder'] = ['included', 'proof', 'audience', 'usage']

const configs: Record<'en' | 'de', AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    sectionOrder: SECTION_ORDER,
    canonical: 'https://expose-u.com/brand-agency',
    title: 'Brand & Agency Documentation Berlin',
    description: 'Photo and video documentation for brand activations, installations and agency-built environments in Berlin. Built for case studies, award submissions and client presentations.',
    ogTitle: 'Brand & Agency Documentation Berlin | expose.u',
    ogDescription: 'Documentation for designed experiences. Photo and video for agencies, brand activations and installations in Berlin.',
    heroKicker: 'Brand & agency documentation · Berlin',
    h1: 'Documentation for designed experiences.',
    h1Line1: 'Documentation for designed experiences.',
    h1Line2: '',
    subheadline: 'Photo and video for brand activations, installations and agency-built environments.\nBuilt for case studies, award submissions and client presentations.',
    subheadlineMobile: 'Photo & video for brand activations and installations.',
    heroPriceLine: 'Photo & video coverage from €300 · Berlin · 24h reply',
    heroProofItems: ['Hero photography', 'Spatial sequences', 'Award submissions', 'Organized delivery'],
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
      serviceLabel: 'Brand / Agency',
      heading: 'Tell us about the project.',
      body: 'Every project has different requirements. Send us the dates and what you need the documentation for, and we will come back within a day with availability.',
      nameLabel: 'Name',
      emailLabel: 'Email',
      dateLabel: 'Shoot or install date',
      dateHint: '(optional)',
      datePlaceholder: 'e.g. 12 September 2026',
      submitLabel: 'Request availability →',
      sendingLabel: 'Sending…',
      successHeading: 'Got it — thank you.',
      successBody: "We've received your details and will get back to you within a day with availability and next steps.",
      errorGeneric: 'Something went wrong — please email us at hello@expose-u.com',
      fullFormLabel: 'Prefer the full form?',
      fullFormHref: '/contact?service=brand-agency&package=project',
    },
    audienceLabel: 'Who we work with',
    audienceHeading: 'For agencies and creative teams',
    audienceGroups: [],
    audienceItems: [
      {
        title: 'Experience design agencies',
        body: 'Spatial documentation for award submissions, case studies and new business.',
      },
      {
        title: 'Creative and production studios',
        body: 'Activations, installations and environments documented for client handover and portfolio.',
      },
      {
        title: 'Brand teams',
        body: 'Product launches, events and campaigns documented for press and campaign follow-up.',
      },
      {
        title: 'Exhibition designers and architects',
        body: 'Finished spaces documented at the standard your portfolio requires.',
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'Everything you need to prove the project worked.',
    includedLede: 'One shoot gives you documentation for case studies, award submissions, client handover and portfolio.',
    includedCards: [
      { slug: 'hero-photography', title: 'Hero photography', body: 'Strong wide shots that show the full project, space and scale.' },
      { slug: 'spatial-documentation', title: 'Spatial documentation sequences', body: 'Sequential coverage of the finished environment, room by room.' },
      { slug: 'vertical-social', title: 'Vertical social content', body: 'Assets that work across formats, from editorial to vertical.' },
      { slug: 'bts', title: 'Behind-the-scenes', body: 'Process and build documentation for case studies and portfolio.' },
      { slug: 'award-submission', title: 'Award submission imagery', body: 'Hero imagery and spatial sequences built for competition formats.' },
      { slug: 'case-study', title: 'Website case study material', body: 'Case study material at the quality your portfolio requires.' },
      { slug: 'presentation', title: 'Presentation-ready assets', body: 'Visual evidence that your work performs in presentation.' },
      { slug: 'organized-delivery', title: 'Organized delivery', body: 'Clean file structure for handover to clients and teams.' },
    ],
    includedCta: 'Request availability',
    proofLabel: 'How we work',
    proofItems: [
      {
        title: 'Small crew, quiet production',
        body: 'Planned, precise and unobtrusive on site.',
      },
      {
        title: 'We work the way designers work',
        body: 'We understand how agencies present finished work and what the documentation needs to say.',
      },
      {
        title: 'Photo and video, one team',
        body: 'Stills and motion covered together, out of one Berlin-based crew.',
      },
      {
        title: 'One shoot, every format',
        body: 'Case studies, award submissions, client handover and portfolio all come out of the same day.',
      },
    ],
    usageLabel: 'Where it works',
    usageHeading: 'Your documentation needs to work everywhere.',
    usageIntro: 'One project gives you assets for the places agencies and brands actually need to show up.',
    platforms: [
      { name: 'Portfolio', use: 'Show the project with images that reflect the quality of the delivery.' },
      { name: 'Case studies', use: 'Build a clear visual story around space, interaction and result.' },
      { name: 'Press', use: 'Send selected images and clips to media, partners and brand channels.' },
      { name: 'Pitch decks', use: 'Use real proof of previous work when presenting the next idea.' },
      { name: 'Client recap', use: 'Give the client clean documentation of what was built and experienced.' },
      { name: 'Social channels', use: 'Share strong moments without reducing the project to quick snapshots.' },
    ],
    usageCta: 'Request availability',
    finalHeading: 'Let us document the project.',
    finalBody: 'Every project has different requirements.\n\nWe build proposals together based on scope, timeline and what you need the documentation for.',
    finalCta: 'Request availability',
  },
  de: {
    ...baseConfig,
    sectionOrder: SECTION_ORDER,
    canonical: 'https://expose-u.com/de/brand-agency',
    title: 'Brand & Agency Dokumentation Berlin',
    description: 'Foto- und Videodokumentation für Markenaktivierungen, Agenturen und gestaltete Erfahrungen in Berlin. Für Fallstudien, Award-Einreichungen und Kundenpräsentationen.',
    ogTitle: 'Brand & Agency Dokumentation Berlin | expose.u',
    ogDescription: 'Dokumentation für gestaltete Erfahrungen. Foto und Video für Agenturen, Markenaktivierungen und Installationen in Berlin.',
    heroKicker: 'Brand- & Agency-Dokumentation · Berlin',
    h1: 'Dokumentation für gestaltete Erfahrungen.',
    h1Line1: 'Dokumentation für gestaltete Erfahrungen.',
    h1Line2: '',
    subheadline: 'Foto und Video für Markenaktivierungen, Installationen und agenturgestaltete Umgebungen.\nFür Fallstudien, Award-Einreichungen und Kundenpräsentationen.',
    subheadlineMobile: 'Foto & Video für Markenaktivierungen und Installationen.',
    heroPriceLine: 'Foto & Video ab 300 € · Berlin · Antwort in 24 Std.',
    heroProofItems: ['Hero-Fotografie', 'Raumsequenzen', 'Award-Einreichungen', 'Organisierte Lieferung'],
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
      serviceLabel: 'Brand / Agentur',
      heading: 'Erzählen Sie uns von dem Projekt.',
      body: 'Jedes Projekt hat andere Anforderungen. Schicken Sie uns die Termine und wofür Sie die Dokumentation brauchen, und wir melden uns innerhalb eines Tages mit der Verfügbarkeit.',
      nameLabel: 'Name',
      emailLabel: 'E-Mail',
      dateLabel: 'Dreh- oder Aufbautermin',
      dateHint: '(optional)',
      datePlaceholder: 'z. B. 12. September 2026',
      submitLabel: 'Verfügbarkeit anfragen →',
      sendingLabel: 'Wird gesendet…',
      successHeading: 'Erhalten — vielen Dank.',
      successBody: 'Wir haben Ihre Angaben erhalten und melden uns innerhalb eines Tages mit Verfügbarkeit und nächsten Schritten.',
      errorGeneric: 'Etwas ist schiefgelaufen – schreiben Sie uns bitte an hello@expose-u.com',
      fullFormLabel: 'Lieber das vollständige Formular?',
      fullFormHref: '/de/contact?service=brand-agency&package=project',
    },
    audienceLabel: 'Mit wem wir arbeiten',
    audienceHeading: 'Für Agenturen und kreative Teams',
    audienceBody: [
      'Experience-Design-Agenturen. Kreativstudios. Markenteams. Produktionshäuser. Ausstellungsgestalter.',
      'Wenn Sie etwas bauen, das es wert ist gesehen zu werden, dokumentieren wir es richtig.',
    ],
    audienceGroups: [],
    audienceItems: [
      {
        title: 'Experience-Design-Agenturen',
        body: 'Raumdokumentation für Award-Einreichungen, Fallstudien und Neukundengewinnung.',
      },
      {
        title: 'Kreativ- und Produktionsstudios',
        body: 'Aktivierungen, Installationen und Environments dokumentiert für Kundenabgabe und Portfolio.',
      },
      {
        title: 'Markenteams',
        body: 'Produktlaunches, Events und Kampagnen dokumentiert für Presse und Follow-up.',
      },
      {
        title: 'Ausstellungsgestalter und Architekten',
        body: 'Fertige Räume dokumentiert auf dem Niveau, das Ihr Portfolio verlangt.',
      },
    ],
    includedLabel: 'Was Sie erhalten',
    includedHeading: 'Alles, was Sie brauchen, um zu zeigen, dass das Projekt funktioniert hat.',
    includedLede: 'Eine Produktion gibt Ihnen Dokumentation für Fallstudien, Award-Einreichungen, Kundenabgabe und Portfolio.',
    includedCards: [
      { slug: 'hero-photography', title: 'Hero-Fotografie', body: 'Starke Wide Shots, die Projekt, Raum und Scale zeigen.' },
      { slug: 'spatial-documentation', title: 'Räumliche Dokumentationssequenzen', body: 'Sequenzielle Abdeckung des fertigen Environments, Raum für Raum.' },
      { slug: 'vertical-social', title: 'Vertikaler Social-Content', body: 'Assets, die über Formate hinweg funktionieren, von Editorial bis Vertikal.' },
      { slug: 'bts', title: 'Behind-the-Scenes', body: 'Prozess- und Build-Dokumentation für Fallstudien und Portfolio.' },
      { slug: 'award-submission', title: 'Award-Dokumentation', body: 'Hero-Aufnahmen und Raumsequenzen für Wettbewerbsformate.' },
      { slug: 'case-study', title: 'Website-Fallstudien-Material', body: 'Fallstudien-Material in der Qualität, die Ihr Portfolio braucht.' },
      { slug: 'presentation', title: 'Präsentationsfertige Assets', body: 'Visueller Nachweis, dass Ihre Arbeit im Pitch funktioniert.' },
      { slug: 'organized-delivery', title: 'Organisierte Lieferung', body: 'Klare Dateistruktur für die Übergabe an Kunden und Teams.' },
    ],
    includedCta: 'Verfügbarkeit anfragen',
    proofLabel: 'So arbeiten wir',
    proofItems: [
      {
        title: 'Kleines Team, ruhige Produktion',
        body: 'Geplant, präzise und unaufdringlich vor Ort.',
      },
      {
        title: 'Wir arbeiten, wie Designer arbeiten',
        body: 'Wir verstehen, wie Agenturen fertige Arbeit präsentieren und was die Dokumentation dafür leisten muss.',
      },
      {
        title: 'Foto und Video, ein Team',
        body: 'Stills und Bewegtbild zusammen abgedeckt, aus einem Berliner Team.',
      },
      {
        title: 'Eine Produktion, alle Formate',
        body: 'Fallstudien, Award-Einreichungen, Kundenabgabe und Portfolio entstehen am selben Tag.',
      },
    ],
    usageLabel: 'Wo es funktioniert',
    usageHeading: 'Ihre Dokumentation muss überall funktionieren.',
    usageIntro: 'Ein Projekt gibt Ihnen Assets für die Orte, an denen Agenturen und Brands sichtbar sein müssen.',
    platforms: [
      { name: 'Portfolio', use: 'Zeigt das Projekt mit Bildern, die die Qualität der Delivery widerspiegeln.' },
      { name: 'Case Studies', use: 'Baut eine klare visuelle Story aus Raum, Interaktion und Ergebnis.' },
      { name: 'Presse', use: 'Sendet ausgewählte Bilder und Clips an Medien, Partner und Brand Channels.' },
      { name: 'Pitch Decks', use: 'Nutzt echten Proof aus früherer Arbeit für die nächste Idee.' },
      { name: 'Client Recap', use: 'Gibt dem Kunden eine klare Dokumentation dessen, was gebaut und erlebt wurde.' },
      { name: 'Social Channels', use: 'Teilt starke Momente, ohne das Projekt auf schnelle Snapshots zu reduzieren.' },
    ],
    usageCta: 'Verfügbarkeit anfragen',
    finalHeading: 'Lassen Sie uns das Projekt dokumentieren.',
    finalBody: 'Jedes Projekt hat unterschiedliche Anforderungen.\n\nWir entwickeln Angebote gemeinsam, basierend auf Umfang, Timeline und dem, wofür Sie die Dokumentation brauchen.',
    finalCta: 'Verfügbarkeit anfragen',
  },
}

export default function BrandAgencyLanding() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
