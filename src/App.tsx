import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import About from './pages/About'
import Atmospheric from './pages/Atmospheric'
import CallSession from './pages/CallSession'
import Contact from './pages/Contact'
import ContactSuccess from './pages/ContactSuccess'
import Exhibitions from './pages/Exhibitions'
import FashionShow from './pages/FashionShow'
import GalleryStories from './pages/GalleryStories'
import Impressum from './pages/Impressum'
import Performance from './pages/Performance'
import ArtistSessions from './pages/ArtistSessions'
import Portfolio from './pages/Portfolio'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import HomeRedesign from './pages/HomeRedesign'
import PricingRequest from './pages/PricingRequest'
import PricingRequestSuccess from './pages/PricingRequestSuccess'
import { ThemeProvider } from './ThemeContext'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackEvent, trackPageView } from './utils/analytics'
function App() {
  const location = useLocation()
  const contentRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

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
        <a className="skip-link" href="#main">Skip to content</a>
        <div className="page__content" ref={contentRef}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home-redesign" element={<HomeRedesign />} />
            <Route path="/about" element={<About />} />
            <Route path="/call-session" element={<CallSession />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact-success" element={<ContactSuccess />} />
            <Route
              path="/documentation"
              element={
                <>
                  <Exhibitions />
                </>
              }
            />
            <Route path="/exhibitions" element={<Navigate to="/documentation" replace />} />
            <Route
              path="/atmospheric"
              element={
                <>
                  <Atmospheric />
                </>
              }
            />
            <Route
              path="/performance"
              element={
                <>
                  <Performance />
                </>
              }
            />
            <Route
              path="/gallery-stories"
              element={
                <>
                  <GalleryStories />
                </>
              }
            />
            <Route path="/impressum" element={<Impressum />} />
            <Route
              path="/artist-sessions"
              element={
                <>
                  <ArtistSessions />
                </>
              }
            />
            <Route
              path="/fashion-show"
              element={
                <>
                  <FashionShow />
                </>
              }
            />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing-request/:plan" element={<PricingRequest />} />
            <Route path="/pricing-request/success" element={<PricingRequestSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
