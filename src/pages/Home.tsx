import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TopNav from '../components/TopNav'
import './Home.css'
import Footer from '../sections/Footer'
import { resolveImagePath } from '../utils/resolveImagePath'
import PricingSection from '../sections/PricingSection'

const projects = [
  {
    title: 'Exhibition documentation',
    location: 'Paris galleries',
    year: '2024',
    image: resolveImagePath('/src/assets/images/PinonShowww.jpg'),
    copy: 'Press-ready stills and recap films for openings, installs, and curator walkthroughs.',
    link: '/exhibitions',
  },
  {
    title: 'Gallery stories',
    location: 'Berlin openings',
    year: '2023',
    image: resolveImagePath('/src/assets/images/PinonTheWall.jpg'),
    copy: 'Curator interviews, collector previews, and narrative cuts that give context to the work.',
    link: '/gallery-stories',
  },
  {
    title: 'Artist sessions',
    location: 'Berlin ateliers',
    year: '2024',
    image: resolveImagePath('/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg'),
    copy: 'Portraits, process, and BTS for releases, press kits, and artist profiles.',
    link: '/artist-sessions',
  },
  {
    title: 'Performance documentation',
    location: 'Berlin nights',
    year: '2024',
    image: resolveImagePath('/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg'),
    copy: 'Live sets captured fast with reels, selects, and clean audio-aware edits.',
    link: '/performance',
  },
  {
    title: 'Fashion show',
    location: 'Milan runway',
    year: '2023',
    image: resolveImagePath('/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg'),
    copy: 'Runway and backstage documentation with editorial framing and fast delivery.',
    link: '/fashion-show',
  },
  {
    title: 'Atmospheric films',
    location: 'Lisbon residencies',
    year: '2024',
    image: resolveImagePath('/src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg'),
    copy: 'Mood-driven shorts and lookbooks for concept launches and immersive installs.',
    link: '/atmospheric',
  },
]

const projectRows = [projects.slice(0, 3), projects.slice(3, 6)]

const heroGallery = [
  {
    id: 'thumb-1',
    image: resolveImagePath('/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg'),
    label: 'Exhibitions',
    rotation: -3,
  },
  {
    id: 'thumb-2',
    image: resolveImagePath('/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg'),
    label: 'Artist sessions',
    rotation: 2,
  },
  {
    id: 'thumb-3',
    image: resolveImagePath('/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg'),
    label: 'Gallery documentation',
    rotation: -1,
  },
  {
    id: 'thumb-4',
    image: resolveImagePath('/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg'),
    label: 'Performances',
    rotation: 4,
  },
  {
    id: 'thumb-5',
    image: resolveImagePath('/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg'),
    label: 'Fashion shows',
    rotation: -4,
  },
]

const proofAvatars = [
  resolveImagePath('/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg'),
  resolveImagePath('/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg'),
  resolveImagePath('/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg'),
  resolveImagePath('/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg'),
]

function Home() {
  const navigate = useNavigate()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const rootRef = useRef<HTMLElement | null>(null)
  const casesRef = useRef<HTMLElement | null>(null)

  const handleScroll = (id: string) => {
    const target = document.querySelector(id)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navLinks = useMemo(
    () => ({
      left: [
        { label: 'Studio', onClick: () => handleScroll('#hero') },
        { label: 'Cases', onClick: () => handleScroll('#cases') },
        { label: 'Pricing', onClick: () => handleScroll('#services') },
      ],
      right: [
        { label: 'About', onClick: () => navigate('/about') },
        { label: 'Contact', onClick: () => navigate('/contact') },
      ],
    }),
    [navigate],
  )

  const handleGalleryMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 6
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6
    setTilt({ x, y })
  }

  const resetTilt = () => setTilt({ x: 0, y: 0 })

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      heroTimeline
        .from('.home__nav', { opacity: 0, y: -12, duration: 0.5 })
        .from('.home__hero-title', { opacity: 0, y: 28, duration: 0.7 }, '-=0.2')
        .from('.home__hero-gallery', { opacity: 0, y: 20, scale: 0.98, duration: 0.7 }, '-=0.35')
        .from('.home__hero-subhead', { opacity: 0, y: 16, duration: 0.6 }, '-=0.35')
        .from('.home__actions button', { opacity: 0, y: 12, duration: 0.5, stagger: 0.12 }, '-=0.3')

      const cards = gsap.utils.toArray<HTMLElement>('.home__case-card')

      cards.forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          scale: 0.92,
          y: 60 + index * 4,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
          },
        })
      })

      const pricingCards = gsap.utils.toArray<HTMLElement>('.home__pricing-card')
      pricingCards.forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 36,
          duration: 0.8,
          delay: index * 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        })
      })

      const proofItems = gsap.utils.toArray<HTMLElement>('.home__proof > *')
      gsap.from(proofItems, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.home__proof',
          start: 'top 80%',
        },
      })

      const listeners: Array<() => void> = []

      cards.forEach((card) => {
        const handleMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect()
          const relX = event.clientX - (rect.left + rect.width / 2)
          const relY = event.clientY - (rect.top + rect.height / 2)
          const rotateX = (-relY / (rect.height / 2)) * 4
          const rotateY = (relX / (rect.width / 2)) * 4
          gsap.to(card, { rotationX: rotateX, rotationY: rotateY, scale: 1.04, duration: 0.35, ease: 'power3.out' })
        }
        const handleEnter = () => {
          gsap.to(card, { scale: 1.05, duration: 0.4, ease: 'power3.out' })
        }
        const handleLeave = () => {
          gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.6, ease: 'power2.out' })
        }

        card.addEventListener('mousemove', handleMove)
        card.addEventListener('mouseenter', handleEnter)
        card.addEventListener('mouseleave', handleLeave)
        listeners.push(() => {
          card.removeEventListener('mousemove', handleMove)
          card.removeEventListener('mouseenter', handleEnter)
          card.removeEventListener('mouseleave', handleLeave)
        })
      })

      return () => listeners.forEach((off) => off())
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="home" ref={rootRef}>
      <div className="home__background" aria-hidden />
      <div className="home__floaters" aria-hidden />
      <header className="home__section home__hero" id="hero">
        <div className="home__nav">
          <TopNav
            className="top-nav--page"
            leftLinks={navLinks.left}
            rightLinks={navLinks.right}
            onBrandClick={() => handleScroll('#hero')}
            brandLabel="expose.u"
          />
      </div>
        <div className="home__hero-body">
          <h1 className="home__hero-title">Photo and video for Berlin&rsquo;s galleries, artists, and live events.</h1>
          <div
            className="home__hero-gallery"
            onMouseMove={handleGalleryMouseMove}
            onMouseLeave={resetTilt}
            style={{ transform: `rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)` }}
          >
            {heroGallery.map((thumb) => (
              <figure
                key={thumb.id}
                className="home__hero-thumb"
                style={{ '--thumb-rotation': `${thumb.rotation}deg` } as CSSProperties}
              >
                <div className="home__hero-thumb-image">
                  <img src={thumb.image} alt={thumb.label} loading="lazy" />
                </div>
                <figcaption>
                  <strong>{thumb.label}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="home__hero-subhead">
            Exhibitions, openings, and performances captured with art-first direction, fast delivery, and clean edits
            that match your tone.
          </p>
          <div className="home__actions">
            <button type="button" onClick={() => navigate('/contact')}>
              Contact us
            </button>
          <button type="button" onClick={() => handleScroll('#services')}>
            View packages
          </button>
          </div>
        </div>
      </header>

      <section className="home__section home__proof">
        <div className="home__proof-avatars">
          {proofAvatars.map((avatar, idx) => (
            <img key={avatar} src={avatar} alt="Client avatar" style={{ zIndex: proofAvatars.length - idx }} />
          ))}
          <span>Over 140 Berlin collaborators</span>
        </div>
        <h2>Work with a team that knows galleries, artists, and live sets, and keeps your visual language intact.</h2>
        <p className="home__proof-copy">
          We document exhibitions, performances, and artist projects with the polish you need for press, socials, and
          collectors, while keeping the atmosphere intact.
        </p>
        <div className="home__proof-actions">
          <button type="button" onClick={() => navigate('/contact')}>
            Contact us
          </button>
          <button type="button" className="home__proof-secondary" onClick={() => handleScroll('#services')}>
            Explore services
          </button>
        </div>
      </section>

      <section className="home__section home__cases" id="cases" ref={casesRef}>
        <div className="home__section-header">
          <p>Coverage types</p>
          <h2>Pick the format that fits your show, release, or live event.</h2>
          <br />
          <p>i need create content for my:</p>
        </div>
        <div className="home__cases-grid">
          {projectRows.map((row, rowIndex) => (
            <div className="home__cases-row" key={`case-row-${rowIndex}`}>
              {row.map((project) => (
                <article key={project.title} className="home__case-card">
                  <div className="home__case-media">
                    <img src={project.image} alt={project.title} />
                  </div>
                  <div className="home__case-meta">
                    <div>
                      <p>{project.location}</p>
                      <span>{project.year}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p className="home__case-copy">{project.copy}</p>
                    <button type="button" onClick={() => navigate(project.link)}>
                      See documentation details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      <PricingSection id="services" />
      <Footer />
    </main>
  )
}

export default Home
