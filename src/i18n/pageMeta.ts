import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocale, useTranslation } from './LocaleProvider'
import { getMetaForPath } from './pageMetaConfig'

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
