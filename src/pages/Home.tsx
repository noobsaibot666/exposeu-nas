import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TopNav from '../components/TopNav'
import './Home.css'
import Footer from '../sections/Footer'

const pricingTiers = [
  {
    name: 'Spontan',
    cadence: 'Per activation',
    price: '€2.9K',
    description: 'One-off coverage for exhibitions, openings, or pop-up concerts.',
    features: ['Editorial photo + video team', '48h highlight cut', 'Private proofing gallery'],
    cta: 'Book Spontan',
    link: '/contact',
  },
  {
    name: 'Monthly',
    cadence: '4 productions / month',
    price: '€6.5K',
    description: 'Popular with galleries and artist-run spaces launching back-to-back shows.',
    features: ['Priority crew & gear', 'Lookbook + reels delivered weekly', 'Creative direction support'],
    cta: 'Start Monthly',
    link: '/contact',
    badge: 'Popular',
  },
  {
    name: 'Yearly',
    cadence: 'Retainer',
    price: 'Custom',
    description: 'Embedded studio for museums, ateliers, and brands running global programs.',
    features: ['Dedicated producer in Berlin', 'Archive & licensing support', 'Seasonal campaign strategy'],
    cta: 'Talk to us',
    link: '/contact',
  },
]

const projects = [
  {
    title: 'Artist sessions',
    location: 'Berlin ateliers',
    year: '2024',
    image: '/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg',
    copy: 'Intimate portrait films and long-form interviews for resident artists.',
    link: '/artist-sessions',
  },
  {
    title: 'Atmospheric films',
    location: 'Lisbon residencies',
    year: '2024',
    image: '/src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg',
    copy: 'Slow cinema treatments that bottle the feeling of immersive installs.',
    link: '/atmospheric',
  },
  {
    title: 'Exhibition launch',
    location: 'Paris galleries',
    year: '2024',
    image: '/src/assets/images/PinonShowww.jpg',
    copy: 'Exhibition coverage for curators unveiling new collections.',
    link: '/exhibitions',
  },
  {
    title: 'Fashion show',
    location: 'Milan runway',
    year: '2023',
    image: '/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg',
    copy: 'High-energy runway coverage with editorial delivery.',
    link: '/fashion-show',
  },
  {
    title: 'Gallery stories',
    location: 'Berlin openings',
    year: '2023',
    image: '/src/assets/images/PinonTheWall.jpg',
    copy: 'Ambient vignettes for curator-led walkthroughs and collector tours.',
    link: '/gallery-stories',
  },
  {
    title: 'Performance docs',
    location: 'Berlin nights',
    year: '2024',
    image: '/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg',
    copy: 'Cinematic documentation for concerts, happenings, and live art.',
    link: '/performance',
  },
]

const projectRows = [projects.slice(0, 3), projects.slice(3, 6)]

const heroGallery = [
  { id: 'thumb-1', image: '/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg', label: 'Openings', tone: 'designer', rotation: -3 },
  { id: 'thumb-2', image: '/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg', label: 'Artists', tone: 'artist', rotation: 2 },
  { id: 'thumb-3', image: '/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg', label: 'Galleries', tone: 'curator', rotation: -1 },
  { id: 'thumb-4', image: '/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg', label: 'Runway', tone: 'producer', rotation: 4 },
  { id: 'thumb-5', image: '/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg', label: 'Concerts', tone: 'live', rotation: -4 },
]

const proofAvatars = [
  '/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg',
  '/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg',
  '/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg',
  '/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg',
]

function Home() {
  const navigate = useNavigate()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
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
    const ctx = gsap.context(() => {
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
    }, casesRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="home">
      <div className="home__background" aria-hidden />
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
          <h1>Content creation for Berlin&rsquo;s galleries, artists, and nights.</h1>
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
                  <span>{thumb.tone}</span>
                  <strong>{thumb.label}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="home__hero-subhead">
            Photo + video crafted for exhibitions, openings, pocket concerts, and experimental art events across Berlin.
          </p>
          <div className="home__actions">
            <button type="button" onClick={() => navigate('/contact')}>
              Get in contact
            </button>
            <button type="button" onClick={() => handleScroll('#services')}>
              View our offers
            </button>
          </div>
        </div>
      </header>

      <section className="home__section home__proof">
        <div className="home__proof-avatars">
          {proofAvatars.map((avatar, idx) => (
            <img key={avatar} src={avatar} alt="Client avatar" style={{ zIndex: proofAvatars.length - idx }} />
          ))}
          <span>140+ Berlin collaborators</span>
        </div>
        <h2>
          Ready for film &amp; photo teams who understand galleries, ateliers, and the energy that makes Berlin glow?
        </h2>
        <p className="home__proof-copy">
          We create cinematic documentation for makers and the curators who elevate them&mdash;from gallery debuts to
          experimental nights and collector previews.
        </p>
        <div className="home__proof-actions">
          <button type="button" onClick={() => navigate('/contact')}>
            Book a session
          </button>
          <button type="button" className="home__proof-secondary" onClick={() => handleScroll('#services')}>
            Explore services
          </button>
        </div>
      </section>

      <section className="home__section home__cases" id="cases" ref={casesRef}>
        <div className="home__section-header">
          <p>Choose your tier</p>
          <h2>Select the offer that fits your launch.</h2>
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
                      Explore offer
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="home__section home__pricing" id="services">
        <div className="home__pricing-header">
          <div>
            <p>Pricing</p>
            <h2>Simple tiers for Berlin creators.</h2>
          </div>
        </div>
        <div className="home__pricing-grid">
          {pricingTiers.map((tier) => (
            <article key={tier.name} className={`home__pricing-card ${tier.badge ? 'is-popular' : ''}`}>
              {tier.badge && <span className="home__pricing-badge">{tier.badge}</span>}
              <div className="home__pricing-meta">
                <h3>{tier.name}</h3>
                <p>{tier.cadence}</p>
              </div>
              <div className="home__pricing-value">
                <span>{tier.price}</span>
                <small>{tier.cadence === 'Per activation' ? '/project' : tier.cadence === 'Retainer' ? '' : '/mo'}</small>
              </div>
              <p className="home__pricing-copy">{tier.description}</p>
              <ul>
                {tier.features.map((feature) => (
                  <li key={feature}>
                    <span>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => navigate(tier.link)}>
                {tier.cta}
              </button>
            </article>
          ))}
        </div>
        <p className="home__pricing-footnote">
          Start with a single activation or scale into monthly and yearly retainers. Educational and artist-led initiatives receive preferred rates.
        </p>
      </section>
      <Footer />
    </main>
  )
}

export default Home
