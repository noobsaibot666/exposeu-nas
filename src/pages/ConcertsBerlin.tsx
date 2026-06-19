import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'concerts-berlin',
  serviceSlug: 'concerts-events',
  canonical: 'https://expose-u.com/concerts-berlin',
  ogImage: 'https://expose-u.com/og-concerts-berlin.jpg',
  heroImage: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4340.jpg'),
  supportImage: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4263.jpg'),
  metaContentName: 'Concerts Berlin Landing Page',
  customPixelEvent: 'ConcertsBerlinView',
}

const configs: Record<'en' | 'de', AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    title: 'Live Event Documentation Berlin — expose.u',
    description: 'Photo and video documentation for concerts, venues, labels and promoters in Berlin. Press-ready delivery, fast turnaround, photo and video from one team.',
    h1Line1: 'Concert photo and video content',
    h1Line2: 'for your next show.',
    subheadline: 'For artists, venues, promoters, and music teams who need the assets for the next booking, the next announcement, and the next campaign — not just a recap of the night.',
    cta: 'Tell us about your show',
    ctaSecondary: 'See what is included',
    audienceLabel: 'Show fit',
    audienceHeading: 'You have the show. Now you need the content.',
    audienceGroups: [
      {
        title: 'For',
        items: ['Musicians', 'Bands', 'DJs', 'Venues', 'Promoters', 'Festivals', 'Labels', 'Artist managers'],
      },
      {
        title: 'Made for',
        items: ['Live show', 'Release show', 'Tour date', 'Club night', 'Festival set', 'Venue program'],
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'Everything useful from the night.',
    includedLede: 'A show moves fast. We help you leave with content ready for socials, press, booking, and the next announcement.',
    includedCards: [
      { slug: 'stage-photos', title: 'Stage photos', body: 'Strong live images with lights, movement, and the key moments.' },
      { slug: 'crowd-energy', title: 'Crowd energy', body: 'People, atmosphere, and room shots that show how it felt.' },
      { slug: 'fast-selects', title: 'Fast selects', body: 'Priority images for posts, press, and next-day announcements.' },
      { slug: 'short-clips', title: 'Short clips', body: 'Vertical video moments ready for reels, stories, and tour updates.' },
      { slug: 'venue-assets', title: 'Venue assets', body: 'Clean images for venue recaps, listings, and future promotion.' },
      { slug: 'backstage-moments', title: 'Backstage moments', body: 'Quiet details before and after the set when access allows.' },
    ],
    includedCta: 'Tell us about your show',
    proofLabel: 'Proof',
    proofItems: [
      { title: 'Built for live rooms', body: 'Low-disruption coverage that works around stage light, timing, crowd flow, and access.' },
      { title: 'Fast use after the show', body: 'Selects are planned around the moments you need to post, pitch, or announce next.' },
      { title: 'Berlin-based', body: 'Local photo and video support for artists, venues, promoters, and cultural teams.' },
    ],
    usageLabel: 'Where it works',
    usageHeading: 'Your show content needs to work everywhere.',
    usageIntro: 'One night gives you assets for the places music teams actually need to show up.',
    platforms: [
      { name: 'Instagram', use: 'Posts, reels, stories, and carousels.' },
      { name: 'TikTok', use: 'Quick vertical clips from the live moment.' },
      { name: 'Press', use: 'Images for announcements and media follow-up.' },
      { name: 'Venue channels', use: 'Recaps, listings, and monthly programs.' },
      { name: 'Tour updates', use: 'Fresh content between cities and dates.' },
      { name: 'Booking profiles', use: 'Proof of stage presence and audience energy.' },
    ],
    usageCta: 'Tell us about your show',
    finalHeading: 'Let us cover your next show.',
    finalBody: 'Tell us the date, venue, and what you need the content for. We will shape the right photo and video setup around it.',
    finalCta: 'Tell us about your show',
  },
  de: {
    ...baseConfig,
    title: 'Live-Event-Dokumentation Berlin — expose.u',
    description: 'Foto- und Videodokumentation für Konzerte, Venues, Labels und Veranstalter in Berlin. Pressefertige Lieferung, schnelle Bearbeitung, Foto und Video aus einer Hand.',
    h1Line1: 'Konzert Foto- und Videocontent',
    h1Line2: 'für deine nächste Show.',
    subheadline: 'Für Artists, Venues, Promoter und Musikteams, die Assets für die nächste Buchung, die nächste Ankündigung und die nächste Kampagne brauchen — nicht nur einen Rückblick auf die Nacht.',
    cta: 'Erzähl uns von deiner Show',
    ctaSecondary: 'Sieh, was dabei ist',
    audienceLabel: 'Show-Fit',
    audienceHeading: 'Du hast die Show. Jetzt brauchst du den Content.',
    audienceGroups: [
      {
        title: 'Für',
        items: ['Musiker:innen', 'Bands', 'DJs', 'Venues', 'Promoter', 'Festivals', 'Labels', 'Artist Manager'],
      },
      {
        title: 'Gemacht für',
        items: ['Live-Show', 'Release-Show', 'Tour-Date', 'Clubnacht', 'Festival-Set', 'Venue-Programm'],
      },
    ],
    includedLabel: 'Was du bekommst',
    includedHeading: 'Alles, was vom Abend wirklich nutzbar ist.',
    includedLede: 'Eine Show bewegt sich schnell. Wir helfen dir, mit Content für Socials, Presse, Booking und die nächste Ankündigung rauszugehen.',
    includedCards: [
      { slug: 'stage-photos', title: 'Bühnenfotos', body: 'Starke Live-Bilder mit Licht, Bewegung und den wichtigen Momenten.' },
      { slug: 'crowd-energy', title: 'Crowd-Energie', body: 'Publikum, Atmosphäre und Raumshots, die zeigen, wie es sich angefühlt hat.' },
      { slug: 'fast-selects', title: 'Schnelle Selects', body: 'Priorisierte Bilder für Posts, Presse und Ankündigungen am nächsten Tag.' },
      { slug: 'short-clips', title: 'Kurze Clips', body: 'Vertikale Videomomente für Reels, Stories und Tour-Updates.' },
      { slug: 'venue-assets', title: 'Venue-Assets', body: 'Saubere Bilder für Recaps, Listings und zukünftige Promotion.' },
      { slug: 'backstage-moments', title: 'Backstage-Momente', body: 'Ruhige Details vor und nach dem Set, wenn der Zugang passt.' },
    ],
    includedCta: 'Erzähl uns von deiner Show',
    proofLabel: 'Proof',
    proofItems: [
      { title: 'Gemacht für Live-Räume', body: 'Coverage, die mit Stage Light, Timing, Crowd Flow und Zugang arbeitet.' },
      { title: 'Schnell nutzbar', body: 'Selects werden um die Momente geplant, die du posten, pitchen oder ankündigen musst.' },
      { title: 'Berlin-based', body: 'Lokaler Foto- und Videosupport für Artists, Venues, Promoter und Kulturteams.' },
    ],
    usageLabel: 'Wo es funktioniert',
    usageHeading: 'Dein Show-Content muss überall funktionieren.',
    usageIntro: 'Eine Nacht gibt dir Assets für die Orte, an denen Musikteams wirklich sichtbar sein müssen.',
    platforms: [
      { name: 'Instagram', use: 'Posts, Reels, Stories und Carousels.' },
      { name: 'TikTok', use: 'Kurze vertikale Clips aus dem Live-Moment.' },
      { name: 'Presse', use: 'Bilder für Ankündigungen und Follow-up.' },
      { name: 'Venue-Kanäle', use: 'Recaps, Listings und Monatsprogramme.' },
      { name: 'Tour-Updates', use: 'Frischer Content zwischen Städten und Dates.' },
      { name: 'Booking-Profile', use: 'Beleg für Präsenz auf der Bühne und Energie im Raum.' },
    ],
    usageCta: 'Erzähl uns von deiner Show',
    finalHeading: 'Lass uns deine nächste Show covern.',
    finalBody: 'Sag uns Datum, Venue und wofür du den Content brauchst. Wir bauen das passende Foto- und Video-Setup darum.',
    finalCta: 'Erzähl uns von deiner Show',
  },
}

export default function ConcertsBerlin() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
