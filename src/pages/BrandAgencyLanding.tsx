import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'brand-agency',
  serviceSlug: 'brand-agency',
  canonical: 'https://expose-u.com/brand-agency',
  ogImage: 'https://expose-u.com/og-brand-agency.jpg',
  heroImage: resolveImagePath('src/assets/images/landing/agency_hero_01.jpeg'),
  supportImage: resolveImagePath('src/assets/images/landing/agency_hero.jpeg'),
  metaContentName: 'Brand Agency Landing Page',
  customPixelEvent: 'BrandAgencyLandingView',
}

const configs: Record<'en' | 'de', AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    title: 'Brand Activation Photo and Video Content Berlin',
    description: 'Photo and video documentation for brand activations, launches, pop-ups, flagship spaces, and agency projects in Berlin.',
    h1Line1: 'Photo and video proof',
    h1Line2: 'for your brand activation.',
    subheadline: 'For brands, agencies, and producers who need launch assets, case-study visuals, client recap content, and social clips before the moment disappears.',
    cta: 'Tell us about the project',
    ctaSecondary: 'See what is included',
    audienceLabel: 'Project fit',
    audienceHeading: 'You built the moment. Now you need the proof.',
    audienceGroups: [
      {
        title: 'For',
        items: ['Brands', 'Agencies', 'Creative producers', 'PR Teams', 'Founders'],
      },
      {
        title: 'Made for',
        items: ['Brand activations', 'Launch events', 'Pop-ups', 'Flagship shops', 'Interactive installs', 'Client showcases'],
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'Everything you need to prove the project worked.',
    includedLede: 'Activations move quickly. We help you leave with assets for your client, press, portfolio, socials, and the next pitch.',
    includedCards: [
      { slug: 'hero-images', title: 'Hero images', body: 'Strong wide shots that show the full project, space, and scale.' },
      { slug: 'interaction-moments', title: 'Interaction moments', body: 'People using, moving through, and reacting to the experience.' },
      { slug: 'project-details', title: 'Project details', body: 'Close shots of screens, materials, product, build quality, and finish.' },
      { slug: 'short-clips', title: 'Short clips', body: 'Video moments for case studies, social posts, and pitch follow-up.' },
      { slug: 'atmosphere-shots', title: 'Atmosphere shots', body: 'Lighting, room flow, audience energy, and the feeling of the space.' },
      { slug: 'fast-selects', title: 'Fast selects', body: 'A first set for press, client updates, and launch-week sharing.' },
    ],
    includedCta: 'Tell us about the project',
    proofLabel: 'Proof',
    proofItems: [
      { title: 'Built for temporary moments', body: 'Coverage planned before the room changes, the install comes down, or the crowd moves on.' },
      { title: 'Client-ready delivery', body: 'Useful selects for internal recap, external launch, PR, case studies, and stakeholder updates.' },
      { title: 'Berlin-based', body: 'Photo and video support for activations, launches, agencies, brands, and cultural teams.' },
    ],
    usageLabel: 'Where it works',
    usageHeading: 'Your activation content needs to work everywhere.',
    usageIntro: 'One project gives you assets for the places brands and agencies actually need to show up.',
    platforms: [
      { name: 'Portfolio', use: 'Show the project with images that reflect the quality of the delivery.' },
      { name: 'Case studies', use: 'Build a clear visual story around space, interaction, and result.' },
      { name: 'Press', use: 'Send selected images and clips to media, partners, and brand channels.' },
      { name: 'Pitch decks', use: 'Use real proof of previous work when presenting the next idea.' },
      { name: 'Client recap', use: 'Give the client clean documentation of what was built and experienced.' },
      { name: 'Social channels', use: 'Share strong moments without reducing the project to quick snapshots.' },
    ],
    usageCta: 'Tell us about the project',
    finalHeading: 'Let us document the activation.',
    finalBody: 'Tell us what is launching, where, and when. We will shape the right photo and video setup around the project.',
    finalCta: 'Tell us about the project',
  },
  de: {
    ...baseConfig,
    title: 'Brand Activation Foto- und Videocontent Berlin',
    description: 'Foto- und Videodokumentation für Brand Activations, Launches, Pop-ups, Flagship Spaces und Agenturprojekte in Berlin.',
    h1Line1: 'Foto- und Videoproof',
    h1Line2: 'für deine Brand Activation.',
    subheadline: 'Für Brands, Agenturen und Producer, die Launch-Assets, Case-Study-Visuals, Client-Recap-Content und Social Clips brauchen, bevor der Moment vorbei ist.',
    cta: 'Erzähl uns vom Projekt',
    ctaSecondary: 'Sieh, was dabei ist',
    audienceLabel: 'Projekt-Fit',
    audienceHeading: 'Du hast den Moment gebaut. Jetzt brauchst du den Proof.',
    audienceGroups: [
      {
        title: 'Für',
        items: ['Brands', 'Agenturen', 'Creative Producer', 'PR Teams', 'Founder'],
      },
      {
        title: 'Gemacht für',
        items: ['Brand Activations', 'Launch Events', 'Pop-ups', 'Flagship Shops', 'Interaktive Installationen', 'Client Showcases'],
      },
    ],
    includedLabel: 'Was du bekommst',
    includedHeading: 'Alles, was du brauchst, um zu zeigen, dass das Projekt funktioniert hat.',
    includedLede: 'Activations bewegen sich schnell. Wir helfen dir mit Assets für Client, Presse, Portfolio, Socials und den nächsten Pitch.',
    includedCards: [
      { slug: 'hero-images', title: 'Hero Images', body: 'Starke Wide Shots, die Projekt, Raum und Scale zeigen.' },
      { slug: 'interaction-moments', title: 'Interaction Moments', body: 'Menschen, die die Experience nutzen, durchlaufen und darauf reagieren.' },
      { slug: 'project-details', title: 'Project Details', body: 'Close Shots von Screens, Materialien, Produkt, Build Quality und Finish.' },
      { slug: 'short-clips', title: 'Kurze Clips', body: 'Videomomente für Case Studies, Social Posts und Pitch Follow-up.' },
      { slug: 'atmosphere-shots', title: 'Atmosphäre', body: 'Licht, Room Flow, Publikum und das Gefühl des Spaces.' },
      { slug: 'fast-selects', title: 'Schnelle Selects', body: 'Ein erstes Set für Presse, Client Updates und Launch-Week Sharing.' },
    ],
    includedCta: 'Erzähl uns vom Projekt',
    proofLabel: 'Proof',
    proofItems: [
      { title: 'Gemacht für temporäre Momente', body: 'Coverage, bevor der Raum sich verändert, der Aufbau abgebaut wird oder die Crowd weiterzieht.' },
      { title: 'Client-ready Delivery', body: 'Nutzbare Selects für Recap, Launch, PR, Case Studies und Stakeholder Updates.' },
      { title: 'Berlin-based', body: 'Foto- und Videosupport für Activations, Launches, Agenturen, Brands und Kulturteams.' },
    ],
    usageLabel: 'Wo es funktioniert',
    usageHeading: 'Dein Activation-Content muss überall funktionieren.',
    usageIntro: 'Ein Projekt gibt dir Assets für die Orte, an denen Brands und Agenturen sichtbar sein müssen.',
    platforms: [
      { name: 'Portfolio', use: 'Zeigt das Projekt mit Bildern, die die Qualität der Delivery widerspiegeln.' },
      { name: 'Case Studies', use: 'Baut eine klare visuelle Story aus Raum, Interaktion und Ergebnis.' },
      { name: 'Presse', use: 'Sendet ausgewählte Bilder und Clips an Medien, Partner und Brand Channels.' },
      { name: 'Pitch Decks', use: 'Nutzt echten Proof aus früherer Arbeit für die nächste Idee.' },
      { name: 'Client Recap', use: 'Gebt dem Client eine klare Dokumentation dessen, was gebaut und erlebt wurde.' },
      { name: 'Social Channels', use: 'Teilt starke Momente, ohne das Projekt auf schnelle Snapshots zu reduzieren.' },
    ],
    usageCta: 'Erzähl uns vom Projekt',
    finalHeading: 'Lass uns die Activation dokumentieren.',
    finalBody: 'Sag uns, was launcht, wo und wann. Wir bauen das passende Foto- und Video-Setup um das Projekt.',
    finalCta: 'Erzähl uns vom Projekt',
  },
}

export default function BrandAgencyLanding() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
