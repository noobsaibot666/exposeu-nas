import AdLandingPage, { type AdLandingPageConfig } from "./AdLandingPage";
import { useLocale } from "../i18n/LocaleProvider";
import { resolveImagePath } from "../utils/resolveImagePath";

const baseConfig = {
  slug: "gallery-museum-documentation",
  serviceSlug: "gallery-museum",
  ctaPackage: "project",
  ogImage: "https://expose-u.com/og-gallery-museum-documentation.jpg",
  heroImage: resolveImagePath("src/assets/images/landing/gallery_hero_05.webp"),
  supportImage: resolveImagePath("src/assets/images/landing/gallery_hero.webp"),
  metaContentName: "Gallery Museum Documentation Landing Page",
  customPixelEvent: "GalleryMuseumLandingView",
  // Lighter than the shared hero wash so the installation shot actually reads.
  heroOverlay: "linear-gradient(90deg, rgba(5, 7, 11, 0.82), rgba(5, 7, 11, 0.34))",
};

// Concrete deliverables first, then how we work, then who it's for.
const SECTION_ORDER: AdLandingPageConfig["sectionOrder"] = ["included", "proof", "audience"];

const configs: Record<"en" | "de", AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    sectionOrder: SECTION_ORDER,
    canonical: "https://expose-u.com/gallery-museum-documentation",
    title: "Gallery & Museum Documentation Berlin",
    description:
      "Considered photo and video documentation for galleries and museums in Berlin — press- and archive-ready.",
    ogTitle: "Gallery & Museum Documentation Berlin | expose.u",
    ogDescription:
      "Installation views, artwork details and opening night, documented to archive standard. For Berlin galleries and museums.",
    heroKicker: "Berlin Art Week & Gallery Night 2026 · limited slots",
    h1: "Your exhibition, documented to archive standard.",
    h1Line1: "Your exhibition, documented to archive standard.",
    h1Line2: "",
    subheadline:
      "Installation views, artwork details and opening night — considered photography and video for Berlin galleries and museums. Press-ready files in hand before the show closes.",
    cta: "Book your date",
    ctaSecondary: "See sample work",
    stickyCta: "Book your date",
    stickyCtaNote: "Limited Art Week slots",
    audienceLabel: "Who this is for",
    audienceHeading: "For galleries, curators and institutions",
    audienceGroups: [],
    audienceItems: [
      {
        title: "Contemporary art galleries",
        body: "Installation and opening images for press, web and archive.",
      },
      {
        title: "Museums and cultural institutions",
        body: "Archive-grade documentation for grants, reports and collections.",
      },
      {
        title: "Curators and project spaces",
        body: "Portfolio- and catalogue-ready material, every show.",
      },
    ],
    includedLabel: "What you get",
    includedHeading: "Installation views, details and opening night",
    includedLede:
      "Delivered as a named, press-ready set — organised the way your team will use it.",
    includedCards: [
      {
        slug: "installation-views",
        title: "Installation views",
        body: "Wide, clean, press-ready.",
      },
      {
        slug: "artwork-detail",
        title: "Artwork detail images",
        body: "Close-ups of individual works and materials.",
      },
      {
        slug: "opening-documentation",
        title: "Opening documentation",
        body: "Opening night, unstaged.",
      },
      {
        slug: "vertical-social",
        title: "Vertical social assets",
        body: "Reels- and Stories-ready clips and images.",
      },
      {
        slug: "press-ready-selects",
        title: "Press-ready selects",
        body: "A curated, named set to hand to press and partners.",
      },
      {
        slug: "24-48h-delivery",
        title: "Delivered before the show closes",
        body: "Named selects in hand while the exhibition is still up.",
      },
    ],
    includedCta: "Book your documentation",
    proofLabel: "How we work",
    proofItems: [
      {
        title: "Shot for the archive",
        body: "Wide, corrected installation views and artwork details, built to outlast the show.",
      },
      {
        title: "In hand before it closes",
        body: "Selects delivered within days of the shoot — in time for press and catalogue deadlines, every exhibition.",
      },
      {
        title: "Made for Berlin's galleries",
        body: "Documentation aligned to how galleries, curators and institutions actually use it: press, web, grants, collectors.",
      },
    ],
    finalHeading: "Book before your opening.",
    finalBody:
      "Berlin Art Week is one week and we take on a limited number of exhibitions. Send us your install and opening dates — we'll hold a slot.",
    finalCta: "Book your date",
  },
  de: {
    ...baseConfig,
    sectionOrder: SECTION_ORDER,
    canonical: "https://expose-u.com/de/gallery-museum-documentation",
    title: "Galerie- & Museumsdokumentation Berlin",
    description:
      "Durchdachte Foto- und Videodokumentation für Galerien und Museen in Berlin — presse- und archivfertig.",
    ogTitle: "Galerie- & Museumsdokumentation Berlin | expose.u",
    ogDescription:
      "Installationsansichten, Werkdetails und Eröffnungsabend, dokumentiert auf Archivniveau. Für Galerien und Museen in Berlin.",
    heroKicker: "Berlin Art Week & Gallery Night 2026 · begrenzte Plätze",
    h1: "Ihre Ausstellung, dokumentiert auf Archivniveau.",
    h1Line1: "Ihre Ausstellung, dokumentiert auf Archivniveau.",
    h1Line2: "",
    subheadline:
      "Installationsansichten, Werkdetails und Eröffnungsabend — durchdachte Foto- und Videoarbeit für Galerien und Museen in Berlin. Pressefertige Dateien in der Hand, bevor die Ausstellung schließt.",
    cta: "Termin sichern",
    ctaSecondary: "Arbeiten ansehen",
    stickyCta: "Termin sichern",
    stickyCtaNote: "Begrenzte Art-Week-Plätze",
    audienceLabel: "Für wen das ist",
    audienceHeading: "Für Galerien, Kurator:innen und Institutionen",
    audienceGroups: [],
    audienceItems: [
      {
        title: "Zeitgenössische Kunstgalerien",
        body: "Installations- und Eröffnungsbilder für Presse, Web und Archiv.",
      },
      {
        title: "Museen und Kulturinstitutionen",
        body: "Archivfähige Dokumentation für Förderung, Berichte und Sammlung.",
      },
      {
        title: "Kurator:innen und Projekträume",
        body: "Portfolio- und katalogfertiges Material, jede Ausstellung.",
      },
    ],
    includedLabel: "Was Sie bekommen",
    includedHeading: "Installationsansichten, Details und Eröffnung",
    includedLede:
      "Geliefert als benannte, pressefertige Auswahl — so geordnet, wie Ihr Team sie nutzt.",
    includedCards: [
      {
        slug: "installation-views",
        title: "Installationsansichten",
        body: "Weit, klar, pressefertig.",
      },
      {
        slug: "artwork-detail",
        title: "Werkdetailaufnahmen",
        body: "Nahaufnahmen einzelner Werke und Materialien.",
      },
      {
        slug: "opening-documentation",
        title: "Eröffnungsdokumentation",
        body: "Eröffnungsabend, uninszeniert.",
      },
      {
        slug: "vertical-social",
        title: "Vertikale Social-Assets",
        body: "Reels- und Stories-fertige Clips und Bilder.",
      },
      {
        slug: "press-ready-selects",
        title: "Pressereife Auswahl",
        body: "Eine kuratierte, benannte Auswahl für Presse und Partner.",
      },
      {
        slug: "24-48h-delivery",
        title: "Lieferung vor Ausstellungsende",
        body: "Benannte Auswahl in der Hand, solange die Ausstellung noch läuft.",
      },
    ],
    includedCta: "Dokumentation buchen",
    proofLabel: "Wie wir arbeiten",
    proofItems: [
      {
        title: "Fürs Archiv fotografiert",
        body: "Weite, entzerrte Installationsansichten und Werkdetails, die die Ausstellung überdauern.",
      },
      {
        title: "In der Hand, bevor sie schließt",
        body: "Auswahl innerhalb weniger Tage nach dem Shooting — rechtzeitig für Presse- und Katalogtermine, jede Ausstellung.",
      },
      {
        title: "Für Berlins Galerien gemacht",
        body: "Dokumentation, ausgerichtet daran, wie Galerien, Kurator:innen und Institutionen sie wirklich nutzen: Presse, Web, Förderung, Sammler.",
      },
    ],
    finalHeading: "Buchen Sie vor Ihrer Eröffnung.",
    finalBody:
      "Berlin Art Week ist nur eine Woche, und wir übernehmen eine begrenzte Anzahl an Ausstellungen. Schicken Sie uns Aufbau- und Eröffnungstermine — wir halten einen Platz frei.",
    finalCta: "Termin sichern",
  },
};

export default function GalleryMuseumLanding() {
  const { locale } = useLocale();

  return <AdLandingPage config={configs[locale]} />;
}
