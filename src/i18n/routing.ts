export const SUPPORTED_LOCALES = ['en', 'de'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'exposeu.locale'

function parseUrlLikePath(input: string) {
  const [pathAndQuery, hash = ''] = input.split('#')
  const [pathname = '/', query = ''] = pathAndQuery.split('?')
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`

  return {
    pathname: normalizedPathname,
    query: query ? `?${query}` : '',
    hash: hash ? `#${hash}` : '',
  }
}

export function getLocaleFromPathname(pathname: string): Locale {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (normalized === '/de' || normalized.startsWith('/de/')) return 'de'
  return DEFAULT_LOCALE
}

export function normalizeLocalePathname(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (normalized === '/de') return '/'
  if (normalized.startsWith('/de/')) {
    return normalized.slice(3) || '/'
  }
  return normalized
}

export function localizePath(path: string, locale: Locale): string {
  const { pathname, query, hash } = parseUrlLikePath(path)
  const canonicalPathname = normalizeLocalePathname(pathname)
  const localizedPathname = locale === 'de'
    ? canonicalPathname === '/'
      ? '/de'
      : `/de${canonicalPathname}`
    : canonicalPathname

  return `${localizedPathname}${query}${hash}`
}

export function switchLocalePath(path: string, locale: Locale): string {
  return localizePath(path, locale)
}
