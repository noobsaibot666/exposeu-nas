import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
// HomeV2.css overrides many `home__*` rules from Home.css. Home.css used to
// reach this page only via WorkPageLayout → PricingSection in the eager
// bundle; with lazy routes it must be imported here, before HomeV2.css, to keep
// the same cascade order.
import './Home.css'
import './HomeV2.css'
import '../pages/Portfolio.css'
import styles from './HomeRedesign.module.css'
import Footer from '../sections/Footer'
import { resolveImagePath } from '../utils/resolveImagePath'
import {
  HOME_HERO_USES_NATIVE_VIDEO,
  HOME_HERO_VIDEO_URLS,
  HOME_HERO_VIMEO_IDS,
  VIMEO_ORIGIN,
  buildHeroVimeoSrc,
} from '../config/homeHeroVideo'

// Seconds before the end of the Vimeo clip to jump back to the start — hides
// the black frame Vimeo shows at its own loop point.
const EARLY_LOOP_SECONDS = 1

function sendToVimeo(iframe: HTMLIFrameElement | null, method: string, value?: unknown) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify(value === undefined ? { method } : { method, value }),
    VIMEO_ORIGIN,
  )
}
import { portfolioProjects } from '../data/portfolioProjects'
import { projectSlug } from '../data/projectPages'
import { serviceMeta } from '../data/serviceMeta'
import { trackEvent, useScrollDepthTracking, useTrackViewEvent } from '../utils/analytics'
import { smoothScrollTo } from '../utils/smoothScroll'
import { useLocale, useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import LocalizedLink from '../i18n/LocalizedLink'
import { SchemaOrg, SEOMeta } from '../components/SEOMeta'
import { useNavOverMedia } from '../hooks/useNavOverMedia'

const exhibitionGalleryCardImage = resolveImagePath('/src/assets/images/website/_incoming/homepage/hero-thumbs/exhibition-gallery/gallery-opening.webp')

const offerVisuals = [
  {
    slug: serviceMeta['exhibition-gallery'].slug,
    offerKey: 'exhibition-gallery',
    image: exhibitionGalleryCardImage,
    link: serviceMeta['exhibition-gallery'].href,
  },
  {
    slug: serviceMeta['brand-agency'].slug,
    offerKey: 'designed-experiences',
    image: resolveImagePath('/src/assets/images/website/_incoming/homepage/hero-thumbs/brand-agency/033.webp'),
    link: serviceMeta['brand-agency'].href,
  },
  {
    slug: serviceMeta['concerts-events'].slug,
    offerKey: 'live-work-artists',
    image: resolveImagePath('/src/assets/images/website/artists/002.webp'),
    link: serviceMeta['concerts-events'].href,
  },
]

const documentationTypeVisuals = [
  {
    slug: serviceMeta['exhibition-gallery'].slug,
    image: exhibitionGalleryCardImage,
    link: serviceMeta['exhibition-gallery'].href,
  },
  {
    slug: serviceMeta['brand-agency'].slug,
    image: resolveImagePath('/src/assets/images/website/_incoming/homepage/hero-thumbs/brand-agency/033.webp'),
    link: serviceMeta['brand-agency'].href,
  },
  {
    slug: serviceMeta['concerts-events'].slug,
    image: resolveImagePath('/src/assets/images/website/artists/002.webp'),
    link: serviceMeta['concerts-events'].href,
  },
  {
    slug: serviceMeta['artist-sessions'].slug,
    image: resolveImagePath('/src/assets/images/website/_incoming/homepage/services/artist-sessions/0015.webp'),
    link: serviceMeta['artist-sessions'].href,
  },
]

const lastProjectsBase = [
  { id: 'v1', image: resolveImagePath('/src/assets/images/thumbs/portfolio/01/thumb_0.webp') },
  { id: 'sanam', image: resolveImagePath('/src/assets/images/thumbs/portfolio/03/thumb_0.webp') },
  { id: 'v2', image: resolveImagePath('/src/assets/images/thumbs/portfolio/02/thumb_0.webp') },
]

const proofAvatars = [
  resolveImagePath('/src/assets/images/website/artists/thumb_3_052.webp'),
  resolveImagePath('/src/assets/images/website/fashion/thumb_3_033.webp'),
  resolveImagePath('/src/assets/images/website/fashion/thumb_3_057.webp'),
  resolveImagePath('/src/assets/images/website/performances/thumb_3_086.webp'),
]

const HOME_SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'expose.u',
    description: 'Photo and video documentation for concerts, exhibitions, and live events in Berlin.',
    url: 'https://expose-u.com',
    telephone: '+4917622132950',
    email: 'hello@expose-u.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Duden Straße 24',
      addressLocality: 'Berlin',
      addressRegion: 'Berlin',
      postalCode: '10965',
      addressCountry: 'DE',
    },
    sameAs: [
      'https://instagram.com/xposeu_official',
      'https://www.threads.net/@xposeu_official',
    ],
    image: 'https://expose-u.com/og-default.png',
    areaServed: { '@type': 'City', name: 'Berlin' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'expose.u',
    url: 'https://expose-u.com',
    inLanguage: ['en', 'de'],
  },
]

function HomeV2() {
  const navigate = useLocaleNavigate()
  const { locale } = useLocale()
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState('home')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  // Mirrors the video source media breakpoint so a resize reloads the matching variant.
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => window.matchMedia('(max-width: 900px)').matches,
  )
  const location = useLocation()
  const rootRef = useRef<HTMLElement | null>(null)
  const casesRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoHeroRef = useRef<HTMLElement | null>(null)
  const vimeoIframeRef = useRef<HTMLIFrameElement | null>(null)
  const prefersReducedMotionRef = useRef(prefersReducedMotion)
  const [vimeoRevealed, setVimeoRevealed] = useState(false)
  // Native MP4 hero unless a <source> fails to load, then fall back to Vimeo.
  const [nativeHeroFailed, setNativeHeroFailed] = useState(false)
  const useNativeHero = HOME_HERO_USES_NATIVE_VIDEO && !nativeHeroFailed
  const useNativeHeroRef = useRef(useNativeHero)
  useEffect(() => { useNativeHeroRef.current = useNativeHero }, [useNativeHero])

  useNavOverMedia(videoHeroRef)
  useTrackViewEvent('home_view')
  useScrollDepthTracking('home', [25, 50, 75, 90])


  const offerCards = useMemo(
    () =>
      offerVisuals.map((project) => ({
        ...project,
        title: t(`home.offerSection.cards.${project.offerKey}.title`),
        subtext: t(`home.offerSection.cards.${project.offerKey}.subtext`),
        cta: t(`home.offerSection.cards.${project.offerKey}.cta`),
      })),
    [t],
  )

  const documentationTypes = useMemo(
    () =>
      documentationTypeVisuals.map((project) => ({
        ...project,
        title: t(`home.services.cards.${project.slug}.title`),
        subtext: t(`home.services.cards.${project.slug}.subtext`),
        cta: t(`home.services.cards.${project.slug}.cta`),
      })),
    [t],
  )

  const lastProjects = useMemo(
    () =>
      lastProjectsBase.map((project) => {
        const title = t(`home.lastProjects.items.${project.id}.title`)
        const subtext = t(`home.lastProjects.items.${project.id}.subtext`)
        // Film + stills come from the shared project list, so this lightbox
        // always matches the Portfolio page's.
        const shared = portfolioProjects.find((entry) => entry.id === project.id)
        return {
          ...project,
          title,
          subtext,
          thumb: project.image,
          description: subtext,
          videoSrc: shared?.videoSrc,
          ambientVideo: shared?.ambientVideo,
          slideshowImages: shared?.slideshowImages,
          year: shared?.year ?? '2026',
          location: shared?.location ?? 'Berlin',
        }
      }),
    [t],
  )

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 900px)')
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches)
      // The Vimeo fallback swaps to a fresh iframe: hide it until it plays again.
      if (!useNativeHeroRef.current) {
        setVimeoRevealed(false)
      }
    }
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionPreference = () => setPrefersReducedMotion(motionQuery.matches)
    motionQuery.addEventListener('change', handleMotionPreference)
    return () => motionQuery.removeEventListener('change', handleMotionPreference)
  }, [])

  // Vimeo fallback: listen for player events (play state, early loop).
  useEffect(() => {
    if (useNativeHero) return
    let seeking = false
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== VIMEO_ORIGIN) return
      if (event.source !== vimeoIframeRef.current?.contentWindow) return
      let data: { event?: string; data?: { seconds?: number; duration?: number } }
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      } catch {
        return
      }
      if (data.event === 'ready') {
        const iframe = vimeoIframeRef.current
        ;['play', 'timeupdate'].forEach((name) => sendToVimeo(iframe, 'addEventListener', name))
        if (prefersReducedMotionRef.current) sendToVimeo(iframe, 'pause')
      } else if (data.event === 'play') {
        setVimeoRevealed(true)
      } else if (data.event === 'timeupdate') {
        const { seconds, duration } = data.data ?? {}
        if (typeof seconds !== 'number' || typeof duration !== 'number' || duration <= 0) return
        if (!seeking && duration - seconds <= EARLY_LOOP_SECONDS) {
          seeking = true
          sendToVimeo(vimeoIframeRef.current, 'seekTo', 0)
          setTimeout(() => { seeking = false }, 1000)
        }
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [useNativeHero])

  // Vimeo fallback: never leave the hero blacked out if the player's events
  // don't arrive (re-armed for each viewport swap / new iframe).
  useEffect(() => {
    if (useNativeHero) return
    const fallback = setTimeout(() => setVimeoRevealed(true), 3500)
    return () => clearTimeout(fallback)
  }, [isMobileViewport, useNativeHero])

  useEffect(() => {
    prefersReducedMotionRef.current = prefersReducedMotion
    if (useNativeHero) return
    sendToVimeo(vimeoIframeRef.current, prefersReducedMotion ? 'pause' : 'play')
  }, [prefersReducedMotion, useNativeHero])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !useNativeHero) return
    video.autoplay = !prefersReducedMotion
    if (prefersReducedMotion) {
      video.pause()
      return
    }
    video.load()
    void video.play().catch(() => {})
  }, [isMobileViewport, prefersReducedMotion, useNativeHero])

  const handleScroll = (id: string) => {
    smoothScrollTo(id, 500, 72)
  }

  const navLinks = useMemo(
    () => ({
      left: [
        { id: 'home', label: t('nav.home'), onClick: () => handleScroll('#hero') },
        { id: 'services', label: t('nav.services'), onClick: () => handleScroll('#cases') },
        { id: 'portfolio', label: t('nav.lastProjects'), onClick: () => navigate('/portfolio') },
      ],
      right: [
        { id: 'about', label: t('nav.about'), onClick: () => navigate('/about') },
        { id: 'contact', label: t('nav.contact'), onClick: () => navigate('/contact') },
      ],
    }),
    [navigate, t],
  )

  const trackHomeCta = (ctaLabel: string, ctaLocation: string) => {
    trackEvent('home_cta_click', {
      cta_label: ctaLabel,
      cta_location: ctaLocation,
    })
  }

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches

      // Nav — slides down and fades in on mount
      gsap.fromTo(
        isMobile ? ['.home__nav', '.locale-switcher'] : '.home__nav',
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'sine.out', delay: 0.2 },
      )

      // Hero video overlay copy (mobile <= 900px) + scroll hint — staggered fade/slide up on mount
      if (window.matchMedia('(max-width: 900px)').matches) {
        gsap.fromTo(
          ['.home__video-copy-title', '.home__video-copy p', '.home__video-copy-cta'],
          { opacity: 0, y: 26, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.85,
            ease: 'sine.out',
            stagger: 0.12,
            delay: 0.28,
          },
        )
      }

      gsap.fromTo(
        '.home__video-scroll-hint',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'sine.out', delay: 0.55 },
      )

      // Cases — quick staged entrance. The offers, Documentation Types and
      // Recent Work sections share these classnames, so every selector here
      // is scoped per-section rather than page-wide — a ScrollTrigger `trigger`
      // string only ever resolves to the FIRST DOM match, so a single shared
      // trigger would silently drive both sections off the first one's scroll
      // position (second section snapping fully visible/hidden off-screen).
      const cards = gsap.utils.toArray<HTMLElement>('.home__case-card')
      const cardMotion = [
        { y: 52, x: -16, rotate: -2.5 },
        { y: 52, x: 16, rotate: 2.5 },
        { y: 64, x: -10, rotate: -1.8 },
        { y: 64, x: 10, rotate: 1.8 },
      ]

      const casesSections = gsap.utils.toArray<HTMLElement>('.home__cases')
      casesSections.forEach((section) => {
        const headerItems = gsap.utils.toArray<HTMLElement>('.home__section-header > *', section)
        const sectionCards = gsap.utils.toArray<HTMLElement>('.home__case-card', section)
        const row = section.querySelector<HTMLElement>('.home__cases-row')

        gsap.fromTo(
          headerItems,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              end: 'top 62%',
              scrub: 0.7,
            },
          },
        )

        if (row) {
          const sectionTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          })

          sectionCards.forEach((card, i) => {
            const { y, x, rotate } = cardMotion[i % cardMotion.length]
            sectionTimeline.fromTo(
              card,
              { opacity: 0, y, x, scale: 0.94, rotate, filter: 'blur(6px)' },
              {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                rotate: 0,
                filter: 'blur(0px)',
                duration: 0.5,
                ease: 'sine.out',
              },
              i * 0.08,
            )
          })
        }

      })

      // Proof sections — gentle fade + lift with scrub
      const proofSections = gsap.utils.toArray<HTMLElement>('.home__proof')
      proofSections.forEach((section) => {
        const items = Array.from(section.children) as HTMLElement[]
        const avatarItems = gsap.utils.toArray<HTMLElement>('.home__proof-avatar', section)
        const avatarText = section.querySelector<HTMLElement>('.home__proof-avatar-text')

        if (avatarItems.length) {
          gsap.set(avatarItems, { opacity: 0, x: -48 })
          if (avatarText) gsap.set(avatarText, { opacity: 0, x: 18 })

          const avatarMotion = gsap
            .timeline({ paused: true })
            .to(avatarItems, {
              opacity: 1,
              x: 0,
              duration: 0.75,
              stagger: 0.08,
              ease: 'power2.out',
            })

          if (avatarText) {
            avatarMotion.to(
              avatarText,
              {
                opacity: 1,
                x: 0,
                duration: 0.55,
                ease: 'power2.out',
              },
              0.08,
            )
          }

          gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              end: 'bottom 18%',
              onEnter: () => avatarMotion.restart(true),
              onEnterBack: () => avatarMotion.restart(true),
              onLeaveBack: () => avatarMotion.pause(0),
            },
          })
        }

        gsap.fromTo(
          items,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              end: 'top 58%',
              scrub: 0.55,
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      // Process — gentle lift with scrub
      const processSection = document.querySelector<HTMLElement>('.home__process')
      if (processSection) {
        const processItems = gsap.utils.toArray<HTMLElement>('.home__process-header > *, .home__process-step, .home__process-actions')
        gsap.fromTo(
          processItems,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.07,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: processSection,
              start: 'top 88%',
              end: 'top 58%',
              scrub: 0.55,
              toggleActions: 'play none none reverse',
            },
          },
        )
      }

      // 3D hover on case cards (desktop pointer only)
      const listeners: Array<() => void> = []
      const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)')
      if (hoverMedia.matches) {
        cards.forEach((card) => {
          const handleMove = (event: MouseEvent) => {
            const rect = card.getBoundingClientRect()
            const relX = event.clientX - (rect.left + rect.width / 2)
            const relY = event.clientY - (rect.top + rect.height / 2)
            const rotateX = (-relY / (rect.height / 2)) * 1.8
            const rotateY = (relX / (rect.width / 2)) * 1.8
            gsap.to(card, { rotationX: rotateX, rotationY: rotateY, scale: 1.02, duration: 0.5, ease: 'power2.out' })
          }
          const handleEnter = () => gsap.to(card, { scale: 1.02, duration: 0.5, ease: 'power2.out' })
          const handleLeave = () => gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.7, ease: 'sine.inOut' })

          card.addEventListener('mousemove', handleMove)
          card.addEventListener('mouseenter', handleEnter)
          card.addEventListener('mouseleave', handleLeave)
          listeners.push(() => {
            card.removeEventListener('mousemove', handleMove)
            card.removeEventListener('mouseenter', handleEnter)
            card.removeEventListener('mouseleave', handleLeave)
          })
        })
      }

      return () => {
        listeners.forEach((off) => off())
      }
    }, rootRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!location.hash) return
    requestAnimationFrame(() => {
      smoothScrollTo(location.hash, 500, 72)
    })
  }, [location.hash])

  useEffect(() => {
    const sections = [
      { id: 'hero', label: 'home' },
      { id: 'cases', label: 'services' },
    ]

    const nodes = sections
      .map((section) => ({ ...section, element: document.getElementById(section.id) }))
      .filter((section): section is { id: string; label: string; element: HTMLElement } => Boolean(section.element))

    if (!nodes.length) return undefined

    const updateActive = () => {
      const marker = window.scrollY + 160
      const active = nodes.reduce((current, node) => (node.element.offsetTop <= marker ? node : current), nodes[0])
      setActiveSection(active.label)
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)

    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [])

  return (
    <main className="home home--v2" ref={rootRef} id="main">
      <SEOMeta
        title={t('common.meta.home.title')}
        description={t('common.meta.home.description')}
        ogTitle={t('common.meta.home.ogTitle')}
        canonical="https://expose-u.com/"
        lang={locale}
      />
      <SchemaOrg data={HOME_SCHEMA} />
      <div className="home__background" aria-hidden="true" />
      <div className="home__floaters" aria-hidden="true" />

      <section className="home__video-hero" aria-label="Background video" ref={videoHeroRef}>
        {useNativeHero ? (
          <video
            ref={videoRef}
            className="home__video-element"
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            // One src for the current viewport (the effect above reloads on a
            // breakpoint change). Not <source media>: the spec fires `error` on
            // every non-matching <source>, which looked like a failed load.
            src={isMobileViewport ? HOME_HERO_VIDEO_URLS.mobile : HOME_HERO_VIDEO_URLS.desktop}
            onError={() => setNativeHeroFailed(true)}
          />
        ) : (
          <div
            className={`home__video-iframe-wrap${isMobileViewport ? ' home__video-iframe-wrap--mobile' : ''}${vimeoRevealed ? ' home__video-iframe-wrap--ready' : ''}`}
            aria-hidden="true"
          >
            {/* Keyed by viewport so only the matching variant is ever fetched. */}
            <iframe
              key={isMobileViewport ? 'mobile' : 'desktop'}
              ref={vimeoIframeRef}
              src={buildHeroVimeoSrc(isMobileViewport ? HOME_HERO_VIMEO_IDS.mobile : HOME_HERO_VIMEO_IDS.desktop)}
              allow="autoplay; fullscreen; picture-in-picture"
              title="Hero background video"
              tabIndex={-1}
            />
          </div>
        )}
        <div className="home__video-overlay" />
        <div className="home__video-copy">
          <h1 className="home__video-copy-title">{t('home.hero.headline')}</h1>
          <p>{t('home.hero.subhead')}</p>
          <LocalizedLink
            to="/contact"
            className="home__video-copy-cta"
            onClick={() => setTimeout(() => trackHomeCta(t('home.hero.primaryCta'), 'hero_primary'), 0)}
          >
            {t('home.hero.primaryCta')}
          </LocalizedLink>
        </div>
        <button
          className="home__video-scroll-hint"
          type="button"
          aria-label={t('home.hero.scrollAria')}
          onClick={() => handleScroll('#hero')}
        >
          <span>{t('home.hero.scroll')}</span>
        </button>
      </section>

      {/* Nav wrapper — hidden on desktop (nav is fixed), visible on mobile */}
      <div className="home__nav">
        <TopNav
          className="top-nav--page"
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate('/')}
          brandLabel={t('nav.brand')}
          activeId={activeSection}
        />
      </div>

      <section className="home__section home__cases home__offerings" id="hero" aria-labelledby="home-offer-heading">
        <div className="home__section-header">
          <p>{t('home.offerSection.label')}</p>
          <h1 id="home-offer-heading">{t('home.offerSection.headline')}</h1>
          <p className={`home__section-intro ${styles.homeRedesign__bodyCopy}`}>
            {t('home.offerSection.intro')}
          </p>
        </div>
        <div className="home__cases-grid">
          <div className="home__cases-row home__cases-row--triple">
            {offerCards.map((project, index) => (
              <LocalizedLink
                key={project.title}
                to={project.link}
                className="home__case-card"
                onClick={() => {
                  trackEvent('home_service_card_click', {
                    service_slug: project.slug,
                    card_position: index + 1,
                  })
                }}
              >
                <div className="home__case-media">
                  <img src={project.image} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="home__case-meta">
                  <h3>{project.title}</h3>
                  <p className={`home__case-copy ${styles.homeRedesign__cardCopy}`}>{project.subtext}</p>
                  <span className="home__case-cta">{project.cta}</span>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
        <div className="home__offer-actions">
          <LocalizedLink
            to="/contact"
            className="home__hero-cta"
            onClick={() => setTimeout(() => trackHomeCta(t('home.hero.primaryCta'), 'hero_primary'), 0)}
          >
            {t('home.hero.primaryCta')}
          </LocalizedLink>
          <LocalizedLink
            to="/portfolio"
            className="home__hero-cta home__hero-cta--ghost"
            onClick={() => setTimeout(() => trackHomeCta(t('home.hero.secondaryCta'), 'hero_secondary'), 0)}
          >
            {t('home.hero.secondaryCta')} →
          </LocalizedLink>
        </div>
      </section>

      <section className="home__section home__proof">
        <div className="home__proof-avatars">
          <div className="home__proof-avatar-stack" aria-hidden="true">
            {proofAvatars.map((avatar, idx) => (
              <img
                key={avatar}
                className="home__proof-avatar"
                src={avatar}
                alt=""
                loading="lazy"
                decoding="async"
                style={{ zIndex: proofAvatars.length - idx }}
              />
            ))}
          </div>
          <span className="home__proof-avatar-text">{t('home.proof.badge')}</span>
        </div>
        <h2>{t('home.proof.headline')}</h2>
        <p className={`home__proof-copy ${styles.homeRedesign__bodyCopy}`}>
          {t('home.proof.copy')}
        </p>
      </section>

      <section className="home__section home__cases" id="cases" ref={casesRef}>
        <span id="services" className="home__section-anchor" aria-hidden="true" />
        <div className="home__section-header">
          <p>{t('home.services.label')}</p>
          <h2>{t('home.services.headline')}</h2>
        </div>
        <div className="home__cases-grid">
          <div className="home__cases-row">
            {documentationTypes.map((project, index) => (
              <LocalizedLink
                key={project.title}
                to={project.link}
                className="home__case-card"
                onClick={() => {
                  trackEvent('home_service_card_click', {
                    service_slug: project.slug,
                    card_position: index + 1,
                  })
                }}
              >
                <div className="home__case-media">
                  <img src={project.image} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="home__case-meta">
                  <h3>{project.title}</h3>
                  <p className={`home__case-copy ${styles.homeRedesign__cardCopy}`}>{project.subtext}</p>
                  <span className="home__case-cta">{project.cta}</span>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="home__section home__cases home__last-projects" id="last-projects">
        <div className="home__section-header">
          <p>{t('home.lastProjects.label')}</p>
          <h2>{t('home.lastProjects.headline')}</h2>
        </div>
        <div className="home__cases-grid">
          <div className="home__cases-row home__cases-row--triple">
            {lastProjects.map((project, index) => (
              <LocalizedLink
                key={project.id}
                className="home__case-card"
                to={`/projects/${projectSlug(project.id)}`}
                onClick={() => {
                  trackEvent('home_last_project_click', {
                    project_id: project.id,
                    card_position: index + 1,
                  })
                }}
              >
                <div className="home__case-media">
                  <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
                </div>
                <div className="home__case-meta">
                  <h3>{project.title}</h3>
                  <p className={`home__case-copy ${styles.homeRedesign__cardCopy}`}>{project.subtext}</p>
                  <span className="home__case-cta">{t('home.lastProjects.cta')}</span>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="home__section home__process" id="process">
        <div className="home__process-header">
          <h2>{t('home.process.headline')}</h2>
          <p className={styles.homeRedesign__bodyCopy}>
            {t('home.process.intro')}
          </p>
        </div>
        <div className="home__process-grid">
          <article className="home__process-step">
            <h3>{t('home.process.steps.0.title')}</h3>
            <p>{t('home.process.steps.0.copy')}</p>
          </article>
          <article className="home__process-step">
            <h3>{t('home.process.steps.1.title')}</h3>
            <p>{t('home.process.steps.1.copy')}</p>
          </article>
          <article className="home__process-step">
            <h3>{t('home.process.steps.2.title')}</h3>
            <p>{t('home.process.steps.2.copy')}</p>
          </article>
        </div>
        <div className="home__proof-actions home__process-actions">
          <button
            type="button"
            onClick={() => {
              trackHomeCta(t('home.process.cta'), 'process_primary')
              navigate('/contact')
            }}
          >
            {t('home.process.cta')}
          </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default HomeV2
