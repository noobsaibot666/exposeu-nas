import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { portfolioProjects } from '../data/portfolioProjects'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import LocalizedLink from '../i18n/LocalizedLink'
import { SchemaOrg, SEOMeta } from '../components/SEOMeta'
import './ProjectDetail.css'

function ProjectFilm({ embedUrl, cover, title }: { embedUrl: string; cover: string; title: string }) {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [slow, setSlow] = useState(false)
  const { t } = useTranslation()
  const youtube = /youtube(?:-nocookie)?\.com\/embed\//i.test(embedUrl)
  const vimeo = /player\.vimeo\.com\/video\//i.test(embedUrl)
  const match = embedUrl.match(/(?:embed\/|video\/)([^?&/]+)/i)
  const watchLink = youtube && match ? `https://www.youtube.com/watch?v=${match[1]}` : vimeo && match ? `https://vimeo.com/${match[1]}` : embedUrl
  const platform = youtube ? 'YouTube' : vimeo ? 'Vimeo' : t('portfolio.detail.film')
  const src = `${embedUrl}?autoplay=1&muted=1&playsinline=1${youtube ? `&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}` : ''}${vimeo ? '&api=1&dnt=1' : ''}`

  useEffect(() => {
    if (!playing || ready) return
    const onMessage = (event: MessageEvent) => {
      if (event.source === frameRef.current?.contentWindow) setReady(true)
    }
    window.addEventListener('message', onMessage)
    const timeout = window.setTimeout(() => setSlow(true), 6000)
    return () => {
      window.removeEventListener('message', onMessage)
      window.clearTimeout(timeout)
    }
  }, [playing, ready])

  const announceReady = () => {
    const frame = frameRef.current?.contentWindow
    if (!frame) return
    try {
      frame.postMessage(JSON.stringify({ method: 'ping' }), 'https://player.vimeo.com')
      frame.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), 'https://www.youtube-nocookie.com')
    } catch {
      // The cover remains visible if the embedded player cannot be reached.
    }
  }

  return (
    <div className={`project-detail__film-frame ${ready ? 'is-ready' : ''}`} style={{ backgroundImage: `url(${cover})` }}>
      {playing ? (
        <>
          <iframe ref={frameRef} src={src} title={`${title} — ${t('portfolio.detail.film')}`} allow="autoplay; picture-in-picture" allowFullScreen loading="eager" onLoad={announceReady} />
          {!ready && !slow && <span className="project-detail__film-loading" role="status">{t('portfolio.detail.loadingFilm')}</span>}
          {slow && !ready && <a className="project-detail__film-fallback" href={watchLink} target="_blank" rel="noopener noreferrer">{t('portfolio.modal.watchOn', { platform })} ↗</a>}
        </>
      ) : (
        <button type="button" className="project-detail__film-play" onClick={() => setPlaying(true)} aria-label={`${t('portfolio.labels.play')}: ${title}`}>
          <span aria-hidden="true">▶</span>{t('portfolio.labels.play')}
        </button>
      )}
    </div>
  )
}

function ProjectDetail() {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()
  const { locale } = useLocale()
  const { t, tm } = useTranslation()
  const heroRef = useRef<HTMLElement | null>(null)
  const storyRef = useRef<HTMLElement | null>(null)
  const translated = tm<Array<{id: string; title: string; description: string; context: string; outcome: string; tag: string}>>('portfolio.videos')
  const projects = useMemo(() => portfolioProjects.map((project) => ({
    ...project,
    ...(translated.find((entry) => entry.id === project.id) ?? {}),
  })), [translated])
  const index = projects.findIndex((project) => project.id === projectId)
  const project = projects[index]

  const navigateHomeToSection = (sectionId: string) => {
    navigate(locale === 'de' ? '/de' : '/')
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      })
    })
  }

  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const root = document.documentElement
    const previousMediaState = root.hasAttribute('data-nav-over-media')
    root.setAttribute('data-nav-over-media', '')
    const observer = new IntersectionObserver(([entry]) => {
      root.toggleAttribute('data-nav-over-media', entry.isIntersecting)
    })
    observer.observe(hero)

    return () => {
      observer.disconnect()
      root.toggleAttribute('data-nav-over-media', previousMediaState)
    }
  }, [projectId])

  useLayoutEffect(() => {
    const story = storyRef.current
    if (!story || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(
        '.project-detail__story-copy > *, .project-detail__facts > div',
      )

      gsap.fromTo(
        items,
        { opacity: 0, y: 22, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.08,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: story,
            start: 'top 88%',
            end: 'top 62%',
            scrub: 0.7,
          },
        },
      )
    }, story)

    return () => context.revert()
  }, [projectId])

  if (!project) {
    return <Navigate to={locale === 'de' ? '/de/portfolio' : '/portfolio'} replace />
  }

  const images = project.slideshowImages?.length ? project.slideshowImages : [project.thumb]
  const navLinks = {
    left: [
      { id: 'home', label: t('nav.home'), onClick: () => navigate(locale === 'de' ? '/de' : '/') },
      { id: 'services', label: t('nav.services'), onClick: () => navigateHomeToSection('cases') },
    ],
    right: [
      { id: 'about', label: t('nav.about'), onClick: () => navigate(locale === 'de' ? '/de/about' : '/about') },
      { id: 'contact', label: t('nav.contact'), onClick: () => navigate(locale === 'de' ? '/de/contact' : '/contact') },
    ],
  }

  return (
    <main className="home home--v2 project-detail" id="main">
      <SEOMeta
        title={`${project.title} — ${project.tag}`}
        description={project.description}
        canonical={`https://expose-u.com/projects/${project.id}`}
        ogImage={project.thumb}
        lang={locale}
      />
      <div className="home__nav">
        <TopNav
          className="top-nav--page"
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate(locale === 'de' ? '/de' : '/')}
          brandLabel={t('nav.brand')}
        />
      </div>
      <header className="project-detail__hero" ref={heroRef}>
        <img className="project-detail__cover" src={project.thumb} alt="" fetchPriority="high" />
        <div className="project-detail__shade" />
        <div className="project-detail__hero-copy">
          <LocalizedLink to="/portfolio" className="project-detail__back">← {t('portfolio.detail.back')}</LocalizedLink>
          <p className="project-detail__eyebrow">{project.tag} <span>·</span> {project.location} <span>·</span> {project.year}</p>
          <h1>{project.title}</h1>
          <p className="project-detail__intro">{project.description}</p>
        </div>
        <a className="home__video-scroll-hint project-detail__scroll" href="#project-story" aria-label={t('portfolio.detail.explore')}>
          <span>{t('portfolio.detail.explore')}</span>
          <span aria-hidden="true">↓</span>
        </a>
      </header>

      <section className="project-detail__story" id="project-story" ref={storyRef}>
        <div className="project-detail__story-copy">
          <p className="project-detail__eyebrow">{t('portfolio.detail.project')}</p>
          <h2>{project.context}</h2>
          <p>{project.description} {t('portfolio.detail.story')}</p>
        </div>
        <dl className="project-detail__facts">
          <div><dt>{t('portfolio.labels.context')}</dt><dd>{project.context}</dd></div>
          <div><dt>{t('portfolio.labels.outcome')}</dt><dd>{project.outcome}</dd></div>
          <div><dt>{t('portfolio.detail.location')}</dt><dd>{project.location} · {project.year}</dd></div>
        </dl>
      </section>

      {project.embedUrl && (
        <section className="project-detail__film" aria-label={t('portfolio.detail.film')}>
          <ProjectFilm embedUrl={project.embedUrl} cover={project.thumb} title={project.title} />
        </section>
      )}

      <section className="project-detail__gallery" aria-label={t('portfolio.detail.gallery')}>
        <div className="project-detail__gallery-heading">
          <p className="project-detail__eyebrow">{t('portfolio.detail.gallery')}</p>
          <h2>{t('portfolio.detail.galleryTitle')}</h2>
        </div>
        <div className="project-detail__image-grid">
          {images.map((image, imageIndex) => (
            <figure className={`project-detail__image project-detail__image--${imageIndex % 3}`} key={image}>
              <img src={image} alt={`${project.title} — ${t('portfolio.detail.image')} ${imageIndex + 1}`} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
      </section>

      <nav className="project-detail__pagination" aria-label={t('portfolio.detail.projectNavigation')}>
        <LocalizedLink to={`/projects/${projects[(index - 1 + projects.length) % projects.length].id}`}>
          <span>{t('portfolio.detail.previous')}</span><strong>{projects[(index - 1 + projects.length) % projects.length].title}</strong>
        </LocalizedLink>
        <LocalizedLink to={`/projects/${projects[(index + 1) % projects.length].id}`}>
          <span>{t('portfolio.detail.next')}</span><strong>{projects[(index + 1) % projects.length].title}</strong>
        </LocalizedLink>
      </nav>
      <section className="project-detail__cta">
        <p className="project-detail__eyebrow">{t('portfolio.detail.ctaEyebrow')}</p>
        <h2>{t('portfolio.detail.ctaTitle')}</h2>
        <LocalizedLink to="/contact">{t('portfolio.detail.cta')} <span aria-hidden="true">↗</span></LocalizedLink>
      </section>
      <Footer />
      <SchemaOrg data={{'@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description: project.description, image: project.thumb, dateCreated: project.year, locationCreated: {'@type': 'Place', name: project.location}}} />
    </main>
  )
}

export default ProjectDetail
