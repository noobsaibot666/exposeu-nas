import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'popups',
  serviceSlug: 'popups',
  ogImage: 'https://expose-u.com/og-popups.jpg',
  heroImage: resolveImagePath('src/assets/images/landing/popup_hero.webp'),
  supportImage: resolveImagePath('src/assets/images/landing/popup_02.webp'),
  metaContentName: 'Popups Landing Page',
  customPixelEvent: 'PopupsLandingView',
}

const configs: Record<'en' | 'de', AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    canonical: 'https://expose-u.com/popups',
    title: 'Pop-up Documentation Berlin',
    description: 'Photo and video documentation for brand, design, culinary and fashion pop-ups in Berlin. Built for recap, press and the next launch.',
    ogTitle: 'Pop-up Documentation Berlin | expose.u',
    ogDescription: 'Your pop-up is temporary. The documentation should keep working after it closes. Photo and video for brand, design and culinary pop-ups in Berlin.',
    h1Line1: 'Your pop-up is temporary.',
    h1Line2: 'The documentation should last.',
    subheadline: 'Photo and video for brand pop-ups, culinary concepts, design activations and temporary retail in Berlin — built for recap, press and the next launch.',
    cta: 'Request availability',
    ctaSecondary: "See what's included",
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
    whatItDoesLabel: 'What it does',
    whatItDoesHeading: 'What the documentation does',
    whatItDoesItems: [
      {
        title: 'Recap & social proof',
        body: 'Same-week selects ready for launch recaps and posts.',
      },
      {
        title: 'Press & partner reporting',
        body: 'Assets for listings, launch notes and sponsor updates.',
      },
      {
        title: 'Future campaign assets',
        body: 'Material that pitches, announces and sells the next pop-up.',
      },
      {
        title: 'Website & portfolio',
        body: 'Clean proof of the space, product and audience for your site.',
      },
      {
        title: 'Vertical social content',
        body: 'Reels- and Stories-ready clips from the day.',
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'What you receive',
    includedLede:
      'Delivered organized and ready to use — for social, press, partners and the next launch.',
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
    proofItems: [],
    proofProse: [
      'Built for short runs.',
      'We work around limited opening windows and tight schedules — one or two people on site, never slowing down service or the room. Photo and video from one team, with a focused set ready for same-week posting.',
    ],
    finalHeading: 'Make the moment last.',
    finalBody:
      'Your pop-up may run for a few days. The right documentation keeps working after the doors close — for recap, partners and the next pitch.',
    finalCta: 'Request availability',
  },
  de: {
    ...baseConfig,
    canonical: 'https://expose-u.com/de/popups',
    title: 'Pop-up-Dokumentation Berlin',
    description: 'Foto- und Videodokumentation für Brand-, Design-, Culinary- und Fashion-Pop-ups in Berlin. Für Recap, Presse und den nächsten Launch.',
    ogTitle: 'Pop-up-Dokumentation Berlin | expose.u',
    ogDescription: 'Dein Pop-up ist temporär. Die Dokumentation sollte weiterarbeiten. Foto und Video für Brand-, Design- und Culinary-Pop-ups in Berlin.',
    h1Line1: 'Dein Pop-up ist temporär.',
    h1Line2: 'Die Dokumentation sollte bleiben.',
    subheadline: 'Foto und Video für Brand-Pop-ups, kulinarische Konzepte, Design-Activations und temporären Retail in Berlin — für Recap, Presse und den nächsten Launch.',
    cta: 'Verfügbarkeit anfragen',
    ctaSecondary: 'Sieh, was dabei ist',
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
    whatItDoesLabel: 'Wofür es genutzt wird',
    whatItDoesHeading: 'Wofür die Dokumentation genutzt wird',
    whatItDoesItems: [
      {
        title: 'Recap & Social Proof',
        body: 'Same-week Selects, bereit für Launch-Recaps und Posts.',
      },
      {
        title: 'Presse & Partner-Reporting',
        body: 'Assets für Listings, Launch Notes und Sponsoren-Updates.',
      },
      {
        title: 'Zukünftige Kampagnen-Assets',
        body: 'Material, das das nächste Pop-up pitcht, ankündigt und verkauft.',
      },
      {
        title: 'Website & Portfolio',
        body: 'Klarer Proof von Space, Produkt und Publikum für deine Website.',
      },
      {
        title: 'Vertikaler Social-Content',
        body: 'Reels- und Stories-fertige Clips vom Tag.',
      },
    ],
    includedLabel: 'Was du bekommst',
    includedHeading: 'Was du erhältst',
    includedLede:
      'Organisiert geliefert und direkt einsatzbereit — für Social, Presse, Partner und den nächsten Launch.',
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
    proofItems: [],
    proofProse: [
      'Gemacht für kurze Laufzeiten.',
      'Wir arbeiten um limitierte Opening Windows und enge Timings herum — ein bis zwei Personen vor Ort, ohne Service oder Raum zu verlangsamen. Foto und Video aus einer Hand, mit einem fokussierten Set, bereit für Same-week Posting.',
    ],
    finalHeading: 'Mach den Moment haltbar.',
    finalBody:
      'Dein Pop-up läuft vielleicht nur ein paar Tage. Die richtige Dokumentation arbeitet weiter, nachdem die Türen schließen — für Recap, Partner und den nächsten Pitch.',
    finalCta: 'Verfügbarkeit anfragen',
  },
}

export default function PopupsLanding() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
