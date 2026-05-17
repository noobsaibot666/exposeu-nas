import type { PricingTier } from './pricingTiers'

// Simple per-service overrides for pricing cards.
// Use plan slugs from src/data/pricingTiers.ts (single-event, monthly-coverage, retainer-studio).
// Only include fields you want to override; everything else uses the base tier values.
export type PricingOverride = {
  price?: string
  descriptionKey?: string
  chooseThisIfKey?: string
  featuresKey?: string
}

export type PricingOverridesByService = Record<string, Partial<Record<PricingTier['slug'], PricingOverride>>>

export const pricingByService = {
  'concerts-events': {
    'single-event': {
      price: '€300',
      descriptionKey: 'pricing.serviceDescriptions.concerts-events.single-event',
      chooseThisIfKey: 'pricing.serviceTiers.concerts-events.single-event.chooseThisIf',
      featuresKey: 'pricing.serviceTiers.concerts-events.single-event.features',
    },
    'monthly-coverage': {
      price: '€2.5K',
      descriptionKey: 'pricing.serviceDescriptions.concerts-events.monthly-coverage',
      chooseThisIfKey: 'pricing.serviceTiers.concerts-events.monthly-coverage.chooseThisIf',
      featuresKey: 'pricing.serviceTiers.concerts-events.monthly-coverage.features',
    },
    'retainer-studio': {
      price: 'Custom',
      featuresKey: 'pricing.serviceTiers.concerts-events.retainer-studio.features',
    },
  },

  'exhibition-gallery': {
    'single-event': {
      price: '€300',
      descriptionKey: 'pricing.serviceDescriptions.exhibition-gallery.single-event',
      chooseThisIfKey: 'pricing.serviceTiers.exhibition-gallery.single-event.chooseThisIf',
      featuresKey: 'pricing.serviceTiers.exhibition-gallery.single-event.features',
    },
    'monthly-coverage': {
      price: '€2.5K',
      descriptionKey: 'pricing.serviceDescriptions.exhibition-gallery.monthly-coverage',
      chooseThisIfKey: 'pricing.serviceTiers.exhibition-gallery.monthly-coverage.chooseThisIf',
      featuresKey: 'pricing.serviceTiers.exhibition-gallery.monthly-coverage.features',
    },
    'retainer-studio': {
      price: 'Custom',
      featuresKey: 'pricing.serviceTiers.exhibition-gallery.retainer-studio.features',
    },
  },

  'artist-sessions': {
    'single-event': {
      price: '€300',
      descriptionKey: 'pricing.serviceDescriptions.artist-sessions.single-event',
      chooseThisIfKey: 'pricing.serviceTiers.artist-sessions.single-event.chooseThisIf',
      featuresKey: 'pricing.serviceTiers.artist-sessions.single-event.features',
    },
    'monthly-coverage': {
      price: '€2.5K',
      descriptionKey: 'pricing.serviceDescriptions.artist-sessions.monthly-coverage',
      chooseThisIfKey: 'pricing.serviceTiers.artist-sessions.monthly-coverage.chooseThisIf',
      featuresKey: 'pricing.serviceTiers.artist-sessions.monthly-coverage.features',
    },
    'retainer-studio': {
      price: 'Custom',
      featuresKey: 'pricing.serviceTiers.artist-sessions.retainer-studio.features',
    },
  },

  'brand-agency': {
    'single-event': {
      price: '€300',
      descriptionKey: 'pricing.serviceDescriptions.brand-agency.single-event',
      chooseThisIfKey: 'pricing.serviceTiers.brand-agency.single-event.chooseThisIf',
      featuresKey: 'pricing.serviceTiers.brand-agency.single-event.features',
    },
    'monthly-coverage': {
      price: '€2.5K',
      descriptionKey: 'pricing.serviceDescriptions.brand-agency.monthly-coverage',
      chooseThisIfKey: 'pricing.serviceTiers.brand-agency.monthly-coverage.chooseThisIf',
      featuresKey: 'pricing.serviceTiers.brand-agency.monthly-coverage.features',
    },
    'retainer-studio': {
      price: 'Custom',
      featuresKey: 'pricing.serviceTiers.brand-agency.retainer-studio.features',
    },
  },
} as const
