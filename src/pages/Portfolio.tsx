import { useRef, useState } from 'react'
import type { WheelEvent } from 'react'
import './Portfolio.css'

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

const videos: VideoItem[] = [
  {
    id: 'v1',
    title: 'Exhibition Prelude',
    description: 'Moody prelude that walks viewers through the build-out.',
    year: '2024',
    location: 'Berlin',
    thumb: '/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg',
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
    thumb: '/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg',
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
    thumb: '/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg',
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
    thumb: '/src/assets/images/5bcdeb6c6e929fdb9f16ed10665ca5e0.jpg',
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
    thumb: '/src/assets/images/5ca58a0696b1a8655c92ae3ed107c5e8.jpg',
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
    thumb: '/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg',
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
    thumb: '/src/assets/images/cfcb07dd865328849ba617c98ae71eb3.jpg',
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
    thumb: '/src/assets/images/Daydream.jpg',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    tag: 'After Hours',
    cta: 'Play',
  },
]

function Portfolio() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const grid = gridRef.current
    if (!grid) return
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault()
      event.stopPropagation()
      const next = grid.scrollLeft + event.deltaY * 1.1
      grid.scrollTo({ left: next, behavior: 'smooth' })
    }
  }

  return (
    <main className="portfolio">
      <div className="content portfolio__nav">
        <nav className="portfolio__links portfolio__links--left">
          <a href="/">Home</a>
          <a href="/#proposal">Proposal</a>
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
        <div
          className="content portfolio__grid"
          ref={gridRef}
          onWheel={handleWheel}
          onWheelCapture={handleWheel}
        >
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              className="portfolio__card"
              onClick={() => setActiveVideo(video)}
            >
              <div className="portfolio__thumb" style={{ backgroundImage: `url(${video.thumb})` }} aria-hidden>
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
