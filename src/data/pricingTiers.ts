export type PricingTier = {
  nameKey: string
  cadenceKey: string
  price: string
  descriptionKey: string
  chooseThisIfKey: string
  featuresKey: string
  ctaKey: string
  link: string
  slug: string
  badgeKey?: string
}

export const pricingTiers: PricingTier[] = [
  {
    nameKey: 'pricing.tiers.single-event.name',
    cadenceKey: 'pricing.tiers.single-event.cadence',
    price: '€2.9K',
    descriptionKey: 'pricing.tiers.single-event.description',
    chooseThisIfKey: 'pricing.tiers.single-event.chooseThisIf',
    featuresKey: 'pricing.tiers.single-event.features',
    ctaKey: 'pricing.tiers.single-event.cta',
    link: '/contact',
    slug: 'single-event',
  },
  {
    nameKey: 'pricing.tiers.monthly-coverage.name',
    cadenceKey: 'pricing.tiers.monthly-coverage.cadence',
    price: '€6.5K',
    descriptionKey: 'pricing.tiers.monthly-coverage.description',
    chooseThisIfKey: 'pricing.tiers.monthly-coverage.chooseThisIf',
    featuresKey: 'pricing.tiers.monthly-coverage.features',
    ctaKey: 'pricing.tiers.monthly-coverage.cta',
    link: '/contact',
    slug: 'monthly-coverage',
    badgeKey: 'pricing.tiers.monthly-coverage.badge',
  },
  {
    nameKey: 'pricing.tiers.retainer-studio.name',
    cadenceKey: 'pricing.tiers.retainer-studio.cadence',
    price: 'Custom',
    descriptionKey: 'pricing.tiers.retainer-studio.description',
    chooseThisIfKey: 'pricing.tiers.retainer-studio.chooseThisIf',
    featuresKey: 'pricing.tiers.retainer-studio.features',
    ctaKey: 'pricing.tiers.retainer-studio.cta',
    link: '/contact',
    slug: 'retainer-studio',
  },
]
