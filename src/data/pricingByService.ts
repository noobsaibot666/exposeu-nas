// Simple per-service overrides for pricing cards.
// Use plan slugs from src/data/pricingTiers.ts (single-event, monthly-coverage, retainer-studio).
// Only include fields you want to override; everything else uses the base tier values.
export const pricingByService = {
  exhibitions: {
    'single-event': {
      price: '€2.9K',
      description: 'Opening night coverage with curator-aligned angles and press-ready selects.',
    },
    'monthly-coverage': {
      price: '€6.5K',
      description: 'Multi-show coverage with consistent framing and fast delivery for galleries.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },
  'gallery-stories': {
    'single-event': {
      price: '€2.9K',
      description: 'Interview-led coverage with b-roll and stills for collector previews.',
    },
    'monthly-coverage': {
      price: '€6.5K',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },
  'artist-sessions': {
    'single-event': {
      price: '€2.9K',
      description: 'Portraits, BTS, and process shots tailored for releases and press.',
    },
    'monthly-coverage': {
      price: '€6.5K',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },
  performance: {
    'single-event': {
      price: '€2.9K',
      description: 'Live set coverage with fast selects and audio-aware edits.',
    },
    'monthly-coverage': {
      price: '€6.5K',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },
  'fashion-show': {
    'single-event': {
      price: '€2.9K',
      description: 'Runway coverage with look-by-look selects and same-day hero frames.',
    },
    'monthly-coverage': {
      price: '€6.5K',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },
  atmospheric: {
    'single-event': {
      price: '€2.9K',
      description: 'Mood-driven coverage with intentional pacing and rich tone.',
    },
    'monthly-coverage': {
      price: '€6.5K',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },
} as const

export type PricingOverride = {
  price?: string
  description?: string
  features?: string[]
  cadence?: string
  cta?: string
}

export type PricingOverridesByService = Record<string, Record<string, PricingOverride>>
