import AdLandingPage, { type AdLandingPageConfig } from './AdLandingPage'
import { resolveImagePath } from '../utils/resolveImagePath'

const config: AdLandingPageConfig = {
  slug: 'concerts-berlin',
  serviceSlug: 'concerts-events',
  title: 'Concert & Live Event Photography Berlin',
  description: 'Concert and live event photo/video content in Berlin for artists, venues, promoters, and teams who need fast press and social assets.',
  canonical: 'https://expose-u.com/concerts-berlin',
  heroImage: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4340.jpg'),
  supportImage: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4263.jpg'),
  h1Line1: 'Your show is happening.',
  h1Line2: 'Will the content be ready?',
  subheadline: 'Concert photography and short video content for Berlin shows: stage, crowd, atmosphere, and fast selects for press and socials.',
  cta: 'Tell us about your show',
  ctaSecondary: 'See what is included',
  audienceLabel: 'We help you',
  audienceHeading: 'Playing or hosting a show?',
  audienceGroups: [
    {
      title: 'That is for you',
      items: ['Musicians', 'Bands', 'DJs', 'Venues', 'Promoters', 'Festivals', 'Labels', 'Artist managers'],
    },
    {
      title: 'We make sure you are covered for',
      items: ['Live show', 'Release show', 'Tour date', 'Club night', 'Festival set', 'Venue program'],
    },
  ],
  includedLabel: 'What you get',
  includedHeading: 'Coverage that captures the night.',
  includedLede: 'You focus on the room. We cover the moments you need after the lights go down.',
  includedCards: [
    { title: 'Stage photos', body: 'Strong live images with lights, movement, and the key moments.' },
    { title: 'Crowd energy', body: 'People, atmosphere, and room shots that show how it felt.' },
    { title: 'Fast selects', body: 'Priority images for posts, press, and next-day announcements.' },
    { title: 'Short clips', body: 'Vertical video moments ready for reels, stories, and tour updates.' },
    { title: 'Backstage moments', body: 'Quiet details before and after the set when access allows.' },
    { title: 'Venue assets', body: 'Clean images for venue recaps, listings, and future promotion.' },
    { title: 'Partner assets', body: 'Shots that help sponsors, labels, and collaborators share the night.' },
    { title: 'Custom support', body: 'Not sure what you need? We shape the coverage around the show.' },
  ],
  includedCta: 'Book show coverage',
  usageLabel: 'Use the content',
  usageHeading: 'Ready for the places your audience already follows.',
  usageIntro: 'Get useful assets for the days before the show, the night itself, and the recap after.',
  platforms: [
    { name: 'Instagram', use: 'Posts, reels, stories, and carousels.' },
    { name: 'TikTok', use: 'Quick vertical clips from the live moment.' },
    { name: 'Press', use: 'Images for announcements and media follow-up.' },
    { name: 'Venue channels', use: 'Recaps, listings, and monthly programs.' },
    { name: 'Tour updates', use: 'Fresh content between cities and dates.' },
    { name: 'Booking profiles', use: 'Proof of stage presence and audience energy.' },
  ],
  usageCta: 'Plan your show coverage',
  finalHeading: 'Need content before the next post goes live?',
  finalBody: 'Send the date, venue, and what you need. We will keep the process simple and useful.',
  finalCta: 'Tell us about your show',
  metaContentName: 'Concerts Berlin Landing Page',
  customPixelEvent: 'ConcertsBerlinView',
}

export default function ConcertsBerlin() {
  return <AdLandingPage config={config} />
}
