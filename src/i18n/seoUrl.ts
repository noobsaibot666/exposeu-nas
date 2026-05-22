import { localizePath, type Locale } from './routing.js'

const BASE_URL = 'https://expose-u.com'

export function getLocalizedCanonicalUrl(canonical: string, locale: Locale): string {
  try {
    const url = new URL(canonical)
    return `${url.origin}${localizePath(`${url.pathname}${url.search}${url.hash}`, locale)}`
  } catch {
    return `${BASE_URL}${localizePath(canonical, locale)}`
  }
}
