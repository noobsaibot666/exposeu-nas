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
};

const configs: Record<"en" | "de", AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    canonical: "https://expose-u.com/gallery-museum-documentation",
    title: "Gallery & Museum Documentation Berlin",
    description:
      "Press-ready, curator-aligned documentation for galleries and museums in Berlin.",
    ogTitle: "Gallery & Museum Documentation Berlin | expose.u",
    ogDescription:
      "Documentation that outlasts the opening. Photo and video for galleries and museums in Berlin.",
    h1: "Documentation That Outlasts the Opening",
    h1Line1: "Documentation That Outlasts the Opening",
    h1Line2: "",
    subheadline:
      "We document your exhibition with press-ready, curator-aligned images.",
    cta: "Request availability",
    ctaSecondary: "See what's included",
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
      {
        title: "Exhibition design studios",
        body: "The installation itself documented, not just the works.",
      },
    ],
    whatItDoesLabel: "What it does",
    whatItDoesHeading: "Where the documentation gets used",
    whatItDoesItems: [
      {
        title: "Archive & institutional memory",
        body: "A permanent record of the show, not just the opening.",
      },
      {
        title: "Press & catalogues",
        body: "Detail and installation shots, ready for print.",
      },
      {
        title: "Grant & funding applications",
        body: "Documentation that supports applications and reporting.",
      },
      {
        title: "Collector communication",
        body: "Opening and artwork images for collector follow-up.",
      },
      {
        title: "Social & vertical content",
        body: "Vertical assets that keep the show visible after it closes.",
      },
    ],
    includedLabel: "What you get",
    includedHeading: "What you receive",
    includedLede:
      "Organised and ready to use — for press, catalogues, funders and the archive.",
    includedCards: [
      {
        slug: "installation-views",
        title: "Installation views",
        body: "Wide, clean views, laid out for press and archive.",
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
        title: "Fast delivery",
        body: "Delivered while the show is still on.",
      },
    ],
    finalHeading: "Let's document your exhibition.",
    finalBody:
      "Every show is different. We build the brief around yours.",
    finalCta: "Request availability",
  },
  de: {
    ...baseConfig,
    canonical: "https://expose-u.com/de/gallery-museum-documentation",
    title: "Galerie- & Museumsdokumentation Berlin",
    description:
      "Pressereife, kuratorisch abgestimmte Dokumentation für Galerien und Museen in Berlin.",
    ogTitle: "Galerie- & Museumsdokumentation Berlin | expose.u",
    ogDescription:
      "Dokumentation, die die Vernissage überdauert. Foto und Video für Galerien und Museen in Berlin.",
    h1: "Dokumentation, die die Vernissage überdauert",
    h1Line1: "Dokumentation, die die Vernissage überdauert",
    h1Line2: "",
    subheadline:
      "Wir dokumentieren Ihre Ausstellung mit pressereifen, kuratorisch abgestimmten Bildern.",
    cta: "Verfügbarkeit anfragen",
    ctaSecondary: "Sehen Sie, was enthalten ist",
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
      {
        title: "Ausstellungsgestalter:innen",
        body: "Die Installation selbst dokumentiert, nicht nur die Werke.",
      },
    ],
    whatItDoesLabel: "Wofür es genutzt wird",
    whatItDoesHeading: "Wo die Dokumentation zum Einsatz kommt",
    whatItDoesItems: [
      {
        title: "Archiv & institutionelles Gedächtnis",
        body: "Ein dauerhafter Nachweis der Ausstellung, nicht nur der Eröffnung.",
      },
      {
        title: "Presse & Kataloge",
        body: "Detail- und Installationsaufnahmen, druckfertig.",
      },
      {
        title: "Förderanträge",
        body: "Dokumentation, die Anträge und Berichte stützt.",
      },
      {
        title: "Sammlerkommunikation",
        body: "Eröffnungs- und Werkbilder für die Sammleransprache.",
      },
      {
        title: "Social & vertikaler Content",
        body: "Vertikale Assets, die die Ausstellung nach Schluss sichtbar halten.",
      },
    ],
    includedLabel: "Was Sie bekommen",
    includedHeading: "Was Sie erhalten",
    includedLede:
      "Organisiert und einsatzbereit — für Presse, Kataloge, Förderer und Archiv.",
    includedCards: [
      {
        slug: "installation-views",
        title: "Installationsansichten",
        body: "Weite, klare Ansichten, aufbereitet für Presse und Archiv.",
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
        title: "Schnelle Lieferung",
        body: "Geliefert, solange die Ausstellung läuft.",
      },
    ],
    finalHeading: "Lassen Sie uns Ihre Ausstellung dokumentieren.",
    finalBody:
      "Jede Ausstellung ist anders. Wir bauen das Briefing um Ihre herum.",
    finalCta: "Verfügbarkeit anfragen",
  },
};

export default function GalleryMuseumLanding() {
  const { locale } = useLocale();

  return <AdLandingPage config={configs[locale]} />;
}
