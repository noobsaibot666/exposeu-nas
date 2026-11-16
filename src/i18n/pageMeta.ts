import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocale, useTranslation } from './LocaleProvider'
import { getMetaForPath, hasPageLevelMetaOwner, isUnsupportedLocalizedLegalPath } from './pageMetaConfig'

function upsertMeta(selector: string, create: () => HTMLElement) {
  const existing = document.head.querySelector<HTMLElement>(selector)
  if (existing) return existing
  const next = create()
  document.head.appendChild(next)
  return next
}

function upsertMetaContent(selector: string, attribute: string, identity: string, content: string) {
  const element = upsertMeta(selector, () => {
    const meta = document.createElement('meta')
    meta.setAttribute(attribute, identity)
    return meta
  })
  element.setAttribute('content', content)
}

export function usePageMeta() {
  const { t } = useTranslation()
  const { locale, canonicalPathname, localizePath } = useLocale()
  const location = useLocation()

  useEffect(() => {
    if (hasPageLevelMetaOwner(location.pathname)) return

    const meta = isUnsupportedLocalizedLegalPath(location.pathname)
      ? { ...getMetaForPath('/__not-found__'), noAlternates: true }
      : getMetaForPath(canonicalPathname)
    const title = t(meta.titleKey)
    const metaDescription = t(meta.descriptionKey)
    const defaultOgImage = 'https://expose-u.com/og-default.png'
    document.title = title
    document.documentElement.setAttribute('lang', locale)

    upsertMetaContent('meta[name="description"]', 'name', 'description', metaDescription)
    upsertMetaContent('meta[property="og:title"]', 'property', 'og:title', title)
    upsertMetaContent('meta[property="og:description"]', 'property', 'og:description', metaDescription)
    upsertMetaContent('meta[property="og:image"]', 'property', 'og:image', defaultOgImage)
    upsertMetaContent('meta[property="og:type"]', 'property', 'og:type', 'website')
    upsertMetaContent('meta[property="og:site_name"]', 'property', 'og:site_name', 'expose.u')
    upsertMetaContent('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    upsertMetaContent('meta[name="twitter:description"]', 'name', 'twitter:description', metaDescription)
    upsertMetaContent('meta[name="twitter:image"]', 'name', 'twitter:image', defaultOgImage)

    // A 404 must not be indexed or claim to be canonical; every other
    // fallback route clears a robots tag a previous 404 may have left.
    const robots = document.head.querySelector('meta[name="robots"]')
    if (meta.notFound) {
      upsertMetaContent('meta[name="robots"]', 'name', 'robots', 'noindex')
      document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], meta[property="og:url"]').forEach((el) => el.remove())
      upsertMetaContent('meta[property="og:locale"]', 'property', 'og:locale', locale === 'de' ? 'de_DE' : 'en_US')
      return
    }
    robots?.remove()

    const localeCanonical = `${window.location.origin}${localizePath(canonicalPathname)}`

    const canonical = upsertMeta('link[rel="canonical"]', () => {
      const el = document.createElement('link')
      el.setAttribute('rel', 'canonical')
      return el
    }) as HTMLLinkElement
    canonical.href = localeCanonical

    upsertMetaContent('meta[property="og:url"]', 'property', 'og:url', localeCanonical)
    upsertMetaContent('meta[property="og:locale"]', 'property', 'og:locale', locale === 'de' ? 'de_DE' : 'en_US')

    if (meta.noAlternates) {
      document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove())
      return
    }

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
