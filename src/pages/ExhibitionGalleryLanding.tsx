import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { resolveImagePath } from '../utils/resolveImagePath'

const config: AdLandingPageConfig = {
  slug: 'exhibition-gallery',
  serviceSlug: 'exhibition-gallery',
  title: 'Exhibition & Gallery Documentation Berlin',
  description: 'Photo and video documentation for exhibitions, openings, installations, and gallery moments in Berlin.',
  canonical: 'https://expose-u.com/exhibition-gallery',
  heroImage: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/008.jpg'),
  supportImage: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/003.jpg'),
  h1Line1: 'Your exhibition is open.',
  h1Line2: 'Is it documented properly?',
  subheadline: 'Photo and video documentation for openings, installations, artists, visitors, and the details you need after the show.',
  cta: 'Tell us about your exhibition',
  ctaSecondary: 'See what is included',
  audienceLabel: 'We help you',
  audienceHeading: 'Opening a show or preparing a gallery moment?',
  audienceGroups: [
    {
      title: 'That is for you',
      items: ['Artists', 'Curators', 'Galleries', 'Project spaces', 'Museums', 'Collectors', 'Cultural teams', 'Art fairs'],
    },
    {
      title: 'We make sure you are covered for',
      items: ['Opening night', 'Installation views', 'Artist portraits', 'Visitor moments', 'Artwork details', 'Archive delivery'],
    },
  ],
  includedLabel: 'What you get',
  includedHeading: 'Clear documentation without turning the room into a set.',
  includedLede: 'We move with the space, respect the work, and deliver images that are useful for artists, galleries, and future opportunities.',
  includedCards: [
    { title: 'Installation views', body: 'Clean room shots that show the work, scale, and atmosphere.' },
    { title: 'Artwork details', body: 'Close images for texture, materials, labels, and selected pieces.' },
    { title: 'Opening moments', body: 'Visitors, conversations, and the energy of the night.' },
    { title: 'Artist portraits', body: 'Simple portraits in the space for profiles and announcements.' },
    { title: 'Short video clips', body: 'Small moving moments for reels, stories, and gallery posts.' },
    { title: 'Archive set', body: 'Organized files for documentation, applications, and future press.' },
    { title: 'Press selects', body: 'A focused set for media, newsletters, and gallery updates.' },
    { title: 'Custom support', body: 'Need something specific? We shape the session around the show.' },
  ],
  includedCta: 'Book exhibition coverage',
  usageLabel: 'Use the content',
  usageHeading: 'Assets for the show now and the archive later.',
  usageIntro: 'Use the material for posts, press, applications, collector updates, and your own record of the work.',
  platforms: [
    { name: 'Instagram', use: 'Posts, reels, carousels, and opening recaps.' },
    { name: 'Press', use: 'Images for announcements and follow-up coverage.' },
    { name: 'Gallery website', use: 'Installation views and selected highlights.' },
    { name: 'Artist profile', use: 'Images for portfolios and future applications.' },
    { name: 'Newsletter', use: 'Clean assets for invites and post-show notes.' },
    { name: 'Archive', use: 'A useful record after the exhibition closes.' },
  ],
  usageCta: 'Plan exhibition coverage',
  finalHeading: 'Need the show documented before it disappears?',
  finalBody: 'Send the date, location, and what matters most. We will keep the process light and clear.',
  finalCta: 'Tell us about your exhibition',
  metaContentName: 'Exhibition Gallery Landing Page',
  customPixelEvent: 'ExhibitionGalleryLandingView',
}

export default function ExhibitionGalleryLanding() {
  return <AdLandingPage config={config} />
}
