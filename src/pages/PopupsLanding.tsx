import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'popups',
  serviceSlug: 'popups',
  ctaPackage: 'project',
  ogImage: 'https://expose-u.com/og-popups.jpg',
  heroImage: resolveImagePath('src/assets/images/landing/popup_hero.webp'),
  supportImage: resolveImagePath('src/assets/images/landing/popup_02.webp'),
  // No supportImages carousel here: there's no pop-up set under
  // assets/images/services, so the static supportImage above stays.
  metaContentName: 'Popups Landing Page',
  customPixelEvent: 'PopupsLandingView',
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
    canonical: 'https://expose-u.com/popups',
    title: 'Pop-up Documentation Berlin',
    description: 'Photo and video documentation for brand, design, culinary and fashion pop-ups in Berlin. Built for recap, press and the next launch.',
    ogTitle: 'Pop-up Documentation Berlin | expose.u',
    ogDescription: 'Your pop-up is temporary. The documentation should keep working after it closes. Photo and video for brand, design and culinary pop-ups in Berlin.',
    heroKicker: 'Pop-up documentation · Berlin',
    h1: 'Your pop-up is temporary. The documentation should last.',
    h1Line1: 'Your pop-up is temporary. The documentation should last.',
    h1Line2: '',
    subheadline: 'Photo and video for brand pop-ups, culinary concepts, design activations and temporary retail in Berlin, built for recap, press and the next launch.',
    subheadlineMobile: 'Photo & video for Berlin pop-ups. Built to outlast the run.',
    heroPriceLine: 'Photo & video coverage from €300 · Berlin · 24h reply',
    heroProofItems: ['Space photos', 'Product moments', 'Vertical clips', 'Same-week selects'],
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
      serviceLabel: 'Pop-up / Activation',
      heading: 'Send us your opening window.',
      body: 'Pop-ups run short, so dates matter. Tell us when you open and what you need the documentation for, and we will come back within a day with availability.',
      nameLabel: 'Name',
      emailLabel: 'Email',
      dateLabel: 'Opening or run dates',
      dateHint: '(optional)',
      datePlaceholder: 'e.g. 12 September 2026',
      submitLabel: 'Request availability →',
      sendingLabel: 'Sending…',
      successHeading: 'Got it — thank you.',
      successBody: "We've received your dates and will get back to you within a day with availability and next steps.",
      errorGeneric: 'Something went wrong — please email us at hello@expose-u.com',
      fullFormLabel: 'Prefer the full form?',
      fullFormHref: '/contact?service=popups&package=project',
    },
    audienceLabel: 'Who this is for',
    audienceHeading: 'For brand, culinary and design pop-ups',
    audienceGroups: [],
    audienceItems: [
      {
        title: 'Brand and product teams',
        body: 'Pop-up shops, product drops and launch days documented for recap and reporting.',
      },
      {
        title: 'Chefs and culinary concepts',
        body: 'Takeovers and food pop-ups, documented without slowing down service.',
      },
      {
        title: 'Designers and fashion labels',
        body: 'Activations and temporary retail, documented at portfolio quality.',
      },
      {
        title: 'Cultural and design projects',
        body: 'Installations and community-facing pop-ups, documented with the same care as a gallery show.',
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'What you receive',
    includedLede:
      'Organized and ready to use for social, press, partners and the next launch.',
    includedCards: [
      {
        slug: 'space-photos',
        title: 'Space photos',
        body: 'Clean views of the setup, layout and design.',
      },
      {
        slug: 'product-moments',
        title: 'Product moments',
        body: 'Details, displays, food and materials, shot as hero images.',
      },
      {
        slug: 'visitor-energy',
        title: 'Visitor energy',
        body: 'People browsing, tasting and interacting — without staged scenes.',
      },
      {
        slug: 'vertical-clips',
        title: 'Vertical clips',
        body: 'Short moments for reels, stories and launch recaps.',
      },
      {
        slug: 'same-week-selects',
        title: 'Same-week selects',
        body: 'A focused set ready for same-week posting and partner updates.',
      },
      {
        slug: 'partner-assets',
        title: 'Partner assets',
        body: 'Material for collaborators, hosts, sponsors and press follow-up.',
      },
    ],
    includedCta: 'Request availability',
    proofLabel: 'How we work',
    proofItems: [
      {
        title: 'Built for short runs',
        body: 'We work around limited opening windows and tight schedules.',
      },
      {
        title: 'Never in the way',
        body: 'One or two of us on site, never slowing down service or the room.',
      },
      {
        title: 'Photo and video, one team',
        body: 'Stills and motion covered together on the same day.',
      },
      {
        title: 'Same-week selects',
        body: 'A focused set ready to post while the pop-up is still news.',
      },
    ],
    finalHeading: 'Make the moment last.',
    finalBody:
      'Your pop-up may run for a few days. The right documentation keeps working after the doors close — for recap, partners and the next pitch.',
    finalCta: 'Request availability',
  },
  de: {
    ...baseConfig,
    sectionOrder: SECTION_ORDER,
    canonical: 'https://expose-u.com/de/popups',
    title: 'Pop-up-Dokumentation Berlin',
    description: 'Foto- und Videodokumentation für Brand-, Design-, Culinary- und Fashion-Pop-ups in Berlin. Für Recap, Presse und den nächsten Launch.',
    ogTitle: 'Pop-up-Dokumentation Berlin | expose.u',
    ogDescription: 'Ihr Pop-up ist temporär. Die Dokumentation sollte weiterarbeiten. Foto und Video für Brand-, Design- und Culinary-Pop-ups in Berlin.',
    heroKicker: 'Pop-up-Dokumentation · Berlin',
    h1: 'Ihr Pop-up ist temporär. Die Dokumentation sollte bleiben.',
    h1Line1: 'Ihr Pop-up ist temporär. Die Dokumentation sollte bleiben.',
    h1Line2: '',
    subheadline: 'Foto und Video für Brand-Pop-ups, kulinarische Konzepte, Design-Activations und temporären Retail in Berlin, für Recap, Presse und den nächsten Launch.',
    subheadlineMobile: 'Foto & Video für Berliner Pop-ups. Gemacht, um zu bleiben.',
    heroPriceLine: 'Foto & Video ab 300 € · Berlin · Antwort in 24 Std.',
    heroProofItems: ['Space-Fotos', 'Produktmomente', 'Vertikale Clips', 'Selects in derselben Woche'],
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
      serviceLabel: 'Pop-up / Activation',
      heading: 'Schicken Sie uns Ihr Opening Window.',
      body: 'Pop-ups laufen kurz, deshalb zählen die Termine. Sagen Sie uns, wann Sie öffnen und wofür Sie die Dokumentation brauchen, und wir melden uns innerhalb eines Tages mit der Verfügbarkeit.',
      nameLabel: 'Name',
      emailLabel: 'E-Mail',
      dateLabel: 'Eröffnungs- oder Laufzeittermine',
      dateHint: '(optional)',
      datePlaceholder: 'z. B. 12. September 2026',
      submitLabel: 'Verfügbarkeit anfragen →',
      sendingLabel: 'Wird gesendet…',
      successHeading: 'Erhalten — vielen Dank.',
      successBody: 'Wir haben Ihre Termine erhalten und melden uns innerhalb eines Tages mit Verfügbarkeit und nächsten Schritten.',
      errorGeneric: 'Etwas ist schiefgelaufen – schreiben Sie uns bitte an hello@expose-u.com',
      fullFormLabel: 'Lieber das vollständige Formular?',
      fullFormHref: '/de/contact?service=popups&package=project',
    },
    audienceLabel: 'Für wen das ist',
    audienceHeading: 'Für Brand-, Culinary- und Design-Pop-ups',
    audienceGroups: [],
    audienceItems: [
      {
        title: 'Brand- und Produktteams',
        body: 'Pop-up Shops, Product Drops und Launch Days, dokumentiert für Recap und Reporting.',
      },
      {
        title: 'Chefs und kulinarische Konzepte',
        body: 'Takeovers und Food-Pop-ups, dokumentiert ohne den Service zu verlangsamen.',
      },
      {
        title: 'Designer:innen und Fashion Labels',
        body: 'Activations und temporärer Retail, dokumentiert auf Portfolio-Niveau.',
      },
      {
        title: 'Kultur- und Design-Projekte',
        body: 'Installationen und community-orientierte Pop-ups, dokumentiert mit derselben Sorgfalt wie eine Ausstellung.',
      },
    ],
    includedLabel: 'Was Sie erhalten',
    includedHeading: 'Was Sie erhalten',
    includedLede:
      'Organisiert geliefert und einsatzbereit für Social, Presse, Partner und den nächsten Launch.',
    includedCards: [
      {
        slug: 'space-photos',
        title: 'Space-Fotos',
        body: 'Klare Views von Setup, Layout und Design.',
      },
      {
        slug: 'product-moments',
        title: 'Produktmomente',
        body: 'Details, Displays, Food und Materialien als Hero Shots.',
      },
      {
        slug: 'visitor-energy',
        title: 'Visitor Energy',
        body: 'Menschen beim Browsen, Probieren und Interagieren — ohne inszenierte Szenen.',
      },
      {
        slug: 'vertical-clips',
        title: 'Vertikale Clips',
        body: 'Kurze Momente für Reels, Stories und Launch-Recaps.',
      },
      {
        slug: 'same-week-selects',
        title: 'Same-week Selects',
        body: 'Ein fokussiertes Set, bereit für Same-week Posting und Partner-Updates.',
      },
      {
        slug: 'partner-assets',
        title: 'Partner-Assets',
        body: 'Material für Collaborators, Hosts, Sponsoren und Presse-Follow-up.',
      },
    ],
    includedCta: 'Verfügbarkeit anfragen',
    proofLabel: 'Wie wir arbeiten',
    proofItems: [
      {
        title: 'Gemacht für kurze Laufzeiten',
        body: 'Wir arbeiten um limitierte Opening Windows und enge Timings herum.',
      },
      {
        title: 'Nie im Weg',
        body: 'Ein bis zwei Personen vor Ort, ohne Service oder Raum zu verlangsamen.',
      },
      {
        title: 'Foto und Video, ein Team',
        body: 'Stills und Bewegtbild zusammen abgedeckt, am selben Tag.',
      },
      {
        title: 'Selects in derselben Woche',
        body: 'Ein fokussiertes Set, bereit zum Posten, solange das Pop-up noch aktuell ist.',
      },
    ],
    finalHeading: 'Machen Sie den Moment haltbar.',
    finalBody:
      'Ihr Pop-up läuft vielleicht nur ein paar Tage. Die richtige Dokumentation arbeitet weiter, nachdem die Türen schließen — für Recap, Partner und den nächsten Pitch.',
    finalCta: 'Verfügbarkeit anfragen',
  },
}

export default function PopupsLanding() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
