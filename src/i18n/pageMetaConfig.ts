export type MetaConfig = {
  titleKey: string
  descriptionKey: string
  noAlternates?: boolean
}

export function getMetaForPath(pathname: string): MetaConfig {
  if (pathname === '/' || pathname === '/v2' || pathname === '/old-home') {
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
  if (pathname === '/portfolio') {
    return { titleKey: 'common.meta.portfolio.title', descriptionKey: 'common.meta.portfolio.description' }
  }
  if (pathname === '/call-session') {
    return { titleKey: 'common.meta.callSession.title', descriptionKey: 'common.meta.callSession.description' }
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
      noAlternates: true,
    }
  }
  return { titleKey: 'common.meta.notFound.title', descriptionKey: 'common.meta.notFound.description' }
}
