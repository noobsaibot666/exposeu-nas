import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { resolveImagePath } from '../utils/resolveImagePath'

const config: AdLandingPageConfig = {
  slug: 'brand-agency',
  serviceSlug: 'brand-agency',
  title: 'Brand & Agency Event Content Berlin',
  description: 'Photo and video content for launches, activations, fashion moments, and agency-led events in Berlin.',
  canonical: 'https://expose-u.com/brand-agency',
  heroImage: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_041.png'),
  supportImage: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_011.jpeg'),
  h1Line1: 'Your event is live.',
  h1Line2: 'Do you have the assets?',
  subheadline: 'Photo and video content for launches, activations, fashion moments, and teams who need useful delivery without a heavy production layer.',
  cta: 'Tell us about your event',
  ctaSecondary: 'See what is included',
  audienceLabel: 'We help you',
  audienceHeading: 'Producing a brand moment or client event?',
  audienceGroups: [
    {
      title: 'That is for you',
      items: ['Brands', 'Agencies', 'Fashion teams', 'PR teams', 'Creative producers', 'Event teams', 'Founders', 'Venues'],
    },
    {
      title: 'We make sure you are covered for',
      items: ['Launch event', 'Activation', 'Fashion show', 'Pop-up', 'Press moment', 'Client recap'],
    },
  ],
  includedLabel: 'What you get',
  includedHeading: 'Content that is ready for the team, the client, and the next post.',
  includedLede: 'We document the room, the people, the product, and the details so you leave with assets that can actually be used.',
  includedCards: [
    { title: 'Hero images', body: 'Strong event shots for recaps, decks, websites, and press.' },
    { title: 'People moments', body: 'Guests, team, talent, and real interaction in the space.' },
    { title: 'Product details', body: 'Close shots of the objects, styling, materials, and setup.' },
    { title: 'Short clips', body: 'Vertical video moments for reels, stories, and paid social.' },
    { title: 'Atmosphere shots', body: 'Room, lighting, flow, and the feeling of the event.' },
    { title: 'Fast selects', body: 'A first set for same-day or next-day sharing when needed.' },
    { title: 'Client recap assets', body: 'Useful images for reports, decks, and internal follow-up.' },
    { title: 'Custom support', body: 'Not sure what the event needs? We build the shot list with you.' },
  ],
  includedCta: 'Book event content',
  usageLabel: 'Use the content',
  usageHeading: 'Useful for launch day, recap day, and everything after.',
  usageIntro: 'Get a practical asset set for social, PR, reports, client delivery, and future promotion.',
  platforms: [
    { name: 'Instagram', use: 'Reels, stories, carousels, and campaign posts.' },
    { name: 'Paid social', use: 'Simple creative assets for Meta and short-form placements.' },
    { name: 'PR', use: 'Selected images for press notes and media follow-up.' },
    { name: 'Client decks', use: 'Clean proof of the event, audience, and result.' },
    { name: 'Website', use: 'Highlights for case studies and launch pages.' },
    { name: 'Internal recap', use: 'A clear record for teams and partners.' },
  ],
  usageCta: 'Plan event content',
  finalHeading: 'Need content before the recap is due?',
  finalBody: 'Send the date, location, and what your team needs after the event. We will keep it direct.',
  finalCta: 'Tell us about your event',
  metaContentName: 'Brand Agency Landing Page',
  customPixelEvent: 'BrandAgencyLandingView',
}

export default function BrandAgencyLanding() {
  return <AdLandingPage config={config} />
}
