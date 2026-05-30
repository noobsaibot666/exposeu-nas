import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { useLocale } from '../i18n/LocaleProvider'
import { resolveImagePath } from '../utils/resolveImagePath'

const baseConfig = {
  slug: 'popups',
  serviceSlug: 'popups',
  canonical: 'https://expose-u.com/popups',
  heroImage: resolveImagePath('src/assets/images/landing/popup_hero.jpeg'),
  supportImage: resolveImagePath('src/assets/images/landing/popup_02.jpeg'),
  metaContentName: 'Popups Landing Page',
  customPixelEvent: 'PopupsLandingView',
}

const configs: Record<'en' | 'de', AdLandingPageConfig> = {
  en: {
    ...baseConfig,
    title: 'Pop-up Photo and Video Content Berlin',
    description: 'Photo and video content for pop-ups, launches, temporary retail spaces, and cultural brand moments in Berlin.',
    h1Line1: 'Photo and video content',
    h1Line2: 'for your pop-up.',
    subheadline: 'For brands, artists, shops, and teams who need launch photos, short clips, product moments, and visitor energy before the pop-up disappears.',
    cta: 'Tell us about your pop-up',
    ctaSecondary: 'See what is included',
    audienceLabel: 'Pop-up fit',
    audienceHeading: 'You have the space. Now you need the content.',
    audienceGroups: [
      {
        title: 'For',
        items: ['Brands', 'Artists', 'Shops', 'Designers', 'Labels', 'Creative teams'],
      },
      {
        title: 'Made for',
        items: ['Pop-up shops', 'Launch days', 'Product drops', 'Temporary spaces', 'Cultural retail', 'Community events'],
      },
    ],
    includedLabel: 'What you get',
    includedHeading: 'Everything you need while the moment is live.',
    includedLede: 'Pop-ups move fast. We help you leave with assets for socials, press, partners, website updates, and future launches.',
    includedCards: [
      { slug: 'space-photos', title: 'Space photos', body: 'Clean views of the setup, layout, design, and atmosphere.' },
      { slug: 'product-moments', title: 'Product moments', body: 'Details, displays, materials, and hero frames of what is being shown.' },
      { slug: 'visitor-energy', title: 'Visitor energy', body: 'People browsing, interacting, buying, and bringing the space to life.' },
      { slug: 'short-clips', title: 'Short clips', body: 'Vertical moments for reels, stories, launch recaps, and ads.' },
      { slug: 'fast-selects', title: 'Fast selects', body: 'A focused set for same-week sharing and partner updates.' },
      { slug: 'partner-assets', title: 'Partner assets', body: 'Useful images for collaborators, hosts, sponsors, and press follow-up.' },
    ],
    includedCta: 'Tell us about your pop-up',
    proofLabel: 'Proof',
    proofItems: [
      { title: 'Built for short runs', body: 'Coverage planned around temporary spaces, limited opening windows, and fast turnarounds.' },
      { title: 'Ready to publish', body: 'Assets made for the channels where pop-ups live: socials, press, partners, and recap.' },
      { title: 'Placeholder visuals for now', body: 'Current imagery is temporary and will be swapped with final pop-up examples later.' },
    ],
    usageLabel: 'Where it works',
    usageHeading: 'Your pop-up content needs to work everywhere.',
    usageIntro: 'One session gives you assets for the places brands, shops, and artists actually need to show up.',
    platforms: [
      { name: 'Instagram', use: 'Posts, reels, stories, launch recaps, and carousels.' },
      { name: 'TikTok', use: 'Short vertical clips from the space and visitor moments.' },
      { name: 'Press', use: 'Selected images for listings, launch notes, and media follow-up.' },
      { name: 'Partners', use: 'Assets collaborators, hosts, and sponsors can share.' },
      { name: 'Website', use: 'Clean proof of the space, products, and audience.' },
      { name: 'Next launch', use: 'Content that helps pitch, announce, and sell the next moment.' },
    ],
    usageCta: 'Tell us about your pop-up',
    finalHeading: 'Let us document your pop-up.',
    finalBody: 'Tell us what is opening, where, and when. We will shape the right photo and video setup around it.',
    finalCta: 'Tell us about your pop-up',
  },
  de: {
    ...baseConfig,
    title: 'Pop-up Foto- und Videocontent Berlin',
    description: 'Foto- und Videocontent für Pop-ups, Launches, temporäre Retail Spaces und kulturelle Brand-Momente in Berlin.',
    h1Line1: 'Foto- und Videocontent',
    h1Line2: 'für dein Pop-up.',
    subheadline: 'Für Brands, Artists, Shops und Teams, die Launch-Fotos, kurze Clips, Produktmomente und Besucherenergie brauchen, bevor das Pop-up verschwindet.',
    cta: 'Erzähl uns von deinem Pop-up',
    ctaSecondary: 'Sieh, was dabei ist',
    audienceLabel: 'Pop-up-Fit',
    audienceHeading: 'Du hast den Space. Jetzt brauchst du den Content.',
    audienceGroups: [
      {
        title: 'Für',
        items: ['Brands', 'Artists', 'Shops', 'Designer:innen', 'Labels', 'Creative Teams'],
      },
      {
        title: 'Gemacht für',
        items: ['Pop-up Shops', 'Launch Days', 'Product Drops', 'Temporäre Spaces', 'Cultural Retail', 'Community Events'],
      },
    ],
    includedLabel: 'Was du bekommst',
    includedHeading: 'Alles, was du brauchst, während der Moment live ist.',
    includedLede: 'Pop-ups bewegen sich schnell. Wir helfen dir mit Assets für Socials, Presse, Partner, Website Updates und zukünftige Launches.',
    includedCards: [
      { slug: 'space-photos', title: 'Space-Fotos', body: 'Klare Views von Setup, Layout, Design und Atmosphäre.' },
      { slug: 'product-moments', title: 'Produktmomente', body: 'Details, Displays, Materialien und Hero-Frames von dem, was gezeigt wird.' },
      { slug: 'visitor-energy', title: 'Visitor Energy', body: 'Menschen beim Browsen, Interagieren, Kaufen und Beleben des Spaces.' },
      { slug: 'short-clips', title: 'Kurze Clips', body: 'Vertikale Momente für Reels, Stories, Launch-Recaps und Ads.' },
      { slug: 'fast-selects', title: 'Schnelle Selects', body: 'Ein fokussiertes Set für Same-Week Sharing und Partner Updates.' },
      { slug: 'partner-assets', title: 'Partner-Assets', body: 'Nutzbare Bilder für Collaborators, Hosts, Sponsoren und Presse-Follow-up.' },
    ],
    includedCta: 'Erzähl uns von deinem Pop-up',
    proofLabel: 'Proof',
    proofItems: [
      { title: 'Gemacht für kurze Laufzeiten', body: 'Coverage für temporäre Spaces, limitierte Opening Windows und schnelle Turnarounds.' },
      { title: 'Bereit zum Posten', body: 'Assets für die Kanäle, auf denen Pop-ups leben: Socials, Presse, Partner und Recap.' },
      { title: 'Platzhalterbilder für jetzt', body: 'Die aktuellen Bilder sind temporär und werden später durch finale Pop-up-Beispiele ersetzt.' },
    ],
    usageLabel: 'Wo es funktioniert',
    usageHeading: 'Dein Pop-up-Content muss überall funktionieren.',
    usageIntro: 'Eine Session gibt dir Assets für die Orte, an denen Brands, Shops und Artists sichtbar sein müssen.',
    platforms: [
      { name: 'Instagram', use: 'Posts, Reels, Stories, Launch-Recaps und Carousels.' },
      { name: 'TikTok', use: 'Kurze vertikale Clips aus dem Space und Besucher:innen-Momente.' },
      { name: 'Presse', use: 'Ausgewählte Bilder für Listings, Launch Notes und Media Follow-up.' },
      { name: 'Partner', use: 'Assets, die Collaborators, Hosts und Sponsoren teilen können.' },
      { name: 'Website', use: 'Klarer Proof von Space, Produkten und Publikum.' },
      { name: 'Nächster Launch', use: 'Content, der den nächsten Moment pitchen, ankündigen und verkaufen hilft.' },
    ],
    usageCta: 'Erzähl uns von deinem Pop-up',
    finalHeading: 'Lass uns dein Pop-up dokumentieren.',
    finalBody: 'Sag uns, was eröffnet, wo und wann. Wir bauen das passende Foto- und Video-Setup darum.',
    finalCta: 'Erzähl uns von deinem Pop-up',
  },
}

export default function PopupsLanding() {
  const { locale } = useLocale()

  return <AdLandingPage config={configs[locale]} />
}
