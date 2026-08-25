import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import './HomeV2.css'
import '../pages/Portfolio.css'
import styles from './HomeRedesign.module.css'
import Footer from '../sections/Footer'
import { resolveImagePath } from '../utils/resolveImagePath'
import { serviceMeta } from '../data/serviceMeta'
import { trackEvent, useScrollDepthTracking, useTrackViewEvent } from '../utils/analytics'
import { smoothScrollTo } from '../utils/smoothScroll'
import { useLocale, useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import LocalizedLink from '../i18n/LocalizedLink'
import { SchemaOrg, SEOMeta } from '../components/SEOMeta'
import { useVideoLightbox } from '../hooks/useVideoLightbox'

// Set type to 'vimeo' or 'youtube' and replace id with the actual video ID
const HERO_VIDEO = {
  type: 'vimeo' as 'vimeo' | 'youtube',
  id: '1220567424',
  hash: '',
}

const MOBILE_HERO_VIDEO = {
  type: 'vimeo' as 'vimeo' | 'youtube',
  id: '1220568256',
  hash: '',
}

// How many seconds before the end to jump back to the start
const EARLY_LOOP_SECONDS = 1

function buildHeroVideoSrc(video: typeof HERO_VIDEO | typeof MOBILE_HERO_VIDEO): string {
  if (video.type === 'vimeo') {
    const hashParam = video.hash ? `h=${video.hash}&` : ''
    // loop=1 = native fallback; api=1 = enables postMessage for early-seek enhancement
    return `https://player.vimeo.com/video/${video.id}?${hashParam}background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&api=1`
  }
  return `https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`
}

const projectVisuals = [
  {
    slug: serviceMeta['exhibition-gallery'].slug,
    image: resolveImagePath('/src/assets/images/website/_incoming/homepage/services/exhibition-gallery/001.webp'),
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

const hiddenHomeServiceSlugs = new Set<string>()

const lastProjectsBase = [
  {
    id: 'v1',
    image: resolveImagePath('/src/assets/images/thumbs/portfolio/01/thumb_0.webp'),
    videoSrc: 'https://youtu.be/00OZBQL4W3Q',
  },
  {
    id: 'sanam',
    image: resolveImagePath('/src/assets/images/thumbs/portfolio/03/thumb_0.webp'),
    slideshowImages: [
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_001.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_002.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_003.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_004.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_005.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_006.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_007.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_008.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_009.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_010.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_011.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_012.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_013.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_014.webp'),
    ],
  },
  {
    id: 'v2',
    image: resolveImagePath('/src/assets/images/thumbs/portfolio/02/thumb_0.webp'),
    videoSrc:
      'https://www.youtube-nocookie.com/embed/DkruqulWupw?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0',
  },
]

const heroGalleryBase = [
  {
    id: 'thumb-exhibition',
    image: resolveImagePath('/src/assets/images/website/_incoming/homepage/hero-thumbs/exhibition-gallery/004.webp'),
    slug: 'exhibition-gallery',
    rotation: -4,
  },
  {
    id: 'thumb-brand',
    image: resolveImagePath('src/assets/images/landing/agency_hero_01.webp'),
    slug: 'brand-agency',
    rotation: -2,
  },
  {
    id: 'thumb-concerts',
    image: resolveImagePath('/src/assets/images/website/_incoming/homepage/hero-thumbs/concerts-events/DSC_4346.webp'),
    slug: 'concerts-events',
    rotation: 2,
  },
  {
    id: 'thumb-artist',
    image: resolveImagePath('/src/assets/images/website/_incoming/homepage/hero-thumbs/artist-sessions/001.webp'),
    slug: 'artist-sessions',
    rotation: 4,
  },
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
  const [mobileVideoReady, setMobileVideoReady] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  // Mirrors the CSS breakpoint that swaps --desktop/--mobile video sections
  // (HomeV2.css, max-width: 900px). CSS alone hides the inactive iframe but
  // doesn't reliably stop the browser from fetching its src, so gate mounting
  // in JS too — otherwise every visitor downloads both hero videos.
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => window.matchMedia('(max-width: 900px)').matches,
  )
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
  const mobileVideoIframeRef = useRef<HTMLIFrameElement | null>(null)
  const earlyLoopUnsubscribeRef = useRef<(() => void) | null>(null)

  useTrackViewEvent('home_view')
  useScrollDepthTracking('home', [25, 50, 75, 90])

  const { openVideo, modal: videoModal } = useVideoLightbox(rootRef)

  const projects = useMemo(
    () =>
      projectVisuals
        .filter((project) => !hiddenHomeServiceSlugs.has(project.slug))
        .map((project) => ({
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
        return {
          ...project,
          title,
          subtext,
          thumb: project.image,
          description: subtext,
          year: '2025',
          location: 'Berlin',
        }
      }),
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

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 900px)')
    const handleChange = (event: MediaQueryListEvent) => setIsMobileViewport(event.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => () => earlyLoopUnsubscribeRef.current?.(), [])

  // Reveal video: fires on iframe load + 600ms buffer, with 3s absolute fallback
  useEffect(() => {
    const fallback = setTimeout(() => setVideoReady(true), 3000)
    return () => clearTimeout(fallback)
  }, [])

  useEffect(() => {
    const fallback = setTimeout(() => setMobileVideoReady(true), 3000)
    return () => clearTimeout(fallback)
  }, [])

  const handleVideoLoad = () => {
    setTimeout(() => setVideoReady(true), 600)
    subscribeVimeoEarlyLoop()
  }

  const handleMobileVideoLoad = () => {
    setTimeout(() => setMobileVideoReady(true), 600)
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

    // Guards against handleVideoLoad firing more than once (e.g. the iframe
    // reloading after a network hiccup) leaving stale listeners attached.
    earlyLoopUnsubscribeRef.current?.()

    let seeking = false

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://player.vimeo.com') return

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
    earlyLoopUnsubscribeRef.current = () => window.removeEventListener('message', onMessage)
  }

  const handleScroll = (id: string) => {
    smoothScrollTo(id, 500, 72)
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
        const mobileHeroItems = gsap.utils.toArray<HTMLElement>('.home__hero-title, .home__hero-gallery--mobile .home__hero-thumb-image, .home__hero-subhead, .home__hero-cta')

        const mobileTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.home__hero',
            start: 'top 82%',
            end: 'top 20%',
            scrub: 0.9,
          },
        })

        mobileTimeline
          .fromTo(
            '.home__hero-title',
            { opacity: 0, y: 34, filter: 'blur(6px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.82, ease: 'sine.out' },
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
              duration: 0.72,
              ease: 'sine.out',
              stagger: 0.06,
            },
            0.48,
          )
          .fromTo(
            ['.home__hero-subhead', '.home__hero-cta'],
            { opacity: 0, y: 24, filter: 'blur(5px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.68, ease: 'sine.out', stagger: 0.1 },
            1.08,
          )

        gsap.to(mobileHeroItems, {
          opacity: 0,
          y: -18,
          filter: 'blur(4px)',
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: '.home__hero',
            start: 'bottom 38%',
            end: 'bottom 8%',
            scrub: 0.65,
          },
        })
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

      // Cases — quick staged entrance. Two sections share these classnames for
      // styling (Documentation Types + Last Projects), so every selector here
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
        const note = section.querySelector<HTMLElement>('.home__section-note')

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

        // Note fades in below the cards
        if (note) {
          gsap.fromTo(
            note,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              ease: 'sine.inOut',
              scrollTrigger: {
                trigger: note,
                start: 'top 94%',
                end: 'top 72%',
                scrub: 0.55,
              },
            },
          )
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
        ogTitle="Concert & Exhibition Documentation Berlin | expose.u"
        canonical="https://expose-u.com/"
        lang={locale}
      />
      <SchemaOrg data={HOME_SCHEMA} />
      <div className="home__background" aria-hidden="true" />
      <div className="home__floaters" aria-hidden="true" />

      {/* Fullscreen video hero — desktop only */}
      <section className="home__video-hero home__video-hero--desktop" aria-label="Background video">
        <div className="home__video-iframe-wrap" aria-hidden="true">
          {!isMobileViewport && (
            <iframe
              ref={videoIframeRef}
              src={buildHeroVideoSrc(HERO_VIDEO)}
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Hero background video"
              tabIndex={-1}
              onLoad={handleVideoLoad}
            />
          )}
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
        {!isMobileViewport && HERO_VIDEO.type === 'vimeo' && (
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

      {/* Fullscreen video hero — mobile only */}
      <section className="home__video-hero home__video-hero--mobile" aria-label="Background video">
        <div className="home__video-iframe-wrap home__video-iframe-wrap--mobile" aria-hidden="true">
          {isMobileViewport && (
            <iframe
              ref={mobileVideoIframeRef}
              src={buildHeroVideoSrc(MOBILE_HERO_VIDEO)}
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Mobile hero background video"
              tabIndex={-1}
              onLoad={handleMobileVideoLoad}
            />
          )}
        </div>
        <div className="home__video-overlay" />
        <div className={`home__video-blind${mobileVideoReady ? ' home__video-blind--gone' : ''}`} aria-hidden="true" />
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
                >
                  <div className="home__hero-thumb-image">
                    <img src={thumb.image} alt="" />
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

      <section className="home__section home__cases home__last-projects" id="last-projects">
        <div className="home__section-header">
          <p>{t('home.lastProjects.label')}</p>
          <h2>{t('home.lastProjects.headline')}</h2>
        </div>
        <div className="home__cases-grid">
          <div className="home__cases-row home__cases-row--triple">
            {lastProjects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                className="home__case-card"
                onClick={() => {
                  trackEvent('home_last_project_click', {
                    project_id: project.id,
                    card_position: index + 1,
                  })
                  openVideo(project)
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
              </button>
            ))}
          </div>
        </div>
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
          <LocalizedLink
            to="/portfolio"
            className="home__process-secondary"
            onClick={() => trackHomeCta(t('home.project.seeLatestWork'), 'process_secondary')}
          >
            {t('home.project.seeLatestWork')}
          </LocalizedLink>
        </div>
      </section>

      <Footer />
      {videoModal}
    </main>
  )
}

export default HomeV2
