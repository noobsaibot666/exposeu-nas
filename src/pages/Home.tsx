import { useMemo, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import './Home.css'

const services = [
  {
    title: 'Editorial capture',
    copy: 'Multi-camera documentation for runway, gallery, and pop-up environments delivered within 72 hours.',
    tag: 'Capture',
  },
  {
    title: 'Library builds',
    copy: 'Vertical loops, GIF-ready stills, and native aspect ratios for every channel you syndicate to.',
    tag: 'Systems',
  },
  {
    title: 'Launch direction',
    copy: 'Creative direction, treatment writing, and on-site stewardship for capsule drops and collector previews.',
    tag: 'Strategy',
  },
]

const projects = [
  {
    title: 'Vault install 08',
    location: 'Paris',
    year: '2024',
    image: '/src/assets/images/PinonShowww.jpg',
  },
  {
    title: 'Runway echo set',
    location: 'Milan',
    year: '2023',
    image: '/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg',
  },
  {
    title: 'Gallery chorus',
    location: 'Lisbon',
    year: '2024',
    image: '/src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg',
  },
]

const heroGallery = [
  { id: 'thumb-1', image: '/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg', label: 'Openings', tone: 'designer', rotation: -3 },
  { id: 'thumb-2', image: '/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg', label: 'Artists', tone: 'artist', rotation: 2 },
  { id: 'thumb-3', image: '/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg', label: 'Galleries', tone: 'curator', rotation: -1 },
  { id: 'thumb-4', image: '/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg', label: 'Runway', tone: 'producer', rotation: 4 },
  { id: 'thumb-5', image: '/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg', label: 'Concerts', tone: 'live', rotation: -4 },
]

function Home() {
  const navigate = useNavigate()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleScroll = (id: string) => {
    const target = document.querySelector(id)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navLinks = useMemo(
    () => ({
      left: [
        { label: 'Studio', onClick: () => handleScroll('#hero') },
        { label: 'Services', onClick: () => handleScroll('#services') },
        { label: 'Cases', onClick: () => handleScroll('#cases') },
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

      <section className="home__section home__services" id="services">
        <div className="home__section-header">
          <p>Services</p>
          <h2>Precision coverage for bold teams.</h2>
        </div>
        <div className="home__services-grid">
          {services.map((service) => (
            <article key={service.title} className="home__service-card">
              <span className="home__service-tag">{service.tag}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <button type="button" onClick={() => navigate('/contact')}>
                Start briefing
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="home__section home__cases" id="cases">
        <div className="home__section-header">
          <p>Selected work</p>
          <h2>Every engagement becomes a living library.</h2>
        </div>
        <div className="home__cases-grid">
          {projects.map((project) => (
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
                <button type="button" onClick={() => navigate('/portfolio')}>
                  Open case study
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
