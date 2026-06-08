import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'brand-agency',
  serviceSlug: 'brand-agency',
  ogImage: 'https://expose-u.com/og-brand-agency.jpg',
  heroImage: resolveImagePath('src/assets/images/landing/agency_hero_01.jpeg'),
  supportImage: resolveImagePath('src/assets/images/landing/agency_hero.jpeg'),
  metaContentName: 'Brand Agency Landing Page',
  customPixelEvent: 'BrandAgencyLandingView',
}

const configs: Record<'en' | 'de', AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    canonical: 'https://expose-u.com/brand-agency',
    title: 'Brand & Agency Documentation Berlin — expose.u',
    description: 'Photo and video documentation for brand activations, agencies and designed experiences in Berlin. Award submissions, case studies, client presentations.',
    ogTitle: 'Brand & Agency Documentation Berlin — expose.u',
    ogDescription: 'Documentation for designed experiences. Photo and video for agencies, brand activations and installations in Berlin.',
    h1: 'Documentation for Designed Experiences',
    h1Line1: 'Documentation for Designed Experiences',
    h1Line2: '',
    subheadline: 'Photo and video for brand activations, installations and agency-built environments.\nBuilt for case studies, award submissions and client presentations.',
    cta: 'Request availability',
    ctaSecondary: 'See what is included',
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
    whatItDoesLabel: 'What it does',
    whatItDoesHeading: 'What the documentation does',
    whatItDoesItems: [
      { title: 'Awards submissions', body: 'Hero imagery and spatial sequences built for competition formats.' },
      { title: 'New business pitches', body: 'Visual evidence that your work performs in presentation.' },
      { title: 'Client deliverables', body: 'Professional documentation of the finished experience for handover.' },
      { title: 'Portfolio and website', body: 'Case study material at the quality your portfolio requires.' },
      { title: 'Press and social', body: 'Assets that work across formats, from editorial to vertical.' },
    ],
    includedLabel: 'What you get',
    includedHeading: 'Everything you need to prove the project worked.',
    includedLede: 'One shoot gives you documentation for case studies, award submissions, client handover, and portfolio.',
    includedCards: [
      { slug: 'hero-photography', title: 'Hero photography', body: 'Strong wide shots that show the full project, space, and scale.' },
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
    proofItems: [],
    proofProse: [
      'Small crew. Quiet production.',
      'We work the way designers work — planned, precise, unobtrusive. We understand how agencies present finished work and what the documentation needs to say. Photo and video from one team. Berlin-based.',
    ],
    usageLabel: 'Where it works',
    usageHeading: 'Your documentation needs to work everywhere.',
    usageIntro: 'One project gives you assets for the places agencies and brands actually need to show up.',
    platforms: [
      { name: 'Portfolio', use: 'Show the project with images that reflect the quality of the delivery.' },
      { name: 'Case studies', use: 'Build a clear visual story around space, interaction, and result.' },
      { name: 'Press', use: 'Send selected images and clips to media, partners, and brand channels.' },
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
    canonical: 'https://expose-u.com/de/brand-agency',
    title: 'Brand & Agency Dokumentation Berlin — expose.u',
    description: 'Foto- und Videodokumentation für Markenaktivierungen, Agenturen und gestaltete Erfahrungen in Berlin. Award-Einreichungen, Fallstudien, Kundenpräsentationen.',
    ogTitle: 'Brand & Agency Dokumentation Berlin — expose.u',
    ogDescription: 'Dokumentation für gestaltete Erfahrungen. Foto und Video für Agenturen, Markenaktivierungen und Installationen in Berlin.',
    h1: 'Dokumentation für gestaltete Erfahrungen',
    h1Line1: 'Dokumentation für gestaltete Erfahrungen',
    h1Line2: '',
    subheadline: 'Foto und Video für Markenaktivierungen, Installationen und agenturgestaltete Umgebungen.\nFür Fallstudien, Award-Einreichungen und Kundenpräsentationen.',
    cta: 'Verfügbarkeit anfragen',
    ctaSecondary: 'Sieh, was dabei ist',
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
    whatItDoesLabel: 'Wofür es genutzt wird',
    whatItDoesHeading: 'Wofür die Dokumentation genutzt wird',
    whatItDoesItems: [
      { title: 'Award-Einreichungen', body: 'Hero-Aufnahmen und Raumsequenzen für Wettbewerbsformate.' },
      { title: 'Neukundenpräsentationen', body: 'Visueller Nachweis, dass Ihre Arbeit im Pitch funktioniert.' },
      { title: 'Kundenabgabe', body: 'Professionelle Dokumentation des fertigen Erlebnisses für die Übergabe.' },
      { title: 'Portfolio und Website', body: 'Fallstudien-Material in der Qualität, die Ihr Portfolio braucht.' },
      { title: 'Presse und Social Media', body: 'Assets, die über Formate hinweg funktionieren — von Editorial bis Vertikal.' },
    ],
    includedLabel: 'Was du bekommst',
    includedHeading: 'Alles, was du brauchst, um zu zeigen, dass das Projekt funktioniert hat.',
    includedLede: 'Eine Produktion gibt dir Dokumentation für Fallstudien, Award-Einreichungen, Kundenabgabe und Portfolio.',
    includedCards: [
      { slug: 'hero-photography', title: 'Hero-Fotografie', body: 'Starke Wide Shots, die Projekt, Raum und Scale zeigen.' },
      { slug: 'spatial-documentation', title: 'Räumliche Dokumentationssequenzen', body: 'Sequenzielle Abdeckung des fertigen Environments, Raum für Raum.' },
      { slug: 'vertical-social', title: 'Vertikaler Social-Content', body: 'Assets, die über Formate hinweg funktionieren — von Editorial bis Vertikal.' },
      { slug: 'bts', title: 'Behind-the-Scenes', body: 'Prozess- und Build-Dokumentation für Fallstudien und Portfolio.' },
      { slug: 'award-submission', title: 'Award-Dokumentation', body: 'Hero-Aufnahmen und Raumsequenzen für Wettbewerbsformate.' },
      { slug: 'case-study', title: 'Website-Fallstudien-Material', body: 'Fallstudien-Material in der Qualität, die Ihr Portfolio braucht.' },
      { slug: 'presentation', title: 'Präsentationsfertige Assets', body: 'Visueller Nachweis, dass Ihre Arbeit im Pitch funktioniert.' },
      { slug: 'organized-delivery', title: 'Organisierte Lieferung', body: 'Klare Dateistruktur für die Übergabe an Kunden und Teams.' },
    ],
    includedCta: 'Verfügbarkeit anfragen',
    proofLabel: 'So arbeiten wir',
    proofItems: [],
    proofProse: [
      'Kleines Team. Ruhige Produktion.',
      'Wir arbeiten so, wie Designer arbeiten — geplant, präzise, unaufdringlich. Wir verstehen, wie Agenturen fertige Arbeit präsentieren und was die Dokumentation dafür leisten muss. Foto und Video aus einer Hand. Berlin-basiert.',
    ],
    usageLabel: 'Wo es funktioniert',
    usageHeading: 'Deine Dokumentation muss überall funktionieren.',
    usageIntro: 'Ein Projekt gibt dir Assets für die Orte, an denen Agenturen und Brands sichtbar sein müssen.',
    platforms: [
      { name: 'Portfolio', use: 'Zeigt das Projekt mit Bildern, die die Qualität der Delivery widerspiegeln.' },
      { name: 'Case Studies', use: 'Baut eine klare visuelle Story aus Raum, Interaktion und Ergebnis.' },
      { name: 'Presse', use: 'Sendet ausgewählte Bilder und Clips an Medien, Partner und Brand Channels.' },
      { name: 'Pitch Decks', use: 'Nutzt echten Proof aus früherer Arbeit für die nächste Idee.' },
      { name: 'Client Recap', use: 'Gebt dem Client eine klare Dokumentation dessen, was gebaut und erlebt wurde.' },
      { name: 'Social Channels', use: 'Teilt starke Momente, ohne das Projekt auf schnelle Snapshots zu reduzieren.' },
    ],
    usageCta: 'Verfügbarkeit anfragen',
    finalHeading: 'Lass uns das Projekt dokumentieren.',
    finalBody: 'Jedes Projekt hat unterschiedliche Anforderungen.\n\nWir entwickeln Angebote gemeinsam — basierend auf Umfang, Timeline und dem, wofür Sie die Dokumentation brauchen.',
    finalCta: 'Verfügbarkeit anfragen',
  },
}

export default function BrandAgencyLanding() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
