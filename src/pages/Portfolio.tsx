import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent, WheelEvent } from 'react'
import './Portfolio.css'
import { resolveImagePath } from '../utils/resolveImagePath'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'

type VideoItem = {
  id: string
  title: string
  description: string
  year: string
  location: string
  thumb: string
  videoSrc: string
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
    title: 'Exhibition Prelude',
    description: 'Moody prelude that walks viewers through the build-out.',
    year: '2024',
    location: 'Berlin',
    thumb: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_030.png'),
    videoSrc: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    tag: 'Live',
    cta: 'Play',
  },
  {
    id: 'v2',
    title: 'Gallery Warmup',
    description: 'Portrait-led teaser for the opening night.',
    year: '2024',
    location: 'Paris',
    thumb: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_012.png'),
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    tag: 'Feature',
    cta: 'Play',
  },
  {
    id: 'v3',
    title: 'Performance Cut',
    description: 'Cinematic capture of live movement and light.',
    year: '2025',
    location: 'London',
    thumb: resolveImagePath('/src/assets/images/services/4_performance_doc/4_PD_004.png'),
    videoSrc: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    tag: 'Live',
    cta: 'Play',
  },
  {
    id: 'v4',
    title: 'Studio Sessions',
    description: 'Intimate look at the artist’s process in-studio.',
    year: '2025',
    location: 'Lisbon',
    thumb: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.png'),
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    tag: 'Studio',
    cta: 'Play',
  },
]

const offers: OfferItem[] = [
  {
    id: 'offer-exhibition',
    title: 'Exhibition',
    blurb: 'Full visual direction for galleries, openings, and installs with immersive screens, loops, and atmosphere.',
    link: '/exhibitions',
    cta: 'Contact us',
    accent: '#ffffffff',
    background: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_030.png'),
  },
  {
    id: 'offer-session',
    title: 'Artist Session',
    blurb: 'Studio and portrait sessions that capture process and story with polished deliverables for press and socials.',
    link: '/artist-sessions',
    cta: 'Contact us',
    accent: '#c4b5fd',
    background: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.png'),
  },
  {
    id: 'offer-performance',
    title: 'Performance',
    blurb: 'Live performance capture with cinematic documentation, multi-angle, crisp audio, and quick turnarounds.',
    link: '/performance',
    cta: 'Contact us',
    accent: '#fca5a5',
    background: resolveImagePath('/src/assets/images/services/4_performance_doc/4_PD_004.png'),
  },
  {
    id: 'offer-atmospheric',
    title: 'Atmospheric',
    blurb: 'Mood-first films and stills that set the tone for your release, event, or install.',
    link: '/atmospheric',
    cta: 'Contact us',
    accent: '#9bd1ff',
    background: resolveImagePath('/src/assets/images/services/6_atmospheric_film/6_AF_018.png'),
  },
  {
    id: 'offer-gallery',
    title: 'Gallery Stories',
    blurb: 'Curator walkthroughs and features that make your space and artists shine online.',
    link: '/gallery-stories',
    cta: 'Contact us',
    accent: '#fbcfe8',
    background: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_012.png'),
  },
  {
    id: 'offer-fashion',
    title: 'Fashion Show',
    blurb: 'Editorial runway capture with clean angles, sharp detail, and fast delivery.',
    link: '/fashion-show',
    cta: 'Contact us',
    accent: '#c7d2fe',
    background: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_011.jpeg'),
  },
]

function Portfolio() {
  const navigate = useNavigate()
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<HTMLElement | null>(null)
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false, pointerId: 0 })
  const goToHomeSection = useCallback((hash?: string) => {
    navigate(hash ? `/${hash}` : '/')
  }, [navigate])

  const navLinks = useMemo(
    () => ({
      left: [
        { label: 'Studio', onClick: () => goToHomeSection('#hero') },
        { label: 'Cases', onClick: () => goToHomeSection('#cases') },
        { label: 'Pricing', onClick: () => goToHomeSection('#services') },
      ],
      right: [
        { label: 'About', onClick: () => navigate('/about') },
        { label: 'Contact', onClick: () => navigate('/contact') },
      ],
    }),
    [goToHomeSection, navigate],
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
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
        opacity: 0,
        y: 18,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.portfolio__offers',
          start: 'top 85%',
        },
      })

      gsap.from('.portfolio__offer-card', {
        opacity: 0,
        y: 26,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.portfolio__offers-grid',
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
    const youTubeMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&/]+)/i)
    if (youTubeMatch) {
      return `https://www.youtube.com/embed/${youTubeMatch[1]}?autoplay=1&rel=0`
    }

    const vimeoMatch = src.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0`
    }

    return null
  }

  return (
    <main className="portfolio" ref={rootRef}>
      <div className="portfolio__nav">
        <TopNav
          className="top-nav--page"
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => goToHomeSection('#hero')}
          brandLabel="expose.u"
        />
      </div>

      <section className="section portfolio__hero">
        <div className="content portfolio__hero-inner">
          <h1>Moving visuals for stages and walls.</h1>
          <p>Bold captures with quiet control. See how we frame performances, galleries, and launches.</p>
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
              {videos.map((video) => (
                  <button
                    key={video.id}
                    type="button"
                    className="portfolio__card"
                    onClick={() => {
                      if (dragState.current.moved) {
                        dragState.current.moved = false
                        return
                      }
                      setActiveVideo(video)
                    }}
                  >
                    <div
                      className="portfolio__thumb"
                      style={{ backgroundImage: `url(${video.thumb})` }}
                    aria-hidden
                  >
                    <span className="portfolio__play" aria-hidden>
                      <span className="portfolio__play-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="9 18 19 12 9 6 9 18" />
                        </svg>
                      </span>
                    </span>
                    <div className="portfolio__topline">
                      <span className="portfolio__pill">{video.tag ?? 'Feature'}</span>
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
                        <div className="portfolio__footer-row">
                          <span className="portfolio__location">{video.location}</span>
                          <span className="portfolio__cta-chip">
                            {video.cta ?? 'Play'}
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

      <section className="section portfolio__offers">
        <div className="content portfolio__offers-inner">
          <div className="portfolio__offers-copy">
            <p className="portfolio__eyebrow">Collaboration</p>
            <h2>Now that you’ve seen the work, choose how we can team up.</h2>
            <p className="portfolio__lead">
              Pick the format that fits your stage, from exhibitions and artist sessions to full performance capture.
            </p>
          </div>
          <div className="portfolio__offers-grid">
            {offers.map((offer) => (
              <a
                key={offer.id}
                className="portfolio__offer-card"
                href={offer.link}
                style={
                  {
                    '--offer-accent': offer.accent,
                    backgroundImage: `url(${offer.background})`,
                  } as CSSProperties
                }
              >
                <div className="portfolio__offer-overlay">
                  <div className="portfolio__offer-top">
                    <span className="portfolio__offer-pill">Offer</span>
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
        <div className="portfolio__overlay" role="dialog" aria-modal="true">
          <div className="portfolio__modal">
            <button
              type="button"
              className="portfolio__close"
              aria-label="Close video"
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
                <p className="portfolio__title">{activeVideo.title}</p>
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
