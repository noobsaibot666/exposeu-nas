import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TopNav from '../components/TopNav'
import './Home.css'
import Footer from '../sections/Footer'
import { resolveImagePath } from '../utils/resolveImagePath'
import { serviceMeta } from '../data/serviceMeta'

const projects = [
  {
    title: serviceMeta.documentation.label,
    location: 'Paris galleries',
    year: '2024',
    image: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_030.png'),
    copy: 'Press-ready stills and recap films for openings, installs, and curator walkthroughs.',
    link: serviceMeta.documentation.href,
  },
  {
    title: serviceMeta['gallery-stories'].label,
    location: 'Berlin openings',
    year: '2023',
    image: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_012.png'),
    copy: 'Curator interviews, collector previews, and narrative cuts that give context to the work.',
    link: serviceMeta['gallery-stories'].href,
  },
  {
    title: serviceMeta['artist-sessions'].label,
    location: 'Berlin ateliers',
    year: '2024',
    image: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.png'),
    copy: 'Portraits, process, and BTS for releases, press kits, and artist profiles.',
    link: serviceMeta['artist-sessions'].href,
  },
  {
    title: serviceMeta.performance.label,
    location: 'Berlin nights',
    year: '2024',
    image: resolveImagePath('/src/assets/images/services/4_performance_doc/4_PD_004.png'),
    copy: 'Live sets captured fast with reels, selects, and clean audio-aware edits.',
    link: serviceMeta.performance.href,
  },
  {
    title: serviceMeta['fashion-show'].label,
    location: 'Milan runway',
    year: '2023',
    image: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_011.jpeg'),
    copy: 'Runway and backstage documentation with editorial framing and fast delivery.',
    link: serviceMeta['fashion-show'].href,
  },
  {
    title: serviceMeta.atmospheric.label,
    location: 'Lisbon residencies',
    year: '2024',
    image: resolveImagePath('/src/assets/images/services/6_atmospheric_film/6_AF_018.png'),
    copy: 'Mood-driven shorts and lookbooks for concept launches and immersive installs.',
    link: serviceMeta.atmospheric.href,
  },
]

const projectRows = [projects.slice(0, 3), projects.slice(3, 6)]

const heroGallery = [
  {
    id: 'thumb-1',
    image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/1_ED_038.png'),
    label: serviceMeta.documentation.label,
    rotation: -3,
  },
  {
    id: 'thumb-2',
    image: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_016.png'),
    label: serviceMeta['artist-sessions'].label,
    rotation: 2,
  },
  {
    id: 'thumb-3',
    image: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_028.png'),
    label: serviceMeta.documentation.label,
    rotation: -1,
  },
  {
    id: 'thumb-4',
    image: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_010.png'),
    label: serviceMeta.performance.label,
    rotation: 4,
  },
  {
    id: 'thumb-5',
    image: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_017.png'),
    label: serviceMeta['fashion-show'].label,
    rotation: -4,
  },
]

const heroServices = projects.map((project, index) => ({
  id: `service-thumb-${project.title}`,
  image: project.image,
  label: project.title,
  rotation: [-4, 2, -1, 3, -2, 4][index % 6],
  index,
}))

const mobileHeroStack = heroServices.slice(0, 5)

const proofAvatars = [
  resolveImagePath('/src/assets/images/services/1_exhibition_doc/_thumb/1_1/1_ED_005t.png'),
  resolveImagePath('/src/assets/images/services/2_gallery_work/_thumb/1_1/2_GW_009t.png'),
  resolveImagePath('/src/assets/images/services/3_artist_sessions/_thumb/1_1/3_AS_022t.png'),
  resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/1_1/4_PD_001t.png'),
]

function Home() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('Home')
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

  const handleScroll = (id: string) => {
    const target = document.querySelector(id)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
        { label: 'Home', onClick: () => handleScroll('#hero') },
        { label: 'Services', href: '/#services' },
      ],
      right: [
        { label: 'About', onClick: () => navigate('/about') },
        { label: 'Contact', onClick: () => navigate('/contact') },
      ],
    }),
    [navigate],
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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      if (galleryRef.current) {
        tiltX.current = gsap.quickTo(galleryRef.current, '--hero-tilt-x', { duration: 0.45, ease: 'power3.out' })
        tiltY.current = gsap.quickTo(galleryRef.current, '--hero-tilt-y', { duration: 0.45, ease: 'power3.out' })
      }

      const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      const mm = gsap.matchMedia()

      heroTimeline
        .from('.home__nav', { opacity: 0, y: -12, duration: 0.5 })
        .from('.home__hero-title', { opacity: 0, y: 28, duration: 0.7 }, '-=0.2')
        .from('.home__hero-gallery', { opacity: 0, duration: 0.7 }, '-=0.35')
        .from('.home__hero-subhead', { opacity: 0, y: 16, duration: 0.6 }, '-=0.35')
        .from('.home__actions button', { opacity: 0, y: 12, duration: 0.5, stagger: 0.12 }, '-=0.3')

      const heroThumbs = gsap.utils.toArray<HTMLElement>('.home__hero-gallery--desktop .home__hero-thumb')
      gsap.from(heroThumbs, {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: 'power3.out',
        stagger: { each: 0.12, from: 'center' },
        delay: 0.15,
        force3D: true,
        clearProps: 'transform',
      })

      mm.add('(max-width: 640px)', () => undefined)

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

      const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)')
      if (hoverMedia.matches) {
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
      }

      return () => {
        mm.revert()
        listeners.forEach((off) => off())
      }
    }, rootRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!location.hash) return
    const target = document.querySelector(location.hash)
    if (!target) return
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.hash])

  useEffect(() => {
    const sections = [
      { id: 'hero', label: 'Home' },
      { id: 'cases', label: 'Services' },
      { id: 'services', label: 'Services' },
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
            onBrandClick={() => navigate('/')}
            brandLabel="expose.u"
            activeLabel={activeSection}
          />
      </div>
        <div className="home__hero-body">
          <h1 className="home__hero-title">Photo and video for Berlin&rsquo;s galleries, artists, and live events.</h1>
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
                role="link"
                tabIndex={0}
                onClick={handleHeroCardClick}
                onKeyDown={handleHeroCardKeyDown}
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
          <div
            className="home__hero-gallery home__hero-gallery--mobile"
            aria-hidden
            ref={mobileHeroRef}
            style={{ '--mobile-card': `${mobileLayout.card}px` } as CSSProperties}
          >
            {mobileHeroStack.map((thumb, index) => {
              const configs = [
                { x: -mobileLayout.outer, y: mobileLayout.yOuter, rotate: -24, scale: 0.82, z: 1, opacity: 0.55, blur: 1.5 },
                { x: -mobileLayout.inner, y: mobileLayout.yInner, rotate: -12, scale: 0.96, z: 2, opacity: 0.85, blur: 0.6 },
                { x: 0, y: -4, rotate: 0, scale: 1.18, z: 3, opacity: 1, blur: 0 },
                { x: mobileLayout.inner, y: mobileLayout.yInner, rotate: 12, scale: 0.96, z: 2, opacity: 0.85, blur: 0.6 },
                { x: mobileLayout.outer, y: mobileLayout.yOuter, rotate: 24, scale: 0.82, z: 1, opacity: 0.55, blur: 1.5 },
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
                  role="link"
                  tabIndex={0}
                  onClick={handleHeroCardClick}
                  onKeyDown={handleHeroCardKeyDown}
                >
                  <div className="home__hero-thumb-image">
                    <img src={thumb.image} alt={thumb.label} loading="lazy" />
                  </div>
                  <figcaption>
                    <strong>{thumb.label}</strong>
                  </figcaption>
                </figure>
              )
            })}
          </div>
          <p className="home__hero-subhead">
            Exhibitions, openings, and performances captured with art-first direction, fast delivery, and edits that
            keep your tone intact.
          </p>
          <div className="home__actions">
            <button type="button" onClick={() => navigate('/contact')}>
              Check availability
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
        <h2>A team fluent in galleries, artists, and live sets, keeping your visual language intact.</h2>
        <p className="home__proof-copy">
          Press-ready stills and films that preserve the atmosphere and help collectors, press, and socials connect
          with the work.
        </p>
      </section>

      {/* Cases */}
      <section className="home__section home__cases" id="cases" ref={casesRef}>
        <div className="home__section-header">
          <p>Coverage types</p>
          <h2>Pick the format that fits your show, release, or live event.</h2>
          <p className="home__section-subcopy">I need content for my:</p>
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

      {/* CTA replaces pricing for A/B test, keep anchor for smooth scroll targets */}
      <section className="home__section home__proof" id="services">
        <h2>Start a project.</h2>
        <p className="home__proof-copy">
          We document exhibitions, performances, and artist-led work with care for tone, space, and intent. If
          you&rsquo;re preparing an opening, release, or live event in Berlin, we&rsquo;d be glad to hear about it.
        </p>
        <div className="home__proof-actions">
          <button type="button" onClick={() => navigate('/contact')}>
            Check availability
          </button>
          <button type="button" className="home__proof-secondary" onClick={() => navigate('/contact')}>
            Check availability
          </button>
        </div>
      </section>
      <section className="home__section home__process" id="process">
        <div className="home__process-header">
          <h2>Process</h2>
        </div>
        <div className="home__process-grid">
          <article className="home__process-step">
            <h3>Consult</h3>
            <p>We align on intent, timing, and deliverables. You&rsquo;ll know what&rsquo;s happening before we shoot.</p>
          </article>
          <article className="home__process-step">
            <h3>Capture</h3>
            <p>We work quietly on site, following your run-of-show and the space&rsquo;s rhythm.</p>
          </article>
          <article className="home__process-step">
            <h3>Deliver</h3>
            <p>You receive press-ready selects and organized finals, ready to publish and archive.</p>
          </article>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </main>
  )
}

export default Home
