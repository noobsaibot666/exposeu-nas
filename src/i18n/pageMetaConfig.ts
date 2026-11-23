export type MetaConfig = {
  titleKey: string
  descriptionKey: string
  noAlternates?: boolean
  /** Unknown route: noindex, no canonical/alternates (a 404 must not be indexed). */
  notFound?: boolean
}

// These route components render `SEOMeta` with route-specific copy/canonical URLs.
// Skip the app-level fallback on these paths so two effects do not compete to
// own title, description, canonical and hreflang tags.
const PAGE_LEVEL_META_PATHS = new Set([
  '/',
  '/v2',
  '/about',
  '/contact',
  '/call-session',
  '/release-content-kit',
  '/exhibition-gallery',
  '/brand-agency',
  '/popups',
  '/gallery-museum-documentation',
  '/artist-musician-documentation',
  '/portfolio',
  '/services',
  '/services/concerts-events',
  '/services/exhibition-gallery',
  '/services/artist-sessions',
  '/services/brand-agency',
  '/privacy',
  '/terms',
  '/data-deletion',
  '/concerts-berlin',
])
const ENGLISH_ONLY_META_PATHS = new Set(['/privacy', '/terms', '/data-deletion'])

export function hasPageLevelMetaOwner(pathname: string): boolean {
  const hasGermanPrefix = pathname === '/de' || pathname.startsWith('/de/')
  const canonicalPath = pathname === '/de' ? '/' : hasGermanPrefix ? pathname.slice(3) : pathname
  if (hasGermanPrefix && ENGLISH_ONLY_META_PATHS.has(canonicalPath)) return false
  return PAGE_LEVEL_META_PATHS.has(canonicalPath)
}

export function isUnsupportedLocalizedLegalPath(pathname: string): boolean {
  if (!pathname.startsWith('/de/')) return false
  return ENGLISH_ONLY_META_PATHS.has(pathname.slice(3))
}

export function getMetaForPath(pathname: string): MetaConfig {
  if (pathname === '/' || pathname === '/v2') {
    return { titleKey: 'common.meta.home.title', descriptionKey: 'common.meta.home.description' }
  }
  if (pathname === '/about') {
    return { titleKey: 'common.meta.about.title', descriptionKey: 'common.meta.about.description' }
  }
  if (pathname === '/contact') {
    return { titleKey: 'common.meta.contact.title', descriptionKey: 'common.meta.contact.description' }
  }
  if (pathname === '/contact-success') {
    return { titleKey: 'common.meta.contactSuccess.title', descriptionKey: 'common.meta.contactSuccess.description' }
  }
  if (pathname === '/consent') {
    return {
      titleKey: 'common.meta.photoConsent.title',
      descriptionKey: 'common.meta.photoConsent.description',
      noAlternates: true,
    }
  }
  if (pathname === '/portfolio') {
    return { titleKey: 'common.meta.portfolio.title', descriptionKey: 'common.meta.portfolio.description' }
  }
  if (pathname === '/call-session') {
    return { titleKey: 'common.meta.callSession.title', descriptionKey: 'common.meta.callSession.description' }
  }
  if (pathname === '/release-content-kit') {
    return {
      titleKey: 'common.meta.releaseContentKit.title',
      descriptionKey: 'common.meta.releaseContentKit.description',
    }
  }
  if (pathname === '/exhibition-gallery') {
    return {
      titleKey: 'common.meta.exhibitionGalleryLanding.title',
      descriptionKey: 'common.meta.exhibitionGalleryLanding.description',
    }
  }
  if (pathname === '/brand-agency') {
    return {
      titleKey: 'common.meta.brandAgencyLanding.title',
      descriptionKey: 'common.meta.brandAgencyLanding.description',
    }
  }
  if (pathname === '/popups') {
    return {
      titleKey: 'common.meta.popupsLanding.title',
      descriptionKey: 'common.meta.popupsLanding.description',
    }
  }
  if (pathname === '/impressum') {
    return { titleKey: 'common.meta.impressum.title', descriptionKey: 'common.meta.impressum.description' }
  }
  if (pathname === '/pricing-request/success') {
    return { titleKey: 'common.meta.pricingSuccess.title', descriptionKey: 'common.meta.pricingSuccess.description' }
  }
  if (pathname.startsWith('/pricing-request/')) {
    return { titleKey: 'common.meta.pricingRequest.title', descriptionKey: 'common.meta.pricingRequest.description' }
  }
  if (pathname === '/services') {
    return { titleKey: 'common.meta.servicesIndex.title', descriptionKey: 'common.meta.servicesIndex.description' }
  }
  if (pathname === '/services/concerts-events') {
    return { titleKey: 'common.meta.services.concerts.title', descriptionKey: 'common.meta.services.concerts.description' }
  }
  if (pathname === '/services/exhibition-gallery') {
    return { titleKey: 'common.meta.services.exhibition.title', descriptionKey: 'common.meta.services.exhibition.description' }
  }
  if (pathname === '/services/artist-sessions') {
    return { titleKey: 'common.meta.services.artist.title', descriptionKey: 'common.meta.services.artist.description' }
  }
  if (pathname === '/services/brand-agency') {
    return { titleKey: 'common.meta.services.brand.title', descriptionKey: 'common.meta.services.brand.description' }
  }
  if (pathname === '/concerts-berlin') {
    return {
      titleKey: 'common.meta.concertsBerlin.title',
      descriptionKey: 'common.meta.concertsBerlin.description',
    }
  }
  if (pathname === '/gallery-museum-documentation') {
    return {
      titleKey: 'common.meta.galleryMuseumLanding.title',
      descriptionKey: 'common.meta.galleryMuseumLanding.description',
    }
  }
  if (pathname === '/artist-musician-documentation') {
    return {
      titleKey: 'common.meta.artistMusicianLanding.title',
      descriptionKey: 'common.meta.artistMusicianLanding.description',
    }
  }
  if (pathname === '/privacy') {
    return { titleKey: 'common.meta.privacy.title', descriptionKey: 'common.meta.privacy.description', noAlternates: true }
  }
  if (pathname === '/terms') {
    return { titleKey: 'common.meta.terms.title', descriptionKey: 'common.meta.terms.description', noAlternates: true }
  }
  if (pathname === '/data-deletion') {
    return { titleKey: 'common.meta.dataDeletion.title', descriptionKey: 'common.meta.dataDeletion.description', noAlternates: true }
  }
  return { titleKey: 'common.meta.notFound.title', descriptionKey: 'common.meta.notFound.description', notFound: true }
}
