import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'exhibition-gallery',
  serviceSlug: 'exhibition-gallery',
  ogImage: 'https://expose-u.com/og-exhibition-gallery.jpg',
  heroImage: resolveImagePath('/src/assets/images/landing/gallery_hero_01.jpeg'),
  supportImage: resolveImagePath('src/assets/images/landing/gallery_hero_03.jpeg'),
  metaContentName: 'Exhibition Gallery Landing Page',
  customPixelEvent: 'ExhibitionGalleryLandingView',
}

const configs: Record<'en' | 'de', AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    canonical: 'https://expose-u.com/exhibition-gallery',
    title: 'Exhibition Documentation for Berlin Project Spaces',
    description: 'Press-ready photo and video documentation for independent galleries and artist-run project spaces in Berlin, sized for independent budgets.',
    ogTitle: 'Exhibition Documentation for Berlin Project Spaces | expose.u',
    ogDescription: 'The same eye, a different scale. Exhibition documentation for independent galleries and project spaces in Berlin.',
    h1Line1: 'Exhibition documentation',
    h1Line2: 'for galleries and project spaces.',
    subheadline: 'Press-ready photo and video for openings, installation views and social — sized for independent and artist-run spaces, not institutional budgets.',
    cta: 'Request availability',
    ctaSecondary: "See what's included",
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
    whatItDoesLabel: 'What it does',
    whatItDoesHeading: 'What the documentation does',
    whatItDoesItems: [
      {
        title: 'Openings & installation views',
        body: 'The record of the show, ready before press or partners ask for it.',
      },
      {
        title: 'Website & social',
        body: 'Reels/Stories-ready clips and images that keep the show visible after it closes.',
      },
      {
        title: 'Berlin gallery rhythm',
        body: 'Built around project-space realities — short runs, tight timelines, fast turnarounds.',
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'What you receive',
    includedLede:
      'Delivered organized and ready to use — for the website, social and the archive.',
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
        body: 'Reels- and Stories-ready clips and images.',
      },
      {
        slug: 'fast-delivery',
        title: 'Fast delivery',
        body: 'Selects out quickly, sized for short exhibition runs.',
      },
    ],
    includedCta: 'Request availability',
    proofLabel: 'How we work',
    proofItems: [],
    proofProse: [
      'Same eye, different scale.',
      'We document project spaces and artist-run galleries with the same care as institutional shows — quiet on site, fast to deliver, priced for independent budgets.',
    ],
    finalHeading: "Let's document your show.",
    finalBody:
      'Every space is different. Tell us the opening date and what you need the documentation for.',
    finalCta: 'Request availability',
  },
  de: {
    ...baseConfig,
    canonical: 'https://expose-u.com/de/exhibition-gallery',
    title: 'Ausstellungsdokumentation für Berliner Projekträume',
    description: 'Pressereife Foto- und Videodokumentation für unabhängige Galerien und Projekträume in Berlin, kalkuliert für unabhängige Budgets.',
    ogTitle: 'Ausstellungsdokumentation für Berliner Projekträume | expose.u',
    ogDescription: 'Derselbe Blick, anderer Maßstab. Ausstellungsdokumentation für unabhängige Galerien und Projekträume in Berlin.',
    h1Line1: 'Ausstellungsdokumentation',
    h1Line2: 'für Galerien und Projekträume.',
    subheadline: 'Pressereife Foto- und Videoarbeit für Eröffnungen, Installationsansichten und Social Media — kalkuliert für unabhängige und selbstorganisierte Räume, nicht für Institutionsbudgets.',
    cta: 'Verfügbarkeit anfragen',
    ctaSecondary: 'Sehen Sie, was enthalten ist',
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
    whatItDoesLabel: 'Wofür es genutzt wird',
    whatItDoesHeading: 'Wofür die Dokumentation genutzt wird',
    whatItDoesItems: [
      {
        title: 'Eröffnungen & Installationsansichten',
        body: 'Der Nachweis der Ausstellung, bereit bevor Presse oder Partner danach fragen.',
      },
      {
        title: 'Website & Social Media',
        body: 'Reels- und Stories-fertige Clips und Bilder, die die Ausstellung über die Laufzeit hinaus sichtbar halten.',
      },
      {
        title: 'Berliner Galerie-Rhythmus',
        body: 'Abgestimmt auf die Realität von Projekträumen — kurze Laufzeiten, enge Zeitpläne, schnelle Umsetzung.',
      },
    ],
    includedLabel: 'Was Sie erhalten',
    includedHeading: 'Was Sie erhalten',
    includedLede:
      'Organisiert geliefert und direkt einsatzbereit — für Website, Social Media und Archiv.',
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
        body: 'Reels- und Stories-fertige Clips und Bilder.',
      },
      {
        slug: 'fast-delivery',
        title: 'Schnelle Lieferung',
        body: 'Auswahl schnell verfügbar, abgestimmt auf kurze Ausstellungslaufzeiten.',
      },
    ],
    includedCta: 'Verfügbarkeit anfragen',
    proofLabel: 'Wie wir arbeiten',
    proofItems: [],
    proofProse: [
      'Derselbe Blick, anderer Maßstab.',
      'Wir dokumentieren Projekträume und selbstorganisierte Galerien mit derselben Sorgfalt wie institutionelle Ausstellungen — ruhig vor Ort, schnell in der Lieferung, kalkuliert für unabhängige Budgets.',
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
