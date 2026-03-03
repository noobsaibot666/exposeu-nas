export type PricingTier = {
  name: string
  cadence: string
  price: string
  description: string
  chooseThisIf: string
  features: string[]
  cta: string
  link: string
  slug: string
  badge?: string
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'One-time',
    cadence: 'One-time project',
    price: '€2.9K',
    description: 'Built for one date, one site, and one clear delivery plan.',
    chooseThisIf: 'you need press-ready assets for one project or event.',
    features: ['Editorial photo and video team', '48h highlight cut', 'Private proofing gallery'],
    cta: 'Get a proposal',
    link: '/contact',
    slug: 'single-event',
  },
  {
    name: 'Monthly',
    cadence: 'Monthly retainer',
    price: '€6.5K',
    description: 'For recurring shoots that need one team, one rhythm, and fast handoff.',
    chooseThisIf: 'you need repeat coverage across multiple dates each month.',
    features: ['Priority crew and gear', 'Lookbook and reels delivered weekly', 'Creative direction support'],
    cta: 'Get a proposal',
    link: '/contact',
    slug: 'monthly-coverage',
    badge: 'Popular',
  },
  {
    name: 'Studio retainer',
    cadence: 'Ongoing support',
    price: 'Custom',
    description: 'Best for teams running seasonal programs, launches, or multi-site output.',
    chooseThisIf: 'you need flexible support across campaigns, venues, or seasons.',
    features: ['Dedicated producer in Berlin', 'Archive and licensing support', 'Seasonal campaign strategy'],
    cta: 'Get a proposal',
    link: '/contact',
    slug: 'retainer-studio',
  },
]
