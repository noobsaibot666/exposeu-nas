import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent, WheelEvent } from 'react'
import './Portfolio.css'
import { resolveImagePath } from '../utils/resolveImagePath'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { serviceMeta } from '../data/serviceMeta'
import { useLocale, useLocaleNavigate, useLocalePath, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

type VideoItem = {
  id: string
  title: string
  description: string
  context: string
  outcome: string
  year: string
  location: string
  thumb: string
  videoSrc?: string
  slideshowImages?: string[]
  tag?: string
  cta?: string
}

type OfferItem = {
  id: string
  title: string
  blurb: string
  link: string
  cta: string
  accent: string
  background: string
}

const videos: VideoItem[] = [
  {
    id: 'v1',
    title: 'Lick the walls to understand echoes',
    description: 'Audio-reactive installation with immersive sound and visuals.',
    context: 'captured sound-based installation',
    outcome: 'delivered press stills + archive set',
    year: '2025',
    location: 'Berlin',
    thumb: resolveImagePath('/src/assets/images/thumbs/portfolio/01/thumb_0.jpg'),
    videoSrc: 'https://youtu.be/00OZBQL4W3Q',
    tag: 'Live Event',
    cta: 'Watch',
  },
  {
    id: 'v2',
    title: 'Abigail Toll - IDOL - Silent Green',
    description: 'Music performance captured at Silent Green, Berlin.',
    context: 'covered venue performance night',
    outcome: 'delivered recap film + promo stills',
    year: '2025',
    location: 'Berlin',
    thumb: resolveImagePath('/src/assets/images/thumbs/portfolio/02/thumb_0.jpg'),
    videoSrc:
      'https://www.youtube-nocookie.com/embed/DkruqulWupw?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0',
    tag: 'Live Event',
    cta: 'Watch',
  },
  {
    id: 'v5',
    title: 'Boogarins Band',
    description: 'A still-driven visual story built from live session captures.',
    context: 'documented live session for touring band',
    outcome: 'delivered release stills + short clips',
    year: '2025',
    location: 'Brazil',
    thumb: resolveImagePath('/src/assets/images/thumbs/portfolio/band/Hero.jpg'),
    slideshowImages: [
      resolveImagePath('/src/assets/images/thumbs/portfolio/band/band_001.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/band/band_002.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/band/band_003.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/band/band_004.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/band/band_005.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/band/band_006.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/band/band_007.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/band/band_008.jpg'),
    ],
    tag: 'Concert',
    cta: 'View',
  },
  {
    id: 'sanam',
    title: 'SANAM — Silent Green Berlin',
    description: 'Full concert documentation at the Betonhalle. Stage, crowd, atmosphere — built for press and social.',
    context: 'press & film documentation, Betonhalle at Silent Green',
    outcome: 'press stills + social media content — delivered',
    year: '2025',
    location: 'Berlin',
    thumb: resolveImagePath('/src/assets/images/thumbs/portfolio/03/thumb_0.jpg'),
    slideshowImages: [
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_001.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_002.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_003.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_004.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_005.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_006.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_007.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_008.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_009.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_010.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_011.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_012.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_013.jpg'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/03/sanam_014.jpg'),
    ],
    tag: 'Concert',
    cta: 'View',
  },
  {
    id: 'placeholder-02',
    title: 'Portfolio preview 02',
    description: 'Placeholder project preview. Final media and copy to be added.',
    context: 'placeholder portfolio entry',
    outcome: 'ready for image or video content',
    year: '2026',
    location: 'Berlin',
    thumb: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.png'),
    slideshowImages: [resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.png')],
    tag: 'Preview',
    cta: 'Preview',
  },
  {
    id: 'placeholder-03',
    title: 'Portfolio preview 03',
    description: 'Placeholder project preview. Final media and copy to be added.',
    context: 'placeholder portfolio entry',
    outcome: 'ready for image or video content',
    year: '2026',
    location: 'Berlin',
    thumb: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_011.jpeg'),
    slideshowImages: [resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_011.jpeg')],
    tag: 'Preview',
    cta: 'Preview',
  },
]

const offers: OfferItem[] = [
  {
    id: 'offer-exhibition',
    title: serviceMeta['exhibition-gallery'].label,
    blurb: '',
    link: '/contact?type=exhibition',
    cta: '',
    accent: '#ffffffff',
    background: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_030.png'),
  },
  {
    id: 'offer-session',
    title: serviceMeta['artist-sessions'].label,
    blurb: '',
    link: '/contact?type=artist-session',
    cta: '',
    accent: '#c4b5fd',
    background: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.png'),
  },
  {
    id: 'offer-performance',
    title: serviceMeta['concerts-events'].label,
    blurb: '',
    link: '/contact?type=concert',
    cta: '',
    accent: '#fca5a5',
    background: resolveImagePath('/src/assets/images/website/performances/thumb_3_086.jpg'),
  },
  {
    id: 'offer-brand',
    title: serviceMeta['brand-agency'].label,
    blurb: '',
    link: '/contact?type=brand-event',
    cta: '',
    accent: '#c7d2fe',
    background: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_011.jpeg'),
  },
]

function Portfolio() {
  const navigate = useLocaleNavigate()
  const { locale } = useLocale()
  const localizePath = useLocalePath()
  const { t, tm } = useTranslation()
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<HTMLElement | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false, pointerId: 0 })

  const videoTranslations = tm<Array<Pick<VideoItem, 'id' | 'title' | 'description' | 'context' | 'outcome' | 'tag' | 'cta'>>>('portfolio.videos')
  const proofItems = tm<string[]>('portfolio.proofStrip')
  const localizedVideos = useMemo(
    () => videos.map((video) => ({ ...video, ...(videoTranslations.find((entry) => entry.id === video.id) ?? {}) })),
    [videoTranslations],
  )

  const localizedOffers = useMemo(
    () =>
      offers.map((offer) => ({
        ...offer,
        title:
          offer.id === 'offer-exhibition'
            ? t(serviceMeta['exhibition-gallery'].labelKey)
            : offer.id === 'offer-session'
              ? t(serviceMeta['artist-sessions'].labelKey)
              : offer.id === 'offer-performance'
                ? t(serviceMeta['concerts-events'].labelKey)
                : t(serviceMeta['brand-agency'].labelKey),
        blurb: t(`portfolio.offers.cards.${offer.id}.blurb`),
        cta: t('portfolio.offers.cta'),
      })),
    [t],
  )

  const navLinks = useMemo(
    () => ({
      left: [
        { id: 'home', label: t('nav.home'), onClick: () => navigate('/') },
        { id: 'services', label: t('nav.services'), href: '/#cases' },
      ],
      right: [
        { id: 'about', label: t('nav.about'), onClick: () => navigate('/about') },
        { id: 'contact', label: t('nav.contact'), onClick: () => navigate('/contact') },
      ],
    }),
    [navigate, t],
  )




  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(max-width: 600px)')
    const update = () => setIsMobile(media.matches)
    update()
    if (media.addEventListener) {
      media.addEventListener('change', update)
    } else {
      media.addListener(update)
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', update)
      } else {
        media.removeListener(update)
      }
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.from('.portfolio__nav', { opacity: 0, y: -12, duration: 0.6, ease: 'power2.out' })

      const heroItems = gsap.utils.toArray<HTMLElement>('.portfolio__hero-inner > *')
      gsap.from(heroItems, {
        opacity: 0,
        y: 22,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
      })

      gsap.fromTo(
        '.portfolio__card',
        {
          opacity: 0,
          y: 56,
          scale: 0.96,
          rotateX: 6,
          transformOrigin: 'center center',
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.95,
          stagger: { each: 0.08, from: 'start' },
          ease: 'power2.inOut',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: '.portfolio__gallery',
            start: 'top 80%',
          },
        },
      )

      const offerItems = gsap.utils.toArray<HTMLElement>('.portfolio__offers-copy > *')
      gsap.from(offerItems, {
        y: 18,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.portfolio__offers',
          start: 'top 85%',
        },
      })

    }, rootRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!activeVideo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.portfolio__overlay',
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' },
      )
      gsap.fromTo(
        '.portfolio__modal',
        { opacity: 0, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.portfolio__player',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.05 },
      )
    }, rootRef)

    return () => ctx.revert()
  }, [activeVideo])

  useEffect(() => {
    if (!activeVideo) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Auto-focus close button
    requestAnimationFrame(() => {
      const closeBtn = document.querySelector<HTMLElement>('.portfolio__close')
      closeBtn?.focus()
    })
    return () => {
      document.body.style.overflow = previousOverflow
      // Restore focus to the element that opened the modal
      requestAnimationFrame(() => openerRef.current?.focus())
    }
  }, [activeVideo])

  const openVideo = useCallback((video: VideoItem) => {
    openerRef.current = document.activeElement as HTMLElement
    setSlideIndex(0)
    setSlideDirection(1)
    setActiveVideo(video)
  }, [])

  useEffect(() => {
    if (!activeVideo) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveVideo(null)
        return
      }

      if (!activeVideo.slideshowImages || activeVideo.slideshowImages.length === 0) return
      const total = activeVideo.slideshowImages.length

      if (event.key === 'ArrowLeft') {
        setSlideDirection(-1)
        setSlideIndex((prev) => (prev - 1 + total) % total)
      }

      if (event.key === 'ArrowRight') {
        setSlideDirection(1)
        setSlideIndex((prev) => (prev + 1) % total)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeVideo])

  // Focus trap: cycle Tab within the modal overlay
  useEffect(() => {
    if (!activeVideo) return
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const overlay = document.querySelector<HTMLElement>('.portfolio__overlay')
      if (!overlay) return
      const focusable = overlay.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [activeVideo])

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const grid = gridRef.current
    if (!grid || grid.scrollWidth <= grid.clientWidth) return

    const maxScroll = grid.scrollWidth - grid.clientWidth
    if (maxScroll <= 0) return

    // Convert vertical wheel motion into horizontal scrolling inside the card rail,
    // but let the page scroll if we are already at an edge.
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      const current = grid.scrollLeft
      const next = Math.min(maxScroll, Math.max(0, current + event.deltaY * 1.1))
      if (next !== current) {
        event.preventDefault()
        event.stopPropagation()
        grid.scrollTo({ left: next, behavior: 'smooth' })
      }
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const grid = gridRef.current
    if (!grid || event.button !== 0 || grid.scrollWidth <= grid.clientWidth) return

    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: grid.scrollLeft,
      moved: false,
      pointerId: event.pointerId,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || !gridRef.current) return
    const deltaX = event.clientX - dragState.current.startX
    if (Math.abs(deltaX) > 8) {
      if (!dragState.current.moved) {
        dragState.current.moved = true
        setIsDragging(true)
        gridRef.current.setPointerCapture(dragState.current.pointerId)
      }
    }
    gridRef.current.scrollLeft = dragState.current.scrollLeft - deltaX
  }

  const stopDragging = () => {
    const grid = gridRef.current
    if (!grid || !dragState.current.active) return
    dragState.current.active = false
    if (dragState.current.pointerId) {
      grid.releasePointerCapture(dragState.current.pointerId)
    }
    setIsDragging(false)
  }

  const getEmbedSrc = (src: string) => {
    const youTubeMatch = src.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([^?&/]+)/i,
    )
    if (youTubeMatch) {
      return `https://www.youtube-nocookie.com/embed/${youTubeMatch[1]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0`
    }

    const vimeoMatch = src.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0`
    }

    return null
  }

  const displayVideos = useMemo(() => {
    if (!isMobile) return localizedVideos
    const filtered = localizedVideos.filter((video) => video.id !== 'v4')
    const boogarins = filtered.find((video) => video.id === 'v5')
    const rest = filtered.filter((video) => video.id !== 'v5')
    return boogarins ? [...rest, boogarins] : rest
  }, [isMobile, localizedVideos])

  return (
    <main className="portfolio" ref={rootRef} id="main">
      <SEOMeta
        title="Portfolio"
        description="Selected documentation work by expose.u — concerts at Silent Green, gallery exhibitions, and artist sessions in Berlin."
        ogTitle="Portfolio — expose.u"
        ogDescription="Eight concerts at Silent Green. Gallery exhibitions. Artist sessions. Selected work from Berlin."
        canonical="https://expose-u.com/portfolio"
        lang={locale}
      />
      <div className="portfolio__nav">
        <TopNav
          className="top-nav--page"
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate('/')}
          brandLabel={t('nav.brand')}
        />
      </div>

      <section className="section portfolio__hero">
        <div className="content portfolio__hero-inner">
          <p className="portfolio__eyebrow">{t('portfolio.hero.eyebrow')}</p>
          <h1>{t('portfolio.hero.headline')}</h1>
          <p>{t('portfolio.hero.copy')}</p>
        </div>
      </section>

      <section className="section portfolio__gallery">
        <div className="content">
          <div className="portfolio__rail" onWheel={handleWheel} onWheelCapture={handleWheel}>
            <div
              className={`portfolio__grid ${isDragging ? 'is-dragging' : ''}`}
              ref={gridRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerLeave={stopDragging}
            >
              {displayVideos.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  className="portfolio__card"
                  onClick={() => {
                    if (dragState.current.moved) {
                      dragState.current.moved = false
                      return
                    }
                    openVideo(video)
                  }}
                >
                  <div
                    className="portfolio__thumb"
                    style={{ backgroundImage: `url(${video.thumb})` }}
                    aria-hidden="true"
                  >
                    <span className="portfolio__play" aria-hidden="true">
                      <span className="portfolio__play-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="9 18 19 12 9 6 9 18" />
                        </svg>
                      </span>
                    </span>
                    <div className="portfolio__topline">
                      <span className="portfolio__pill">{video.tag ?? t('portfolio.labels.feature')}</span>
                      <span className="portfolio__icon">
                        <svg width="12" height="12" viewBox="0 0 22 22" fill="none">
                          <path
                            d="M20 18.6842C20 19.4109 19.4109 20 18.6842 20C17.9575 20 17.3684 19.4109 17.3684 18.6842V4.49219L2.24609 19.6145C1.73225 20.1284 0.899333 20.1284 0.385485 19.6145C-0.128363 19.1007 -0.128362 18.2678 0.385485 17.7539L15.5078 2.63158H1.31579C0.589099 2.63158 0 2.04248 0 1.31579C0 0.589099 0.589099 0 1.31579 0H20V18.6842Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="portfolio__thumb-overlay" />
                    <div className="portfolio__bottom">
                      <span className="portfolio__chip">{video.year}</span>
                      <p className="portfolio__title">{video.title}</p>
                      <p className="portfolio__description">{video.description}</p>
                      <p className="portfolio__context">
                        <span className="portfolio__context-label">{t('portfolio.labels.context')}</span>
                        {video.context}
                      </p>
                      <p className="portfolio__context">
                        <span className="portfolio__context-label">{t('portfolio.labels.outcome')}</span>
                        {video.outcome}
                      </p>
                      <div className="portfolio__footer-row">
                        <span className="portfolio__location">{video.location}</span>
                        <span className="portfolio__cta-chip">
                          {video.cta ?? t('portfolio.labels.play')}
                          <svg width="8" height="14" viewBox="0 0 3 7" fill="none">
                            <path
                              d="M1 6L2.50024 4.1247C2.79242 3.75948 2.79242 3.24052 2.50024 2.87531L1 1"
                              stroke="white"
                              strokeWidth="0.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="portfolio__proofStrip">
        {proofItems.flatMap((item, i) =>
          i === 0
            ? [<span key={item}>{item}</span>]
            : [
                <span key={`dot-${i}`} className="portfolio__proofDot" aria-hidden="true">·</span>,
                <span key={item}>{item}</span>,
              ]
        )}
      </div>

      <section className="section portfolio__offers">
        <div className="content portfolio__offers-inner">
          <div className="portfolio__offers-copy">
            <p className="portfolio__eyebrow">{t('portfolio.offers.label')}</p>
            <p className="portfolio__servicesBridge">{t('portfolio.offers.bridge')}</p>
            <h2>{t('portfolio.offers.headline')}</h2>
            <p className="portfolio__lead">{t('portfolio.offers.copy')}</p>
          </div>
          <div className="portfolio__offers-grid">
            {localizedOffers.map((offer) => (
              <a
                key={offer.id}
                className="portfolio__offer-card"
                href={localizePath(offer.link)}
              >
                <div className="portfolio__offer-image-wrap">
                  <img className="portfolio__offer-image" src={offer.background} alt="" decoding="async" />
                </div>
                <div className="portfolio__offer-content">
                  <div className="portfolio__offer-top">
                    <span className="portfolio__offer-pill">{t('portfolio.offers.pill')}</span>
                    <span className="portfolio__offer-badge">{offer.title}</span>
                  </div>
                  <p className="portfolio__offer-title">{offer.title}</p>
                  <p className="portfolio__offer-blurb">{offer.blurb}</p>
                  <span className="portfolio__offer-cta">
                    {offer.cta}
                    <svg width="10" height="16" viewBox="0 0 6 10" fill="none">
                      <path
                        d="M1 9L4.5 5L1 1"
                        stroke="white"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {activeVideo && (
        <div
          className="portfolio__overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-modal-title"
          onClick={() => setActiveVideo(null)}
        >
          <div className="portfolio__modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="portfolio__close"
              aria-label={t('portfolio.modal.close')}
              onClick={() => setActiveVideo(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            <div className="portfolio__player">
              {(() => {
                if (activeVideo.slideshowImages && activeVideo.slideshowImages.length > 0) {
                  const total = activeVideo.slideshowImages.length
                  const current = activeVideo.slideshowImages[slideIndex] ?? activeVideo.slideshowImages[0]
                  return (
                    <div className="portfolio__slideshow">
                      <div className="portfolio__slideshow-frame">
                        {total > 1 && (
                          <>
                            <button
                              type="button"
                              className="portfolio__slideshow-arrow portfolio__slideshow-arrow--left"
                              aria-label={t('portfolio.modal.previousSlide')}
                              onClick={() => {
                                setSlideDirection(-1)
                                setSlideIndex((slideIndex - 1 + total) % total)
                              }}
                            >
                              <span aria-hidden="true">‹</span>
                            </button>
                            <button
                              type="button"
                              className="portfolio__slideshow-arrow portfolio__slideshow-arrow--right"
                              aria-label={t('portfolio.modal.nextSlide')}
                              onClick={() => {
                                setSlideDirection(1)
                                setSlideIndex((slideIndex + 1) % total)
                              }}
                            >
                              <span aria-hidden="true">›</span>
                            </button>
                          </>
                        )}
                        <img
                          key={`${activeVideo.id}-slide-${slideIndex}`}
                          className={`portfolio__slideshow-image ${slideDirection === -1 ? 'portfolio__slideshow-image--prev' : 'portfolio__slideshow-image--next'
                            }`}
                          src={current}
                          alt={`${activeVideo.title} slide ${slideIndex + 1}`}
                        />
                      </div>
                      {total > 1 && (
                        <div className="portfolio__slideshow-dots" aria-hidden="true">
                          {activeVideo.slideshowImages.map((_, index) => (
                            <span
                              key={`slide-${activeVideo.id}-${index}`}
                              className={`portfolio__slideshow-dot ${index === slideIndex ? 'is-active' : ''}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                if (!activeVideo.videoSrc) return null
                const embedSrc = getEmbedSrc(activeVideo.videoSrc)
                if (embedSrc) {
                  return (
                    <iframe
                      key={activeVideo.id}
                      title={activeVideo.title}
                      src={embedSrc}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  )
                }

                return (
                  <video
                    key={activeVideo.id}
                    controls
                    autoPlay
                    playsInline
                    poster={activeVideo.thumb}
                    src={activeVideo.videoSrc}
                  />
                )
              })()}
              <div className="portfolio__player-meta">
                <div className="portfolio__eyebrow">
                  <span>{activeVideo.year}</span>
                  <span className="portfolio__dot">•</span>
                  <span>{activeVideo.location}</span>
                </div>
                <p className="portfolio__title" id="portfolio-modal-title">{activeVideo.title}</p>
                <p className="portfolio__description">{activeVideo.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </main>
  )
}

export default Portfolio
