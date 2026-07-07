import AdLandingPage, { type AdLandingPageConfig } from "./AdLandingPage";
import { useLocale } from "../i18n/LocaleProvider";
import { resolveImagePath } from "../utils/resolveImagePath";

const baseConfig = {
  slug: "artist-musician-documentation",
  serviceSlug: "artist-musician",
  ctaPackage: "project",
  ogImage: "https://expose-u.com/og-artist-musician-documentation.jpg",
  heroImage: resolveImagePath(
    "src/assets/images/landing/artistMusician_hero_01.jpg",
  ),
  supportImage: resolveImagePath(
    "src/assets/images/landing/artistMusician_hero.jpg",
  ),
  metaContentName: "Artist Musician Documentation Landing Page",
  customPixelEvent: "ArtistMusicianLandingView",
};

const configs: Record<"en" | "de", AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    canonical: "https://expose-u.com/artist-musician-documentation",
    title: "Artist & Musician Documentation Berlin",
    description:
      "Editorial photo and video documentation for artists, musicians and performers in Berlin. Press-ready, delivered fast enough to matter.",
    ogTitle: "Artist & Musician Documentation Berlin | expose.u",
    ogDescription:
      "Your archive starts with your first show. Editorial documentation for artists and musicians in Berlin.",
    h1: "Your Archive Starts With Your First Show",
    h1Line1: "Your Archive Starts With Your First Show",
    h1Line2: "",
    subheadline:
      "Not a phone video. The kind of image that makes a label, venue or booking agent take the project seriously.",
    cta: "Request availability",
    ctaSecondary: "See what's included",
    audienceLabel: "Who this is for",
    audienceHeading: "For artists, musicians and performers",
    audienceGroups: [],
    audienceItems: [
      {
        title: "Independent musicians and bands",
        body: "Press images and performance documentation for releases and bookings.",
      },
      {
        title: "Independent labels and management",
        body: "Visual assets for press, announcements and campaign launches.",
      },
      {
        title: "Performing artists, dancers, fashion designers",
        body: "Editorial documentation of performances and presentations.",
      },
      {
        title: "Creative studios and collectives",
        body: "Ongoing visual identity across projects.",
      },
    ],
    whatItDoesLabel: "What it does",
    whatItDoesHeading: "What the documentation does",
    whatItDoesItems: [
      {
        title: "Release campaigns",
        body: "Imagery and clips built for single, album and tour announcements.",
      },
      {
        title: "Press & booking",
        body: "Current, press-ready images for labels, venues and booking profiles.",
      },
      {
        title: "Platform presence",
        body: "Assets for Spotify, Apple Music and artist websites.",
      },
      {
        title: "Social & vertical content",
        body: "Reels/TikTok-ready material from the same shoot.",
      },
      {
        title: "Archive",
        body: "The first entry in a visual record that keeps building with every project.",
      },
    ],
    includedLabel: "What you get",
    includedHeading: "What you receive",
    includedLede:
      "Delivered organized and ready to use — for release day, press, and booking.",
    includedCards: [
      {
        slug: "hero-portraits",
        title: "Hero portraits",
        body: "Current, press-ready portraits that hold up next to any label roster.",
      },
      {
        slug: "performance-documentation",
        title: "Editorial performance documentation",
        body: "The show, captured properly — not a phone clip from the crowd.",
      },
      {
        slug: "release-campaign-imagery",
        title: "Release campaign imagery",
        body: "Built for single, album and tour announcements.",
      },
      {
        slug: "vertical-social",
        title: "Vertical social assets",
        body: "Reels- and TikTok-ready material from the same shoot.",
      },
      {
        slug: "platform-ready",
        title: "Platform-ready images",
        body: "Sized and ready for Spotify and Apple Music.",
      },
      {
        slug: "press-ready-selects",
        title: "Press-ready selects",
        body: "A curated, named set ready to hand to labels and venues.",
      },
    ],
    includedCta: "Request availability",
    proofLabel: "How we work",
    proofItems: [],
    proofProse: [
      "One quiet, minimal crew.",
      "Press-ready and current — the difference a label, venue or booking agent notices immediately next to a phone clip from the crowd. Delivered fast enough to matter: in time for the release date, the press outreach, the next booking pitch.",
    ],
    finalHeading: "Tell us about your show — let's start your archive.",
    finalBody:
      "Every project gets a proposal built around scope, timeline and budget.",
    pricingNote:
      "Most independent artist productions fall between €400 and €700, depending on concept, location and deliverables. Smaller projects and long-term collaborations are welcome to reach out.",
    finalCta: "Request availability",
  },
  de: {
    ...baseConfig,
    canonical: "https://expose-u.com/de/artist-musician-documentation",
    title: "Künstler- und Musikerdokumentation Berlin",
    description:
      "Editoriale Foto- und Videodokumentation für Künstler:innen, Musiker:innen und Performer in Berlin. Pressereif, schnell geliefert.",
    ogTitle: "Künstler- und Musikerdokumentation Berlin | expose.u",
    ogDescription:
      "Ihr Archiv beginnt mit dem ersten Auftritt. Editoriale Dokumentation für Künstler:innen und Musiker:innen in Berlin.",
    h1: "Ihr Archiv beginnt mit dem ersten Auftritt",
    h1Line1: "Ihr Archiv beginnt mit dem ersten Auftritt",
    h1Line2: "",
    subheadline:
      "Kein Handyvideo. Die Art von Bild, die ein Label, eine Venue oder eine Booking-Agentur den Auftritt ernst nehmen lässt.",
    cta: "Verfügbarkeit anfragen",
    ctaSecondary: "Sehen Sie, was enthalten ist",
    audienceLabel: "Für wen das ist",
    audienceHeading: "Für Künstler:innen, Musiker:innen und Performer",
    audienceGroups: [],
    audienceItems: [
      {
        title: "Unabhängige Musiker:innen und Bands",
        body: "Presse- und Auftrittsdokumentation für Releases und Bookings.",
      },
      {
        title: "Unabhängige Labels und Management",
        body: "Visuelle Assets für Presse, Ankündigungen und Kampagnen-Launches.",
      },
      {
        title: "Performer, Tänzer:innen, Modedesigner:innen",
        body: "Editoriale Dokumentation von Auftritten und Präsentationen.",
      },
      {
        title: "Kreativstudios und Kollektive",
        body: "Durchgängige visuelle Identität über mehrere Projekte hinweg.",
      },
    ],
    whatItDoesLabel: "Wofür es genutzt wird",
    whatItDoesHeading: "Wofür die Dokumentation genutzt wird",
    whatItDoesItems: [
      {
        title: "Release-Kampagnen",
        body: "Bilder und Clips für Single-, Album- und Tour-Ankündigungen.",
      },
      {
        title: "Presse & Booking",
        body: "Aktuelle, pressereife Bilder für Labels, Venues und Booking-Profile.",
      },
      {
        title: "Plattformpräsenz",
        body: "Assets für Spotify, Apple Music und Artist-Websites.",
      },
      {
        title: "Social & vertikaler Content",
        body: "Reels-/TikTok-fertiges Material aus demselben Shooting.",
      },
      {
        title: "Archiv",
        body: "Der erste Eintrag in einem visuellen Archiv, das mit jedem Projekt weiterwächst.",
      },
    ],
    includedLabel: "Was Sie erhalten",
    includedHeading: "Was Sie erhalten",
    includedLede:
      "Organisiert geliefert und direkt einsatzbereit — für den Release-Tag, die Presse und Bookings.",
    includedCards: [
      {
        slug: "hero-portraits",
        title: "Hero-Portraits",
        body: "Aktuelle, pressereife Portraits, die neben jedem Label-Roster bestehen.",
      },
      {
        slug: "performance-documentation",
        title: "Editoriale Auftrittsdokumentation",
        body: "Der Auftritt, richtig festgehalten — kein Handyclip aus dem Publikum.",
      },
      {
        slug: "release-campaign-imagery",
        title: "Release-Kampagnenbilder",
        body: "Für Single-, Album- und Tour-Ankündigungen.",
      },
      {
        slug: "vertical-social",
        title: "Vertikale Social-Assets",
        body: "Reels- und TikTok-fertiges Material aus demselben Shooting.",
      },
      {
        slug: "platform-ready",
        title: "Plattformfertige Bilder",
        body: "Formatiert und bereit für Spotify und Apple Music.",
      },
      {
        slug: "press-ready-selects",
        title: "Pressereife Auswahl",
        body: "Eine kuratierte, benannte Auswahl für Labels und Venues.",
      },
    ],
    includedCta: "Verfügbarkeit anfragen",
    proofLabel: "Wie wir arbeiten",
    proofItems: [],
    proofProse: [
      "Ein ruhiges, minimales Team.",
      "Pressereif und aktuell — der Unterschied, den ein Label, eine Venue oder eine Booking-Agentur sofort bemerkt, neben einem Handyclip aus dem Publikum. Schnell genug geliefert, um zu zählen: rechtzeitig für den Release-Termin, die Presse-Anfrage, den nächsten Booking-Pitch.",
    ],
    finalHeading:
      "Erzählen Sie uns von Ihrem Auftritt — starten wir Ihr Archiv.",
    finalBody:
      "Jedes Projekt bekommt ein Angebot, abgestimmt auf Umfang, Zeitplan und Budget.",
    pricingNote:
      "Die meisten unabhängigen Artist-Produktionen liegen zwischen 400 € und 700 €, je nach Konzept, Location und Deliverables. Kleinere Projekte und langfristige Zusammenarbeiten sind ausdrücklich willkommen.",
    finalCta: "Verfügbarkeit anfragen",
  },
};

export default function ArtistMusicianLanding() {
  const { locale } = useLocale();

  return <AdLandingPage config={configs[locale]} />;
}
