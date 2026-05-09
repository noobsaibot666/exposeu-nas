import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import commonEn from '../locales/en/common.json'
import navEn from '../locales/en/nav.json'
import footerEn from '../locales/en/footer.json'
import homeEn from '../locales/en/home.json'
import aboutEn from '../locales/en/about.json'
import contactEn from '../locales/en/contact.json'
import portfolioEn from '../locales/en/portfolio.json'
import servicesEn from '../locales/en/services.json'
import pricingEn from '../locales/en/pricing.json'
import legalEn from '../locales/en/legal.json'
import formsEn from '../locales/en/forms.json'
import notFoundEn from '../locales/en/notFound.json'
import callSessionEn from '../locales/en/callSession.json'

import commonDe from '../locales/de/common.json'
import navDe from '../locales/de/nav.json'
import footerDe from '../locales/de/footer.json'
import homeDe from '../locales/de/home.json'
import aboutDe from '../locales/de/about.json'
import contactDe from '../locales/de/contact.json'
import portfolioDe from '../locales/de/portfolio.json'
import servicesDe from '../locales/de/services.json'
import pricingDe from '../locales/de/pricing.json'
import legalDe from '../locales/de/legal.json'
import formsDe from '../locales/de/forms.json'
import notFoundDe from '../locales/de/notFound.json'
import callSessionDe from '../locales/de/callSession.json'

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  type Locale,
  getLocaleFromPathname,
  localizePath,
  normalizeLocalePathname,
  switchLocalePath,
} from './routing'

type TranslationParams = Record<string, string | number | undefined>
type TranslationTree = Record<string, unknown>

type LocaleContextValue = {
  locale: Locale
  t: (key: string, params?: TranslationParams) => string
  tm: <T>(key: string) => T
  localizePath: (path: string) => string
  switchLocale: (locale: Locale) => void
  canonicalPathname: string
}

const resources = {
  en: {
    common: commonEn,
    nav: navEn,
    footer: footerEn,
    home: homeEn,
    about: aboutEn,
    contact: contactEn,
    portfolio: portfolioEn,
    services: servicesEn,
    pricing: pricingEn,
    legal: legalEn,
    forms: formsEn,
    notFound: notFoundEn,
    callSession: callSessionEn,
  },
  de: {
    common: commonDe,
    nav: navDe,
    footer: footerDe,
    home: homeDe,
    about: aboutDe,
    contact: contactDe,
    portfolio: portfolioDe,
    services: servicesDe,
    pricing: pricingDe,
    legal: legalDe,
    forms: formsDe,
    notFound: notFoundDe,
    callSession: callSessionDe,
  },
} satisfies Record<Locale, TranslationTree>

const warnedKeys = new Set<string>()

const LocaleContext = createContext<LocaleContextValue | null>(null)

function getNestedValue(source: TranslationTree, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in acc) {
      return (acc as Record<string, unknown>)[segment]
    }
    return undefined
  }, source)
}

function interpolate(template: string, params?: TranslationParams) {
  if (!params) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, token: string) => String(params[token] ?? ''))
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const locale = getLocaleFromPathname(location.pathname)
  const canonicalPathname = normalizeLocalePathname(location.pathname)

  useEffect(() => {
    document.documentElement.lang = locale
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch {
      // ignore storage access issues
    }
  }, [locale])

  const localizeCurrentPath = useCallback(
    (path: string) => localizePath(path, locale),
    [locale],
  )

  const t = useCallback((key: string, params?: TranslationParams) => {
    const direct = getNestedValue(resources[locale], key)
    if (typeof direct === 'string') return interpolate(direct, params)

    const fallback = getNestedValue(resources[DEFAULT_LOCALE], key)
    if (typeof fallback === 'string') {
      if (!warnedKeys.has(`${locale}:${key}`) && import.meta.env.DEV) {
        warnedKeys.add(`${locale}:${key}`)
        console.warn(`[i18n] Missing "${key}" for locale "${locale}", falling back to English.`)
      }
      return interpolate(fallback, params)
    }

    if (!warnedKeys.has(`missing:${key}`) && import.meta.env.DEV) {
      warnedKeys.add(`missing:${key}`)
      console.warn(`[i18n] Missing translation key "${key}".`)
    }
    return key
  }, [locale])

  const tm = useCallback(<T,>(key: string): T => {
    const direct = getNestedValue(resources[locale], key)
    if (direct !== undefined) return direct as T

    const fallback = getNestedValue(resources[DEFAULT_LOCALE], key)
    if (fallback !== undefined) {
      if (!warnedKeys.has(`${locale}:${key}`) && import.meta.env.DEV) {
        warnedKeys.add(`${locale}:${key}`)
        console.warn(`[i18n] Missing "${key}" for locale "${locale}", falling back to English.`)
      }
      return fallback as T
    }

    throw new Error(`Missing translation object for key "${key}"`)
  }, [locale])

  const switchLocaleValue = useCallback((nextLocale: Locale) => {
    if (nextLocale === locale) return
    const nextPath = switchLocalePath(
      `${location.pathname}${location.search}${location.hash}`,
      nextLocale,
    )
    navigate(nextPath)
  }, [locale, location.hash, location.pathname, location.search, navigate])

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    t,
    tm,
    localizePath: localizeCurrentPath,
    switchLocale: switchLocaleValue,
    canonicalPathname,
  }), [canonicalPathname, locale, localizeCurrentPath, switchLocaleValue, t, tm])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}

export function useLocalePath() {
  return useLocale().localizePath
}

export function useLocaleNavigate() {
  const navigate = useNavigate()
  const localize = useLocalePath()

  return useCallback((path: string, options?: { replace?: boolean; state?: unknown }) => {
    navigate(localize(path), options)
  }, [localize, navigate])
}

export function useTranslation() {
  const { t, tm } = useLocale()
  return { t, tm }
}
