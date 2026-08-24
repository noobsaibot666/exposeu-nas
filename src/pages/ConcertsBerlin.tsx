import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'concerts-berlin',
  serviceSlug: 'concerts-events',
  ogImage: 'https://expose-u.com/og-concerts-berlin.jpg',
  heroImage: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4340.webp'),
  supportImage: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4263.webp'),
  metaContentName: 'Concerts Berlin Landing Page',
  customPixelEvent: 'ConcertsBerlinView',
}

const configs: Record<'en' | 'de', AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    canonical: 'https://expose-u.com/concerts-berlin',
    title: 'Concert Documentation Berlin',
    description: 'Photo and video documentation for artists, venues and promoters in Berlin. Booking, press and social assets built for what comes after the show.',
    ogTitle: 'Concert Documentation Berlin | expose.u',
    ogDescription: 'The show ends. The assets help the next one happen. Concert documentation for artists, venues and promoters in Berlin.',
    h1Line1: 'Concert documentation',
    h1Line2: 'for artists, venues and promoters.',
    subheadline: 'Photo and video assets for booking, press, social media and future event promotion — not just a recap of tonight.',
    cta: 'Request availability',
    ctaSecondary: "See what's included",
    audienceLabel: 'Who this is for',
    audienceHeading: 'For artists, venues and promoters',
    audienceGroups: [],
    audienceItems: [
      {
        title: 'Musicians, bands and DJs',
        body: 'Stage and press images ready for the next booking, release or announcement.',
      },
      {
        title: 'Venues and clubs',
        body: 'Recap and marketing assets for monthly programs and listings.',
      },
      {
        title: 'Promoters and booking agencies',
        body: 'Proof material for lineup pitches, sponsor decks and future dates.',
      },
      {
        title: 'Labels and artist management',
        body: 'Campaign assets tied to a live date, ready the morning after.',
      },
    ],
    whatItDoesLabel: 'What it does',
    whatItDoesHeading: 'What the documentation does',
    whatItDoesItems: [
      {
        title: 'Booking & lineup pitches',
        body: 'Current stage images and clips booking agents can use immediately.',
      },
      {
        title: 'Press & next-day announcements',
        body: 'Fast turnaround selects while the show is still news.',
      },
      {
        title: 'Venue marketing',
        body: 'Clean images for recaps, listings and monthly programs.',
      },
      {
        title: 'Sponsor & partner reporting',
        body: 'Assets that show partners the night delivered.',
      },
      {
        title: 'Social & vertical content',
        body: 'Reels/Stories-ready clips straight from the set.',
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'What you receive',
    includedLede:
      'Delivered organized and ready to use — for booking, press and the next announcement.',
    includedCards: [
      {
        slug: 'stage-photos',
        title: 'Stage photos',
        body: 'Strong live images with light, movement and the key moments.',
      },
      {
        slug: 'crowd-atmosphere',
        title: 'Crowd & room atmosphere',
        body: 'Shots that show how the night felt, not just how it looked.',
      },
      {
        slug: 'backstage-moments',
        title: 'Backstage moments',
        body: 'Quiet details before and after the set, when access allows.',
      },
      {
        slug: 'vertical-clips',
        title: 'Vertical video clips',
        body: 'Reels- and Stories-ready moments from the same night.',
      },
      {
        slug: 'press-ready-selects',
        title: 'Press-ready selects',
        body: 'A curated set, named and ready to hand to press and partners.',
      },
      {
        slug: 'fast-delivery',
        title: 'Fast priority delivery',
        body: 'Key selects out fast enough for a next-day post or announcement.',
      },
    ],
    includedCta: 'Request availability',
    proofLabel: 'How we work',
    proofItems: [],
    proofProse: [
      'Quiet in the room. Fast after.',
      'One or two people on site, working around stage light, timing and crowd flow without getting in the way. Photo and video from one team, with priority selects out fast enough to matter for the next booking, the next announcement, the next campaign.',
    ],
    finalHeading: "Let's cover your next show.",
    finalBody:
      'Every show is different. We build the brief around your date, venue and what you need the documentation for.',
    finalCta: 'Request availability',
  },
  de: {
    ...baseConfig,
    canonical: 'https://expose-u.com/de/concerts-berlin',
    title: 'Konzertdokumentation Berlin',
    description: 'Foto- und Videodokumentation für Artists, Venues und Promoter in Berlin. Booking-, Presse- und Social-Assets für die Zeit nach der Show.',
    ogTitle: 'Konzertdokumentation Berlin | expose.u',
    ogDescription: 'Die Show endet. Die Assets bringen die nächste ins Rollen. Konzertdokumentation für Artists, Venues und Promoter in Berlin.',
    h1Line1: 'Konzertdokumentation',
    h1Line2: 'für Artists, Venues und Promoter.',
    subheadline: 'Foto- und Videoassets für Booking, Presse, Social Media und zukünftige Event-Promotion — nicht nur ein Rückblick auf den Abend.',
    cta: 'Verfügbarkeit anfragen',
    ctaSecondary: 'Sehen Sie, was enthalten ist',
    audienceLabel: 'Für wen das ist',
    audienceHeading: 'Für Artists, Venues und Promoter',
    audienceGroups: [],
    audienceItems: [
      {
        title: 'Musiker:innen, Bands und DJs',
        body: 'Bühnen- und Pressebilder, einsatzbereit für das nächste Booking, Release oder die nächste Ankündigung.',
      },
      {
        title: 'Venues und Clubs',
        body: 'Recap- und Marketing-Assets für Monatsprogramme und Listings.',
      },
      {
        title: 'Promoter und Booking-Agenturen',
        body: 'Proof-Material für Lineup-Pitches, Sponsoren-Decks und zukünftige Termine.',
      },
      {
        title: 'Labels und Artist-Management',
        body: 'Kampagnen-Assets zum Live-Termin, bereit am nächsten Morgen.',
      },
    ],
    whatItDoesLabel: 'Wofür es genutzt wird',
    whatItDoesHeading: 'Wofür die Dokumentation genutzt wird',
    whatItDoesItems: [
      {
        title: 'Booking & Lineup-Pitches',
        body: 'Aktuelle Bühnenbilder und Clips, die Booking-Agenturen sofort nutzen können.',
      },
      {
        title: 'Presse & Ankündigungen am nächsten Tag',
        body: 'Schnelle Auswahl, solange die Show noch aktuell ist.',
      },
      {
        title: 'Venue-Marketing',
        body: 'Saubere Bilder für Recaps, Listings und Monatsprogramme.',
      },
      {
        title: 'Sponsoren- & Partnerberichte',
        body: 'Assets, die Partnern zeigen, dass der Abend geliefert hat.',
      },
      {
        title: 'Social & vertikaler Content',
        body: 'Reels-/Stories-fertige Clips direkt vom Set.',
      },
    ],
    includedLabel: 'Was Sie erhalten',
    includedHeading: 'Was Sie erhalten',
    includedLede:
      'Organisiert geliefert und direkt einsatzbereit — für Booking, Presse und die nächste Ankündigung.',
    includedCards: [
      {
        slug: 'stage-photos',
        title: 'Bühnenfotos',
        body: 'Starke Live-Bilder mit Licht, Bewegung und den wichtigen Momenten.',
      },
      {
        slug: 'crowd-atmosphere',
        title: 'Crowd- & Raumatmosphäre',
        body: 'Bilder, die zeigen, wie sich der Abend angefühlt hat, nicht nur, wie er aussah.',
      },
      {
        slug: 'backstage-moments',
        title: 'Backstage-Momente',
        body: 'Ruhige Details vor und nach dem Set, wenn der Zugang es erlaubt.',
      },
      {
        slug: 'vertical-clips',
        title: 'Vertikale Videoclips',
        body: 'Reels- und Stories-fertige Momente aus derselben Nacht.',
      },
      {
        slug: 'press-ready-selects',
        title: 'Pressereife Auswahl',
        body: 'Eine kuratierte, benannte Auswahl, bereit für Presse und Partner.',
      },
      {
        slug: 'fast-delivery',
        title: 'Schnelle Priority-Lieferung',
        body: 'Wichtige Selects schnell genug für einen Post oder eine Ankündigung am nächsten Tag.',
      },
    ],
    includedCta: 'Verfügbarkeit anfragen',
    proofLabel: 'Wie wir arbeiten',
    proofItems: [],
    proofProse: [
      'Ruhig im Raum. Schnell danach.',
      'Ein bis zwei Personen vor Ort, abgestimmt auf Bühnenlicht, Timing und Publikumsfluss, ohne im Weg zu stehen. Foto und Video aus einer Hand, mit priorisierten Selects, schnell genug für das nächste Booking, die nächste Ankündigung, die nächste Kampagne.',
    ],
    finalHeading: 'Lass uns deine nächste Show begleiten.',
    finalBody:
      'Jede Show ist anders. Wir entwickeln das Briefing gemeinsam — abgestimmt auf Termin, Venue und den Zweck der Dokumentation.',
    finalCta: 'Verfügbarkeit anfragen',
  },
}

export default function ConcertsBerlin() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
