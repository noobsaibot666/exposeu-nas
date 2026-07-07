import AdLandingPage, { type AdLandingPageConfig } from "./AdLandingPage";
import { useLocale } from "../i18n/LocaleProvider";
import { resolveImagePath } from "../utils/resolveImagePath";

const baseConfig = {
  slug: "gallery-museum-documentation",
  serviceSlug: "gallery-museum",
  ctaPackage: "project",
  ogImage: "https://expose-u.com/og-gallery-museum-documentation.jpg",
  heroImage: resolveImagePath("src/assets/images/landing/gallery_hero_05.jpeg"),
  supportImage: resolveImagePath("src/assets/images/landing/gallery_hero.jpeg"),
  metaContentName: "Gallery Museum Documentation Landing Page",
  customPixelEvent: "GalleryMuseumLandingView",
};

const configs: Record<"en" | "de", AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    canonical: "https://expose-u.com/gallery-museum-documentation",
    title: "Gallery & Museum Documentation Berlin",
    description:
      "Press-ready, curator-aligned documentation for galleries, museums and cultural institutions in Berlin. Delivered in 24-48 hours.",
    ogTitle: "Gallery & Museum Documentation Berlin | expose.u",
    ogDescription:
      "Documentation that outlasts the opening. Photo and video for galleries, museums and cultural institutions in Berlin.",
    h1: "Documentation That Outlasts the Opening",
    h1Line1: "Documentation That Outlasts the Opening",
    h1Line2: "",
    subheadline:
      "expose.u documents exhibitions and openings with curator-aligned, press-ready images — delivered in 24-48 hours.",
    cta: "Request availability",
    ctaSecondary: "See what's included",
    audienceLabel: "Who this is for",
    audienceHeading: "For galleries, curators and institutions",
    audienceGroups: [],
    audienceItems: [
      {
        title: "Contemporary art galleries",
        body: "Installation views and opening documentation, ready for press, website and archive.",
      },
      {
        title: "Museums and cultural institutions",
        body: "Archive-quality documentation for grant applications, funding reports and collections.",
      },
      {
        title: "Curators and independent project spaces",
        body: "Portfolio and catalogue-ready material for every show.",
      },
      {
        title: "Exhibition design studios",
        body: "Spatial documentation of the installation itself, not just the artwork on the walls.",
      },
    ],
    whatItDoesLabel: "What it does",
    whatItDoesHeading: "What the documentation does",
    whatItDoesItems: [
      {
        title: "Archive & institutional memory",
        body: "A permanent record of the exhibition, independent of what happened to be photographed at the opening.",
      },
      {
        title: "Press & catalogues",
        body: "Artwork detail and installation images ready for publications and exhibition catalogues.",
      },
      {
        title: "Grant & funding applications",
        body: "Professional documentation supporting applications and institutional reporting.",
      },
      {
        title: "Collector communication",
        body: "Opening and artwork imagery ready for direct collector follow-up.",
      },
      {
        title: "Social & vertical content",
        body: "Reels/Stories-ready assets that keep the exhibition visible after it closes.",
      },
    ],
    includedLabel: "What you get",
    includedHeading: "What you receive",
    includedLede:
      "Delivered organized and ready to use — for press, catalogues, funders and the archive.",
    includedCards: [
      {
        slug: "installation-views",
        title: "Installation views",
        body: "Wide, clean views of the show, laid out for press and archive.",
      },
      {
        slug: "artwork-detail",
        title: "Artwork detail images",
        body: "Close-up frames of individual works and materials.",
      },
      {
        slug: "opening-documentation",
        title: "Opening documentation",
        body: "Guests and atmosphere on opening night, without staged scenes.",
      },
      {
        slug: "vertical-social",
        title: "Vertical social assets",
        body: "Reels- and Stories-ready clips and images.",
      },
      {
        slug: "press-ready-selects",
        title: "Press-ready selects",
        body: "A curated set, organized and named, ready to hand to press and partners.",
      },
      {
        slug: "24-48h-delivery",
        title: "24-48 hour delivery",
        body: "Fast enough to matter while the show is still news.",
      },
    ],
    includedCta: "Request availability",
    proofLabel: "How we work",
    proofItems: [],
    proofProse: [
      "Quiet on set. Curator-aligned.",
      "We read the exhibition before we shoot it — the sightlines, the sequencing, what the curator meant to anchor the room. One or two people on site, never disrupting the opening or the work. Photo and video from one team, delivered press-ready within 24-48 hours.",
    ],
    finalHeading: "Let's document your exhibition.",
    finalBody:
      "Every exhibition is different. We build the brief around your show, your timeline and what you need the documentation for.",
    finalCta: "Request availability",
  },
  de: {
    ...baseConfig,
    canonical: "https://expose-u.com/de/gallery-museum-documentation",
    title: "Galerie- & Museumsdokumentation Berlin",
    description:
      "Pressereife, kuratorisch abgestimmte Dokumentation für Galerien, Museen und Kulturinstitutionen in Berlin. Lieferung in 24-48 Stunden.",
    ogTitle: "Galerie- & Museumsdokumentation Berlin | expose.u",
    ogDescription:
      "Dokumentation, die die Vernissage überdauert. Foto und Video für Galerien, Museen und Kulturinstitutionen in Berlin.",
    h1: "Dokumentation, die die Vernissage überdauert",
    h1Line1: "Dokumentation, die die Vernissage überdauert",
    h1Line2: "",
    subheadline:
      "expose.u dokumentiert Ausstellungen und Eröffnungen mit kuratorisch abgestimmten, pressereifen Bildern — geliefert in 24-48 Stunden.",
    cta: "Verfügbarkeit anfragen",
    ctaSecondary: "Sehen Sie, was enthalten ist",
    audienceLabel: "Für wen das ist",
    audienceHeading: "Für Galerien, Kurator:innen und Institutionen",
    audienceGroups: [],
    audienceItems: [
      {
        title: "Zeitgenössische Kunstgalerien",
        body: "Installationsansichten und Eröffnungsdokumentation, einsatzbereit für Presse, Website und Archiv.",
      },
      {
        title: "Museen und Kulturinstitutionen",
        body: "Archivfähige Dokumentation für Förderanträge, Berichte und Sammlungen.",
      },
      {
        title: "Kurator:innen und unabhängige Projekträume",
        body: "Portfolio- und katalogfertiges Material für jede Ausstellung.",
      },
      {
        title: "Ausstellungsgestalter:innen",
        body: "Räumliche Dokumentation der Installation selbst, nicht nur der Werke an der Wand.",
      },
    ],
    whatItDoesLabel: "Wofür es genutzt wird",
    whatItDoesHeading: "Wofür die Dokumentation genutzt wird",
    whatItDoesItems: [
      {
        title: "Archiv & institutionelles Gedächtnis",
        body: "Ein dauerhafter Nachweis der Ausstellung, unabhängig davon, was am Eröffnungsabend zufällig fotografiert wurde.",
      },
      {
        title: "Presse & Kataloge",
        body: "Werk- und Installationsdetails, einsatzbereit für Publikationen und Ausstellungskataloge.",
      },
      {
        title: "Förderanträge",
        body: "Professionelle Dokumentation zur Unterstützung von Anträgen und institutionellen Berichten.",
      },
      {
        title: "Sammlerkommunikation",
        body: "Eröffnungs- und Werkbilder, direkt einsetzbar in der Sammlerkommunikation.",
      },
      {
        title: "Social & vertikaler Content",
        body: "Reels-/Stories-fertige Assets, die die Ausstellung über die Laufzeit hinaus sichtbar halten.",
      },
    ],
    includedLabel: "Was Sie erhalten",
    includedHeading: "Was Sie erhalten",
    includedLede:
      "Organisiert geliefert und direkt einsatzbereit — für Presse, Kataloge, Förderer und das Archiv.",
    includedCards: [
      {
        slug: "installation-views",
        title: "Installationsansichten",
        body: "Weite, klare Ansichten der Ausstellung, aufbereitet für Presse und Archiv.",
      },
      {
        slug: "artwork-detail",
        title: "Werkdetailaufnahmen",
        body: "Nahaufnahmen einzelner Werke und Materialien.",
      },
      {
        slug: "opening-documentation",
        title: "Eröffnungsdokumentation",
        body: "Gäste und Atmosphäre am Eröffnungsabend, ohne inszenierte Szenen.",
      },
      {
        slug: "vertical-social",
        title: "Vertikale Social-Assets",
        body: "Reels- und Stories-fertige Clips und Bilder.",
      },
      {
        slug: "press-ready-selects",
        title: "Pressereife Auswahl",
        body: "Eine kuratierte, benannte Auswahl, bereit für Presse und Partner.",
      },
      {
        slug: "24-48h-delivery",
        title: "Lieferung in 24-48 Stunden",
        body: "Schnell genug, um zu zählen, solange die Ausstellung noch aktuell ist.",
      },
    ],
    includedCta: "Verfügbarkeit anfragen",
    proofLabel: "Wie wir arbeiten",
    proofItems: [],
    proofProse: [
      "Kleines Team. Kuratorisch abgestimmt.",
      "Wir lesen die Ausstellung, bevor wir sie dokumentieren — die Blickführung, die Abfolge, was im Raum verankert werden sollte. Ein bis zwei Personen vor Ort, ohne die Eröffnung oder die Arbeit zu stören. Foto und Video aus einer Hand, pressereif geliefert innerhalb von 24-48 Stunden.",
    ],
    finalHeading: "Lassen Sie uns Ihre Ausstellung dokumentieren.",
    finalBody:
      "Jede Ausstellung ist anders. Wir entwickeln das Briefing gemeinsam — abgestimmt auf Ihre Ausstellung, Ihren Zeitplan und den Zweck der Dokumentation.",
    finalCta: "Verfügbarkeit anfragen",
  },
};

export default function GalleryMuseumLanding() {
  const { locale } = useLocale();

  return <AdLandingPage config={configs[locale]} />;
}
