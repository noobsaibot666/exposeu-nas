import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocale, useTranslation } from './LocaleProvider'

type MetaConfig = {
  titleKey: string
  descriptionKey: string
}

function getMetaForPath(pathname: string): MetaConfig {
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
  return { titleKey: 'common.meta.notFound.title', descriptionKey: 'common.meta.notFound.description' }
}

function upsertMeta(selector: string, create: () => HTMLElement) {
  const existing = document.head.querySelector<HTMLElement>(selector)
  if (existing) return existing
  const next = create()
  document.head.appendChild(next)
  return next
}

export function usePageMeta() {
  const { t } = useTranslation()
  const { locale, canonicalPathname, localizePath } = useLocale()
  const location = useLocation()

  useEffect(() => {
    const meta = getMetaForPath(canonicalPathname)
    document.title = t(meta.titleKey)

    const description = upsertMeta('meta[name="description"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('name', 'description')
      return el
    })
    description.setAttribute('content', t(meta.descriptionKey))

    const canonical = upsertMeta('link[rel="canonical"]', () => {
      const el = document.createElement('link')
      el.setAttribute('rel', 'canonical')
      return el
    }) as HTMLLinkElement
    canonical.href = `${window.location.origin}${localizePath(canonicalPathname)}`

    const hreflangEn = upsertMeta('link[rel="alternate"][hreflang="en"]', () => {
      const el = document.createElement('link')
      el.setAttribute('rel', 'alternate')
      el.setAttribute('hreflang', 'en')
      return el
    }) as HTMLLinkElement
    hreflangEn.href = `${window.location.origin}${canonicalPathname === '/' ? '/' : canonicalPathname}`

    const hreflangDe = upsertMeta('link[rel="alternate"][hreflang="de"]', () => {
      const el = document.createElement('link')
      el.setAttribute('rel', 'alternate')
      el.setAttribute('hreflang', 'de')
      return el
    }) as HTMLLinkElement
    hreflangDe.href = `${window.location.origin}${localizePath(canonicalPathname).replace(/^(?!\/de)/, '/de')}`

    const hreflangDefault = upsertMeta('link[rel="alternate"][hreflang="x-default"]', () => {
      const el = document.createElement('link')
      el.setAttribute('rel', 'alternate')
      el.setAttribute('hreflang', 'x-default')
      return el
    }) as HTMLLinkElement
    hreflangDefault.href = `${window.location.origin}${canonicalPathname === '/' ? '/' : canonicalPathname}`
  }, [canonicalPathname, locale, localizePath, location.pathname, t])
}
