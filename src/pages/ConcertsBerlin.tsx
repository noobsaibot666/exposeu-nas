import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'concerts-berlin',
  serviceSlug: 'concerts-events',
  canonical: 'https://expose-u.com/concerts-berlin',
  heroImage: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4340.jpg'),
  supportImage: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4263.jpg'),
  metaContentName: 'Concerts Berlin Landing Page',
  customPixelEvent: 'ConcertsBerlinView',
}

const configs: Record<'en' | 'de', AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    title: 'Concert & Live Event Photography Berlin',
    description: 'Concert and live event photo/video content in Berlin for artists, venues, promoters, and teams who need fast press and social assets.',
    h1Line1: 'Your show is happening.',
    h1Line2: 'Will the content be ready?',
    subheadline: 'Concert photography and short video content for Berlin shows: stage, crowd, atmosphere, and fast selects for press and socials.',
    cta: 'Tell us about your show',
    ctaSecondary: 'See what is included',
    audienceLabel: 'We help you',
    audienceHeading: 'Playing or hosting a show?',
    audienceGroups: [
      {
        title: 'That is for you',
        items: ['Musicians', 'Bands', 'DJs', 'Venues', 'Promoters', 'Festivals', 'Labels', 'Artist managers'],
      },
      {
        title: 'We make sure you are covered for',
        items: ['Live show', 'Release show', 'Tour date', 'Club night', 'Festival set', 'Venue program'],
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'Coverage that captures the night.',
    includedLede: 'You focus on the room. We cover the moments you need after the lights go down.',
    includedCards: [
      { slug: 'stage-photos', title: 'Stage photos', body: 'Strong live images with lights, movement, and the key moments.' },
      { slug: 'crowd-energy', title: 'Crowd energy', body: 'People, atmosphere, and room shots that show how it felt.' },
      { slug: 'fast-selects', title: 'Fast selects', body: 'Priority images for posts, press, and next-day announcements.' },
      { slug: 'short-clips', title: 'Short clips', body: 'Vertical video moments ready for reels, stories, and tour updates.' },
      { slug: 'backstage-moments', title: 'Backstage moments', body: 'Quiet details before and after the set when access allows.' },
      { slug: 'venue-assets', title: 'Venue assets', body: 'Clean images for venue recaps, listings, and future promotion.' },
      { slug: 'partner-assets', title: 'Partner assets', body: 'Shots that help sponsors, labels, and collaborators share the night.' },
      { slug: 'custom-support', title: 'Custom support', body: 'Not sure what you need? We shape the coverage around the show.' },
    ],
    includedCta: 'Book show coverage',
    usageLabel: 'Use the content',
    usageHeading: 'Ready for the places your audience already follows.',
    usageIntro: 'Get useful assets for the days before the show, the night itself, and the recap after.',
    platforms: [
      { name: 'Instagram', use: 'Posts, reels, stories, and carousels.' },
      { name: 'TikTok', use: 'Quick vertical clips from the live moment.' },
      { name: 'Press', use: 'Images for announcements and media follow-up.' },
      { name: 'Venue channels', use: 'Recaps, listings, and monthly programs.' },
      { name: 'Tour updates', use: 'Fresh content between cities and dates.' },
      { name: 'Booking profiles', use: 'Proof of stage presence and audience energy.' },
    ],
    usageCta: 'Plan your show coverage',
    finalHeading: 'Need content before the next post goes live?',
    finalBody: 'Send the date, venue, and what you need. We will keep the process simple and useful.',
    finalCta: 'Tell us about your show',
  },
  de: {
    ...baseConfig,
    title: 'Konzert- & Live-Event-Fotografie Berlin',
    description: 'Foto- und Videocontent für Konzerte und Live-Events in Berlin, für Artists, Venues, Promoter und Teams, die schnell gutes Material brauchen.',
    h1Line1: 'Deine Show steht.',
    h1Line2: 'Ist der Content bereit?',
    subheadline: 'Konzertfotos und kurze Videomomente für Berliner Shows: Bühne, Crowd, Atmosphäre und schnelle Selects für Presse und Socials.',
    cta: 'Erzähl uns von deiner Show',
    ctaSecondary: 'Sieh, was dabei ist',
    audienceLabel: 'Wir helfen dir',
    audienceHeading: 'Spielst du eine Show oder hostest du den Abend?',
    audienceGroups: [
      {
        title: 'Das ist für dich',
        items: ['Musiker:innen', 'Bands', 'DJs', 'Venues', 'Promoter', 'Festivals', 'Labels', 'Artist Manager'],
      },
      {
        title: 'Wir sorgen dafür, dass du abgedeckt bist für',
        items: ['Live-Show', 'Release-Show', 'Tour-Date', 'Clubnacht', 'Festival-Set', 'Venue-Programm'],
      },
    ],
    includedLabel: 'Was du bekommst',
    includedHeading: 'Coverage, die den Abend wirklich zeigt.',
    includedLede: 'Du konzentrierst dich auf den Raum. Wir halten die Momente fest, die du nach der Show brauchst.',
    includedCards: [
      { slug: 'stage-photos', title: 'Bühnenfotos', body: 'Starke Live-Bilder mit Licht, Bewegung und den wichtigen Momenten.' },
      { slug: 'crowd-energy', title: 'Crowd-Energie', body: 'Publikum, Atmosphäre und Raumshots, die zeigen, wie es sich angefühlt hat.' },
      { slug: 'fast-selects', title: 'Schnelle Selects', body: 'Priorisierte Bilder für Posts, Presse und Ankündigungen am nächsten Tag.' },
      { slug: 'short-clips', title: 'Kurze Clips', body: 'Vertikale Videomomente für Reels, Stories und Tour-Updates.' },
      { slug: 'backstage-moments', title: 'Backstage-Momente', body: 'Ruhige Details vor und nach dem Set, wenn der Zugang passt.' },
      { slug: 'venue-assets', title: 'Venue-Assets', body: 'Saubere Bilder für Recaps, Listings und zukünftige Promotion.' },
      { slug: 'partner-assets', title: 'Partner-Assets', body: 'Shots für Sponsoren, Labels und Collaborators, damit alle den Abend teilen können.' },
      { slug: 'custom-support', title: 'Custom Support', body: 'Nicht sicher, was du brauchst? Wir passen die Coverage an deine Show an.' },
    ],
    includedCta: 'Show-Coverage buchen',
    usageLabel: 'Content nutzen',
    usageHeading: 'Bereit für die Orte, an denen dein Publikum schon ist.',
    usageIntro: 'Du bekommst brauchbares Material für die Tage vor der Show, den Abend selbst und den Recap danach.',
    platforms: [
      { name: 'Instagram', use: 'Posts, Reels, Stories und Carousels.' },
      { name: 'TikTok', use: 'Kurze vertikale Clips aus dem Live-Moment.' },
      { name: 'Presse', use: 'Bilder für Ankündigungen und Follow-up.' },
      { name: 'Venue-Kanäle', use: 'Recaps, Listings und Monatsprogramme.' },
      { name: 'Tour-Updates', use: 'Frischer Content zwischen Städten und Dates.' },
      { name: 'Booking-Profile', use: 'Beleg für Präsenz auf der Bühne und Energie im Raum.' },
    ],
    usageCta: 'Show-Coverage planen',
    finalHeading: 'Brauchst du Content, bevor der nächste Post rausgeht?',
    finalBody: 'Schick uns Datum, Venue und was du brauchst. Wir halten den Prozess einfach und hilfreich.',
    finalCta: 'Erzähl uns von deiner Show',
  },
}

export default function ConcertsBerlin() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
