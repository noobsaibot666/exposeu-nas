const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

type GtagParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    clarity?: (eventName: string, eventValue?: string) => void
  }
}

const hasAnalytics = () => typeof window !== 'undefined' && typeof window.gtag === 'function' && Boolean(GA_ID)

export const trackPageView = (path: string, params: GtagParams = {}) => {
  if (!hasAnalytics()) return
  window.gtag?.('config', GA_ID, {
    page_path: path,
    ...params,
  })
}

export const trackEvent = (
  action: string,
  category: string,
  label: string,
  value?: number,
  params: GtagParams = {},
) => {
  if (!hasAnalytics()) return
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    ...(typeof value === 'number' ? { value } : {}),
    ...params,
  })
}
