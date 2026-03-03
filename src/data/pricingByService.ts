import type { PricingTier } from './pricingTiers'

// Simple per-service overrides for pricing cards.
// Use plan slugs from src/data/pricingTiers.ts (single-event, monthly-coverage, retainer-studio).
// Only include fields you want to override; everything else uses the base tier values.
export type PricingOverridesByService = Record<string, Partial<Record<PricingTier['slug'], Partial<PricingTier>>>>

export const pricingByService = {
  documentation: {
    'single-event': {
      price: '€1.1K',
      description: 'One exhibition or opening captured for press, archive, and partner use.',
    },
    'monthly-coverage': {
      price: '€3.5K',
      description: 'Recurring exhibition coverage with one visual standard and faster turnaround.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  'gallery-stories': {
    'single-event': {
      price: '€1.1K',
      description: 'One social-first story package with stills, motion, and interview cuts.',
    },
    'monthly-coverage': {
      price: '€3.1K',
      description: 'Recurring story coverage aligned to openings, releases, and program cycles.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  'artist-sessions': {
    'single-event': {
      price: '€599',
      description: 'One portrait and process session for releases, profiles, and press kits.',
    },
    'monthly-coverage': {
      price: '€2.1K',
      description: 'Recurring artist coverage across studio work, launches, and exhibition dates.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  performance: {
    'single-event': {
      price: '€1.5K',
      description: 'One live capture with fast selects, reels, and clean hero moments.',
    },
    'monthly-coverage': {
      price: '€3.9K',
      description: 'Repeat performance coverage with one crew and one delivery rhythm.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  'fashion-show': {
    'single-event': {
      price: '€1.5K',
      description: 'One show captured for runway, backstage, PR, and sponsor use.',
    },
    'monthly-coverage': {
      price: '€5.9K',
      description: 'Seasonal fashion coverage with consistent runway, backstage, and campaign output.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },

  atmospheric: {
    'single-event': {
      price: '€1.1K',
      description: 'One spatial film package for launches, decks, websites, and case studies.',
    },
    'monthly-coverage': {
      price: '€3.5K',
      description: 'Recurring spatial storytelling for programs, launches, and seasonal updates.',
    },
    'retainer-studio': {
      price: 'Custom',
    },
  },
} as const
