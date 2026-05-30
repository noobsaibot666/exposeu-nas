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
    description: 'Photo and video documentation for galleries, openings, artist talks, releases, and cultural events in Berlin.',
    h1Line1: 'Photo and video documentation',
    h1Line2: 'for your exhibition.',
    subheadline: 'For galleries, artists, curators, and cultural spaces who need clean documentation before the press, partners, and archive need it.',
    cta: 'Tell us about the event',
    ctaSecondary: 'See what is included',
    audienceLabel: 'Event fit',
    audienceHeading: 'You have the opening. Now you need the record.',
    audienceGroups: [
      {
        title: 'For',
        items: ['Galleries', 'Artists', 'Curators', 'Art spaces', 'PR teams', 'Cultural venues'],
      },
      {
        title: 'Made for',
        items: ['Opening nights', 'Installations', 'Artist talks', 'Presentations', 'Book releases', 'Art sales'],
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'Everything you need to share the exhibition.',
    includedLede: 'Openings move quickly. We help you leave with images and clips for press, partners, artists, collectors, and archive.',
    includedCards: [
      { slug: 'room-and-work', title: 'Room and work', body: 'Clean views of the space, artwork, setup, and atmosphere.' },
      { slug: 'artist-moments', title: 'Artist moments', body: 'Talks, readings, signings, introductions, and real interactions.' },
      { slug: 'guest-energy', title: 'Guest energy', body: 'Visitors, collectors, conversations, and the feeling of the day.' },
      { slug: 'short-video-clips', title: 'Short video clips', body: 'Small moving moments for reels, newsletters, and press follow-up.' },
      { slug: 'press-selects', title: 'Press selects', body: 'A focused image set for PR, partners, listings, and media requests.' },
      { slug: 'archive-set', title: 'Archive set', body: 'Organized files for documentation, future programming, and sales records.' },
    ],
    includedCta: 'Tell us about the event',
    proofLabel: 'Proof',
    proofItems: [
      { title: 'Calm in the room', body: 'Coverage that respects artworks, visitors, timing, and the pace of the opening.' },
      { title: 'Useful after the night', body: 'Files are planned for press, newsletters, partners, artists, collectors, and archive.' },
      { title: 'Berlin cultural focus', body: 'Photo and video support for galleries, artists, art houses, and cultural programs.' },
    ],
    usageLabel: 'Where it works',
    usageHeading: 'Your exhibition content needs to work everywhere.',
    usageIntro: 'One documentation session gives you assets for the places galleries and artists actually need to show up.',
    platforms: [
      { name: 'Gallery channels', use: 'Posts, reels, carousels, website updates, and event recaps.' },
      { name: 'Press and PR', use: 'Selected images for media, listings, partners, and follow-up coverage.' },
      { name: 'Artist promotion', use: 'Assets for touring artists, profiles, releases, and future bookings.' },
      { name: 'Collector updates', use: 'Clean material for newsletters, sales notes, and private follow-up.' },
      { name: 'Partner recap', use: 'Show collaborators, sponsors, and hosts how the day landed.' },
      { name: 'Archive', use: 'A clear record for future programming, applications, and documentation.' },
    ],
    usageCta: 'Tell us about the event',
    finalHeading: 'Let us document your exhibition.',
    finalBody: 'Tell us what is opening, where, and when. We will shape the right photo and video setup around the work.',
    finalCta: 'Tell us about the event',
  },
  de: {
    ...baseConfig,
    title: 'Ausstellungs- & Galerie-Dokumentation Berlin',
    description: 'Foto- und Videodokumentation für Galerien, Openings, Artist Talks, Releases und kulturelle Events in Berlin.',
    h1Line1: 'Foto- und Videodokumentation',
    h1Line2: 'für deine Ausstellung.',
    subheadline: 'Für Galerien, Artists, Kurator:innen und Kulturorte, die klare Dokumentation brauchen, bevor Presse, Partner und Archiv sie brauchen.',
    cta: 'Erzähl uns vom Event',
    ctaSecondary: 'Sieh, was dabei ist',
    audienceLabel: 'Event-Fit',
    audienceHeading: 'Du hast das Opening. Jetzt brauchst du die Dokumentation.',
    audienceGroups: [
      {
        title: 'Für',
        items: ['Galerien', 'Artists', 'Kurator:innen', 'Art Spaces', 'PR Teams', 'Kulturorte'],
      },
      {
        title: 'Gemacht für',
        items: ['Openings', 'Installationen', 'Artist Talks', 'Präsentationen', 'Book Releases', 'Art Sales'],
      },
    ],
    includedLabel: 'Was du bekommst',
    includedHeading: 'Alles, was du brauchst, um die Ausstellung zu teilen.',
    includedLede: 'Openings bewegen sich schnell. Wir helfen dir mit Bildern und Clips für Presse, Partner, Artists, Sammler:innen und Archiv.',
    includedCards: [
      { slug: 'room-and-work', title: 'Raum und Arbeit', body: 'Klare Views von Space, Kunstwerken, Setup und Atmosphäre.' },
      { slug: 'artist-moments', title: 'Artist-Momente', body: 'Talks, Lesungen, Signings, Intros und echte Interaktionen.' },
      { slug: 'guest-energy', title: 'Guest Energy', body: 'Besucher:innen, Sammler:innen, Gespräche und das Gefühl des Tages.' },
      { slug: 'short-video-clips', title: 'Kurze Videoclips', body: 'Kleine bewegte Momente für Reels, Newsletter und Presse-Follow-up.' },
      { slug: 'press-selects', title: 'Presse-Selects', body: 'Ein fokussiertes Bildset für PR, Partner, Listings und Media Requests.' },
      { slug: 'archive-set', title: 'Archiv-Set', body: 'Organisierte Dateien für Dokumentation, zukünftiges Programm und Sales Records.' },
    ],
    includedCta: 'Erzähl uns vom Event',
    proofLabel: 'Proof',
    proofItems: [
      { title: 'Ruhig im Raum', body: 'Coverage, die Kunstwerke, Besucher:innen, Timing und den Ablauf respektiert.' },
      { title: 'Nach dem Abend nutzbar', body: 'Dateien für Presse, Newsletter, Partner, Artists, Sammler:innen und Archiv.' },
      { title: 'Berlin Kultur-Fokus', body: 'Foto- und Videosupport für Galerien, Artists, Kunsthäuser und Kulturprogramme.' },
    ],
    usageLabel: 'Wo es funktioniert',
    usageHeading: 'Dein Ausstellungscontent muss überall funktionieren.',
    usageIntro: 'Eine Dokumentationssession gibt dir Assets für die Orte, an denen Galerien und Artists sichtbar sein müssen.',
    platforms: [
      { name: 'Galerie-Kanäle', use: 'Posts, Reels, Carousels, Website Updates und Event Recaps.' },
      { name: 'Presse und PR', use: 'Ausgewählte Bilder für Medien, Listings, Partner und Follow-up Coverage.' },
      { name: 'Artist Promotion', use: 'Assets für Touring Artists, Profile, Releases und zukünftige Bookings.' },
      { name: 'Collector Updates', use: 'Klares Material für Newsletter, Sales Notes und private Follow-ups.' },
      { name: 'Partner Recap', use: 'Zeigt Collaborators, Sponsoren und Hosts, wie der Tag angekommen ist.' },
      { name: 'Archiv', use: 'Ein klarer Record für zukünftiges Programm, Bewerbungen und Dokumentation.' },
    ],
    usageCta: 'Erzähl uns vom Event',
    finalHeading: 'Lass uns deine Ausstellung dokumentieren.',
    finalBody: 'Sag uns, was eröffnet, wo und wann. Wir bauen das passende Foto- und Video-Setup um die Arbeit.',
    finalCta: 'Erzähl uns vom Event',
  },
}

export default function ExhibitionGalleryLanding() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
