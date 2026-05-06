import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import './HomeV2.css'
import styles from './HomeRedesign.module.css'
import Footer from '../sections/Footer'
import { resolveImagePath } from '../utils/resolveImagePath'
import { serviceMeta } from '../data/serviceMeta'
import { trackEvent, useScrollDepthTracking, useTrackViewEvent } from '../utils/analytics'

// Set type to 'vimeo' or 'youtube' and replace id with the actual video ID
const HERO_VIDEO = {
  type: 'vimeo' as 'vimeo' | 'youtube',
  id: '863362136',
  hash: '',
}

function buildHeroVideoSrc(video: typeof HERO_VIDEO): string {
  if (video.type === 'vimeo') {
    const hashParam = video.hash ? `h=${video.hash}&` : ''
    return `https://player.vimeo.com/video/${video.id}?${hashParam}background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`
  }
  return `https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`
}

const projects = [
  {
    slug: serviceMeta['concerts-events'].slug,
    title: 'Concert & Live Event Documentation',
    location: 'Live Programs',
    year: '2024',
    image: resolveImagePath('/src/assets/images/website/performances/thumb_3_086.jpg'),
    copy: 'Fast selects, recap films, and hero frames for concerts, venues, and live teams.',
    link: serviceMeta['concerts-events'].href,
  },
  {
    slug: serviceMeta['exhibition-gallery'].slug,
    title: 'Exhibition & Gallery Documentation',
    location: 'Galleries',
    year: '2024',
    image: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_030.png'),
    copy: 'Press-ready photo and film for galleries, curators, openings, and archives.',
    link: serviceMeta['exhibition-gallery'].href,
  },
  {
    slug: serviceMeta['artist-sessions'].slug,
    title: 'Artist Sessions & Portraits',
    location: 'Venues & Studios',
    year: '2024',
    image: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.png'),
    copy: 'Portraits and process assets for artists, studios, and press kits.',
    link: serviceMeta['artist-sessions'].href,
  },
  {
    slug: serviceMeta['brand-agency'].slug,
    title: 'Brand & Agency Events',
    location: 'Launches',
    year: '2023',
    image: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_011.jpeg'),
    copy: 'Event, activation, runway, and backstage assets for brands, agencies, and sponsors.',
    link: serviceMeta['brand-agency'].href,
  },
]

const projectRows = [projects.slice(0, 2), projects.slice(2, 4)]

const heroGallery = [
  {
    id: 'thumb-5',
    image: resolveImagePath('/src/assets/images/website/fashion/thumb_3_081.jpg'),
    label: serviceMeta['brand-agency'].label,
    rotation: -4,
  },
  {
    id: 'thumb-1',
    image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/1_ED_055.png'),
    label: serviceMeta['exhibition-gallery'].label,
    rotation: -3,
  },
  {
    id: 'thumb-2',
    image: resolveImagePath('/src/assets/images/website/performances/thumb_3_033.jpg'),
    label: serviceMeta['concerts-events'].label,
    rotation: 2,
  },
  {
    id: 'thumb-4',
    image: resolveImagePath('/src/assets/images/website/performances/thumb_3_027.jpg'),
    label: serviceMeta['concerts-events'].label,
    rotation: 4,
  },
  {
    id: 'thumb-3',
    image: resolveImagePath('/src/assets/images/website/exhibitions/thumb_3_031.jpg'),
    label: serviceMeta['exhibition-gallery'].label,
    rotation: -1,
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
  resolveImagePath('/src/assets/images/website/artists/thumb_3_052.jpg'),
  resolveImagePath('/src/assets/images/website/artists/thumb_3_060.jpg'),
  resolveImagePath('/src/assets/images/website/fashion/thumb_3_057.jpg'),
  resolveImagePath('/src/assets/images/website/performances/thumb_3_086.jpg'),
]

function HomeV2() {
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

  useTrackViewEvent('home_view')
  useScrollDepthTracking('home', [25, 50, 75, 90])

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
        { label: 'Services', href: '/#cases' },
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

  const trackHomeCta = (ctaLabel: string, ctaLocation: string) => {
    trackEvent('home_cta_click', {
      cta_label: ctaLabel,
      cta_location: ctaLocation,
    })
  }

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      if (galleryRef.current) {
        tiltX.current = gsap.quickTo(galleryRef.current, '--hero-tilt-x', { duration: 0.45, ease: 'power3.out' })
        tiltY.current = gsap.quickTo(galleryRef.current, '--hero-tilt-y', { duration: 0.45, ease: 'power3.out' })
      }

      // Hero section — one ordered scroll sequence after the fullscreen video.
      const heroThumbs = gsap.utils.toArray<HTMLElement>('.home__hero-gallery--desktop .home__hero-thumb')
      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.home__hero',
          start: 'top 88%',
          end: 'bottom 34%',
          scrub: 1.35,
        },
      })

      heroTimeline.fromTo(
        '.home__hero-title',
        { opacity: 0, y: 88, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.35, ease: 'power4.inOut' },
      )

      const yOffsets = [96, 78, 108, 86, 102]
      const xOffsets = [-12, 10, 0, 14, -8]
      const cardStart = 0.95
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
            scale: 0.93,
            rotate: [-1.2, 0.9, -0.6, 1.25, -0.8][i % 5],
            filter: 'blur(9px)',
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotate: 0,
            filter: 'blur(0px)',
            duration: 1.15,
            ease: 'power3.inOut',
            clearProps: 'transform',
            onComplete: () => { el.style.transition = '' },
          },
          cardStart + i * 0.18,
        )
      })

      heroTimeline
        .fromTo(
          '.home__hero-subhead',
          { opacity: 0, y: 52, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.05, ease: 'power3.inOut' },
          cardStart + heroThumbs.length * 0.18 + 0.48,
        )
        .fromTo(
          '.home__actions button',
          { opacity: 0, y: 38, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.14, duration: 0.9, ease: 'power3.inOut' },
          '>-0.12',
        )

      // Cases — section copy and cards rise in as they enter the viewport.
      const cards = gsap.utils.toArray<HTMLElement>('.home__case-card')
      const casesHeaderItems = gsap.utils.toArray<HTMLElement>('.home__cases .home__section-header > *')
      gsap.fromTo(
        casesHeaderItems,
        { opacity: 0, y: 42 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.home__cases',
            start: 'top 86%',
            end: 'top 48%',
            scrub: 0.7,
          },
        },
      )

      const randomCardMotion = gsap.utils.shuffle(
        cards.map((card, index) => ({
          card,
          y: [92, 116, 76, 128, 88, 108][index % 6],
          x: [-14, 10, 0, 16, -8, 6][index % 6],
          scale: [0.91, 0.94, 0.9, 0.93, 0.92, 0.95][index % 6],
          rotate: [-2.2, 1.4, -0.8, 2, -1.5, 0.9][index % 6],
          scrub: [0.75, 1.05, 0.85, 1.15, 0.95, 1.25][index % 6],
        })),
      )

      randomCardMotion.forEach(({ card, y, x, scale, rotate, scrub }, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y,
            x,
            scale,
            rotate,
            filter: 'blur(10px)',
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotate: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            delay: index * 0.03,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 94%',
              end: 'top 58%',
              scrub,
            },
          },
        )
      })

      // Proof sections — fade + slide with scrub
      const proofSections = gsap.utils.toArray<HTMLElement>('.home__proof')
      proofSections.forEach((section) => {
        const items = Array.from(section.children) as HTMLElement[]
        gsap.fromTo(
          items,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              end: 'top 38%',
              scrub: 0.6,
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      // Process — slide up with scrub
      const processSection = document.querySelector<HTMLElement>('.home__process')
      if (processSection) {
        const processItems = gsap.utils.toArray<HTMLElement>('.home__process-header > *, .home__process-step')
        gsap.fromTo(
          processItems,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: processSection,
              start: 'top 80%',
              end: 'top 35%',
              scrub: 0.6,
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
            const rotateX = (-relY / (rect.height / 2)) * 4
            const rotateY = (relX / (rect.width / 2)) * 4
            gsap.to(card, { rotationX: rotateX, rotationY: rotateY, scale: 1.04, duration: 0.35, ease: 'power3.out' })
          }
          const handleEnter = () => gsap.to(card, { scale: 1.05, duration: 0.4, ease: 'power3.out' })
          const handleLeave = () => gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.6, ease: 'power2.out' })

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
    <main className="home home--v2" ref={rootRef} id="main">
      <div className="home__background" aria-hidden="true" />
      <div className="home__floaters" aria-hidden="true" />

      {/* Fullscreen video hero — desktop only */}
      <section className="home__video-hero" aria-hidden="true">
        <div className="home__video-iframe-wrap">
          <iframe
            src={buildHeroVideoSrc(HERO_VIDEO)}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Hero background video"
          />
        </div>
        <div className="home__video-overlay" />
        <div className="home__video-scroll-hint">
          <span>Scroll</span>
        </div>
      </section>

      {/* Nav wrapper — hidden on desktop (nav is fixed), visible on mobile */}
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

      <header className="home__section home__hero" id="hero">
        <div className="home__hero-body">
          <h1 className="home__hero-title">
            Strategic photo and film for exhibitions, artists, and live work.
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
                role="button"
                tabIndex={0}
                onClick={handleHeroCardClick}
                onKeyDown={handleHeroCardKeyDown}
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
                  role="button"
                  tabIndex={0}
                  onClick={handleHeroCardClick}
                  onKeyDown={handleHeroCardKeyDown}
                >
                  <div className="home__hero-thumb-image">
                    <img src={thumb.image} alt={thumb.label} />
                  </div>
                  <figcaption>
                    <strong>{thumb.label}</strong>
                  </figcaption>
                </figure>
              )
            })}
          </div>
          <p className="home__hero-subhead">
            For Berlin-based institutions, studios, artists, and spatial teams needing press, archive, funding, and long-term assets.
          </p>
          <div className="home__actions">
            <button
              type="button"
              onClick={() => {
                trackHomeCta('Request availability', 'hero_primary')
                navigate('/contact')
              }}
            >
              Request availability
            </button>
            <button
              type="button"
              onClick={() => {
                trackHomeCta('View services', 'hero_secondary')
                handleScroll('#services')
              }}
            >
              View services
            </button>
          </div>
        </div>
      </header>

      <section className="home__section home__proof">
        <div className="home__proof-avatars">
          {proofAvatars.map((avatar, idx) => (
            <img key={avatar} src={avatar} alt="Client avatar" loading="lazy" decoding="async" style={{ zIndex: proofAvatars.length - idx }} />
          ))}
          <span>Make us part of your creative hub</span>
        </div>
        <h2>Documentation is not coverage.</h2>
        <p className={`home__proof-copy ${styles.homeRedesign__bodyCopy}`}>
          We create assets teams can publish, archive, and reuse.
        </p>
      </section>

      <section className="home__section home__cases" id="cases" ref={casesRef}>
        <div className="home__section-header">
          <p>Coverage types</p>
          <h2>Choose the format for your show, release, or space.</h2>
          <p className="home__section-subcopy">I need content for my:</p>
        </div>
        <div className="home__cases-grid">
          {projectRows.map((row, rowIndex) => (
            <div className="home__cases-row" key={`case-row-${rowIndex}`}>
              {row.map((project) => (
                <button
                  key={project.title}
                  type="button"
                  className="home__case-card"
                  onClick={() => {
                    trackEvent('home_service_card_click', {
                      service_slug: project.slug,
                      card_position: rowIndex * 3 + row.indexOf(project) + 1,
                    })
                    navigate(project.link)
                  }}
                >
                  <div className="home__case-media">
                    <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
                  </div>
                  <div className="home__case-meta">
                    <div>
                      <p>{project.location}</p>
                      <span>{project.year}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p className={`home__case-copy ${styles.homeRedesign__cardCopy}`}>{project.copy}</p>
                    <span className="home__case-cta">See documentation details</span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
        <p className="home__section-note">
          Need help choosing? <Link to="/contact">Contact us</Link>.
        </p>
      </section>

      <section className="home__section home__proof" id="services">
        <h2>Start a project.</h2>
        <p className={`home__proof-copy ${styles.homeRedesign__bodyCopy}`}>
          Turn your project into press-ready assets with a clear plan and deliverables.
        </p>
        <div className="home__proof-actions">
          <button
            type="button"
            onClick={() => {
              trackHomeCta('Request availability', 'footer_primary')
              navigate('/contact')
            }}
          >
            Request availability
          </button>
          <button
            type="button"
            className="home__proof-secondary"
            onClick={() => {
              trackHomeCta('View services', 'footer_secondary')
              handleScroll('#cases')
            }}
          >
            View services
          </button>
        </div>
      </section>

      <section className="home__section home__process" id="process">
        <div className="home__process-header">
          <h2>Our Process</h2>
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

      <Footer />
    </main>
  )
}

export default HomeV2
