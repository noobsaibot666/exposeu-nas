import type { PricingTier } from './pricingTiers'

// Simple per-service overrides for pricing cards.
// Use plan slugs from src/data/pricingTiers.ts (single-event, monthly-coverage, retainer-studio).
// Only include fields you want to override; everything else uses the base tier values.
export type PricingOverridesByService = Record<string, Partial<Record<PricingTier['slug'], Partial<PricingTier>>>>

export const pricingByService = {
  'concerts-events': {
    'single-event': {
      price: '€900',
      description: 'One concert or live event captured with fast selects, reels, and clean hero moments.',
    },
    'monthly-coverage': {
      price: '€2.9K',
      description: 'Repeat live event coverage with one crew and one delivery rhythm.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  'exhibition-gallery': {
    'single-event': {
      price: '€600',
      description: 'One exhibition, opening, or gallery program captured for press, archive, and partner use.',
    },
    'monthly-coverage': {
      price: '€2.1K',
      description: 'Recurring gallery documentation with one visual standard and faster turnaround.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  'artist-sessions': {
    'single-event': {
      price: '€400',
      description: 'One portrait and process session for releases, profiles, and press kits.',
    },
    'monthly-coverage': {
      price: '€1.8K',
      description: 'Recurring artist coverage across studio work, launches, and exhibition dates.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  'brand-agency': {
    'single-event': {
      price: '€1.5K',
      description: 'One brand, agency, runway, or activation event captured for PR, campaign, and sponsor use.',
    },
    'monthly-coverage': {
      price: '€5.9K',
      description: 'Seasonal brand event coverage with consistent editorial and campaign output.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },
} as const
