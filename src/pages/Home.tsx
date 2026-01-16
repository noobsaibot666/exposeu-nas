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
    image: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_030.png'),
    copy: 'Press-ready stills and recap films for openings, installs, and curator walkthroughs.',
    link: '/exhibitions',
  },
  {
    title: 'Gallery stories',
    location: 'Berlin openings',
    year: '2023',
    image: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_012.png'),
    copy: 'Curator interviews, collector previews, and narrative cuts that give context to the work.',
    link: '/gallery-stories',
  },
  {
    title: 'Artist sessions',
    location: 'Berlin ateliers',
    year: '2024',
    image: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.png'),
    copy: 'Portraits, process, and BTS for releases, press kits, and artist profiles.',
    link: '/artist-sessions',
  },
  {
    title: 'Performance documentation',
    location: 'Berlin nights',
    year: '2024',
    image: resolveImagePath('/src/assets/images/services/4_performance_doc/4_PD_004.png'),
    copy: 'Live sets captured fast with reels, selects, and clean audio-aware edits.',
    link: '/performance',
  },
  {
    title: 'Fashion show',
    location: 'Milan runway',
    year: '2023',
    image: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_011.jpeg'),
    copy: 'Runway and backstage documentation with editorial framing and fast delivery.',
    link: '/fashion-show',
  },
  {
    title: 'Atmospheric films',
    location: 'Lisbon residencies',
    year: '2024',
    image: resolveImagePath('/src/assets/images/services/6_atmospheric_film/6_AF_018.png'),
    copy: 'Mood-driven shorts and lookbooks for concept launches and immersive installs.',
    link: '/atmospheric',
  },
]

const projectRows = [projects.slice(0, 3), projects.slice(3, 6)]

const heroGallery = [
  {
    id: 'thumb-1',
    image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/1_ED_038.png'),
    label: 'Exhibitions',
    rotation: -3,
  },
  {
    id: 'thumb-2',
    image: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_016.png'),
    label: 'Artist sessions',
    rotation: 2,
  },
  {
    id: 'thumb-3',
    image: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_028.png'),
    label: 'Documentations',
    rotation: -1,
  },
  {
    id: 'thumb-4',
    image: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_010.png'),
    label: 'Performances',
    rotation: 4,
  },
  {
    id: 'thumb-5',
    image: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_017.png'),
    label: 'Fashion shows',
    rotation: -4,
  },
]

const proofAvatars = [
  resolveImagePath('/src/assets/images/services/1_exhibition_doc/_thumb/1_1/1_ED_005t.png'),
  resolveImagePath('/src/assets/images/services/2_gallery_work/_thumb/1_1/2_GW_009t.png'),
  resolveImagePath('/src/assets/images/services/3_artist_sessions/_thumb/1_1/3_AS_022t.png'),
  resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/1_1/4_PD_001t.png'),
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
      {/* Background layers */}
      <div className="home__background" aria-hidden />
      <div className="home__floaters" aria-hidden />
      {/* Hero */}
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

      {/* Proof */}
      <section className="home__section home__proof">
        <div className="home__proof-avatars">
          {proofAvatars.map((avatar, idx) => (
            <img key={avatar} src={avatar} alt="Client avatar" style={{ zIndex: proofAvatars.length - idx }} />
          ))}
          <span>Make us part of your creative hub</span>
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

      {/* Cases */}
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
        <p className="home__section-note">
          Not sure which coverage fits you best? <a href="/contact">Get in contact with us</a> and we will guide you.
        </p>
      </section>

      {/* Pricing */}
      <PricingSection id="services" />
      {/* Footer */}
      <Footer />
    </main>
  )
}

export default Home
