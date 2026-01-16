import type { PricingTier } from './pricingTiers'

// Simple per-service overrides for pricing cards.
// Use plan slugs from src/data/pricingTiers.ts (single-event, monthly-coverage, retainer-studio).
// Only include fields you want to override; everything else uses the base tier values.
export type PricingOverridesByService = Record<string, Partial<Record<PricingTier['slug'], Partial<PricingTier>>>>

export const pricingByService = {
  exhibitions: {
    'single-event': {
      price: 'Up To €2.4K',
      description: 'Exhibition and opening documentation with curator-aligned framing and press-ready selects.',
    },
    'monthly-coverage': {
      price: 'Up To €5.6K',
      description: 'Ongoing exhibition coverage with consistent tone and priority delivery.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  'gallery-stories': {
    'single-event': {
      price: 'Up To €2.4K',
      description: 'Interview-led gallery documentation with stills and motion for collectors and press.',
    },
    'monthly-coverage': {
      price: 'Up To €5.6K',
      description: 'Recurring gallery storytelling aligned with exhibition cycles.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  'artist-sessions': {
    'single-event': {
      price: 'Up To €1.6K',
      description: 'Editorial portraits and process documentation for releases and press kits.',
    },
    'monthly-coverage': {
      price: 'Up To €3.9K',
      description: 'Ongoing artist documentation across studio work, releases, and exhibitions.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  performance: {
    'single-event': {
      price: 'Up To €2.5K',
      description: 'Live performance coverage with fast selects and atmosphere-aware edits.',
    },
    'monthly-coverage': {
      price: 'Up To €5.9K',
      description: 'Multi-performance documentation with consistent visual language.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  'fashion-show': {
    'single-event': {
      price: 'Up To €2.6K',
      description: 'Runway and backstage documentation with look-by-look clarity and hero frames.',
    },
    'monthly-coverage': {
      price: 'Up To €6.2K',
      description: 'Seasonal fashion documentation with editorial consistency.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  atmospheric: {
    'single-event': {
      price: 'Up To €2.7K',
      description: 'Concept-driven atmospheric films with intentional pacing and cinematic tone.',
    },
    'monthly-coverage': {
      price: 'Up To €6.5K',
      description: 'Ongoing atmospheric storytelling for programs or seasonal narratives.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },
} as const
