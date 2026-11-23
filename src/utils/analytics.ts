import { useEffect, useRef, type RefObject } from 'react'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID || 'vlupnuzyk8'
const ADSENSE_CLIENT_ID = 'ca-pub-8205854545246075'

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
let consentVendorsStarted = false
let lastPageViewPath: string | null = null
let lastMetaPageViewPath: string | null = null

function appendVendorScript(id: string, src: string, crossOrigin?: string) {
  if (document.getElementById(id)) return
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  if (crossOrigin) script.crossOrigin = crossOrigin
  document.head.appendChild(script)
}

/** Bootstrap optional analytics and advertising vendors after affirmative consent. */
export const initializeAnalyticsVendors = () => {
  if (typeof window === 'undefined' || !hasAnalyticsConsent() || consentVendorsStarted) return
  consentVendorsStarted = true

  if (GA_ID) {
    window.dataLayer = window.dataLayer || []
    if (typeof window.gtag !== 'function') {
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args)
      }
    }
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500,
    })
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    })
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, { send_page_view: false })
    appendVendorScript('vendor-google-tag', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`)
    trackPageView(window.location.pathname + window.location.search)
  }

  if (META_PIXEL_ID) {
    if (!window.fbq) {
      type FbqStub = NonNullable<Window['fbq']> & {
        callMethod?: (...args: unknown[]) => void
        push: FbqStub
        loaded: boolean
        version: string
        queue: unknown[][]
      }
      const fbqStub = function (...args: unknown[]) {
        if (fbqStub.callMethod) {
          fbqStub.callMethod(...args)
        } else {
          fbqStub.queue.push(args)
        }
      } as FbqStub
      fbqStub.push = fbqStub
      fbqStub.loaded = true
      fbqStub.version = '2.0'
      fbqStub.queue = []
      window.fbq = fbqStub
      window._fbq = fbqStub
    }
    appendVendorScript('vendor-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js')
    window.fbq('init', META_PIXEL_ID)
    lastMetaPageViewPath = window.location.pathname + window.location.search
    window.fbq('track', 'PageView')
  }

  if (CLARITY_ID) {
    if (!window.clarity) {
      type ClarityWithQueue = NonNullable<Window['clarity']> & { q: unknown[][] }
      const clarityStub = ((...args: Parameters<NonNullable<Window['clarity']>>) => {
        clarityStub.q.push(args)
      }) as ClarityWithQueue
      clarityStub.q = []
      window.clarity = clarityStub
    }
    appendVendorScript('vendor-clarity', `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_ID)}`)
  }

  appendVendorScript(
    'vendor-adsense',
    `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT_ID)}`,
    'anonymous',
  )
}

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

const getLegacyConsentPreference = () => {
  if (typeof window === 'undefined') return null

  try {
    for (const key of CONSENT_STORAGE_KEYS) {
      const value = window.localStorage.getItem(key)
      if (value !== null) return isTruthyConsentValue(value)
    }
  } catch {
    // ignore storage access issues
  }

  for (const key of CONSENT_COOKIE_KEYS) {
    const value = getCookie(key)
    if (value !== null) return isTruthyConsentValue(value)
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

export const updateGoogleConsentMode = (granted: boolean) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  const state = granted ? 'granted' : 'denied'
  window.gtag('consent', 'update', {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  })

  // Consent update alone doesn't make gtag.js send a new hit. The first hit
  // sent after this point is the one that actually becomes a real, cookied,
  // Realtime-countable session — re-fire the page view here (carrying the
  // persisted landing UTM/click-id params) so that session is attributed
  // correctly even if the visitor has since navigated off the tagged URL.
  if (granted) {
    trackPageView(window.location.pathname + window.location.search)
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

  const legacyPreference = getLegacyConsentPreference()
  if (legacyPreference !== null) {
    window.__analyticsConsent = legacyPreference
    return legacyPreference
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

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid'] as const
const LANDING_PARAMS_STORAGE_KEY = '__landingAttributionParams'
const LANDING_REFERRER_STORAGE_KEY = '__landingReferrer'

export type FormAttributionParams = {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_term: string
  utm_content: string
  referrer: string
}

export function getFormAttributionParams(): FormAttributionParams {
  const captured = captureLandingAttributionParams()
  const current = extractUtmParams()
  let storedReferrer = ''
  if (typeof window !== 'undefined') {
    try {
      storedReferrer = window.sessionStorage.getItem(LANDING_REFERRER_STORAGE_KEY) || ''
      if (!storedReferrer && document.referrer) {
        storedReferrer = document.referrer
        window.sessionStorage.setItem(LANDING_REFERRER_STORAGE_KEY, storedReferrer)
      }
    } catch {
      storedReferrer = typeof document !== 'undefined' ? document.referrer : ''
    }
  }
  const merged = { ...captured, ...current }
  return {
    utm_source: String(merged.utm_source || ''),
    utm_medium: String(merged.utm_medium || ''),
    utm_campaign: String(merged.utm_campaign || ''),
    utm_term: String(merged.utm_term || ''),
    utm_content: String(merged.utm_content || ''),
    referrer: storedReferrer || (typeof document !== 'undefined' ? document.referrer || '' : ''),
  }
}

function extractUtmParams(): AnalyticsParams {
  if (typeof window === 'undefined') return {}
  const sp = new URLSearchParams(window.location.search)
  const utm: AnalyticsParams = {}
  for (const key of UTM_KEYS) {
    const val = sp.get(key)
    if (val) utm[key] = val
  }
  return utm
}

// UTM/click-id params only exist in the URL on the landing hit. SPA navigation
// (and the delay before a consent decision) can strip them before GA4 ever
// sees a "granted" hit, so we snapshot them into sessionStorage once per
// session and forward them on every subsequent config call.
function captureLandingAttributionParams(): AnalyticsParams {
  if (typeof window === 'undefined') return {}

  try {
    const cached = window.sessionStorage.getItem(LANDING_PARAMS_STORAGE_KEY)
    if (cached) return JSON.parse(cached) as AnalyticsParams
  } catch {
    // ignore storage access issues
  }

  const sp = new URLSearchParams(window.location.search)
  const landing: AnalyticsParams = { ...extractUtmParams() }
  for (const key of CLICK_ID_KEYS) {
    const val = sp.get(key)
    if (val) landing[key] = val
  }

  if (Object.keys(landing).length > 0) {
    try {
      window.sessionStorage.setItem(LANDING_PARAMS_STORAGE_KEY, JSON.stringify(landing))
    } catch {
      // ignore storage access issues
    }
  }

  return landing
}

export const trackPageView = (path: string, params: AnalyticsParams = {}) => {
  // There is no gtag function before consent because vendor bootstrap is deferred.
  if (typeof window.gtag === 'function' && GA_ID && path !== lastPageViewPath) {
    lastPageViewPath = path
    window.gtag('config', GA_ID, {
      page_path: path,
      page_title: typeof document !== 'undefined' ? document.title : undefined,
      source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
      // First-touch UTM/click-id params, persisted for the whole session,
      // so attribution survives SPA navigation and delayed consent grants.
      ...captureLandingAttributionParams(),
      // Current-URL UTM params override, in case this hit is itself a new
      // campaign entrance within the same session.
      ...extractUtmParams(),
      ...params,
    })
  }

  // Fire Meta Pixel PageView on SPA navigations (initial bootstrap is guarded via lastMetaPageViewPath).
  if (hasAnalyticsConsent() && typeof window.fbq === 'function' && META_PIXEL_ID && path !== lastMetaPageViewPath) {
    lastMetaPageViewPath = path
    window.fbq('track', 'PageView')
  }
}

export const useGlobalClickTracking = () => {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const handleClick = (event: MouseEvent) => {
      const element =
        event.target instanceof Element
          ? event.target
          : (event.target as Node | null)?.parentElement ?? null
      const anchor = element?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const rawHref = anchor.getAttribute('href') || ''
      const href = anchor.href || rawHref
      const pagePath = window.location.pathname

      if (href.includes('wa.me/')) {
        trackEvent('whatsapp_click', { link_url: href, page_path: pagePath })
        if (hasAnalyticsConsent() && typeof window.fbq === 'function' && META_PIXEL_ID) {
          window.fbq('track', 'Contact', { content_name: 'whatsapp' })
        }
      } else if (href.includes('calendly.com/') || rawHref.includes('/call-session')) {
        trackEvent('calendar_click', { link_url: href, page_path: pagePath })
        if (hasAnalyticsConsent() && typeof window.fbq === 'function' && META_PIXEL_ID) {
          window.fbq('track', 'Contact', { content_name: 'calendar' })
        }
      } else if (rawHref.startsWith('mailto:')) {
        trackEvent('mailto_click', { link_url: rawHref, page_path: pagePath })
      } else if (rawHref.startsWith('tel:')) {
        trackEvent('phone_click', { link_url: rawHref, page_path: pagePath })
      }
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
  }, [])
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
