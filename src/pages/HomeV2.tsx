import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import './HomeV2.css'
import styles from './HomeRedesign.module.css'
import Footer from '../sections/Footer'
import { resolveImagePath } from '../utils/resolveImagePath'
import { serviceMeta } from '../data/serviceMeta'
import { trackEvent, useScrollDepthTracking, useTrackViewEvent } from '../utils/analytics'
import { smoothScrollTo } from '../utils/smoothScroll'
import { useLocale, useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import LocalizedLink from '../i18n/LocalizedLink'
import { SchemaOrg, SEOMeta } from '../components/SEOMeta'

// Set type to 'vimeo' or 'youtube' and replace id with the actual video ID
const HERO_VIDEO = {
  type: 'vimeo' as 'vimeo' | 'youtube',
  id: '1191974727',
  hash: '',
}

// How many seconds before the end to jump back to the start
const EARLY_LOOP_SECONDS = 1

function buildHeroVideoSrc(video: typeof HERO_VIDEO): string {
  if (video.type === 'vimeo') {
    const hashParam = video.hash ? `h=${video.hash}&` : ''
    // loop=1 = native fallback; api=1 = enables postMessage for early-seek enhancement
    return `https://player.vimeo.com/video/${video.id}?${hashParam}background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&api=1`
  }
  return `https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`
}

const projectVisuals = [
  {
    slug: serviceMeta['concerts-events'].slug,
    image: resolveImagePath('/src/assets/images/website/performances/thumb_3_086.jpg'),
    link: serviceMeta['concerts-events'].href,
  },
  {
    slug: serviceMeta['exhibition-gallery'].slug,
    image: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_030.png'),
    link: serviceMeta['exhibition-gallery'].href,
  },
  {
    slug: serviceMeta['artist-sessions'].slug,
    image: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.png'),
    link: serviceMeta['artist-sessions'].href,
  },
  {
    slug: serviceMeta['brand-agency'].slug,
    image: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_011.jpeg'),
    link: serviceMeta['brand-agency'].href,
  },
]

const heroGalleryBase = [
  {
    id: 'thumb-concerts',
    image: resolveImagePath('/src/assets/images/website/performances/thumb_3_033.jpg'),
    slug: 'concerts-events',
    rotation: -4,
  },
  {
    id: 'thumb-exhibition',
    image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/1_ED_055.png'),
    slug: 'exhibition-gallery',
    rotation: -2,
  },
  {
    id: 'thumb-artist',
    image: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.png'),
    slug: 'artist-sessions',
    rotation: 2,
  },
  {
    id: 'thumb-brand',
    image: resolveImagePath('/src/assets/images/website/fashion/thumb_3_081.jpg'),
    slug: 'brand-agency',
    rotation: 4,
  },
]

const proofAvatars = [
  resolveImagePath('/src/assets/images/website/artists/thumb_3_052.jpg'),
  resolveImagePath('/src/assets/images/website/artists/thumb_3_060.jpg'),
  resolveImagePath('/src/assets/images/website/fashion/thumb_3_057.jpg'),
  resolveImagePath('/src/assets/images/website/performances/thumb_3_086.jpg'),
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
    sameAs: ['https://instagram.com/xposeu_official'],
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
  const [videoReady, setVideoReady] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const location = useLocation()
  const [mobileLayout, setMobileLayout] = useState({
    card: 160,
    outer: 160,
    inner: 90,
    yOuter: 26,
    yInner: 12,
  })
  const rootRef = useRef<HTMLElement | null>(null)
  const casesRef = useRef<HTMLElement | null>(null)
  const mobileHeroRef = useRef<HTMLDivElement | null>(null)
  const galleryRef = useRef<HTMLDivElement | null>(null)
  const tiltX = useRef<((value: number) => void) | null>(null)
  const tiltY = useRef<((value: number) => void) | null>(null)
  const videoIframeRef = useRef<HTMLIFrameElement | null>(null)

  useTrackViewEvent('home_view')
  useScrollDepthTracking('home', [25, 50, 75, 90])

  const projects = useMemo(
    () =>
      projectVisuals.map((project) => ({
        ...project,
        title: t(`home.services.cards.${project.slug}.title`),
        subtext: t(`home.services.cards.${project.slug}.subtext`),
        cta: t(`home.services.cards.${project.slug}.cta`),
      })),
    [t],
  )

  const heroGallery = useMemo(
    () =>
      heroGalleryBase.map((item) => ({
        ...item,
        label: t(`home.services.cards.${item.slug}.title`),
      })),
    [t],
  )

  const heroServices = useMemo(
    () =>
      projects.map((project, index) => ({
        id: `service-thumb-${project.slug}`,
        image: project.image,
        label: project.title,
        rotation: [-4, 2, -1, 3, -2, 4][index % 6],
        index,
      })),
    [projects],
  )

  const mobileHeroStack = useMemo(() => {
    const extraThumb = heroGallery[0]

    return [
      ...heroServices,
      {
        id: `mobile-extra-${extraThumb.id}`,
        image: extraThumb.image,
        label: extraThumb.label,
        rotation: 3,
        index: heroServices.length,
      },
    ]
  }, [heroGallery, heroServices])

  // Reveal video: fires on iframe load + 600ms buffer, with 3s absolute fallback
  useEffect(() => {
    const fallback = setTimeout(() => setVideoReady(true), 3000)
    return () => clearTimeout(fallback)
  }, [])

  const handleVideoLoad = () => {
    setTimeout(() => setVideoReady(true), 600)
    subscribeVimeoEarlyLoop()
  }

  const toggleMute = () => {
    const iframe = videoIframeRef.current
    if (!iframe?.contentWindow) return
    if (isMuted) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ method: 'setVolume', value: 1 }),
        'https://player.vimeo.com',
      )
    } else {
      iframe.contentWindow.postMessage(
        JSON.stringify({ method: 'setVolume', value: 0 }),
        'https://player.vimeo.com',
      )
    }
    setIsMuted((prev) => !prev)
  }

  // Early-loop via Vimeo postMessage API.
  // Called from handleVideoLoad so the iframe ref is guaranteed to be populated.
  // loop=1 in the URL is the safety net — this just makes the loop start earlier.
  const subscribeVimeoEarlyLoop = () => {
    if (HERO_VIDEO.type !== 'vimeo') return
    const iframe = videoIframeRef.current
    if (!iframe) return

    let seeking = false

    const onMessage = (event: MessageEvent) => {
      if (!event.origin.includes('vimeo.com')) return

      let data: Record<string, unknown>
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      } catch {
        return
      }

      if (data.event === 'ready') {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ method: 'addEventListener', value: 'timeupdate' }),
          'https://player.vimeo.com',
        )
      }

      if (data.event === 'timeupdate') {
        const payload = data.data as { seconds: number; duration: number }
        if (!payload || typeof payload.duration !== 'number') return
        const remaining = payload.duration - payload.seconds

        if (!seeking && payload.duration > 0 && remaining <= EARLY_LOOP_SECONDS) {
          seeking = true
          iframe.contentWindow?.postMessage(
            JSON.stringify({ method: 'seekTo', value: 0 }),
            'https://player.vimeo.com',
          )
          setTimeout(() => { seeking = false }, 1000)
        }
      }
    }

    window.addEventListener('message', onMessage)
    // Cleanup is intentionally not returned here because handleVideoLoad
    // is called once; the listener is cheap and lives for the page lifetime.
  }

  const handleScroll = (id: string) => {
    smoothScrollTo(id, 500, 72)
  }

  const handleHeroCardClick = () => {
    handleScroll('#cases')
  }

  const handleHeroCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleScroll('#cases')
    }
  }

  const navLinks = useMemo(
    () => ({
      left: [
        { id: 'home', label: t('nav.home'), onClick: () => handleScroll('#hero') },
        { id: 'services', label: t('nav.services'), onClick: () => handleScroll('#cases') },
      ],
      right: [
        { id: 'about', label: t('nav.about'), onClick: () => navigate('/about') },
        { id: 'contact', label: t('nav.contact'), onClick: () => navigate('/contact') },
      ],
    }),
    [navigate, t],
  )

  const handleGalleryMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!galleryRef.current || !tiltX.current || !tiltY.current) return
    const bounds = galleryRef.current.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 6
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6
    tiltX.current(x)
    tiltY.current(-y)
  }

  const resetTilt = () => {
    tiltX.current?.(0)
    tiltY.current?.(0)
  }

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

      if (galleryRef.current) {
        tiltX.current = gsap.quickTo(galleryRef.current, '--hero-tilt-x', { duration: 0.45, ease: 'power3.out' })
        tiltY.current = gsap.quickTo(galleryRef.current, '--hero-tilt-y', { duration: 0.45, ease: 'power3.out' })
      }

      if (isMobile) {
        const mobileThumbImages = gsap.utils.toArray<HTMLElement>('.home__hero-gallery--mobile .home__hero-thumb-image')
        const mobileTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.home__hero',
            start: 'top 82%',
            end: 'top 8%',
            scrub: 1.4,
          },
        })

        mobileTimeline
          .fromTo(
            '.home__hero-title',
            { opacity: 0, y: 34, filter: 'blur(6px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'sine.inOut' },
          )
          .fromTo(
            mobileThumbImages,
            { opacity: 0, y: 36, scale: 0.82, rotate: -6, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotate: 0,
              filter: 'blur(0px)',
              duration: 0.95,
              ease: 'sine.inOut',
              stagger: 0.08,
            },
            0.75,
          )
          .fromTo(
            ['.home__hero-subhead', '.home__hero-cta'],
            { opacity: 0, y: 24, filter: 'blur(5px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'sine.inOut', stagger: 0.12 },
            1.58,
          )
      } else {
        // Hero section — scrub-based sequence, animates in/out with scroll direction.
        // start: 'top bottom' begins as soon as hero enters from below the viewport.
        // end: 'top 15%'  completes once the section is fully visible — so clicking
        // the scroll button (which lands hero.top near 0%) always shows full content.
        const heroThumbs = gsap.utils.toArray<HTMLElement>('.home__hero-gallery--desktop .home__hero-thumb')
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.home__hero',
            start: 'top bottom',
            end: 'top 15%',
            scrub: 2,
          },
        })

        heroTimeline.fromTo(
          '.home__hero-title',
          { opacity: 0, y: 44, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'sine.inOut' },
        )

        const yOffsets = [48, 40, 56, 44, 52]
        const xOffsets = [-6, 5, 0, 7, -4]
        const cardStart = 0.9
        gsap.utils.shuffle(heroThumbs).forEach((el, i) => {
          el.style.transition = 'none'
          const image = el.querySelector<HTMLElement>('.home__hero-thumb-image')
          const caption = el.querySelector<HTMLElement>('figcaption')
          const targets = [image, caption].filter(Boolean) as HTMLElement[]

          heroTimeline.fromTo(
            targets.length ? targets : el,
            {
              opacity: 0,
              y: yOffsets[i % yOffsets.length],
              x: xOffsets[i % xOffsets.length],
              scale: 0.96,
              rotate: [-0.8, 0.6, -0.4, 0.8, -0.5][i % 5],
              filter: 'blur(5px)',
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              rotate: 0,
              filter: 'blur(0px)',
              duration: 1.1,
              ease: 'sine.inOut',
              onComplete: () => { el.style.transition = '' },
            },
            cardStart + i * 0.16,
          )
        })

        heroTimeline
          .fromTo(
            '.home__hero-subhead',
            { opacity: 0, y: 28, filter: 'blur(5px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'sine.inOut' },
            cardStart + heroThumbs.length * 0.16 + 0.4,
          )
          .fromTo(
            '.home__hero-cta',
            { opacity: 0, y: 20, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'sine.inOut' },
            '>-0.1',
          )
      }

      // Cases — scrub-based, animates in and out with scroll direction.
      const cards = gsap.utils.toArray<HTMLElement>('.home__case-card')
      const casesHeaderItems = gsap.utils.toArray<HTMLElement>('.home__cases .home__section-header > *')
      const casesNote = document.querySelector('.home__section-note')

      // Header fades in with scrub
      gsap.fromTo(
        casesHeaderItems,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: '.home__cases',
            start: 'top 82%',
            end: 'top 36%',
            scrub: 1.6,
          },
        },
      )

      // Each card arrives from a unique direction for visual interest
      const cardMotion = [
        { y: 52, x: -16, rotate: -2.5 },
        { y: 52, x: 16, rotate: 2.5 },
        { y: 64, x: -10, rotate: -1.8 },
        { y: 64, x: 10, rotate: 1.8 },
      ]
      cards.forEach((card, i) => {
        const { y, x, rotate } = cardMotion[i % cardMotion.length]
        gsap.fromTo(
          card,
          { opacity: 0, y, x, scale: 0.94, rotate, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotate: 0,
            filter: 'blur(0px)',
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 48%',
              scrub: 1.1,
            },
          },
        )
      })

      // Note fades in below the cards
      if (casesNote) {
        gsap.fromTo(
          casesNote,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: casesNote,
              start: 'top 90%',
              end: 'top 50%',
              scrub: 1.4,
            },
          },
        )
      }

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
              duration: 1.15,
              stagger: 0.16,
              ease: 'power2.out',
            })

          if (avatarText) {
            avatarMotion.to(
              avatarText,
              {
                opacity: 1,
                x: 0,
                duration: 0.9,
                ease: 'power2.out',
              },
              0.12,
            )
          }

          gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              end: 'bottom 18%',
              onEnter: () => avatarMotion.restart(true),
              onEnterBack: () => avatarMotion.restart(true),
              onLeaveBack: () => avatarMotion.pause(0),
            },
          })
        }

        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
              end: 'top 32%',
              scrub: 1.2,
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
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: processSection,
              start: 'top 78%',
              end: 'top 30%',
              scrub: 1.2,
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

  useEffect(() => {
    const node = mobileHeroRef.current
    if (!node) return undefined

    const updateLayout = () => {
      const width = node.getBoundingClientRect().width || window.innerWidth
      const card = Math.min(240, Math.max(168, width * 0.44))
      const outer = Math.round(card * 1.0)
      const inner = Math.round(card * 0.55)
      const yOuter = Math.round(Math.abs(outer) * 0.16)
      const yInner = Math.round(Math.abs(inner) * 0.14)

      setMobileLayout({ card, outer, inner, yOuter, yInner })
    }

    updateLayout()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => updateLayout())
      observer.observe(node)
      return () => observer.disconnect()
    }

    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  return (
    <main className="home home--v2" ref={rootRef} id="main">
      <SEOMeta
        title="Berlin Photo & Video Documentation"
        description="Photo and video documentation for concerts, exhibitions, and live events in Berlin. Serving galleries, artists, venues, and agencies."
        ogTitle="expose.u — Concert & Exhibition Documentation, Berlin"
        canonical="https://expose-u.com/"
        lang={locale}
      />
      <SchemaOrg data={HOME_SCHEMA} />
      <div className="home__background" aria-hidden="true" />
      <div className="home__floaters" aria-hidden="true" />

      {/* Fullscreen video hero — desktop only */}
      <section className="home__video-hero" aria-hidden="true">
        <div className="home__video-iframe-wrap">
          <iframe
            ref={videoIframeRef}
            src={buildHeroVideoSrc(HERO_VIDEO)}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Hero background video"
            onLoad={handleVideoLoad}
          />
        </div>
        <div className="home__video-overlay" />
        <div className={`home__video-blind${videoReady ? ' home__video-blind--gone' : ''}`} aria-hidden="true" />
        <button
          className="home__video-scroll-hint"
          type="button"
          aria-label={t('home.hero.scrollAria')}
          onClick={() => handleScroll('#hero')}
        >
          <span>{t('home.hero.scroll')}</span>
        </button>
        {HERO_VIDEO.type === 'vimeo' && (
          <button
            className="home__video-mute-btn"
            type="button"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            onClick={toggleMute}
          >
            {isMuted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        )}
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

      <header className="home__section home__hero" id="hero">
        <div className="home__hero-body">
          <h1 className="home__hero-title">
            {t('home.hero.headline')}
          </h1>
          <div
            className="home__hero-gallery home__hero-gallery--desktop"
            ref={galleryRef}
            onMouseMove={handleGalleryMouseMove}
            onMouseLeave={resetTilt}
          >
            {heroGallery.map((thumb) => (
              <figure
                key={thumb.id}
                className="home__hero-thumb"
                data-rotation={thumb.rotation}
                style={{ '--thumb-rotation': `${thumb.rotation}deg` } as CSSProperties}
                role="button"
                tabIndex={0}
                onClick={handleHeroCardClick}
                onKeyDown={handleHeroCardKeyDown}
              >
                <div className="home__hero-thumb-image">
                  <img src={thumb.image} alt={thumb.label} />
                </div>
                <figcaption>
                  <strong>{thumb.label}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
          <div
            className="home__hero-gallery home__hero-gallery--mobile"
            aria-hidden="true"
            ref={mobileHeroRef}
            style={{ '--mobile-card': `${mobileLayout.card}px` } as CSSProperties}
          >
            {mobileHeroStack.map((thumb, index) => {
              const configs = [
                { x: -mobileLayout.outer, y: mobileLayout.yOuter + 8, rotate: -24, scale: 0.78, z: 1, opacity: 0.55, blur: 1.5 },
                { x: -mobileLayout.inner, y: mobileLayout.yInner, rotate: -12, scale: 0.96, z: 2, opacity: 0.85, blur: 0.6 },
                { x: 0, y: -4, rotate: 0, scale: 1.18, z: 3, opacity: 1, blur: 0 },
                { x: mobileLayout.inner, y: mobileLayout.yInner, rotate: 12, scale: 0.96, z: 2, opacity: 0.85, blur: 0.6 },
                { x: mobileLayout.outer, y: mobileLayout.yOuter + 8, rotate: 24, scale: 0.78, z: 1, opacity: 0.55, blur: 1.5 },
              ]
              const config = configs[index] ?? configs[2]
              const stackShift = Math.round(mobileLayout.card * 0.22)
              const x = config.x - stackShift
              const y = config.y - 20

              const style: CSSProperties = {
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${config.scale}) rotate(${config.rotate}deg)`,
                zIndex: config.z,
                opacity: config.opacity,
                filter: `blur(${config.blur}px)`,
              }

              return (
                <figure
                  key={thumb.id}
                  className="home__hero-thumb"
                  data-rotation={thumb.rotation}
                  style={style}
                  role="button"
                  tabIndex={0}
                  onClick={handleHeroCardClick}
                  onKeyDown={handleHeroCardKeyDown}
                >
                  <div className="home__hero-thumb-image">
                    <img src={thumb.image} alt={thumb.label} />
                  </div>
                  <figcaption>
                    <strong>{thumb.label}</strong>
                  </figcaption>
                </figure>
              )
            })}
          </div>
          <p className="home__hero-subhead">
            {t('home.hero.subhead')}
          </p>
          <div className="home__actions">
            <LocalizedLink
              to="/contact"
              className="home__hero-cta"
              onClick={() => trackHomeCta(t('home.hero.primaryCta'), 'hero_primary')}
            >
              {t('home.hero.primaryCta')}
            </LocalizedLink>
          </div>
        </div>
      </header>

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
            {projects.map((project, index) => (
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
                  <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
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
        <p className="home__section-note">
          {t('home.services.needHelp')} <LocalizedLink to="/contact">{t('home.services.contactUs')}</LocalizedLink>.
        </p>
      </section>

      <section className="home__section home__process" id="process">
        <div className="home__process-header">
          <h2>{t('home.process.headline')}</h2>
          <p className={styles.homeRedesign__bodyCopy}>
            {t('home.project.copy')}
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
              trackHomeCta(t('home.project.requestAvailability'), 'process_primary')
              navigate('/contact')
            }}
          >
            {t('home.project.requestAvailability')}
          </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default HomeV2
