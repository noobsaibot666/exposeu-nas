import AdLandingPage, { type AdLandingPageConfig } from "./AdLandingPage";
import { useLocale } from "../i18n/LocaleProvider";
import { resolveImagePath } from "../utils/resolveImagePath";

const baseConfig = {
  slug: "popups",
  serviceSlug: "popups",
  canonical: "https://expose-u.com/popups",
  ogImage: "https://expose-u.com/og-popups.jpg",
  heroImage: resolveImagePath("src/assets/images/landing/popup_hero.jpeg"),
  supportImage: resolveImagePath("src/assets/images/landing/popup_02.jpeg"),
  metaContentName: "Popups Landing Page",
  customPixelEvent: "PopupsLandingView",
};

const configs: Record<"en" | "de", AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    title: "Pop-up Photo and Video Content Berlin",
    description:
      "Photo and video content for pop-ups, launches, temporary retail spaces, and cultural brand moments in Berlin.",
    h1Line1: "Your pop-up is temporary.",
    h1Line2: "The content should last.",
    subheadline:
      "We create photo and video assets for pop-ups, launches, brand activations, chef takeovers, product drops, and temporary spaces in Berlin.",
    cta: "Book Now",
    ctaSecondary: "See what's included",
    audienceLabel: "Pop-up fit",
    audienceHeading: "You have the space. Now you need the content.",
    audienceBody: [
      "Pop-ups move fast. The setup, the people, the food, the products, the energy of the room — everything happens in a short window. We document it while it's alive.",
    ],
    audienceGroups: [
      {
        title: "For",
        items: [
          "Chefs",
          "Restaurants",
          "Brands",
          "Shops",
          "Designers",
          "Artists",
          "Product teams",
          "Creative teams",
        ],
      },
      {
        title: "Made for",
        items: [
          "Pop-up shops",
          "Chef takeovers",
          "Brand activations",
          "Product drops",
          "Launch days",
          "Cultural retail",
          "Community events",
          "Temporary spaces",
        ],
      },
    ],
    includedLabel: "What you get",
    includedHeading: "Everything you need while the moment is live.",
    includedLede:
      "We document the space, the details, the people, and the small moments that make the pop-up feel real — ready for social, press, partners, websites, and future launches.",
    includedCards: [
      {
        slug: "space-photos",
        title: "Space photos",
        body: "Clean views of the setup, layout, design, and finish.",
      },
      {
        slug: "product-moments",
        title: "Product moments",
        body: "Details, displays, food, objects, materials, and hero shots.",
      },
      {
        slug: "visitor-energy",
        title: "Visitor energy",
        body: "People browsing, tasting, interacting, buying, and bringing the space to life.",
      },
      {
        slug: "short-clips",
        title: "Short clips",
        body: "Vertical moments for reels, stories, launch recaps, and ads.",
      },
      {
        slug: "same-week-selects",
        title: "Same-week selects",
        body: "A focused set of images for same-week posting and partner updates.",
      },
      {
        slug: "partner-assets",
        title: "Partner assets",
        body: "Useful content for collaborators, hosts, sponsors, press, and follow-up.",
      },
    ],
    includedCta: "Book Now",
    proofLabel: "Why it matters",
    proofItems: [
      {
        title: "Built for short runs",
        body: "Pop-ups are quick. We work around limited opening windows, tight schedules, and fast turnarounds.",
      },
      {
        title: "Ready to publish",
        body: "You leave with content made for the channels where your pop-up lives: social, press, partners, website, and recap.",
      },
      {
        title: "More than documentation",
        body: "We document the space, the product, the people and the small moments that make the experience worth sharing — material you can use long after the doors close.",
      },
    ],
    usageLabel: "Where it works",
    usageHeading: "Your pop-up content needs to work everywhere.",
    usageIntro:
      "One focused session gives you assets for the places your audience, partners, and future clients will actually see you.",
    platforms: [
      {
        name: "Instagram",
        use: "Posts, reels, stories, launch recaps, and carousels.",
      },
      {
        name: "TikTok",
        use: "Short vertical clips from the space, product, food, and visitor moments.",
      },
      {
        name: "Press",
        use: "Selected images for listings, launch notes, blogs, and media follow-up.",
      },
      {
        name: "Partners",
        use: "Assets your collaborators, hosts, sponsors, and vendors can share.",
      },
      {
        name: "Website",
        use: "Clean proof of the space, product, audience and energy of the day.",
      },
      {
        name: "Next launch",
        use: "Content that helps you pitch, announce, and sell the next pop-up.",
      },
    ],
    usageCta: "Book Now",
    finalHeading: "Make the moment last.",
    finalBody:
      "Your pop-up may only run for a few days. The right content can keep working long after the doors close.\n\nA pop-up is a designed experience like any other — and it deserves the same documentation logic we use for agency activations: material that works for press today and for your next pitch, case study or campaign tomorrow.",
    finalCta: "Tell us about your pop-up",
  },
  de: {
    ...baseConfig,
    title: "Pop-up Foto- und Videocontent Berlin",
    description:
      "Foto- und Videocontent für Pop-ups, Launches, temporäre Retail Spaces und kulturelle Brand-Momente in Berlin.",
    h1Line1: "Dein Pop-up ist temporär.",
    h1Line2: "Der Content sollte bleiben.",
    subheadline:
      "Wir erstellen Foto- und Videoassets für Pop-ups, Launches, Brand Activations, Chef Takeovers, Product Drops und temporäre Spaces in Berlin.",
    cta: "Erzähl uns von deinem Pop-up",
    ctaSecondary: "Sieh, was dabei ist",
    audienceLabel: "Pop-up-Fit",
    audienceHeading: "Du hast den Space. Jetzt brauchst du den Content.",
    audienceBody: [
      "Pop-ups bewegen sich schnell. Setup, Menschen, Food, Produkte, Energie des Raums — alles passiert in einem kurzen Zeitfenster. Wir dokumentieren es, solange es lebt.",
    ],
    audienceGroups: [
      {
        title: "Für",
        items: [
          "Chefs",
          "Restaurants",
          "Brands",
          "Shops",
          "Designer:innen",
          "Artists",
          "Product Teams",
          "Creative Teams",
        ],
      },
      {
        title: "Gemacht für",
        items: [
          "Pop-up Shops",
          "Chef Takeovers",
          "Brand Activations",
          "Product Drops",
          "Launch Days",
          "Cultural Retail",
          "Community Events",
          "Temporäre Spaces",
        ],
      },
    ],
    includedLabel: "Was du bekommst",
    includedHeading: "Alles, was du brauchst, während der Moment live ist.",
    includedLede:
      "Wir dokumentieren den Space, die Details, die Menschen und die kleinen Momente, die das Pop-up echt wirken lassen — bereit für Social, Presse, Partner, Websites und zukünftige Launches.",
    includedCards: [
      {
        slug: "space-photos",
        title: "Space-Fotos",
        body: "Klare Views von Setup, Layout, Design und Umsetzung.",
      },
      {
        slug: "product-moments",
        title: "Produktmomente",
        body: "Details, Displays, Food, Objekte, Materialien und Hero Shots.",
      },
      {
        slug: "visitor-energy",
        title: "Visitor Energy",
        body: "Menschen beim Browsen, Probieren, Interagieren, Kaufen und Beleben des Spaces.",
      },
      {
        slug: "short-clips",
        title: "Kurze Clips",
        body: "Vertikale Momente für Reels, Stories, Launch-Recaps und Ads.",
      },
      {
        slug: "same-week-selects",
        title: "Same-week Selects",
        body: "Ein fokussiertes Bildset für Same-week Posting und Partner Updates.",
      },
      {
        slug: "partner-assets",
        title: "Partner-Assets",
        body: "Nutzbarer Content für Collaborators, Hosts, Sponsoren, Presse und Follow-up.",
      },
    ],
    includedCta: "Erzähl uns von deinem Pop-up",
    proofLabel: "Warum es zählt",
    proofItems: [
      {
        title: "Gemacht für kurze Laufzeiten",
        body: "Pop-ups sind schnell vorbei. Wir arbeiten um limitierte Opening Windows, enge Timings und schnelle Turnarounds herum.",
      },
      {
        title: "Bereit zum Posten",
        body: "Du gehst mit Content raus, der für die Kanäle gemacht ist, auf denen dein Pop-up lebt: Social, Presse, Partner, Website und Recap.",
      },
      {
        title: "Mehr als Dokumentation",
        body: "Wir dokumentieren den Space, das Produkt, die Menschen und die kleinen Momente, die die Experience teilenswert machen — Material, das noch lange nach dem Abschluss nutzbar ist.",
      },
    ],
    usageLabel: "Wo es funktioniert",
    usageHeading: "Dein Pop-up-Content muss überall funktionieren.",
    usageIntro:
      "Eine fokussierte Session gibt dir Assets für die Orte, an denen dein Publikum, deine Partner und zukünftige Kund:innen dich wirklich sehen.",
    platforms: [
      {
        name: "Instagram",
        use: "Posts, Reels, Stories, Launch-Recaps und Carousels.",
      },
      {
        name: "TikTok",
        use: "Kurze vertikale Clips aus dem Space, von Produkt, Food und Besucher:innen-Momenten.",
      },
      {
        name: "Presse",
        use: "Ausgewählte Bilder für Listings, Launch Notes, Blogs und Media Follow-up.",
      },
      {
        name: "Partner",
        use: "Assets, die Collaborators, Hosts, Sponsoren und Vendors teilen können.",
      },
      {
        name: "Website",
        use: "Klarer Proof von Space, Produkt, Publikum und Energie des Tages.",
      },
      {
        name: "Nächster Launch",
        use: "Content, der dir hilft, das nächste Pop-up zu pitchen, anzukündigen und zu verkaufen.",
      },
    ],
    usageCta: "Erzähl uns von deinem Pop-up",
    finalHeading: "Mach den Moment haltbar.",
    finalBody:
      "Dein Pop-up läuft vielleicht nur ein paar Tage. Der richtige Content kann noch lange weiterarbeiten, nachdem die Türen schließen.\n\nEin Pop-up ist eine gestaltete Erfahrung wie jede andere — und verdient dieselbe Dokumentationslogik wie unsere Agentur-Aktivierungen: Material, das heute für die Presse funktioniert und morgen für die nächste Pitch, Fallstudie oder Kampagne.",
    finalCta: "Erzähl uns von deinem Pop-up",
  },
};

export default function PopupsLanding() {
  const { locale } = useLocale();

  return <AdLandingPage config={configs[locale]} />;
}
