import { useEffect } from 'react'

interface SEOMetaProps {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonical?: string
  lang?: string
}

const DEFAULT_OG_IMAGE = 'https://expose-u.com/og-default.png'
const SITE_NAME = 'expose.u'
const BASE_URL = 'https://expose-u.com'

function setMeta(selector: string, attrKey: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attrKey}="${selector}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrKey, selector)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string, extra?: Record<string, string>) {
  const extraSelector = extra
    ? Object.entries(extra).map(([k, v]) => `[${k}="${v}"]`).join('')
    : ''
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]${extraSelector}`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v))
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function removeLinks(rel: string, attr: string) {
  document.querySelectorAll(`link[rel="${rel}"][${attr}]`).forEach((el) => el.remove())
}

export function SEOMeta({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_OG_IMAGE,
  canonical,
  lang = 'en',
}: SEOMetaProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`
    const resolvedOgTitle = ogTitle ?? fullTitle
    const resolvedOgDesc = ogDescription ?? description

    document.title = fullTitle
    document.documentElement.setAttribute('lang', lang)

    setMeta('description', 'name', description)

    setMeta('og:title', 'property', resolvedOgTitle)
    setMeta('og:description', 'property', resolvedOgDesc)
    setMeta('og:image', 'property', ogImage)
    setMeta('og:type', 'property', 'website')
    setMeta('og:site_name', 'property', SITE_NAME)
    setMeta('og:locale', 'property', lang === 'de' ? 'de_DE' : 'en_US')

    setMeta('twitter:title', 'name', resolvedOgTitle)
    setMeta('twitter:description', 'name', resolvedOgDesc)
    setMeta('twitter:image', 'name', ogImage)

    if (canonical) {
      setLink('canonical', canonical)

      // hreflang alternates
      removeLinks('alternate', 'hreflang')
      const dePath = new URL(canonical).pathname
      const enHref = canonical
      const deHref = `${BASE_URL}/de${dePath === '/' ? '' : dePath}`

      const enEl = document.createElement('link')
      enEl.setAttribute('rel', 'alternate')
      enEl.setAttribute('hreflang', 'en')
      enEl.setAttribute('href', enHref)
      document.head.appendChild(enEl)

      const deEl = document.createElement('link')
      deEl.setAttribute('rel', 'alternate')
      deEl.setAttribute('hreflang', 'de')
      deEl.setAttribute('href', deHref)
      document.head.appendChild(deEl)

      const xEl = document.createElement('link')
      xEl.setAttribute('rel', 'alternate')
      xEl.setAttribute('hreflang', 'x-default')
      xEl.setAttribute('href', enHref)
      document.head.appendChild(xEl)
    }
  }, [title, description, ogTitle, ogDescription, ogImage, canonical, lang])

  return null
}

export function SchemaOrg({ data }: { data: unknown }) {
  useEffect(() => {
    const json = JSON.stringify(data)
    let el = document.querySelector<HTMLScriptElement>('script[data-schema-org]')
    if (!el) {
      el = document.createElement('script')
      el.setAttribute('type', 'application/ld+json')
      el.setAttribute('data-schema-org', '')
      document.head.appendChild(el)
    }
    el.textContent = json
  }, [data])

  return null
}
