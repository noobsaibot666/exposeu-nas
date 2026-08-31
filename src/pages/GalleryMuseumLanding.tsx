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
  // Lighter than the shared hero wash so the footage actually reads.
  heroOverlay: "linear-gradient(90deg, rgba(5, 7, 11, 0.82), rgba(5, 7, 11, 0.34))",
  // Same background film as the homepage hero (desktop + portrait cut).
  heroVideo: { id: "1220567424", mobileId: "1220568256" },
};

// The offer first, then how we shoot, then who it's for.
const SECTION_ORDER: AdLandingPageConfig["sectionOrder"] = ["included", "proof", "audience"];

const configs: Record<"en" | "de", AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    sectionOrder: SECTION_ORDER,
    canonical: "https://expose-u.com/gallery-museum-documentation",
    title: "Gallery & Museum Documentation Berlin",
    description:
      "Photo and video for exhibitions in Berlin — galleries, artists and independent spaces. Content worth sharing long after opening night.",
    ogTitle: "Exhibition Photo & Video Berlin | expose.u",
    ogDescription:
      "We photograph and film your exhibition and give you photo and video that keeps it alive long after it closes.",
    heroKicker: "Berlin Art Week & Gallery Night 2026",
    h1: "Give your exhibition a longer life.",
    h1Line1: "Give your exhibition a longer life.",
    h1Line2: "",
    subheadline:
      "We photograph and film your exhibition — the art, the space, the opening, the mood — and give you photo and video worth sharing long after the doors close.",
    cta: "Book your date",
    stickyCta: "Book your date",
    stickyCtaNote: "Limited Art Week slots",
    audienceLabel: "Who this is for",
    audienceHeading: "For galleries, artists and independent spaces",
    audienceGroups: [],
    audienceItems: [
      {
        title: "Galleries",
        body: "Solo and group shows, back-to-back openings through the fair.",
      },
      {
        title: "Artists with a show on",
        body: "Your exhibition, performance or installation — documented properly.",
      },
      {
        title: "Curators and project spaces",
        body: "Independent programmes that deserve the coverage the big institutions get.",
      },
    ],
    includedLabel: "What you get",
    includedHeading: "Photo and video you'll actually use.",
    includedLede:
      "Everything shot, edited and delivered ready to post, print and pitch.",
    includedCards: [
      {
        slug: "installation-views",
        title: "The art, shown at its best",
        body: "Every key work photographed the way it's meant to be seen.",
      },
      {
        slug: "artwork-detail",
        title: "Close-up detail",
        body: "Texture, material, the things people miss walking past.",
      },
      {
        slug: "opening-documentation",
        title: "The opening, as it felt",
        body: "The crowd, the faces, the energy — real, not posed.",
      },
      {
        slug: "vertical-social",
        title: "Ready to post",
        body: "Vertical video and stills to share while your show is the talk of the week.",
      },
      {
        slug: "press-ready-selects",
        title: "A set worth keeping",
        body: "Named, edited selects for press, collectors and your archive.",
      },
    ],
    includedCta: "Book your documentation",
    proofLabel: "How we work",
    proofItems: [
      {
        title: "We shoot what matters to you",
        body: "Your artists, your key works, your priorities — agreed before we arrive.",
      },
      {
        title: "Photo and video, one team",
        body: "Stills and motion covered together, so nothing about the day slips past.",
      },
      {
        title: "Close to the art, light on our feet",
        body: "We move quietly through the room and catch how it actually feels.",
      },
      {
        title: "Back to you fast",
        body: "Edited selects while people are still talking about the show.",
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
      "Foto und Video für Ausstellungen in Berlin — Galerien, Künstler:innen und unabhängige Räume. Inhalte, die weit über die Eröffnung hinaus wirken.",
    ogTitle: "Ausstellungs-Foto & -Video Berlin | expose.u",
    ogDescription:
      "Wir fotografieren und filmen Ihre Ausstellung und geben Ihnen Foto- und Videomaterial, das sie lange nach dem letzten Tag lebendig hält.",
    heroKicker: "Berlin Art Week & Gallery Night 2026",
    h1: "Geben Sie Ihrer Ausstellung ein längeres Leben.",
    h1Line1: "Geben Sie Ihrer Ausstellung ein längeres Leben.",
    h1Line2: "",
    subheadline:
      "Wir fotografieren und filmen Ihre Ausstellung — die Werke, den Raum, die Eröffnung, die Stimmung — und geben Ihnen Foto- und Videomaterial, das noch lange nach dem letzten Tag wirkt.",
    cta: "Termin sichern",
    stickyCta: "Termin sichern",
    stickyCtaNote: "Begrenzte Art-Week-Plätze",
    audienceLabel: "Für wen das ist",
    audienceHeading: "Für Galerien, Künstler:innen und unabhängige Räume",
    audienceGroups: [],
    audienceItems: [
      {
        title: "Galerien",
        body: "Einzel- und Gruppenausstellungen, Eröffnung auf Eröffnung während der Art Week.",
      },
      {
        title: "Künstler:innen mit einer laufenden Ausstellung",
        body: "Ihre Ausstellung, Performance oder Installation — richtig dokumentiert.",
      },
      {
        title: "Kurator:innen und Projekträume",
        body: "Unabhängige Programme, die dieselbe Aufmerksamkeit verdienen wie die großen Häuser.",
      },
    ],
    includedLabel: "Was Sie bekommen",
    includedHeading: "Foto und Video, das Sie wirklich nutzen.",
    includedLede:
      "Alles aufgenommen, bearbeitet und geliefert — bereit zum Posten, Drucken und Vorstellen.",
    includedCards: [
      {
        slug: "installation-views",
        title: "Die Kunst im besten Licht",
        body: "Jedes wichtige Werk so fotografiert, wie es gesehen werden soll.",
      },
      {
        slug: "artwork-detail",
        title: "Detailaufnahmen",
        body: "Textur, Material — das, was im Vorbeigehen übersehen wird.",
      },
      {
        slug: "opening-documentation",
        title: "Die Eröffnung, wie sie sich anfühlte",
        body: "Das Publikum, die Gesichter, die Energie — echt, nicht gestellt.",
      },
      {
        slug: "vertical-social",
        title: "Bereit zum Posten",
        body: "Vertikales Video und Stills, solange über Ihre Show gesprochen wird.",
      },
      {
        slug: "press-ready-selects",
        title: "Eine Auswahl, die bleibt",
        body: "Benannte, bearbeitete Selects für Presse, Sammler und Ihr Archiv.",
      },
    ],
    includedCta: "Dokumentation buchen",
    proofLabel: "Wie wir arbeiten",
    proofItems: [
      {
        title: "Wir fotografieren, worauf es Ihnen ankommt",
        body: "Ihre Künstler:innen, Ihre Schlüsselwerke, Ihre Prioritäten — vorab abgestimmt.",
      },
      {
        title: "Foto und Video, ein Team",
        body: "Stills und Bewegtbild zusammen abgedeckt, damit nichts vom Tag verloren geht.",
      },
      {
        title: "Nah an der Kunst, leicht auf den Beinen",
        body: "Wir bewegen uns leise durch den Raum und fangen ein, wie es sich wirklich anfühlt.",
      },
      {
        title: "Schnell zurück bei Ihnen",
        body: "Bearbeitete Auswahl, solange noch über die Show gesprochen wird.",
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
