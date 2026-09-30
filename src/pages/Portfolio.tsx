import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent, WheelEvent } from 'react'
import './Portfolio.css'
import { resolveImagePath } from '../utils/resolveImagePath'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { serviceMeta } from '../data/serviceMeta'
import { useLocale, useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import LocalizedLink from '../i18n/LocalizedLink'
import { SchemaOrg, SEOMeta } from '../components/SEOMeta'
import { useVideoLightbox } from '../hooks/useVideoLightbox'

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
  ambientVideo?: boolean
  embedUrl?: string
  thumbnailUrl?: string
  uploadDate?: string
  slideshowImages?: string[]
  tag?: string
}

type OfferItem = {
  id: string
  slug: string
  title: string
  blurb: string
  link: string
  cta: string
  background: string
}

const videos: VideoItem[] = [
  {
    id: 'leonis-liquidrom',
    title: 'Leonis Work & Liquidrom',
    description: 'Four dancers, two live performances at Liquidrom.',
    context: 'DOME 36 performance, Liquidrom Berlin',
    outcome: 'Performance film',
    year: '2026',
    location: 'Berlin',
    thumb: resolveImagePath('/src/assets/images/thumbs/portfolio/06/thumb_0.webp'),
    videoSrc: 'https://vimeo.com/1231688364',
    embedUrl: 'https://player.vimeo.com/video/1231688364',
    thumbnailUrl: 'https://i.vimeocdn.com/video/2206903226-a92ca0b4441b470692995d6bb36303dca1d05b11347c9c1dd53cd59ed12cafc2-d_1280x720',
    uploadDate: '2026-09-30',
    // With both a film and stills, the lightbox opens on the film and the
    // stills follow as further slides.
    slideshowImages: [
      resolveImagePath('/src/assets/images/thumbs/portfolio/06/leonis_001.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/06/leonis_002.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/06/leonis_003.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/06/leonis_004.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/06/leonis_005.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/06/leonis_006.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/06/leonis_007.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/06/leonis_008.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/06/leonis_009.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/06/leonis_010.webp'),
    ],
    tag: 'Performance',
  },
  {
    id: 'v1',
    title: 'Lick the walls to understand echoes',
    description: 'Audio-reactive installation with immersive sound and visuals.',
    context: 'captured sound-based installation',
    outcome: 'delivered press stills + archive set',
    year: '2026',
    location: 'Berlin',
    thumb: resolveImagePath('/src/assets/images/thumbs/portfolio/01/thumb_0.webp'),
    videoSrc: 'https://youtu.be/00OZBQL4W3Q',
    embedUrl: 'https://www.youtube-nocookie.com/embed/00OZBQL4W3Q',
    thumbnailUrl: 'https://i.ytimg.com/vi/00OZBQL4W3Q/maxresdefault.jpg',
    uploadDate: '2025-01-01',
    tag: 'Live Event',
  },
  {
    id: 'v2',
    title: 'Abigail Toll - IDOL - Silent Green',
    description: 'Music performance captured at Silent Green, Berlin.',
    context: 'covered venue performance night',
    outcome: 'delivered recap film + promo stills',
    year: '2026',
    location: 'Berlin',
    thumb: resolveImagePath('/src/assets/images/thumbs/portfolio/02/thumb_0.webp'),
    videoSrc:
      'https://www.youtube-nocookie.com/embed/DkruqulWupw?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0',
    embedUrl: 'https://www.youtube-nocookie.com/embed/DkruqulWupw',
    thumbnailUrl: 'https://i.ytimg.com/vi/DkruqulWupw/maxresdefault.jpg',
    uploadDate: '2025-01-01',
    tag: 'Live Event',
  },
  {
    id: 'sanam',
    title: 'SANAM — Silent Green Berlin',
    description: 'Full concert documentation at the Betonhalle. Stage, crowd, atmosphere — built for press and social.',
    context: 'press & film documentation, Betonhalle at Silent Green',
    outcome: 'press stills + social media content — delivered',
    year: '2026',
    location: 'Berlin',
    thumb: resolveImagePath('/src/assets/images/thumbs/portfolio/03/thumb_0.webp'),
    videoSrc: 'https://vimeo.com/1231736451',
    ambientVideo: true,
    embedUrl: 'https://player.vimeo.com/video/1231736451',
    thumbnailUrl: 'https://i.vimeocdn.com/video/2206964713-aa5395c3116d542260553f6a897a64c70b7a484e1b924aa782fdeb7504ea4613-d_1280x720',
    uploadDate: '2026-09-30',
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
    tag: 'Concert',
  },
  {
    id: 'seefeel',
    title: 'Seefeel — Silent Green Berlin',
    description: 'Concert press and film documentation at the Betonhalle. Full coverage from stage to crowd.',
    context: 'press & film documentation, Betonhalle at Silent Green',
    outcome: 'concert coverage — delivered',
    year: '2026',
    location: 'Berlin',
    thumb: resolveImagePath('/src/assets/images/thumbs/portfolio/04/thumb_0.webp'),
    slideshowImages: [
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_001.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_002.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_003.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_004.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_005.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_006.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_007.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_008.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_009.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_010.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_011.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_012.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_013.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_014.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_015.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_016.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_017.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_018.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_019.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/04/seefeel_020.webp'),
    ],
    tag: 'Concert',
  },
  {
    id: 'gleo',
    title: 'GLEO — Silent Green Berlin',
    description: 'Video and photo documentation of GLEO live at the Betonhalle. Full concert coverage, stage to crowd.',
    context: 'video & photo documentation, Betonhalle at Silent Green',
    outcome: 'concert coverage — delivered',
    year: '2026',
    location: 'Berlin',
    thumb: resolveImagePath('/src/assets/images/thumbs/portfolio/05/thumb_0.webp'),
    videoSrc: 'https://vimeo.com/1231736450',
    ambientVideo: true,
    embedUrl: 'https://player.vimeo.com/video/1231736450',
    thumbnailUrl: 'https://i.vimeocdn.com/video/2206964720-584f41bb88a1dfacd83791435675c537e2b13233b3cde4d870c907d085335073-d_1280x720',
    uploadDate: '2026-09-30',
    slideshowImages: [
      resolveImagePath('/src/assets/images/thumbs/portfolio/05/gleo_001.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/05/gleo_002.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/05/gleo_003.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/05/gleo_004.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/05/gleo_005.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/05/gleo_006.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/05/gleo_007.webp'),
      resolveImagePath('/src/assets/images/thumbs/portfolio/05/gleo_008.webp'),
    ],
    tag: 'Concert',
  },
]

const offers: OfferItem[] = [
  {
    id: 'offer-performance',
    slug: serviceMeta['concerts-events'].slug,
    title: serviceMeta['concerts-events'].label,
    blurb: '',
    link: serviceMeta['concerts-events'].href,
    cta: '',
    background: resolveImagePath('/src/assets/images/website/artists/002.webp'),
  },
  {
    id: 'offer-exhibition',
    slug: serviceMeta['exhibition-gallery'].slug,
    title: serviceMeta['exhibition-gallery'].label,
    blurb: '',
    link: serviceMeta['exhibition-gallery'].href,
    cta: '',
    background: resolveImagePath('/src/assets/images/website/_incoming/homepage/services/exhibition-gallery/001.webp'),
  },
  {
    id: 'offer-session',
    slug: serviceMeta['artist-sessions'].slug,
    title: serviceMeta['artist-sessions'].label,
    blurb: '',
    link: serviceMeta['artist-sessions'].href,
    cta: '',
    background: resolveImagePath('/src/assets/images/website/_incoming/homepage/services/artist-sessions/0015.webp'),
  },
]

function Portfolio() {
  const navigate = useLocaleNavigate()
  const { locale } = useLocale()
  const { t, tm } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<HTMLElement | null>(null)
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false, pointerId: 0 })
  const { openVideo, modal: videoModal } = useVideoLightbox(rootRef)

  const videoTranslations = tm<Array<Pick<VideoItem, 'id' | 'title' | 'description' | 'context' | 'outcome' | 'tag'>>>('portfolio.videos')
  const proofItems = tm<string[]>('portfolio.proofStrip')
  const localizedVideos = useMemo(
    () => videos.map((video) => ({ ...video, ...(videoTranslations.find((entry) => entry.id === video.id) ?? {}) })),
    [videoTranslations],
  )

  const localizedOffers = useMemo(
    () =>
      offers.map((offer) => ({
        ...offer,
        title: t(`home.services.cards.${offer.slug}.title`),
        blurb: t(`portfolio.offers.cards.${offer.id}.blurb`),
        cta: t('portfolio.offers.cta'),
      })),
    [t],
  )

  const portfolioVideoSchema = useMemo(() => {
    const videoObjects = localizedVideos
      .filter((video) => video.embedUrl && video.thumbnailUrl && video.uploadDate)
      .map((video) => ({
        '@type': 'VideoObject',
        name: video.title,
        description: video.description,
        thumbnailUrl: [video.thumbnailUrl],
        uploadDate: video.uploadDate,
        embedUrl: video.embedUrl,
        url: `https://expose-u.com/portfolio#${video.id}`,
        inLanguage: locale,
        publisher: {
          '@type': 'Organization',
          name: 'expose.u',
          logo: {
            '@type': 'ImageObject',
            url: 'https://expose-u.com/og-default.png',
          },
        },
      }))

    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Last Projects - expose.u',
      url: 'https://expose-u.com/portfolio',
      inLanguage: locale,
      video: videoObjects,
    }
  }, [localizedVideos, locale])

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




  // One motion language for the whole page: a soft fade with a small rise
  // and a light blur clearing, all on the same easing. Transforms are cleared
  // afterwards so CSS hover states (which use the separate `translate`/`scale`
  // properties) never fight GSAP.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ease = 'power3.out'
    const reveal = { opacity: 1, y: 0, filter: 'blur(0px)', ease, clearProps: 'transform,filter' }

    const ctx = gsap.context(() => {
      gsap.fromTo('.portfolio__nav', { opacity: 0 }, { opacity: 1, duration: 0.8, ease })

      // Hero: eyebrow, then the headline line by line, then the intro.
      gsap.fromTo(
        '.portfolio__hero .portfolio__eyebrow, .portfolio__hero h1 > span, .portfolio__hero-inner > p:last-child',
        { opacity: 0, y: 18, filter: 'blur(6px)' },
        { ...reveal, duration: 1, stagger: 0.1, delay: 0.1 },
      )

      // Cards: each enters as it scrolls into view (cards in the same row
      // cascade slightly); the photo settles from a gentle zoom and the
      // card text follows.
      gsap.utils.toArray<HTMLElement>('.portfolio__card').forEach((card, index) => {
        const tl = gsap.timeline({
          delay: (index % 3) * 0.09,
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        })
        tl.fromTo(card, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1, ease, clearProps: 'transform' })
          .fromTo(
            card.querySelector('.portfolio__thumb'),
            { scale: 1.08 },
            { scale: 1, duration: 1.4, ease, clearProps: 'transform' },
            0,
          )
          .fromTo(
            card.querySelectorAll('.portfolio__pill, .portfolio__bottom > *'),
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease, clearProps: 'transform' },
            0.3,
          )
      })

      gsap.fromTo(
        '.portfolio__proofStrip > *',
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease,
          clearProps: 'transform',
          scrollTrigger: { trigger: '.portfolio__proofStrip', start: 'top 92%', once: true },
        },
      )

      gsap.fromTo(
        '.portfolio__offers-copy > *',
        { opacity: 0, y: 16, filter: 'blur(4px)' },
        {
          ...reveal,
          duration: 0.9,
          stagger: 0.08,
          scrollTrigger: { trigger: '.portfolio__offers', start: 'top 82%', once: true },
        },
      )

      // Offer cards stay forced visible in CSS, so animate what's inside them.
      gsap.utils.toArray<HTMLElement>('.portfolio__offer-card').forEach((card, index) => {
        const tl = gsap.timeline({
          delay: index * 0.1,
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        })
        tl.fromTo(
          card.querySelector('.portfolio__offer-image-wrap'),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1, ease, clearProps: 'transform' },
        )
          .fromTo(
            card.querySelector('.portfolio__offer-image'),
            { scale: 1.06 },
            { scale: 1, duration: 1.4, ease, clearProps: 'transform' },
            0,
          )
          .fromTo(
            card.querySelectorAll('.portfolio__offer-content > *'),
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease, clearProps: 'transform' },
            0.25,
          )
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

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
    if (dragState.current.pointerId && grid.hasPointerCapture(dragState.current.pointerId)) {
      grid.releasePointerCapture(dragState.current.pointerId)
    }
    setIsDragging(false)
  }

  return (
    <main className="portfolio" ref={rootRef} id="main">
      <SEOMeta
        title="Last Projects"
        description="Selected documentation work by expose.u — concerts at Silent Green, gallery exhibitions, and artist sessions in Berlin."
        ogTitle="Last Projects | expose.u"
        ogDescription="Eight concerts at Silent Green. Gallery exhibitions. Artist sessions. Selected work from Berlin."
        canonical="https://expose-u.com/portfolio"
        lang={locale}
      />
      <SchemaOrg data={portfolioVideoSchema} />
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
          <h1>
            {t('portfolio.hero.headline').split('. ').map((part, i, arr) => (
              <span key={i}>{part}{i < arr.length - 1 ? '.' : ''}{i < arr.length - 1 && <br />}</span>
            ))}
          </h1>
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
              {localizedVideos.map((video) => (
                <button
                  key={video.id}
                  id={video.id}
                  type="button"
                  className="portfolio__card"
                  aria-label={video.title}
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
                    <div className="portfolio__topline">
                      <span className="portfolio__pill">{video.tag ?? t('portfolio.labels.feature')}</span>
                    </div>
                    <div className="portfolio__thumb-overlay" />
                    <div className="portfolio__bottom">
                      <p className="portfolio__title">{video.title}</p>
                      <p className="portfolio__description">{video.description}</p>
                      <p className="portfolio__context">{video.context}</p>
                      <p className="portfolio__context">{video.outcome}</p>
                      <div className="portfolio__footer-row">
                        <span className="portfolio__location">{video.location}</span>
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
            <h2>{t('portfolio.offers.headline')}</h2>
            <p className="portfolio__lead">{t('portfolio.offers.copy')}</p>
          </div>
          <div className="portfolio__offers-grid">
            {localizedOffers.map((offer) => (
              <LocalizedLink
                key={offer.id}
                className="portfolio__offer-card"
                to={offer.link}
              >
                <div className="portfolio__offer-image-wrap">
                  <img className="portfolio__offer-image" src={offer.background} alt="" decoding="async" />
                </div>
                <div className="portfolio__offer-content">
                  <p className="portfolio__offer-title">{offer.title}</p>
                  <p className="portfolio__offer-blurb">{offer.blurb}</p>
                  <span className="portfolio__offer-cta">
                    {offer.cta}
                  </span>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      {videoModal}
      <Footer />
    </main>
  )
}

export default Portfolio
