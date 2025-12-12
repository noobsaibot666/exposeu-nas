import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent, WheelEvent } from 'react'
import './Portfolio.css'
import { resolveImagePath } from '../utils/resolveImagePath'

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
    thumb: resolveImagePath('/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg'),
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
    thumb: resolveImagePath('/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg'),
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
    thumb: resolveImagePath('/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg'),
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
    thumb: resolveImagePath('/src/assets/images/5bcdeb6c6e929fdb9f16ed10665ca5e0.jpg'),
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    tag: 'Studio',
    cta: 'Play',
  },
  {
    id: 'v5',
    title: 'Campaign Pulse',
    description: 'Editorial frames for a new collection drop.',
    year: '2025',
    location: 'Milan',
    thumb: resolveImagePath('/src/assets/images/5ca58a0696b1a8655c92ae3ed107c5e8.jpg'),
    videoSrc: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    tag: 'Editorial',
    cta: 'Play',
  },
  {
    id: 'v6',
    title: 'Launch Night',
    description: 'One-take reveal capturing the crowd and energy.',
    year: '2024',
    location: 'Rotterdam',
    thumb: resolveImagePath('/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg'),
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    tag: 'Live',
    cta: 'Play',
  },
  {
    id: 'v7',
    title: 'Immersive Walkthrough',
    description: 'Wide shots and close detail of an immersive build.',
    year: '2025',
    location: 'Copenhagen',
    thumb: resolveImagePath('/src/assets/images/cfcb07dd865328849ba617c98ae71eb3.jpg'),
    videoSrc: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    tag: 'Immersive',
    cta: 'Play',
  },
  {
    id: 'v8',
    title: 'Night Gallery',
    description: 'After-dark coverage with moody grading.',
    year: '2024',
    location: 'Madrid',
    thumb: resolveImagePath('/src/assets/images/Daydream.jpg'),
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    tag: 'After Hours',
    cta: 'Play',
  },
]

const offers: OfferItem[] = [
  {
    id: 'offer-exhibition',
    title: 'Exhibition',
    blurb: 'Full visual direction for galleries, openings, and installs—immersive screens, loops, and atmosphere.',
    link: '/#offer',
    cta: 'Explore Exhibition',
    accent: '#ffffffff',
    background: resolveImagePath('/src/assets/images/5bcdeb6c6e929fdb9f16ed10665ca5e0.jpg'),
  },
  {
    id: 'offer-session',
    title: 'Artist Session',
    blurb: 'Studio and portrait sessions that capture process and story—polished deliverables for press and socials.',
    link: '/#offer',
    cta: 'Book a Session',
    accent: '#c4b5fd',
    background: resolveImagePath('/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg'),
  },
  {
    id: 'offer-performance',
    title: 'Performance',
    blurb: 'Live performance capture with cinematic coverage—multi-angle, crisp audio, and quick turnarounds.',
    link: '/#offer',
    cta: 'Plan a Performance',
    accent: '#fca5a5',
    background: resolveImagePath('/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg'),
  },
  {
    id: 'offer-atmospheric',
    title: 'Atmospheric',
    blurb: 'Mood-first films and stills that set the tone for your release, event, or install.',
    link: '/atmospheric',
    cta: 'Build the Atmosphere',
    accent: '#9bd1ff',
    background: resolveImagePath('/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg'),
  },
  {
    id: 'offer-gallery',
    title: 'Gallery Stories',
    blurb: 'Curator walkthroughs and features that make your space and artists shine online.',
    link: '/gallery-stories',
    cta: 'Tell the Story',
    accent: '#fbcfe8',
    background: resolveImagePath('/src/assets/images/PinonShowww.jpg'),
  },
  {
    id: 'offer-fashion',
    title: 'Fashion Show',
    blurb: 'Editorial runway capture with clean angles, sharp detail, and fast delivery.',
    link: '/fashion-show',
    cta: 'Book Runway Coverage',
    accent: '#c7d2fe',
    background: resolveImagePath('/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg'),
  },
]

function Portfolio() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false, pointerId: 0 })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
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
    setHoveredId(null)
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

  const stopDragging = (_event?: PointerEvent<HTMLDivElement>) => {
    const grid = gridRef.current
    if (!grid || !dragState.current.active) return
    dragState.current.active = false
    dragState.current.pointerId && grid.releasePointerCapture(dragState.current.pointerId)
    setIsDragging(false)
  }

  const hoveredIndex = hoveredId ? videos.findIndex((v) => v.id === hoveredId) : -1

  return (
    <main className="portfolio">
      <div className="content portfolio__nav">
        <nav className="portfolio__links portfolio__links--left">
          <a href="/">Home</a>
          <a href="/#cases">Cases</a>
          <a href="/#claim">Claim</a>
          <a href="/#offer">Offer</a>
        </nav>
        <a className="portfolio__brand" href="/">
          expose.u
        </a>
        <nav className="portfolio__links portfolio__links--right">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>

      <section className="section portfolio__hero">
        <div className="content portfolio__hero-inner">
          <h1>Moving visuals for stages and walls.</h1>
          <p>Bold captures with quiet control—see how we frame performances, galleries, and launches.</p>
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
              {videos.map((video, index) => {
                const shift =
                  hoveredIndex === -1
                    ? 0
                    : index < hoveredIndex
                      ? -48
                      : index > hoveredIndex
                        ? 48
                        : 0
                const cardStyle: CSSProperties & { '--card-shift'?: string } = {
                  '--card-shift': `${shift}px`,
                }

                return (
                  <button
                    key={video.id}
                    type="button"
                    className="portfolio__card"
                    style={cardStyle}
                    onClick={() => {
                      if (dragState.current.moved) {
                        dragState.current.moved = false
                        return
                      }
                      setActiveVideo(video)
                    }}
                    onMouseEnter={() => setHoveredId(video.id)}
                    onMouseLeave={() => setHoveredId(null)}
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
                )
              })}
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
              Pick the format that fits your stage—exhibitions, artist sessions, or full performance capture.
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
              <video
                key={activeVideo.id}
                controls
                autoPlay
                playsInline
                poster={activeVideo.thumb}
                src={activeVideo.videoSrc}
              />
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
    </main>
  )
}

export default Portfolio
