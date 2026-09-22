import AdLandingPage, { type AdLandingPageConfig } from "./AdLandingPage";
import { useLocale } from "../i18n/LocaleProvider";
import { resolveImagePath } from "../utils/resolveImagePath";

const baseConfig = {
  slug: "artist-musician-documentation",
  serviceSlug: "artist-musician",
  ctaPackage: "project",
  ogImage: "https://expose-u.com/og-artist-musician-documentation.jpg",
  heroImage: resolveImagePath(
    "src/assets/images/landing/artistMusician_hero_01.webp",
  ),
  supportImage: resolveImagePath(
    "src/assets/images/landing/artistMusician_hero.webp",
  ),
  // Portraits, session and performance frames, so "what you get" reads as a
  // body of work rather than one photo.
  supportImages: [
    "/src/assets/images/services/3_artist_sessions/_incoming/gallery/0014.webp",
    "/src/assets/images/services/3_artist_sessions/_incoming/gallery/0016.webp",
    "/src/assets/images/services/3_artist_sessions/_incoming/gallery/0021.webp",
    "/src/assets/images/services/3_artist_sessions/_incoming/gallery/0022.webp",
    "/src/assets/images/services/3_artist_sessions/_incoming/gallery/020.webp",
    "/src/assets/images/services/3_artist_sessions/_incoming/gallery/021.webp",
  ].map((path) => resolveImagePath(path)),
  metaContentName: "Artist Musician Documentation Landing Page",
  customPixelEvent: "ArtistMusicianLandingView",
  // Lighter than the shared hero wash so the footage actually reads.
  heroOverlay: "linear-gradient(90deg, rgba(5, 7, 11, 0.82), rgba(5, 7, 11, 0.34))",
  // Same background film as the homepage hero (desktop + portrait cut).
  // startAt skips into the source on first play (loop restarts at 0).
  heroVideo: { id: "1228854165", mobileId: "1228856768", startAt: 0.5 },
  // Mobile: price line / proof pills / CTA sit below the hero instead of
  // overlaid on the video, and WhatsApp/call/email move to after the
  // inline lead form so every contact option is grouped together.
  heroPriceProofBelowFoldMobile: true,
  heroContactAfterLeadFormMobile: true,
};

// The offer first, then how we shoot, then who it's for.
const SECTION_ORDER: AdLandingPageConfig["sectionOrder"] = ["included", "proof", "audience"];

const configs: Record<"en" | "de", AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    sectionOrder: SECTION_ORDER,
    canonical: "https://expose-u.com/artist-musician-documentation",
    title: "Artist & Musician Documentation Berlin",
    description:
      "Editorial photo and video documentation for artists, musicians and performers in Berlin. Press-ready, delivered fast enough to matter.",
    ogTitle: "Artist & Musician Documentation Berlin | expose.u",
    ogDescription:
      "Your archive starts with your first show. Editorial documentation for artists and musicians in Berlin.",
    heroKicker: "Artist & musician documentation · Berlin",
    h1: "Your archive starts with your first show.",
    h1Line1: "Your archive starts with your first show.",
    h1Line2: "",
    subheadline:
      "Not a phone video. The kind of image that makes a label, venue or booking agent take the project seriously.",
    subheadlineMobile: "Press-ready images labels and venues take seriously.",
    // Matches the €400–€700 range this page states in pricingNote below.
    heroPriceLine: "Editorial photo & video from €400 · Berlin · 24h reply",
    heroProofItems: ["Hero portraits", "Performance documentation", "Vertical social", "Press-ready selects"],
    heroContact: {
      whatsapp: { href: "https://wa.me/48786696765", label: "WhatsApp us" },
      phone: { href: "tel:+4917622132950", label: "Call" },
      email: { href: "mailto:hello@expose-u.com", label: "Email" },
    },
    cta: "Request availability",
    ctaSecondary: "See what's included",
    stickyCta: "Request availability",
    stickyCtaNote: "Editorial photo & video from €400",
    leadForm: {
      serviceLabel: "Artist / Musician",
      heading: "Tell us about the project.",
      body: "Every project gets a proposal built around scope, timeline and budget. Send us the date and what the images are for, and we will come back within a day.",
      nameLabel: "Name",
      emailLabel: "Email",
      dateLabel: "Show or shoot date",
      dateHint: "(optional)",
      datePlaceholder: "e.g. 12 September 2026",
      submitLabel: "Request availability →",
      sendingLabel: "Sending…",
      successHeading: "Got it — thank you.",
      successBody: "We've received your details and will get back to you within a day with availability and next steps.",
      errorGeneric: "Something went wrong — please email us at hello@expose-u.com",
      fullFormLabel: "Prefer the full form?",
      fullFormHref: "/contact?service=artist-musician&package=project",
    },
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
    includedLabel: "What you get",
    includedHeading: "What you receive",
    includedLede:
      "Organized and ready to use for release day, press and booking.",
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
    proofItems: [
      {
        title: "One quiet, minimal crew",
        body: "A small team on site with the kit the shoot actually needs.",
      },
      {
        title: "Press-ready and current",
        body: "The difference a label, venue or booking agent notices immediately next to a phone clip from the crowd.",
      },
      {
        title: "Delivered fast enough to matter",
        body: "In time for the release date, the press outreach and the next booking pitch.",
      },
      {
        title: "The start of an archive",
        body: "The first entry in a visual record that keeps building with every project.",
      },
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
    sectionOrder: SECTION_ORDER,
    canonical: "https://expose-u.com/de/artist-musician-documentation",
    title: "Künstler- und Musikerdokumentation Berlin",
    description:
      "Editoriale Foto- und Videodokumentation für Künstler:innen, Musiker:innen und Performer in Berlin. Pressereif, schnell geliefert.",
    ogTitle: "Künstler- und Musikerdokumentation Berlin | expose.u",
    ogDescription:
      "Ihr Archiv beginnt mit dem ersten Auftritt. Editoriale Dokumentation für Künstler:innen und Musiker:innen in Berlin.",
    heroKicker: "Künstler- & Musikerdokumentation · Berlin",
    h1: "Ihr Archiv beginnt mit dem ersten Auftritt.",
    h1Line1: "Ihr Archiv beginnt mit dem ersten Auftritt.",
    h1Line2: "",
    subheadline:
      "Kein Handyvideo. Die Art von Bild, die ein Label, eine Venue oder eine Booking-Agentur den Auftritt ernst nehmen lässt.",
    subheadlineMobile: "Pressereife Bilder, die Labels und Venues ernst nehmen.",
    // Entspricht der Spanne von 400–700 €, die diese Seite unten in pricingNote nennt.
    heroPriceLine: "Editoriales Foto & Video ab 400 € · Berlin · Antwort in 24 Std.",
    heroProofItems: ["Hero-Portraits", "Auftrittsdokumentation", "Vertikale Social-Assets", "Pressereife Auswahl"],
    heroContact: {
      whatsapp: { href: "https://wa.me/48786696765", label: "WhatsApp schreiben" },
      phone: { href: "tel:+4917622132950", label: "Anrufen" },
      email: { href: "mailto:hello@expose-u.com", label: "E-Mail" },
    },
    cta: "Verfügbarkeit anfragen",
    ctaSecondary: "Sehen Sie, was enthalten ist",
    stickyCta: "Verfügbarkeit anfragen",
    stickyCtaNote: "Editoriales Foto & Video ab 400 €",
    leadForm: {
      serviceLabel: "Künstler:in / Musiker:in",
      heading: "Erzählen Sie uns von dem Projekt.",
      body: "Jedes Projekt bekommt ein Angebot, abgestimmt auf Umfang, Zeitplan und Budget. Schicken Sie uns den Termin und wofür die Bilder gedacht sind, und wir melden uns innerhalb eines Tages.",
      nameLabel: "Name",
      emailLabel: "E-Mail",
      dateLabel: "Auftritts- oder Shooting-Termin",
      dateHint: "(optional)",
      datePlaceholder: "z. B. 12. September 2026",
      submitLabel: "Verfügbarkeit anfragen →",
      sendingLabel: "Wird gesendet…",
      successHeading: "Erhalten — vielen Dank.",
      successBody: "Wir haben Ihre Angaben erhalten und melden uns innerhalb eines Tages mit Verfügbarkeit und nächsten Schritten.",
      errorGeneric: "Etwas ist schiefgelaufen – schreiben Sie uns bitte an hello@expose-u.com",
      fullFormLabel: "Lieber das vollständige Formular?",
      fullFormHref: "/de/contact?service=artist-musician&package=project",
    },
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
    includedLabel: "Was Sie erhalten",
    includedHeading: "Was Sie erhalten",
    includedLede:
      "Organisiert geliefert und einsatzbereit für den Release-Tag, die Presse und Bookings.",
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
    proofItems: [
      {
        title: "Ein ruhiges, minimales Team",
        body: "Ein kleines Team vor Ort, mit der Ausrüstung, die der Dreh wirklich braucht.",
      },
      {
        title: "Pressereif und aktuell",
        body: "Der Unterschied, den ein Label, eine Venue oder eine Booking-Agentur sofort bemerkt, neben einem Handyclip aus dem Publikum.",
      },
      {
        title: "Schnell genug geliefert, um zu zählen",
        body: "Rechtzeitig für den Release-Termin, die Presse-Anfrage und den nächsten Booking-Pitch.",
      },
      {
        title: "Der Anfang eines Archivs",
        body: "Der erste Eintrag in einem visuellen Archiv, das mit jedem Projekt weiterwächst.",
      },
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
