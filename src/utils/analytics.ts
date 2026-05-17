import { useEffect, useRef, type RefObject } from 'react'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

type Primitive = string | number | boolean | undefined | null
export type AnalyticsParams = Record<string, Primitive>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: Array<Record<string, unknown> | unknown[]>
    clarity?: (eventName: string, eventValue?: string) => void
    fbq?: (command: string, event: string, params?: Record<string, unknown>, options?: Record<string, unknown>) => void
    _fbq?: unknown
    __analyticsConsent?: boolean
  }
}

const CONSENT_STORAGE_KEYS = [
  'analytics_consent',
  'cookie_consent_analytics',
  'consent_analytics',
  'cookieConsentAnalytics',
  'cookie-consent-analytics',
]

const CONSENT_COOKIE_KEYS = [
  'analytics_consent',
  'cookie_consent_analytics',
  'consent_analytics',
  'cookieConsentAnalytics',
  'cookie-consent-analytics',
]

export const ANALYTICS_CONSENT_KEY = '__analyticsConsent'
const DEBUG_STORAGE_KEY = '__analyticsDebug'

const isTruthyConsentValue = (value: string | null | undefined) => {
  if (!value) return false
  const normalized = value.trim().toLowerCase()
  return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'granted' || normalized === 'allow'
}

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null
}

const getStoredConsentPreference = () => {
  if (typeof window === 'undefined') return null

  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY)
    if (value === 'true' || value === 'false') return value
  } catch {
    // ignore storage access issues
  }

  return null
}

const isLocalDevelopmentHost = () => {
  if (typeof window === 'undefined') return false
  const { hostname } = window.location
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

const isDebugEnabled = () => {
  if (typeof window === 'undefined') return false

  try {
    return isTruthyConsentValue(window.localStorage.getItem(DEBUG_STORAGE_KEY))
  } catch {
    return false
  }
}

export const initializeAnalyticsConsent = () => {
  if (typeof window === 'undefined') return null

  const storedPreference = getStoredConsentPreference()

  if (storedPreference === 'true') {
    window.__analyticsConsent = true
    return true
  }

  if (storedPreference === 'false') {
    window.__analyticsConsent = false
    return false
  }

  if (window.__analyticsConsent === true) return true
  if (window.__analyticsConsent === false) return false
  return null
}

export const hasAnalyticsInstalled = () =>
  typeof window !== 'undefined' && Boolean(GA_ID) && (typeof window.gtag === 'function' || Array.isArray(window.dataLayer))

export const hasAnalyticsConsent = () => {
  if (typeof window === 'undefined') return false
  const explicitPreference = initializeAnalyticsConsent()
  if (explicitPreference === true) return true
  if (explicitPreference === false) return false

  if (window.__analyticsConsent === true) return true
  if (window.__analyticsConsent === false) return false

  if (import.meta.env.DEV || isLocalDevelopmentHost()) {
    try {
      if (isTruthyConsentValue(window.localStorage.getItem(ANALYTICS_CONSENT_KEY))) {
        return true
      }
    } catch {
      // ignore storage access issues
    }
  }

  try {
    if (CONSENT_STORAGE_KEYS.some((key) => isTruthyConsentValue(window.localStorage.getItem(key)))) {
      return true
    }
  } catch {
    // ignore storage access issues
  }

  return CONSENT_COOKIE_KEYS.some((key) => isTruthyConsentValue(getCookie(key)))
}

const shouldSendAnalytics = () => hasAnalyticsInstalled() && hasAnalyticsConsent()

const getDefaultParams = (): AnalyticsParams => ({
  page_path: typeof window !== 'undefined' ? window.location.pathname + window.location.search : undefined,
  page_title: typeof document !== 'undefined' ? document.title : undefined,
  source_url: typeof window !== 'undefined' ? window.location.href : undefined,
  referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
})

const sendEvent = (name: string, params: AnalyticsParams = {}) => {
  const finalParams = {
    ...getDefaultParams(),
    ...params,
  }

  if (isDebugEnabled()) {
    console.debug('[analytics event]', name, finalParams)
  }

  if (!shouldSendAnalytics()) {
    if (import.meta.env.DEV && hasAnalyticsInstalled()) {
      console.debug('[analytics blocked]', name, finalParams)
    }
    return
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, finalParams)
    return
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...finalParams })
  }
}

export const trackPageView = (path: string, params: AnalyticsParams = {}) => {
  if (!shouldSendAnalytics()) return

  if (typeof window.gtag === 'function' && GA_ID) {
    window.gtag('config', GA_ID, {
      page_path: path,
      page_title: typeof document !== 'undefined' ? document.title : undefined,
      source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
      ...params,
    })
  }

  // Meta Pixel's initial PageView is fired by the required snippet in index.html.
  // Avoid sending an additional SPA route PageView here.
}

export function trackEvent(name: string, params?: AnalyticsParams): void
export function trackEvent(
  action: string,
  category: string,
  label: string,
  value?: number,
  params?: AnalyticsParams,
): void
export function trackEvent(
  action: string,
  categoryOrParams?: string | AnalyticsParams,
  label?: string,
  value?: number,
  params: AnalyticsParams = {},
): void {
  if (typeof categoryOrParams === 'string') {
    sendEvent(action, {
      event_category: categoryOrParams,
      event_label: label,
      ...(typeof value === 'number' ? { value } : {}),
      ...params,
    })
    return
  }

  sendEvent(action, categoryOrParams ?? {})
}

export const useTrackViewEvent = (eventName: string, params: AnalyticsParams = {}) => {
  const firedRef = useRef(false)
  const paramsRef = useRef(params)

  useEffect(() => {
    paramsRef.current = params
  }, [params])

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true
    trackEvent(eventName, paramsRef.current)
  }, [eventName])
}

export const useScrollDepthTracking = (
  pageKey: string,
  thresholds: number[],
  buildParams?: (threshold: number) => AnalyticsParams,
) => {
  const buildParamsRef = useRef(buildParams)
  const thresholdsKey = thresholds.join(',')

  useEffect(() => {
    buildParamsRef.current = buildParams
  }, [buildParams])

  useEffect(() => {
    const fired = new Set<number>()
    const activeThresholds = thresholdsKey
      .split(',')
      .map((threshold) => Number(threshold))
      .filter((threshold) => Number.isFinite(threshold))

    const onScroll = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) return

      const progress = Math.round((window.scrollY / scrollable) * 100)

      activeThresholds.forEach((threshold) => {
        if (progress >= threshold && !fired.has(threshold)) {
          fired.add(threshold)
          trackEvent(`${pageKey}_scroll_${threshold}`, buildParamsRef.current?.(threshold) ?? {})
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pageKey, thresholdsKey])
}

export const useElementViewTracking = (
  ref: RefObject<Element | null>,
  eventName: string,
  params: AnalyticsParams = {},
  options?: IntersectionObserverInit,
) => {
  const firedRef = useRef(false)
  const paramsRef = useRef(params)
  const optionsRef = useRef(options)

  useEffect(() => {
    paramsRef.current = params
  }, [params])

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    const node = ref.current
    if (!node || firedRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !firedRef.current) {
            firedRef.current = true
            trackEvent(eventName, paramsRef.current)
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.35,
        ...optionsRef.current,
      },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [eventName, ref])
}
