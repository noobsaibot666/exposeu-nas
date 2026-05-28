import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'brand-agency',
  serviceSlug: 'brand-agency',
  canonical: 'https://expose-u.com/brand-agency',
  heroImage: resolveImagePath('src/assets/images/landing/agency_hero_01.jpeg'),
  supportImage: resolveImagePath('src/assets/images/landing/agency_hero.jpeg'),
  metaContentName: 'Brand Agency Landing Page',
  customPixelEvent: 'BrandAgencyLandingView',
}

const configs: Record<'en' | 'de', AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    title: 'Brand & Agency Event Content Berlin',
    description: 'Photo and video documentation for brand activations, immersive rooms, flagship spaces, and client projects that need portfolio-ready proof.',
    h1Line1: 'You delivered the project.',
    h1Line2: 'Can people see it?',
    subheadline: 'We document the space, interaction, details, and audience so your client work looks as strong in your portfolio as it did in the room.',
    cta: 'Tell us about the project',
    ctaSecondary: 'See what is included',
    audienceLabel: 'We help you',
    audienceHeading: 'Need to document a project you delivered for a client?',
    audienceGroups: [
      {
        title: 'That is for you',
        items: ['Brands', 'Agencies', 'Creative producers', 'PR Teams', 'Founders'],
      },
      {
        title: 'We make sure you are covered for',
        items: ['Brand activations', 'Immersive rooms', 'Flagship shops', 'Interactive installs', 'Studio projects', 'Client showcases'],
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'Content that proves the quality of the work you delivered.',
    includedLede: 'We document the environment, interaction, product moments, audience, and details so the project can live beyond opening day.',
    includedCards: [
      { slug: 'hero-images', title: 'Hero images', body: 'Strong wide shots that show the full project, space, and scale.' },
      { slug: 'interaction-moments', title: 'Interaction moments', body: 'People using, moving through, and reacting to the experience.' },
      { slug: 'project-details', title: 'Project details', body: 'Close shots of screens, materials, product, build quality, and finish.' },
      { slug: 'short-clips', title: 'Short clips', body: 'Video moments for case studies, social posts, and pitch follow-up.' },
      { slug: 'atmosphere-shots', title: 'Atmosphere shots', body: 'Lighting, room flow, audience energy, and the feeling of the space.' },
      { slug: 'fast-selects', title: 'Fast selects', body: 'A first set for press, client updates, and launch-week sharing.' },
    ],
    includedCta: 'Book project documentation',
    usageLabel: 'Use the content',
    usageHeading: 'Turn the delivered project into proof for the next one.',
    usageIntro: 'Use the content to update your portfolio, send the work to press, build stronger case studies, and support the next pitch.',
    platforms: [
      { name: 'Portfolio', use: 'Show the project with images that reflect the quality of the delivery.' },
      { name: 'Case studies', use: 'Build a clear visual story around space, interaction, and result.' },
      { name: 'Press', use: 'Send selected images and clips to media, partners, and brand channels.' },
      { name: 'Pitch decks', use: 'Use real proof of previous work when presenting the next idea.' },
      { name: 'Client recap', use: 'Give the client clean documentation of what was built and experienced.' },
      { name: 'Social channels', use: 'Share strong moments without reducing the project to quick snapshots.' },
    ],
    usageCta: 'Plan project documentation',
    finalHeading: 'Need the project documented before the room changes?',
    finalBody: 'Send the location, timing, and what was delivered. We will help shape the coverage around the work and how you need to use it.',
    finalCta: 'Tell us about the project',
  },
  de: {
    ...baseConfig,
    title: 'Brand- & Agency-Event-Content Berlin',
    description: 'Foto- und Videodokumentation für Brand Activations, immersive Räume, Flagship Spaces und Client-Projekte, die portfolio-ready Proof brauchen.',
    h1Line1: 'Ihr habt das Projekt geliefert.',
    h1Line2: 'Kann man es sehen?',
    subheadline: 'Wir dokumentieren Raum, Interaktion, Details und Publikum, damit eure Client-Arbeit im Portfolio so stark wirkt wie vor Ort.',
    cta: 'Erzähl uns vom Projekt',
    ctaSecondary: 'Sieh, was dabei ist',
    audienceLabel: 'Wir helfen dir',
    audienceHeading: 'Müsst ihr ein Projekt dokumentieren, das ihr für einen Client geliefert habt?',
    audienceGroups: [
      {
        title: 'Das ist für dich',
        items: ['Brands', 'Agenturen', 'Creative Producer', 'PR Teams', 'Founder'],
      },
      {
        title: 'Wir sorgen dafür, dass du abgedeckt bist für',
        items: ['Brand Activations', 'Immersive Räume', 'Flagship Shops', 'Interaktive Installationen', 'Studio-Projekte', 'Client Showcases'],
      },
    ],
    includedLabel: 'Was du bekommst',
    includedHeading: 'Content, der zeigt, wie gut eure Arbeit geliefert wurde.',
    includedLede: 'Wir dokumentieren Umgebung, Interaktion, Produktmomente, Publikum und Details, damit das Projekt über den Opening Day hinaus wirkt.',
    includedCards: [
      { slug: 'hero-images', title: 'Hero Images', body: 'Starke Wide Shots, die Projekt, Raum und Scale zeigen.' },
      { slug: 'interaction-moments', title: 'Interaction Moments', body: 'Menschen, die die Experience nutzen, durchlaufen und darauf reagieren.' },
      { slug: 'project-details', title: 'Project Details', body: 'Close Shots von Screens, Materialien, Produkt, Build Quality und Finish.' },
      { slug: 'short-clips', title: 'Kurze Clips', body: 'Videomomente für Case Studies, Social Posts und Pitch Follow-up.' },
      { slug: 'atmosphere-shots', title: 'Atmosphäre', body: 'Licht, Room Flow, Publikum und das Gefühl des Spaces.' },
      { slug: 'fast-selects', title: 'Schnelle Selects', body: 'Ein erstes Set für Presse, Client Updates und Launch-Week Sharing.' },
    ],
    includedCta: 'Projekt-Dokumentation buchen',
    usageLabel: 'Content nutzen',
    usageHeading: 'Macht aus dem gelieferten Projekt Proof für das nächste.',
    usageIntro: 'Nutzt den Content für Portfolio, Presse, Case Studies, Client Delivery und stärkere nächste Pitches.',
    platforms: [
      { name: 'Portfolio', use: 'Zeigt das Projekt mit Bildern, die die Qualität der Delivery widerspiegeln.' },
      { name: 'Case Studies', use: 'Baut eine klare visuelle Story aus Raum, Interaktion und Ergebnis.' },
      { name: 'Presse', use: 'Sendet ausgewählte Bilder und Clips an Medien, Partner und Brand Channels.' },
      { name: 'Pitch Decks', use: 'Nutzt echten Proof aus früherer Arbeit für die nächste Idee.' },
      { name: 'Client Recap', use: 'Gebt dem Client eine klare Dokumentation dessen, was gebaut und erlebt wurde.' },
      { name: 'Social Channels', use: 'Teilt starke Momente, ohne das Projekt auf schnelle Snapshots zu reduzieren.' },
    ],
    usageCta: 'Projekt-Dokumentation planen',
    finalHeading: 'Muss das Projekt dokumentiert werden, bevor der Raum sich verändert?',
    finalBody: 'Schick uns Ort, Timing und was geliefert wurde. Wir helfen, die Coverage passend zur Arbeit und zur Nutzung zu planen.',
    finalCta: 'Erzähl uns vom Projekt',
  },
}

export default function BrandAgencyLanding() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
