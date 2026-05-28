import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'exhibition-gallery',
  serviceSlug: 'exhibition-gallery',
  canonical: 'https://expose-u.com/exhibition-gallery',
  heroImage: resolveImagePath('src/assets/images/landing/gallery_hero.jpeg'),
  supportImage: resolveImagePath('src/assets/images/landing/gallery_hero_03.jpeg'),
  metaContentName: 'Exhibition Gallery Landing Page',
  customPixelEvent: 'ExhibitionGalleryLandingView',
}

const configs: Record<'en' | 'de', AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    title: 'Exhibition & Gallery Documentation Berlin',
    description: 'Photo and video documentation for galleries, art houses, artist talks, presentations, releases, and cultural events in Berlin.',
    h1Line1: 'Your big day is live.',
    h1Line2: 'Will it be documented well?',
    subheadline: 'expose.u documents exhibitions, talks, presentations, releases, cultural gatherings, and hosted moments with clean photo and video assets you can actually use.',
    cta: 'Tell us about the event',
    ctaSecondary: 'See what is included',
    audienceLabel: 'We help you',
    audienceHeading: 'Hosting a day that needs to be remembered and shared?',
    audienceGroups: [
      {
        title: 'That is for you',
        items: ['Gallery owners', 'Art houses', 'Bookers', 'PR teams', 'Artists on tour', 'Curators', 'Cultural venues'],
      },
      {
        title: 'We make sure you are covered for',
        items: ['Artist talks', 'Presentations', 'Meet and greets', 'Book releases', 'Album releases', 'Art sales', 'Opening days'],
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'Documentation that respects the work and shows the room alive.',
    includedLede: 'We work as a calm creative partner for galleries and cultural teams: present enough to catch the day, light enough to not interrupt it.',
    includedCards: [
      { slug: 'room-and-work', title: 'Room and work', body: 'Clean views of the space, artwork, setup, and atmosphere.' },
      { slug: 'artist-moments', title: 'Artist moments', body: 'Talks, readings, signings, introductions, and real interactions.' },
      { slug: 'guest-energy', title: 'Guest energy', body: 'Visitors, collectors, conversations, and the feeling of the day.' },
      { slug: 'release-assets', title: 'Release assets', body: 'Useful content for book, album, edition, or project releases.' },
      { slug: 'short-video-clips', title: 'Short video clips', body: 'Small moving moments for reels, newsletters, and press follow-up.' },
      { slug: 'press-selects', title: 'Press selects', body: 'A focused image set for PR, partners, listings, and media requests.' },
      { slug: 'archive-set', title: 'Archive set', body: 'Organized files for documentation, future programming, and sales records.' },
      { slug: 'custom-support', title: 'Custom support', body: 'Not a standard opening? We shape the coverage around the format.' },
    ],
    includedCta: 'Book cultural event coverage',
    usageLabel: 'Use the content',
    usageHeading: 'Make the big day useful after the room closes.',
    usageIntro: 'Use the material for gallery communication, artist promotion, press, collector updates, partner recaps, and the archive.',
    platforms: [
      { name: 'Gallery channels', use: 'Posts, reels, carousels, website updates, and event recaps.' },
      { name: 'Press and PR', use: 'Selected images for media, listings, partners, and follow-up coverage.' },
      { name: 'Artist promotion', use: 'Assets for touring artists, profiles, releases, and future bookings.' },
      { name: 'Collector updates', use: 'Clean material for newsletters, sales notes, and private follow-up.' },
      { name: 'Partner recap', use: 'Show collaborators, sponsors, and hosts how the day landed.' },
      { name: 'Archive', use: 'A clear record for future programming, applications, and documentation.' },
    ],
    usageCta: 'Plan the documentation',
    finalHeading: 'Need a partner for the big day?',
    finalBody: 'Send the date, location, format, and what matters most. expose.u keeps the process clear, calm, and built around the work.',
    finalCta: 'Tell us about the event',
  },
  de: {
    ...baseConfig,
    title: 'Ausstellungs- & Galerie-Dokumentation Berlin',
    description: 'Foto- und Videodokumentation für Galerien, Kunsthäuser, Artist Talks, Präsentationen, Releases und kulturelle Events in Berlin.',
    h1Line1: 'Euer großer Tag ist live.',
    h1Line2: 'Wird er gut dokumentiert?',
    subheadline: 'expose.u dokumentiert Ausstellungen, Talks, Präsentationen, Releases, kulturelle Gatherings und gehostete Momente mit klaren Foto- und Videoassets, die ihr wirklich nutzen könnt.',
    cta: 'Erzähl uns vom Event',
    ctaSecondary: 'Sieh, was dabei ist',
    audienceLabel: 'Wir helfen dir',
    audienceHeading: 'Hostet ihr einen Tag, der festgehalten und geteilt werden muss?',
    audienceGroups: [
      {
        title: 'Das ist für dich',
        items: ['Galerieinhaber:innen', 'Kunsthäuser', 'Booker', 'PR Teams', 'Artists on Tour', 'Kurator:innen', 'Kulturorte'],
      },
      {
        title: 'Wir sorgen dafür, dass du abgedeckt bist für',
        items: ['Artist Talks', 'Präsentationen', 'Meet and Greets', 'Book Releases', 'Album Releases', 'Art Sales', 'Opening Days'],
      },
    ],
    includedLabel: 'Was du bekommst',
    includedHeading: 'Dokumentation, die die Arbeit respektiert und den Raum lebendig zeigt.',
    includedLede: 'Wir arbeiten als ruhiger kreativer Partner für Galerien und Kulturteams: präsent genug, um den Tag einzufangen, leicht genug, um ihn nicht zu stören.',
    includedCards: [
      { slug: 'room-and-work', title: 'Raum und Arbeit', body: 'Klare Views von Space, Kunstwerken, Setup und Atmosphäre.' },
      { slug: 'artist-moments', title: 'Artist-Momente', body: 'Talks, Lesungen, Signings, Intros und echte Interaktionen.' },
      { slug: 'guest-energy', title: 'Guest Energy', body: 'Besucher:innen, Sammler:innen, Gespräche und das Gefühl des Tages.' },
      { slug: 'release-assets', title: 'Release Assets', body: 'Brauchbarer Content für Book, Album, Edition oder Project Releases.' },
      { slug: 'short-video-clips', title: 'Kurze Videoclips', body: 'Kleine bewegte Momente für Reels, Newsletter und Presse-Follow-up.' },
      { slug: 'press-selects', title: 'Presse-Selects', body: 'Ein fokussiertes Bildset für PR, Partner, Listings und Media Requests.' },
      { slug: 'archive-set', title: 'Archiv-Set', body: 'Organisierte Dateien für Dokumentation, zukünftiges Programm und Sales Records.' },
      { slug: 'custom-support', title: 'Custom Support', body: 'Kein klassisches Opening? Wir passen die Coverage an das Format an.' },
    ],
    includedCta: 'Kultur-Event-Coverage buchen',
    usageLabel: 'Content nutzen',
    usageHeading: 'Macht den großen Tag nutzbar, nachdem der Raum schließt.',
    usageIntro: 'Nutzt das Material für Galeriekommunikation, Artist Promotion, Presse, Collector Updates, Partner Recaps und Archiv.',
    platforms: [
      { name: 'Galerie-Kanäle', use: 'Posts, Reels, Carousels, Website Updates und Event Recaps.' },
      { name: 'Presse und PR', use: 'Ausgewählte Bilder für Medien, Listings, Partner und Follow-up Coverage.' },
      { name: 'Artist Promotion', use: 'Assets für Touring Artists, Profile, Releases und zukünftige Bookings.' },
      { name: 'Collector Updates', use: 'Klares Material für Newsletter, Sales Notes und private Follow-ups.' },
      { name: 'Partner Recap', use: 'Zeigt Collaborators, Sponsoren und Hosts, wie der Tag angekommen ist.' },
      { name: 'Archiv', use: 'Ein klarer Record für zukünftiges Programm, Bewerbungen und Dokumentation.' },
    ],
    usageCta: 'Dokumentation planen',
    finalHeading: 'Braucht ihr einen Partner für den großen Tag?',
    finalBody: 'Schick uns Datum, Ort, Format und was wichtig ist. expose.u hält den Prozess klar, ruhig und nah an der Arbeit.',
    finalCta: 'Erzähl uns vom Event',
  },
}

export default function ExhibitionGalleryLanding() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
