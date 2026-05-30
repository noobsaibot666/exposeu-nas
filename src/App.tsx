import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import About from './pages/About'
import BrandAgency from './pages/BrandAgency'
import CallSession from './pages/CallSession'
import ConcertsEvents from './pages/ConcertsEvents'
import Contact from './pages/Contact'
import ContactSuccess from './pages/ContactSuccess'
import ExhibitionGallery from './pages/ExhibitionGallery'
import Impressum from './pages/Impressum'
import ArtistSessions from './pages/ArtistSessions'
import Portfolio from './pages/Portfolio'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import BrandAgencyLanding from './pages/BrandAgencyLanding'
import ConcertsBerlin from './pages/ConcertsBerlin'
import ExhibitionGalleryLanding from './pages/ExhibitionGalleryLanding'
import HomeV2 from './pages/HomeV2'
import PricingRequest from './pages/PricingRequest'
import PricingRequestSuccess from './pages/PricingRequestSuccess'
import ReleaseContentKit from './pages/ReleaseContentKit'
import PopupsLanding from './pages/PopupsLanding'
import { ThemeProvider } from './ThemeContext'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import AnalyticsConsentBanner from './components/AnalyticsConsentBanner'
import { trackEvent, trackPageView } from './utils/analytics'
import LocaleSwitcher from './components/LocaleSwitcher'
import { usePageMeta } from './i18n/pageMeta'
import { useTranslation } from './i18n/LocaleProvider'
function App() {
  const location = useLocation()
  const contentRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const { t } = useTranslation()

  usePageMeta()

  // Centralized scroll reset + micro-transition on route change
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const el = contentRef.current
    if (!el) return
    // Apply entering class before paint
    el.classList.add('is-entering')
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    // Remove after one frame to trigger the CSS transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.remove('is-entering')
      })
    })
  }, [location.pathname])

  useEffect(() => {
    const path = location.pathname + location.search
    const previousPath = sessionStorage.getItem('analytics_prev_path') ?? 'direct'

    trackPageView(path, { previous_path: previousPath })
    trackEvent('route_change', 'navigation', path, undefined, { from_path: previousPath, to_path: path })
    sessionStorage.setItem('analytics_prev_path', path)
  }, [location])

  useEffect(() => {
    const checkpoints = [25, 50, 75, 100]
    const fired = new Set<number>()
    const path = location.pathname + location.search

    const onScroll = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const progress = Math.round((window.scrollY / scrollable) * 100)

      checkpoints.forEach((checkpoint) => {
        if (progress >= checkpoint && !fired.has(checkpoint)) {
          fired.add(checkpoint)
          trackEvent('scroll_depth', 'engagement', `${checkpoint}%`, checkpoint, { page_path: path })
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname, location.search])

  useEffect(() => {
    const path = location.pathname + location.search
    const time30 = window.setTimeout(() => {
      trackEvent('engaged_30s', 'engagement', path, 30, { page_path: path })
    }, 30000)
    const time90 = window.setTimeout(() => {
      trackEvent('engaged_90s', 'engagement', path, 90, { page_path: path })
    }, 90000)

    return () => {
      window.clearTimeout(time30)
      window.clearTimeout(time90)
    }
  }, [location.pathname, location.search])

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      trackEvent('js_error', 'stability', event.message || 'unknown', undefined, {
        file: event.filename || 'unknown',
        line: event.lineno || 0,
      })
    }

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason instanceof Error ? event.reason.message : String(event.reason ?? 'unknown')
      trackEvent('promise_rejection', 'stability', reason)
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onUnhandledRejection)

    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onUnhandledRejection)
    }
  }, [])

  return (
    <ThemeProvider>
      <div className="page">
        <a className="skip-link" href="#main">{t('common.skipToContent')}</a>
        <AnalyticsConsentBanner />
        <LocaleSwitcher />
        <div className="page__content" ref={contentRef}>
          <Routes>
            <Route path="/" element={<HomeV2 />} />
            <Route path="/de" element={<HomeV2 />} />
            <Route path="/old-home" element={<Home />} />
            <Route path="/de/old-home" element={<Navigate to="/de" replace />} />
            <Route path="/v2" element={<HomeV2 />} />
            <Route path="/de/v2" element={<HomeV2 />} />
            <Route path="/about" element={<About />} />
            <Route path="/de/about" element={<About />} />
            <Route path="/call-session" element={<CallSession />} />
            <Route path="/de/call-session" element={<CallSession />} />
            <Route path="/release-content-kit" element={<ReleaseContentKit />} />
            <Route path="/de/release-content-kit" element={<ReleaseContentKit />} />
            <Route path="/exhibition-gallery" element={<ExhibitionGalleryLanding />} />
            <Route path="/de/exhibition-gallery" element={<ExhibitionGalleryLanding />} />
            <Route path="/brand-agency" element={<BrandAgencyLanding />} />
            <Route path="/de/brand-agency" element={<BrandAgencyLanding />} />
            <Route path="/popups" element={<PopupsLanding />} />
            <Route path="/de/popups" element={<PopupsLanding />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/de/contact" element={<Contact />} />
            <Route path="/contact-success" element={<ContactSuccess />} />
            <Route path="/de/contact-success" element={<ContactSuccess />} />
            <Route path="/services/concerts-events" element={<ConcertsEvents />} />
            <Route path="/de/services/concerts-events" element={<ConcertsEvents />} />
            <Route path="/services/exhibition-gallery" element={<ExhibitionGallery />} />
            <Route path="/de/services/exhibition-gallery" element={<ExhibitionGallery />} />
            <Route path="/services/artist-sessions" element={<ArtistSessions />} />
            <Route path="/de/services/artist-sessions" element={<ArtistSessions />} />
            <Route path="/services/brand-agency" element={<BrandAgency />} />
            <Route path="/de/services/brand-agency" element={<BrandAgency />} />
            <Route path="/services/performance" element={<Navigate to="/services/concerts-events" replace />} />
            <Route path="/de/services/performance" element={<Navigate to="/de/services/concerts-events" replace />} />
            <Route path="/services/gallery-stories" element={<Navigate to="/services/exhibition-gallery" replace />} />
            <Route path="/de/services/gallery-stories" element={<Navigate to="/de/services/exhibition-gallery" replace />} />
            <Route path="/services/fashion-show" element={<Navigate to="/services/brand-agency" replace />} />
            <Route path="/de/services/fashion-show" element={<Navigate to="/de/services/brand-agency" replace />} />
            <Route path="/services/atmospheric-films" element={<Navigate to="/services/concerts-events" replace />} />
            <Route path="/de/services/atmospheric-films" element={<Navigate to="/de/services/concerts-events" replace />} />
            <Route path="/performance" element={<Navigate to="/services/concerts-events" replace />} />
            <Route path="/de/performance" element={<Navigate to="/de/services/concerts-events" replace />} />
            <Route path="/gallery-stories" element={<Navigate to="/services/exhibition-gallery" replace />} />
            <Route path="/de/gallery-stories" element={<Navigate to="/de/services/exhibition-gallery" replace />} />
            <Route path="/fashion-show" element={<Navigate to="/services/brand-agency" replace />} />
            <Route path="/de/fashion-show" element={<Navigate to="/de/services/brand-agency" replace />} />
            <Route path="/atmospheric" element={<Navigate to="/services/concerts-events" replace />} />
            <Route path="/de/atmospheric" element={<Navigate to="/de/services/concerts-events" replace />} />
            <Route path="/documentation" element={<Navigate to="/services/exhibition-gallery" replace />} />
            <Route path="/de/documentation" element={<Navigate to="/de/services/exhibition-gallery" replace />} />
            <Route path="/exhibitions" element={<Navigate to="/services/exhibition-gallery" replace />} />
            <Route path="/de/exhibitions" element={<Navigate to="/de/services/exhibition-gallery" replace />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/de/impressum" element={<Impressum />} />
            <Route path="/artist-sessions" element={<Navigate to="/services/artist-sessions" replace />} />
            <Route path="/de/artist-sessions" element={<Navigate to="/de/services/artist-sessions" replace />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/de/portfolio" element={<Portfolio />} />
            <Route path="/pricing-request/:plan" element={<PricingRequest />} />
            <Route path="/de/pricing-request/:plan" element={<PricingRequest />} />
            <Route path="/pricing-request/success" element={<PricingRequestSuccess />} />
            <Route path="/de/pricing-request/success" element={<PricingRequestSuccess />} />
            <Route path="/concerts-berlin" element={<ConcertsBerlin />} />
            <Route path="/de/concerts-berlin" element={<ConcertsBerlin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
