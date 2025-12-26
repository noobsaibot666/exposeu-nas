export type PricingTier = {
  name: string
  cadence: string
  price: string
  description: string
  features: string[]
  cta: string
  link: string
  slug: string
  badge?: string
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Single Event',
    cadence: 'Per event',
    price: '€2.9K',
    description: 'One-off documentation for exhibitions, openings, or pop-up performances.',
    features: ['Editorial photo and video team', '48h highlight cut', 'Private proofing gallery'],
    cta: 'Book Single Event',
    link: '/contact',
    slug: 'single-event',
  },
  {
    name: 'Monthly Coverage',
    cadence: '4 productions / month',
    price: '€6.5K',
    description: 'For galleries and producers running multiple shows each month.',
    features: ['Priority crew and gear', 'Lookbook and reels delivered weekly', 'Creative direction support'],
    cta: 'Start Monthly Coverage',
    link: '/contact',
    slug: 'monthly-coverage',
    badge: 'Popular',
  },
  {
    name: 'Retainer Studio',
    cadence: 'Retainer',
    price: 'Custom',
    description: 'Embedded support for institutions and brands planning seasonal programming.',
    features: ['Dedicated producer in Berlin', 'Archive and licensing support', 'Seasonal campaign strategy'],
    cta: 'Talk to us',
    link: '/contact',
    slug: 'retainer-studio',
  },
]
